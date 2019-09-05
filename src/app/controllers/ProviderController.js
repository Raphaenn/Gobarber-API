// Controller para buscar os usuários que são providers.

import User from "../models/Users"
import File from "../models/File"

class ProviderController {
    async index(req, res) {
        const prov = await User.findAll({
            where: {provider: true},
            attributes: ['id', 'name', 'email', 'avatar_id'], // passar atritubos que desejamos exibir ao front end
            include: [                                          // incluir dados do avatar associado ao usuário provider
                {
                    model: File, 
                    as: 'avatar', // foi definido no User que o codinome do file seria avatar
                    attributes: ['name', 'path', 'url'],
                },
            ]
        });
        return res.json(prov)
    }
}

export default new ProviderController();