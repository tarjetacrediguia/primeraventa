// src/infrastructure/routes/tasas.routes.ts

import { Router } from 'express';
import { esAdministrador } from './middlewares/rolesMiddleware';
import {
    createConjuntoTasas,
    updateConjuntoTasas,
    deleteConjuntoTasas,
    agregarTasaAConjunto,
    getConjuntoTasas,
    activateConjuntoTasas,
    listConjuntosTasas
} from '../routes/controllers/Tasas.controller';

const router = Router();

// Conjuntos de tasas
router.post('/conjuntos', esAdministrador, createConjuntoTasas);
router.put('/conjuntos/:id', esAdministrador, updateConjuntoTasas);
router.delete('/conjuntos/:id', esAdministrador, deleteConjuntoTasas);
//router.post('/conjuntos/:id/activate', esAdministrador, activateConjuntoTasas);
router.get('/conjuntos', esAdministrador, listConjuntosTasas);
router.get('/conjuntos/:id', esAdministrador, getConjuntoTasas);

// Operaciones con tasas individuales
router.post('/conjuntos/:conjuntoId/tasas', esAdministrador, agregarTasaAConjunto);

export default router;