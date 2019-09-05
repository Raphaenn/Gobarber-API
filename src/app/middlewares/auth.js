import jwt from "jsonwebtoken";
import { promisify } from "util";

import authConfig from '../../config/auth';

export default async (req, res, next) => {
    const authHearder = req.headers.authorization;

    if (!authHearder) {
        return res.status(401).json({ error: "Token not provided"});
    }

    const [, token] = authHearder.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret); // linha para evitar o callback da função verify do jwt. Além de possibilitar pegarmos o id do usuário que havia sido codificado pelo token no sessionController

        req.userId = decoded.id;
        return next();
    } catch (err) {
        return res.status(401).json({ error: "Token invalid"})
    }
};


// fazer autenticação antes de liberar acesso a troca dos dados do usuário. 
// Usando o token para isso, não precisamos passar o id na url, pois a mesma já está com os dados do usuário que já está logado.