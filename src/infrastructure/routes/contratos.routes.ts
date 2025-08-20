// src/infrastructure/routes/contratos.routes.ts

/**
 * RUTAS: Contratos
 *
 * Este archivo define las rutas para la generación y descarga de contratos en formato PDF.
 * Permite a los comerciantes generar contratos y a comerciantes o analistas descargarlos.
 * Todas las rutas están protegidas por los middlewares de roles correspondientes.
 */
import { Router } from 'express';
import { 
  generarYDescargarContratoPDF
} from './controllers/Contrato.controller';
import { esComerciante, esComercianteOAnalista } from './middlewares/rolesMiddleware';

const router = Router();

// Generar contrato PDF y descargarlo directamente
router.post(
  '/compra/:id/contrato-descarga',
  esComercianteOAnalista, // Solo comerciante puede generar
  generarYDescargarContratoPDF
);

export default router;
