// src/infrastructure/routes/configuracion.routes.ts
import { Router } from 'express';
import { esAdministrador } from './middlewares/rolesMiddleware';
import { 
    getConfiguracion, 
    updateConfiguracion, 
    createConfiguracion 
} from './controllers/Configuracion.controller';

const router = Router();

// Obtener toda la configuración
router.get('/', esAdministrador, getConfiguracion);

router.put('/', esAdministrador, updateConfiguracion);

// Crear nueva configuración
router.post('/', esAdministrador, createConfiguracion);

export default router;
