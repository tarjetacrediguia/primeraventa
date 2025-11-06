// src/infrastructure/routes/configuracion.routes.ts

/**
 * RUTAS: Configuración
 *
 * Este archivo define las rutas para la gestión de la configuración del sistema.
 * Permite a los administradores obtener, actualizar y crear configuraciones.
 * Todas las rutas están protegidas por el middleware de rol de administrador.
 */
import { Router } from 'express';
import { esAdministrador, esComercianteOAnalistaOAdministrador } from './middlewares/rolesMiddleware';
import { 
    getConfiguracion, 
    updateConfiguracion, 
    createConfiguracion 
} from './controllers/Configuracion.controller';

const router = Router();

// Obtener toda la configuración
router.get('/', esComercianteOAnalistaOAdministrador, getConfiguracion);

router.put('/', esAdministrador, updateConfiguracion);

// Crear nueva configuración
router.post('/', esAdministrador, createConfiguracion);

export default router;
