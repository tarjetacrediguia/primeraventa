// src/infrastructure/controllers/Compra.controller.ts
import { Request, Response } from "express";
import { CrearCompraUseCase } from "../../../application/use-cases/Compra/CrearCompraUseCase";
import { AprobarCompraUseCase } from "../../../application/use-cases/Compra/AprobarCompraUseCase";
import { RechazarCompraUseCase } from "../../../application/use-cases/Compra/RechazarCompraUseCase";
import { ObtenerComprasPorEstadoUseCase } from "../../../application/use-cases/Compra/ObtenerComprasPorEstadoUseCase";
import { ObtenerDetalleCompraUseCase } from "../../../application/use-cases/Compra/ObtenerDetalleCompraUseCase";
import { UpdateCompraUseCase } from "../../../application/use-cases/Compra/UpdateCompraUseCase";

// Repositorios y adapters
import { CompraRepositoryAdapter } from "../../adapters/repository/CompraRepositoryAdapter";
import { SolicitudFormalRepositoryAdapter } from "../../adapters/repository/SolicitudFormalRepositoryAdapter";
import { HistorialRepositoryAdapter } from "../../adapters/repository/HistorialRepositoryAdapter";
import { NotificationAdapter } from "../../adapters/notification/NotificationAdapter";
import { ClienteRepositoryAdapter } from "../../adapters/repository/ClienteRepositoryAdapter";
import { AnalistaRepositoryAdapter } from "../../adapters/repository/AnalistaRepositoryAdapter";
import { SolicitudInicialRepositoryAdapter } from "../../adapters/repository/SolicitudInicialRepositoryAdapter";
import { ConfiguracionRepositoryAdapter } from '../../adapters/repository/ConfiguracionRepositoryAdapter';
import { ObtenerTodasLasComprasUseCase } from "../../../application/use-cases/Compra/ObtenerTodasLasComprasUseCase";
import { ObtenerComprasPorComercianteUseCase } from "../../../application/use-cases/Compra/ObtenerComprasPorComercianteUseCase";
import { ObtenerCompraPorSolicitudFormalUseCase } from "../../../application/use-cases/Compra/ObtenerCompraPorSolicitudFormalUseCase";

// Instancias de adapters
const compraRepository = new CompraRepositoryAdapter();
const solicitudFormalRepository = new SolicitudFormalRepositoryAdapter();
const historialRepository = new HistorialRepositoryAdapter();
const notificationService = new NotificationAdapter();
const clienteRepository = new ClienteRepositoryAdapter();
const analistaRepo = new AnalistaRepositoryAdapter();
const solicitudInicialRepository = new SolicitudInicialRepositoryAdapter();
const configuracionRepo = new ConfiguracionRepositoryAdapter();

// Controlador para crear compra
export const crearCompra = async (req: Request, res: Response) => {
    try {
        const { solicitudFormalId, descripcion, cantidadCuotas, montoTotal } = req.body;
        const usuarioId = req.user?.id;
        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const useCase = new CrearCompraUseCase(
            compraRepository,
            solicitudFormalRepository,
            historialRepository,
            notificationService,
            analistaRepo,
            solicitudInicialRepository
        );

        const compra = await useCase.execute(
            solicitudFormalId,
            descripcion,
            cantidadCuotas,
            montoTotal,
            Number(usuarioId)
        );

        res.status(201).json(compra.toPlainObject());
    } catch (error: any) {
        console.error('Error al crear compra:', error);
        res.status(500).json({ 
            error: error.message || 'Error al crear compra',
            code: error.code || 'UNKNOWN_ERROR'
        });
    }
};

// Controlador para obtener compras por estado
export const obtenerComprasPorEstado = async (req: Request, res: Response) => {
    try {
        const estado = req.params.estado as string;
        const useCase = new ObtenerComprasPorEstadoUseCase(compraRepository);
        const compras = await useCase.execute(estado as any);

        res.status(200).json(compras.map(c => c.toPlainObject()));
    } catch (error: any) {
        if (error.message.includes('Estado de compra inválido')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error al obtener compras' });
        }
    }
};

export const obtenerDetalleCompra = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const usuarioId = req.user?.id ? Number(req.user.id) : undefined;
        const usuarioRol = req.user?.rol;

        const useCase = new ObtenerDetalleCompraUseCase(compraRepository);
        const compra = await useCase.execute(id, usuarioId, usuarioRol);

        res.status(200).json(compra.toPlainObject());
    } catch (error: any) {
        if (error.message.includes('No existe una compra con ID')) {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('No tienes permiso')) {
            res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error al obtener detalle de compra' });
        }
    }
};

