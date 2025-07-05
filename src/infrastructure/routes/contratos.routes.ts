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
  generarContratoPDF, 
  descargarContratoPDF 
} from './controllers/Contrato.controller';
import { esComerciante, esComercianteOAnalista } from './middlewares/rolesMiddleware';

const router = Router();

// Generar contrato PDF
router.post(
  '/solicitudes-formales/:id/contrato',
  esComerciante, // Solo comerciante puede generar
  generarContratoPDF
);

// Descargar contrato PDF
router.get(
  '/solicitudes-formales/:id/contrato',
  esComercianteOAnalista, // Ambos pueden descargar
  descargarContratoPDF
);

export default router;
