import Sequelize, { Model } from "sequelize";
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
    static init(sequelize) {
        super.init({
            date: Sequelize.DATE,
            canceled_at: Sequelize.DATE,
            // Past:  Sabe se data de agendamento já passou
            past: {
                type: Sequelize.VIRTUAL,
                get() {
                    return isBefore(this.date, new Date())
                }
            },
            cancelable: {
                type: Sequelize.VIRTUAL,
                get() {
                    return isBefore(new Date(), subHours(this.date, 2)); // tirando duas horas do agendamento e verificando se ainda está a duas horas de distancia do agendamento acontecer
                }
            }
        },
        {
            sequelize,
        }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
    }
}

export default Appointment;