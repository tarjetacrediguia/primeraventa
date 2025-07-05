//src/infrastructure/routes/controllers/Historial.controller.ts

/**
 * CONTROLADOR: Historial
 *
 * Este archivo contiene los controladores para la gestión del historial de acciones en el sistema.
 * Permite obtener el historial de un usuario o de una solicitud.
 * Cada función está diseñada para ser utilizada como handler de rutas Express.
 */

import { Request, Response } from 'express';
import { GetHistorialBySolicitudInicialUseCase } from '../../../application/use-cases/Historial/GetHistorialBySolicitudInicial';
import { HistorialRepositoryAdapter } from '../../adapters/repository/HistorialRepositoryAdapter';

const historialRepository = new HistorialRepositoryAdapter();

/**
 * Obtiene el historial de una solicitud por su ID.
 * @param req - Request de Express con el ID de la solicitud en params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un array de acciones del historial o un error en caso de fallo.
 */
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
