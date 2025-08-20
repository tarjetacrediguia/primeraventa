// src/infrastructure/routes/controllers/Contrato.controller.ts

/**
 * CONTROLADOR: Contratos
 *
 * Este archivo contiene los controladores para la gestión de contratos en el sistema.
 * Permite generar, obtener y listar contratos asociados a solicitudes.
 * Cada función está diseñada para ser utilizada como handler de rutas Express.
 */
import { Request, Response } from 'express';
import { ContratoRepositoryAdapter } from '../../adapters/repository/ContratoRepositoryAdapter';
import { SolicitudFormalRepositoryAdapter } from '../../adapters/repository/SolicitudFormalRepositoryAdapter';
import { NotificationAdapter } from '../../adapters/notification/NotificationAdapter';
import { PdfAdapter } from '../../adapters/pdf/pdfAdapter';
import { ClienteRepositoryAdapter } from '../../adapters/repository/ClienteRepositoryAdapter';
import { HistorialRepositoryAdapter } from '../../adapters/repository/HistorialRepositoryAdapter';
import { SolicitudInicialRepositoryAdapter } from '../../adapters/repository/SolicitudInicialRepositoryAdapter';
import { ComercianteRepositoryAdapter } from '../../adapters/repository/ComercianteRepositoryAdapter';
import { GeneracionYDescargaContratoUseCase } from '../../../application/use-cases/Contrato/GenerarYDescargarContratoUseCase';
import { CompraRepositoryAdapter } from '../../adapters/repository/CompraRepositoryAdapter';

// Inicializar adapters
const contratoRepository = new ContratoRepositoryAdapter();
const solicitudRepository = new SolicitudFormalRepositoryAdapter();
const pdfService = new PdfAdapter();
const notificationService = new NotificationAdapter();
const clienteRepository = new ClienteRepositoryAdapter();
const solicitudInicialRepository = new SolicitudInicialRepositoryAdapter();
const comercianteRepository = new ComercianteRepositoryAdapter();
const historialRepository = new HistorialRepositoryAdapter();
const compraRepository = new CompraRepositoryAdapter();

// Inicializar el nuevo caso de uso unificado
const generacionYDescargaUC = new GeneracionYDescargaContratoUseCase(
    solicitudRepository,
    contratoRepository,
    pdfService,
    notificationService,
    clienteRepository,
    historialRepository,
    solicitudInicialRepository,
    comercianteRepository,
    compraRepository
);

export const generarYDescargarContratoPDF = async (req: Request, res: Response) => {
    try {
        const compraId = parseInt(req.params.id, 10);
        const userId = Number(req.user?.id);
        
        // Ejecutar generación y descarga en un solo paso
        const { pdf } = await generacionYDescargaUC.execute(compraId, userId);
        
        // Enviar el PDF directamente como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=contrato.pdf`);
        res.send(pdf);
    } catch (error: any) {
        const message = error.message || 'Error generando y descargando contrato';
        const status = message.includes('no encontrada') ? 404 : 500;
        res.status(status).json({ error: message });
    }
};
