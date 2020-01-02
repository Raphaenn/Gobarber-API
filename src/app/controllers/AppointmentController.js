/* Controle dos apontamentos realizados pelos usuários */

import Appointment from "../models/Appointment"
import Notification from "../schemas/Notification";
import { startOfHour, parseISO, isBefore, format, subHours } from "date-fns";
import pt from 'date-fns/locale/pt'
import * as Yup from "yup";
import User from "../models/Users";
import File from "../models/File";

import CancellationMail from "../jobs/CancellationMail";
import Queue from "../../lib/queue";

class AppointmentController {

    /* Listando todos agentamentos do prestador com dados do usuários e avatar */
    async index(req, res) {
        const { page = 1 } = req.query;

        const appointmentList = await Appointment.findAll({
            where: {
                user_id: req.userId,
                canceled_at: null,
            },
            order: ['date'],
            attributes: ['id', 'date', 'past', 'cancelable'],
            limit: 20,
            offset: (page - 1) * 20, // paginação
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id','url', 'path']
                        },
                    ],
                },
            ],


        });
        return res.json(appointmentList);
    }

    async store(req, res) {

        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required(),
        });

        /* Verificar se req é válida */
        if(!(await schema.isValid(req.body))) {
            return res.status(400).json({error: "Validation fails" })
        }

        const { provider_id, date } = req.body;

        // Verificar se provider_id é um provider
        const isProvider = await User.findOne({ where: {id: provider_id, provider: true}}); // Logica para testar se provider é provider

        if(!isProvider) {
            return res.status(401).json({ error: "You can only create appointmens with providers"})
        }

        /* Verificar se data cadastrar é menor que dia atual (arredonda agendamento pela hora)*/
        const hourStart = startOfHour(parseISO(date))

        if(isBefore(hourStart, new Date())) {
            return res.status(400).json({ error: "Past dates are not permitted"})
        }

        /* Check se data de requisição já não está sendo utilziada */
        const ViabilidadeData = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart,
            }
        });

        if(ViabilidadeData) {
            return res.status(400).json({ error: "Appointment date is not availiable"})
        }

        /* Criar agendamento */
        const salveAppointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date,
        });

        /* NOTIFICAR AGENDAMENTOS */

        // buscar usuário que está fazendo o apontamento
        const user = await User.findByPk(req.userId);

        // formatar data
        const formattedDate = format(
            hourStart,
            " dd 'de' MMMM', às 'H:mm'h' ",
            {locale: pt}
        )
        
        await Notification.create({
            content: `Novo agendamento de ${user.name} para ${formattedDate}`,
            user: provider_id,
        })


        return res.json(salveAppointment)
    }

    // Deletando appointments do usuário
    async delete(req, res) {

        const appointment = await Appointment.findByPk(req.params.id, {
            include: [  // Pegar dados do prestador para usar no sendMail
                {
                    model: User,
                    as: 'provider',
                    attributes: ['name', 'email'],
                },
                    {
                        model: User,
                        as: 'user',
                        attributes: ["name"],
                    }
            ],
        }) // pegando apontamentos do usuário logado

        if(appointment.user_id != req.userId) {
           return res.status(401).json({error: "You don't have permission to cancel this appointment"})
        }

        // Somente pode deletar se tiver com duas horas de antecedencia.

        const dataSub = subHours(appointment.date, 2)

        // Verificando se a dataSub é antes da data de hoje. Se for o horário não é mais valido para cancelar.
        if(isBefore(dataSub, new Date())) {
            return req.status(401).json({ error: "You can't only cancel appointments 2 hours in advance"})
        }

        appointment.canceled_at = new Date();

        await appointment.save()

        Queue.add(CancellationMail.key, {
            appointment,
        })

        return res.json(appointment)
    }
}


export default new AppointmentController();
