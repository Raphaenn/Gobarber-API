/* CONTROLE DE NOTIFICAÇÕES PARA OS PROVIDERS */

import Notification from "../schemas/Notification";
import User from "../models/Users";

class NotificationController {
    async index(req, res) {

        const isProvider = await User.findOne({ where: {id: req.userId, provider: true}}); // Logica para testar se provider é provider

        if(!isProvider) {
            return res.status(401).json({error: "Only provider can load notifications"})
        }

        // Buscar notificações para provider
        const notifications = await Notification.find({
            user: req.userId,
        }).sort({createAt: "desc"}).limit(20);


        return res.json(notifications)
    };

    // Atualiza a notificação para lida
    async update(req, res) {
        const notificationRead = await Notification.findByIdAndUpdate(
            req.params.id,
            {read: true},
            {new: true}
        );

        return res.json(notificationRead)
    };
};

export default new NotificationController();