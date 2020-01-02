/* Controle de dadas válidas para marcações */
import { startOfDay, endOfDay, setHours, setMinutes, setSeconds, format, isAfter } from "date-fns";
import { Op } from "sequelize";
import Appointment from "../models/Appointment";


class AvaliableController {
    async index(req, res) {

        // Pegar data da query
        const { date } = req.query;

        // Verificar se data é válida
        if(!date) {
            return res.status(400).json({error: "Invalid Date"})
        }

        // salvar data com formato de número inteiro
        const searchDate = Number(date);

        // filtrar appointments
        const appointment = await Appointment.findAll({
            where: {
                provider_id: req.params.providerId,
                canceled_at: null,
                date: {
                    [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)]
                }
            }
        })

        // const com horários disponiveis do prestador
        const schedule = [
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
        ]


        const avaliable = schedule.map(time => {
            const [ hour, minute ] = time.split(':')  // dividir horarios do schedule em horas e minutos
            const value = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0) // salva as datas no formato do schedule

            return {
                time,
                value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"), // retorna a data no formato padrão internet
                avaliable: isAfter(value, new Date()) && // vefiricar a const value vai acontecer depois da data de agora (se ja passou da hora)
                !appointment.find(a => format(a.date, 'HH:mm') == time ) // verifica se o horário já não está ocupado com um appointment
            }
        })


        return res.json(avaliable);
    }

}

export default new AvaliableController();



/* date-fns ajuda a listar todos atendimento que estao listados para o dia */