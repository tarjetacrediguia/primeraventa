//src/infrastructure/routes/controllers/Historial.controller.ts

import { Request, Response } from 'express';
import { GetHistorialBySolicitudInicialUseCase } from '../../../application/use-cases/Historial/GetHistorialBySolicitudInicial';
import { HistorialRepositoryAdapter } from '../../adapters/repository/HistorialRepositoryAdapter';

const historialRepository = new HistorialRepositoryAdapter();

export const getHistorialBySolicitudInicial = async (req: Request, res: Response) => {
    try {
        const solicitudInicialId = parseInt(req.params.solicitudInicialId, 10);
        if (isNaN(solicitudInicialId)) {
            return res.status(400).json({ error: 'ID de solicitud inicial inválido' });
        }

        const useCase = new GetHistorialBySolicitudInicialUseCase(historialRepository);
        const historial = await useCase.execute(solicitudInicialId);
        res.status(200).json(historial.map(evento => evento.toPlainObject()));
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};