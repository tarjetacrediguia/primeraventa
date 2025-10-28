// src/infrastructure/routes/comercios.routes.ts
import { Router } from 'express';
import { 
    createComercio, 
    getComercio, 
    updateComercio, 
    deleteComercio, 
    listComercios, 
    getPlanesDeCuotas
} from './controllers/Comercios.controller';
import { esAdministrador, esComercianteOAnalistaOAdministrador } from './middlewares/rolesMiddleware';

const router = Router();

router.post('/', esAdministrador, createComercio);
router.get('/', esAdministrador, listComercios);
router.get('/:numeroComercio', esAdministrador, getComercio);
router.put('/:numeroComercio', esAdministrador, updateComercio);
router.delete('/:numeroComercio', esAdministrador, deleteComercio);
//Ruta para planes de cuotas
router.get('/:numeroComercio/planes', esComercianteOAnalistaOAdministrador, getPlanesDeCuotas);

export default router;