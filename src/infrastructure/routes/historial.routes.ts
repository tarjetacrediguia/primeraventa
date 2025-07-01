//src/infrastructure/routes/historial.routes.ts

import { Router } from 'express';
import { esAdministrador } from './middlewares/rolesMiddleware';
import { getHistorialBySolicitudInicial } from './controllers/Historial.controller';

const router = Router();

router.get('/solicitud-inicial/:solicitudInicialId', esAdministrador, getHistorialBySolicitudInicial);

export default router;