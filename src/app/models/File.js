import Sequelize, { Model } from "sequelize";

class File extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            path: Sequelize.STRING,
            url: {                              // campo virtual só visto por devs
                type: Sequelize.VIRTUAL,
                get() {                         // metodo para formatar o valor da url
                    return `${process.env.APP_URL}/files/${this.path}` // This se refere ao campos do model (name e path)
                }
            }
        },
        {
            sequelize,
        }
        );
        return this;
    }
}

export default File;
