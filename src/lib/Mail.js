/* Configurações de email */
import nodemailer from "nodemailer";
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import { resolve } from "path";

import mailConfig from "../config/mail";


class Mail {
    constructor() {

        const { host, port, secure, auth } = mailConfig;

        // mode do nodemailer chamar a conexão com o serviço de email. ( cadastrado no MailConfig)
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null  //verificar se existe um usuário
        });

        this.configureTemplates();
    }

    /* Localização das pastas de configuração dos email */
    configureTemplates() {
        const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

        //Confi dos layouts
        this.transporter.use('compile', nodemailerhbs({
            viewEngine: exphbs.create({
                layoutsDir: resolve(viewPath, 'layouts'),
                partialsDir: resolve(viewPath, 'partials'),
                defaultLayout: 'default',
                extname: '.hbs'
            }),
            viewPath,
            extName: '.hbs'
        }))
    }

    // Método para enviar o e-mail em si
    sendMail(message) {
        return this.transporter.sendMail({
            ...mailConfig.default,
            ...message
        })
    }
}

export default new Mail();