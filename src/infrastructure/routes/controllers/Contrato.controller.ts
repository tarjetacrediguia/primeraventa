// src/infrastructure/routes/controllers/Contrato.controller.ts

/**
 * CONTROLADOR: Contratos
 *
 * Este archivo contiene los controladores para la gestión de contratos en el sistema.
 * Permite generar, obtener y listar contratos asociados a solicitudes.
 * Cada función está diseñada para ser utilizada como handler de rutas Express.
 */
import { Request, Response } from 'express';
import { DescargarContratoUseCase } from '../../../application/use-cases/Contrato/DescargarContratoUseCase';
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
        const solicitudId = parseInt(req.params.id, 10);
        const userId = Number(req.user?.id);
        
        // Ejecutar generación y descarga en un solo paso
        const { pdf } = await generacionYDescargaUC.execute(solicitudId, userId);
        
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

/**
 * Obtiene un contrato por su ID.
 * @param req - Request de Express con el ID del contrato en params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve el contrato encontrado o un error si no existe.
 */
export const descargarContratoPDF = async (req: Request, res: Response) => {
  try {
    const contratoId = req.params.id;
    const userId = Number(req.user?.id);

    // Obtener contrato
    const contrato = await contratoRepository.getContratoById(contratoId);
    if (!contrato) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }
    
    // Obtener cliente
    const cliente = await clienteRepository.findById(contrato.getClienteId());
    
    // Verificar permisos relacionar el cliente con el comerciante
    /*
    if (req.user?.rol === 'comerciante') {
      if (cliente.getComercianteId() !== userId) {
        return res.status(403).json({ error: 'No tiene permiso para este contrato' });
      }
    }
    */

    // Generar PDF
    const useCase = new DescargarContratoUseCase(
      contratoRepository,
      pdfService,
      solicitudRepository
    );
    const pdfBuffer = await useCase.execute(contratoId, cliente.getDni());
    
    // Enviar PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=contrato-${contratoId}.pdf`);
    res.send(pdfBuffer);
  } catch (error: any) {
    const message = error.message || 'Error descargando contrato';
    const status = message.includes('no encontrado') ? 404 : 500;
    res.status(status).json({ error: message });
  }
};
