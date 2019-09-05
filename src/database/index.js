// Arquivo para criar conexão e carregar os models

import Sequelize from "sequelize";
import mongoose from "mongoose"

import User from "../app/models/Users";
import File from "../app/models/File";
import Appointment from "../app/models/Appointment";

import databaseConfig from "../config/database";

const models = [User, File, Appointment];

class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    // Metodo para conectar e carregar dados
    init() {
        this.connection = new Sequelize(databaseConfig);

        models.map(model => model.init(this.connection))
        .map(model => model.associate && model.associate(this.connection.models))
    }

    mongo() {
        this.mongoConnection = mongoose.connect(process.env.MONGO_URL,
        { useNewUrlParser: true, useFindAndModify: true}
        )
    }
}

export default new Database();
