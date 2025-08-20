// src/infrastructure/routes/compra.routes.ts
import { Router } from 'express';
import { actualizarCompra, aprobarCompra, crearCompra, obtenerCompraPorSolicitudFormal, obtenerCompraPorSolicitudFormalAnalista, obtenerComprasPorComerciante, obtenerComprasPorEstado, obtenerDetalleCompra, obtenerTodasLasCompras, rechazarCompra } from './controllers/Compra.controller';
import { esAnalista, esAnalistaOAdministrador, esComerciante, esComercianteOAnalista } from './middlewares/rolesMiddleware';

const router = Router();

// Crear nueva compra
router.post('/',esComerciante, crearCompra);

router.get('/', esAnalista, obtenerTodasLasCompras); // Para analistas

router.get('/obtenerComprasPorComerciante', esComerciante, obtenerComprasPorComerciante);

// Obtener compras por estado
router.get('/estado/:estado', obtenerComprasPorEstado);

// Obtener detalle de compra
router.get('/:id',esComercianteOAnalista, obtenerDetalleCompra);

// Aprobar compra
router.post('/:id/aprobar',esAnalista, aprobarCompra);

// Rechazar compra
router.post('/:id/rechazar',esAnalista, rechazarCompra);

// Actualizar compra
router.put('/:id',esComercianteOAnalista, actualizarCompra);

router.get('/compraporcomerciante-solicitudformal/:idSolicitudFormal', esComercianteOAnalista, obtenerCompraPorSolicitudFormal);

router.get(
    '/compraporanalista-solicitudformal/:idSolicitudFormal', 
    esAnalistaOAdministrador, 
    obtenerCompraPorSolicitudFormalAnalista
);

export default router;