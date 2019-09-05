// Armazenar todos jobs em segundo plano

import Mail from "../../lib/Mail";
import { format, parseISO } from "date-fns";
import pt from 'date-fns/locale/pt'

class CancellationMail {

    // Possibilita chamar o CancellationMail.key sem chamar o método key()
    get key() {
        return "CancellationMail";
    }

    /* Tarefa que vai executar quando o processo for executado - será chamado para envio de cada email */
    async handle({ data }) {

        const { appointment } = data;

         /* Dados do envio de email para o prestador de serviço*/
         await Mail.sendMail({
            to: `${appointment.provider.name} <${appointment.provider.email}>`,
            subject: 'Agendamento cancelado',
            template: "cancellation",
            context: {
                provider: appointment.provider.name,
                user: appointment.user.name,
                date: format(
                    parseISO(appointment.date),
                    " dd 'de' MMMM', às 'H:mm'h' ",
                    {locale: pt}
                )
            }
        })
    }
}

export default new CancellationMail();