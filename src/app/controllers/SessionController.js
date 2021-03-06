import jwt from "jsonwebtoken";
import * as Yup from "yup"; // importando o arquivo todo, pois não existe export default no arquivo da extensão. - Validação

import authConfig from "../../config/auth";
import User from "../models/Users";
import File from "../models/File";

class SessionController {
    async store(req, res) {

        // Validação de login
        const schema = Yup.object().shape({
            email: Yup.string().required(),
            password: Yup.string().required()
        });

        //If para testar se a validação nao bate
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Validation fails"})
        }

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email },
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: [ 'id','path', 'url']
                } 
            ]
        });

        if (!user) {
            return res.status(401).json({ error: "User not found" })
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: "Password does not match"})
        }

        const { id, name, avatar, provider } = user;

        return res.json({
            user: {
                id,
                name,
                email,
                avatar,
                provider
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        })

    }
}

export default new SessionController();
