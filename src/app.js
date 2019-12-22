import "dotenv/config";

import express from "express";
import cors from 'cors';
import path from "path";
import * as Sentry from '@sentry/node'; // Tratativas de erro do sistema
import Youch from "youch"; // passa config de visualização de erros para o dev
import 'express-async-errors' // posibilita o sentry fazer as mensagens de erro
import routes from "./routes";

import sentryConfig from "./config/sentry"; // Config da ferramenta de tratativas de erro do sistema
import "./database"; // importa configurações do banco de dados realacional (sql)

class App {
    constructor() {
        this.server = express();

        Sentry.init(sentryConfig); // chamando o sentry passando as configs como parametros

        this.middlewares();
        this.routes();
        this.exceptionHandle();
    }


    middlewares() {
        this.server.use(Sentry.Handlers.requestHandler());
        this.server.use(cors());
        this.server.use(express.json()); // possibilita o uso do json
        this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))); // utilizado para servir arquivos estaticos
    }

    routes() {
        this.server.use(routes) // carrega as rotas
        this.server.use(Sentry.Handlers.errorHandler());
    }

    // Middleware para retornar resposta com  mensagem de erro
    exceptionHandle() {
        /* para tratamento de exeções o express solicita que o async do middleware tenha 4 parametros */
        this.server.use(async(err, req, res, next) => {

            if(process.env.NODE_ENV == 'development') {
                const errors = await new Youch(err, req).toJSON();

                return res.status(500).json(errors)
            }

            return res.status(500).json({ error: "Internal server error"})
        })

    }

}

export default new App().server;
