import multer from "multer";
import crypto from "crypto"; // adcionar nome único na imagem
import { extname, resolve } from "path" // extname para pegar no nome da extensao da imagem (png ou jpge) e resolve percorrer um caminho.

export default  {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, res) => {
                if(err) return cb(err);

                return cb(null, res.toString('hex') + extname(file.originalname)) // retorna um novo nome ao arquivo que será salvo
            });
        },
    }),
};
