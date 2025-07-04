// src/infrastructure/controllers/Contrato.controller.ts
import { Request, Response } from 'express';
import { GenerarContratoUseCase } from '../../../application/use-cases/Contrato/GenerarContratoUseCase';
import { DescargarContratoUseCase } from '../../../application/use-cases/Contrato/DescargarContratoUseCase';
import { ContratoRepositoryAdapter } from '../../adapters/repository/ContratoRepositoryAdapter';
import { SolicitudFormalRepositoryAdapter } from '../../adapters/repository/SolicitudFormalRepositoryAdapter';
import { NotificationAdapter } from '../../adapters/notification/NotificationAdapter';
import { PdfAdapter } from '../../adapters/pdf/pdfAdapter';
import { ClienteRepositoryAdapter } from '../../adapters/repository/ClienteRepositoryAdapter';
import { HistorialRepositoryAdapter } from '../../adapters/repository/HistorialRepositoryAdapter';
import { SolicitudInicialRepositoryAdapter } from '../../adapters/repository/SolicitudInicialRepositoryAdapter';

// Inicializar adapters
const contratoRepository = new ContratoRepositoryAdapter();
const solicitudRepository = new SolicitudFormalRepositoryAdapter();
const pdfService = new PdfAdapter();
const notificationService = new NotificationAdapter();
const clienteRepository = new ClienteRepositoryAdapter();
const historialRepository = new HistorialRepositoryAdapter();
const solicitudInicialRepository = new SolicitudInicialRepositoryAdapter();

export const generarContratoPDF = async (req: Request, res: Response) => {
  try {
    const solicitudId = parseInt(req.params.id, 10);
    const userId = Number(req.user?.id);
    // Obtener solicitud
    const solicitud = await solicitudRepository.getSolicitudFormalById(solicitudId);
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    // Verificar permisos
    if (req.user?.rol === 'comerciante') {
      //const cliente = await clienteRepository.findById(solicitud.getClienteId());
      if (solicitud.getComercianteId() !== userId) {
        return res.status(403).json({ error: 'No tiene permiso para esta operación' });
      }
    }

    // Generar contrato
    const useCase = new GenerarContratoUseCase(
      solicitudRepository,
      contratoRepository,
      pdfService,
      notificationService,
      clienteRepository,
      historialRepository,
      solicitudInicialRepository
    );
    const contrato = await useCase.execute(solicitudId,userId);
    // Devolver URL con ID de contrato, no de solicitud
    res.status(200).json({ 
      url: `/API/v1/contratos/${contrato.getId()}` 
    });
  } catch (error: any) {
    const message = error.message || 'Error generando contrato';
    const status = message.includes('no encontrada') ? 404 : 500;
    res.status(status).json({ error: message });
  }
};

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
