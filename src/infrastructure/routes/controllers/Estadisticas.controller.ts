//src/infrastructure/routes/controllers/Estadisticas.controller.ts

/**
 * CONTROLADOR: Estadísticas
 *
 * Este archivo contiene los controladores para la obtención de estadísticas del sistema.
 * Permite obtener estadísticas de comerciantes, analistas y solicitudes.
 * Cada función está diseñada para ser utilizada como handler de rutas Express.
 */

import { Request, Response } from 'express';
import { GetSolicitudesInicialesStatsUseCase } from '../../../application/use-cases/Estadisticas/GetSolicitudesInicialesStatsUseCase';
import { GetSolicitudesFormalesStatsUseCase } from '../../../application/use-cases/Estadisticas/GetSolicitudesFormalesStatsUseCase';
import { GetTiemposAprobacionStatsUseCase } from '../../../application/use-cases/Estadisticas/GetTiemposAprobacionStatsUseCase';
import { GetTasaConversionStatsUseCase } from '../../../application/use-cases/Estadisticas/GetTasaConversionStatsUseCase';
import { GetContratosStatsUseCase } from '../../../application/use-cases/Estadisticas/GetContratosStatsUseCase';
import { EstadisticasRepositoryAdapter } from '../../adapters/repository/EstadisticasRepositoryAdapter';
import { GetTiemposResolucionUseCase } from '../../../application/use-cases/Estadisticas/GetTiemposResolucionUseCase';
import { GetActividadSistemaUseCase } from '../../../application/use-cases/Estadisticas/GetActividadSistemaUseCase';
import { GetEstadisticasAnalistasUseCase } from '../../../application/use-cases/Estadisticas/GetEstadisticasAnalistasUseCase';
import { GetEstadisticasComerciantesUseCase } from '../../../application/use-cases/Estadisticas/GetEstadisticasComerciantesUseCase';

const estadisticasRepository = new EstadisticasRepositoryAdapter();

/**
 * Obtiene estadísticas de solicitudes iniciales en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de solicitudes iniciales o un error en caso de fallo.
 */
export const getSolicitudesInicialesStats = async (req: Request, res: Response) => {
  try {
    const { desde, hasta } = req.query;
    const useCase = new GetSolicitudesInicialesStatsUseCase(estadisticasRepository);
    const stats = await useCase.execute(
      desde ? new Date(desde as string) : undefined,
      hasta ? new Date(hasta as string) : undefined
    );
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas de solicitudes iniciales' });
  }
};

/**
 * Obtiene estadísticas de solicitudes formales en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de solicitudes formales o un error en caso de fallo.
 */
export const getSolicitudesFormalesStats = async (req: Request, res: Response) => {
  try {
    const { desde, hasta } = req.query;
    const useCase = new GetSolicitudesFormalesStatsUseCase(estadisticasRepository);
    const stats = await useCase.execute(
      desde ? new Date(desde as string) : undefined,
      hasta ? new Date(hasta as string) : undefined
    );
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas de solicitudes formales' });
  }
};

/**
 * Obtiene estadísticas de tiempos de aprobación en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de tiempos de aprobación o un error en caso de fallo.
 */
export const getTiemposAprobacionStats = async (req: Request, res: Response) => {
  try {
    const { desde, hasta } = req.query;
    const useCase = new GetTiemposAprobacionStatsUseCase(estadisticasRepository);
    const stats = await useCase.execute(
      desde ? new Date(desde as string) : undefined,
      hasta ? new Date(hasta as string) : undefined
    );
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tiempos de aprobación' });
  }
};

/**
 * Obtiene estadísticas de tasa de conversión en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de tasa de conversión o un error en caso de fallo.
 */
export const getTasaConversionStats = async (req: Request, res: Response) => {
  try {
    const { desde, hasta } = req.query;
    const useCase = new GetTasaConversionStatsUseCase(estadisticasRepository);
    const stats = await useCase.execute(
      desde ? new Date(desde as string) : undefined,
      hasta ? new Date(hasta as string) : undefined
    );
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tasa de conversión' });
  }
};

/**
 * Obtiene estadísticas de contratos en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de contratos o un error en caso de fallo.
 */
export const getContratosStats = async (req: Request, res: Response) => {
  try {
    const { desde, hasta } = req.query;
    const useCase = new GetContratosStatsUseCase(estadisticasRepository);
    const stats = await useCase.execute(
      desde ? new Date(desde as string) : undefined,
      hasta ? new Date(hasta as string) : undefined
    );
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas de contratos' });
  }
};

/**
 * Obtiene estadísticas de comerciantes en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de comerciantes o un error en caso de fallo.
 */
export const getEstadisticasComerciantes = async (req: Request, res: Response) => {
  try {
    const { desde, hasta } = req.query;
    
    

    const useCase = new GetEstadisticasComerciantesUseCase(estadisticasRepository);
    const stats = await useCase.execute(
      formatDate(desde as string | undefined),
      formatDate(hasta as string | undefined)
    );
    
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener estadísticas de comerciantes' });
  }
};

// Convertir a formato ISO y ajustar a UTC
    const formatDate = (dateString?: string) => {
      if (!dateString) return undefined;
      const date = new Date(dateString);
      return date.toISOString();
    };

/**
 * Obtiene estadísticas de analistas en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de analistas o un error en caso de fallo.
 */
export const getEstadisticasAnalistas = async (req: Request, res: Response) => {
  try {
    const { desde, hasta } = req.query;
    const useCase = new GetEstadisticasAnalistasUseCase(estadisticasRepository);
    const stats = await useCase.execute(
      formatDate(desde as string | undefined),
      formatDate(hasta as string | undefined)
    );
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas de analistas' });
  }
};

/**
 * Obtiene estadísticas de actividad del sistema en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de actividad del sistema o un error en caso de fallo.
 */
export const getActividadSistema = async (req: Request, res: Response) => {
  try {
    const { desde, hasta } = req.query;
    const useCase = new GetActividadSistemaUseCase(estadisticasRepository);
    const stats = await useCase.execute(
      formatDate(desde as string | undefined),
      formatDate(hasta as string | undefined)
    );
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener actividad del sistema' });
  }
};

/**
 * Obtiene estadísticas de tiempos de resolución en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de tiempos de resolución o un error en caso de fallo.
 */
export const getTiemposResolucion = async (req: Request, res: Response) => {
  try {
    const { desde, hasta } = req.query;
    const useCase = new GetTiemposResolucionUseCase(estadisticasRepository);
    const stats = await useCase.execute(
      formatDate(desde as string | undefined),
      formatDate(hasta as string | undefined)
    );
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tiempos de resolución' });
  }
};
