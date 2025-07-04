// src/infrastructure/routes/contratos.routes.ts
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
