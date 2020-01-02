import Router from "express";
import multer from "multer"; // Possibilita salvar imagens em banco de dados
import multerConfig from "./config/multer"; // carrega as configurações do multer

import authMiddleware from "./app/middlewares/auth"; // autenticação de usuários
import UserController from "./app/controllers/UserController"; // controller cadastro de usuários
import SessionController from "./app/controllers/SessionController"; // controller de sessão de usuários
import FileController from "./app/controllers/FileController"; // controle de upload de imagens
import ProviderController from "./app/controllers/ProviderController"; // controle de provedores de serviços 
import AvaliableController from "./app/controllers/AvaliableController"; // Listar horários vagos para appointments
import AppointmentController from "./app/controllers/AppointmentController"; // controle dos servirços marcados - usuário
import ScheduleController from "./app/controllers/ScheduleController"; // controle dos servirços marcados - provider
import NotificationController from "./app/controllers/NotificationController"; // Rota para listage de notificações 


const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.get('/', (req, res) => res.send('Working'));

routes.post('/sessions', SessionController.store);
routes.use(authMiddleware); // Utilizado para fazer a autenticação do usuário

routes.put('/users', UserController.update); // rota de update

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/avaliable', AvaliableController.index);

routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
