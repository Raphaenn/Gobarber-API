import * as Yup from "Yup"; // importando o arquivo todo, pois não existe export default no arquivo da extensão. - Validação
import User from "../models/Users";

class UserController {
    // Cadastro dos dados
    async store(req, res) {

        // Validações de criação do usuário
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required(),
            password: Yup.string().required().min(6),
        });

        //If para testar se a validação nao bate
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Validation fails"})
        }

        const userExists = await User.findOne({ where: { email: req.body.email } })

        if(userExists) {
            return res.status(400).json({ error: "User already exists"})
        }

        const user = await User.create(req.body);

        return res.json(user);
    }

    // EDIÇÃO DOS DADOS DO USUÁRIO

    async update(req, res) {

         // Validações de edição do usuário
         const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6).when("oldPassword", (oldPassword, field) => {
                // ? se a variavel estiver prenchida
                return oldPassword ? field.required() : field
            }),
            // garantiar que senha de alteração bate - When password estiver preenchido
            confirmPassword: Yup.string().when('password', (password, field) => {
                return password ? field.required().oneOf([Yup.ref('password')]) : field
            })
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Validation fails"})
        }

        const { email, oldPassword } = req.body;

        const user = await User.findByPk(req.userId);

        // Verificar se email já existe ou é igual ao utilizado
        if (email != user.email) {
            const userExists = await User.findOne({ where: { email }});

            if(userExists) {
                return res.status(400).json({ error: "User already exists"})
            }
        }

        // Verificar se senha antiga confere
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: "Password does not match"})
        }

        const {id, name, provider} = await user.update(req.body);

        // Usar desestruturação para retornar ao front somente esses campos
        return res.json({
            id,
            name,
            email,
            provider,
        });
    }
}

export default new UserController();
