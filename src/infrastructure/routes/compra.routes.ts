// src/infrastructure/routes/compra.routes.ts
import { Router } from 'express';
import { actualizarCompra, aprobarCompra, crearCompra, obtenerComprasPorEstado, obtenerDetalleCompra, rechazarCompra } from './controllers/Compra.controller';

const router = Router();

// Crear nueva compra
router.post('/', crearCompra);

// Obtener compras por estado
router.get('/estado/:estado', obtenerComprasPorEstado);

// Obtener detalle de compra
router.get('/:id', obtenerDetalleCompra);

// Aprobar compra
router.post('/:id/aprobar', aprobarCompra);

// Rechazar compra
router.post('/:id/rechazar', rechazarCompra);

// Actualizar compra
router.put('/:id', actualizarCompra);

export default router;