export const obtenerCompraPorSolicitudFormal = async (req: Request, res: Response) => {
    try {
        const idSolicitudFormal = parseInt(req.params.idSolicitudFormal, 10);
        const usuarioId = req.user?.id ? Number(req.user.id) : undefined;
        const usuarioRol = req.user?.rol;

        const useCase = new ObtenerCompraPorSolicitudFormalUseCase(compraRepository);
        const compras = await useCase.execute(idSolicitudFormal, usuarioId, usuarioRol);
        
        res.status(200).json(compras.map(c => c.toPlainObject()));
    } catch (error: any) {
        if (error.message.includes('No se encontraron compras')) {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('No tienes permiso')) {
            res.status(403).json({ error: error.message });
        } else {
            console.error('Error al obtener compra por solicitud formal:', error);
            res.status(500).json({ error: 'Error al obtener compra por solicitud formal' });
        }
    }
};

export const obtenerCompraPorSolicitudFormalAnalista = async (req: Request, res: Response) => {
    try {
        const idSolicitudFormal = parseInt(req.params.idSolicitudFormal, 10);
        
        // Para analistas, no necesitamos verificar permisos de comerciante
        const useCase = new ObtenerCompraPorSolicitudFormalUseCase(compraRepository);
        const compra = await useCase.execute(idSolicitudFormal);
        
        res.status(200).json(compra);
    } catch (error: any) {
        if (error.message.includes('No se encontraron compras')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error al obtener compra por solicitud formal' });
        }
    }
};

// Controlador para aprobar compra
export const aprobarCompra = async (req: Request, res: Response) => {
    try {
        const { numeroAutorizacion, numeroCuenta } = req.body;
        if (!numeroAutorizacion && !numeroCuenta) {
            return res.status(400).json({ error: 'Debe proporcionar al menos un número de tarjeta o cuenta' });
        }
        const id = parseInt(req.params.id, 10);
        const usuarioId = req.user?.id;
        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const useCase = new AprobarCompraUseCase(
            compraRepository,
            solicitudFormalRepository,
            historialRepository,
            notificationService,
            clienteRepository,
            solicitudInicialRepository
        );

        const compraActualizada = await useCase.execute(id, Number(usuarioId), numeroAutorizacion, numeroCuenta);
        res.status(200).json(compraActualizada.toPlainObject());
    } catch (error: any) {
        console.error('Error al aprobar compra:', error);
        
        if (error.message.includes('No existe una compra con ID') || 
            error.message.includes('no está pendiente') ||
            error.message.includes('no existe') ||
            error.message.includes('no está aprobada') ||
            error.message.includes('excede el límite')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ 
                error: error.message || 'Error al aprobar compra',
                code: 'APROBACION_ERROR'
            });
        }
    }
};

// Controlador para rechazar compra
export const rechazarCompra = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { motivo } = req.body;
        const usuarioId = req.user?.id;
        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const useCase = new RechazarCompraUseCase(
            compraRepository,
            historialRepository,
            notificationService,
            solicitudFormalRepository,
            clienteRepository,
            solicitudInicialRepository
        );

        const compraActualizada = await useCase.execute(id, motivo, Number(usuarioId));
        res.status(200).json(compraActualizada.toPlainObject());
    } catch (error: any) {
        console.error('Error al rechazar compra:', error);
        
        if (error.message.includes('No existe una compra con ID') || 
            error.message.includes('no está pendiente') ||
            error.message.includes('Debe proporcionar un motivo')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ 
                error: error.message || 'Error al rechazar compra',
                code: 'RECHAZO_ERROR'
            });
        }
    }
};

// Controlador para actualizar compra
export const actualizarCompra = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { descripcion, cantidadCuotas, montoTotal } = req.body;
        const usuarioId = req.user?.id;
        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const useCase = new UpdateCompraUseCase(
            compraRepository,
            historialRepository,
            solicitudFormalRepository,
            notificationService
        );

        const compraActualizada = await useCase.execute(
            id,
            descripcion,
            cantidadCuotas,
            montoTotal,
            Number(usuarioId)
        );

        res.status(200).json(compraActualizada.toPlainObject());
    } catch (error: any) {
        console.error('Error al actualizar compra:', error);
        
        if (error.message === "Compra no encontrada") {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('Cantidad de cuotas inválida') || 
                   error.message.includes('sin nombre') || 
                   error.message.includes('precio inválido') || 
                   error.message.includes('cantidad inválida')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ 
                error: error.message || 'Error al actualizar compra',
                code: 'UPDATE_ERROR'
            });
        }
    }
};

export const obtenerTodasLasCompras = async (req: Request, res: Response) => {
    try {
        const useCase = new ObtenerTodasLasComprasUseCase(compraRepository);
        const compras = await useCase.execute();
        res.status(200).json(compras);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener compras' });
    }
};

export const obtenerComprasPorComerciante = async (req: Request, res: Response) => {
    try {
        // Obtener el ID del comerciante desde el token de autenticación
        const comercianteId = req.user?.id;
        if (!comercianteId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const useCase = new ObtenerComprasPorComercianteUseCase(compraRepository);
        const compras = await useCase.execute(Number(comercianteId));
        res.status(200).json(compras.map(c => c.toPlainObject()));
    } catch (error: any) {
        console.error('Error al obtener compras por comerciante:', error);
        res.status(500).json({ error: 'Error al obtener compras' });
    }
};