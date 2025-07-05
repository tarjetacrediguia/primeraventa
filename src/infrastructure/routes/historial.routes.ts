//src/infrastructure/routes/historial.routes.ts

/**
 * RUTAS: Historial
 *
 * Este archivo define las rutas para la obtención del historial de acciones sobre solicitudes iniciales.
 * Permite a los administradores consultar el historial de una solicitud inicial específica.
 * Todas las rutas están protegidas por el middleware de rol de administrador.
 */

import { Router } from 'express';
import { esAdministrador } from './middlewares/rolesMiddleware';
import { getHistorialBySolicitudInicial } from './controllers/Historial.controller';

const router = Router();

router.get('/solicitud-inicial/:solicitudInicialId', esAdministrador, getHistorialBySolicitudInicial);

export default router;
