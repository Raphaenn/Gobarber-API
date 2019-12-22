import { startOfDay, endOfDay , parseISO } from "date-fns"; // Métodos pré definidos para comparaçã entre datas
import { Op } from "sequelize";

import Appointment from "../models/Appointment";
import User from "../models/Users"

class ScheduleController {
    async index(req, res) {

        /* Check se usuário é um provider */
        const checkUserProvider = await User.findOne({
            where: { id: req.userId, provider: true },
          });
      
          if (!checkUserProvider) {
            return res.status(401).json({ error: 'User is not a provider' });
          }

        // Filtro para as datas do dia

        // Pegando a data que é passada pela query (insomnia)
        const { date } = req.query ;
        const parseDate = parseISO(date); 

        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.userId, // Listar todos os apontamantos do provider
                canceled_at: null,
                // Metodo para fazer a comparação entre as datas e pegar a correpondente ao dia de hoje.
                date: {
                    [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)] // linha que efetivamente compara usando os metodos date-fns
                }
            },
            include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['name']
                    }
                ],
            order: ['date'],
        });

        console.log(appointments)
        return res.json(appointments);
    }
}

export default new ScheduleController();