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
import { GetEstadisticasSistemaUseCase } from '../../../application/use-cases/Estadisticas/GetEstadisticasSistemaUseCase';
import { GetEstadisticasComprasUseCase } from '../../../application/use-cases/Estadisticas/GetEstadisticasComprasUseCase';
import { GetEstadisticasPorComercioUseCase } from '../../../application/use-cases/Estadisticas/GetEstadisticasPorComercioUseCase';
import { GetEstadisticasPorComercianteUseCase } from '../../../application/use-cases/Estadisticas/GetEstadisticasPorComercianteUseCase';
import { GetRankingComerciosUseCase } from '../../../application/use-cases/Estadisticas/GetRankingComerciosUseCase';
import { GetRankingComerciantesUseCase } from '../../../application/use-cases/Estadisticas/GetRankingComerciantesUseCase';
import { GetTodosAnalistasUseCase } from '../../../application/use-cases/Estadisticas/GetTodosAnalistasUseCase';
import { GetComerciantesPorComercioUseCase } from '../../../application/use-cases/Estadisticas/GetComerciantesPorComercioUseCase';
import { GetTodosComerciosUseCase } from '../../../application/use-cases/Estadisticas/GetTodosComerciosUseCase';



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


/**
 * Obtiene estadísticas generales del sistema
 */
export const getEstadisticasSistema = async (req: Request, res: Response) => {
  try {
    const { desde, hasta } = req.query;
    const useCase = new GetEstadisticasSistemaUseCase(estadisticasRepository);
    const stats = await useCase.execute(
      formatDate(desde as string | undefined),
      formatDate(hasta as string | undefined)
    );
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener estadísticas del sistema' });
  }
};

/**
 * Obtiene estadísticas de compras
 */
export const getEstadisticasCompras = async (req: Request, res: Response) => {
  try {
    const { desde, hasta } = req.query;
    const useCase = new GetEstadisticasComprasUseCase(estadisticasRepository);
    const stats = await useCase.execute(
      formatDate(desde as string | undefined),
      formatDate(hasta as string | undefined)
    );
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener estadísticas de compras' });
  }
};

/**
 * Obtiene estadísticas agrupadas por comercio
 */
export const getEstadisticasPorComercio = async (req: Request, res: Response) => {
  try {
    const { desde, hasta, comercio_id } = req.query;
    const useCase = new GetEstadisticasPorComercioUseCase(estadisticasRepository);
    const stats = await useCase.execute(
      formatDate(desde as string | undefined),
      formatDate(hasta as string | undefined),
      comercio_id as string | undefined
    );
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener estadísticas por comercio' });
  }
};

/**
 * Obtiene estadísticas por comerciante específico
 */
export const getEstadisticasPorComerciante = async (req: Request, res: Response) => {
  try {
    const { desde, hasta, comerciante_id } = req.query;
    const useCase = new GetEstadisticasPorComercianteUseCase(estadisticasRepository);
    const stats = await useCase.execute(
      formatDate(desde as string | undefined),
      formatDate(hasta as string | undefined),
      comerciante_id as string | undefined
    );
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener estadísticas por comerciante' });
  }
};

/**
 * Obtiene ranking de comercios por ventas/compras
 */
export const getRankingComercios = async (req: Request, res: Response) => {
  try {
    const { desde, hasta, limite } = req.query;
    const useCase = new GetRankingComerciosUseCase(estadisticasRepository);
    const stats = await useCase.execute(
      formatDate(desde as string | undefined),
      formatDate(hasta as string | undefined),
      limite ? parseInt(limite as string) : 10
    );
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener ranking de comercios' });
  }
};

/**
 * Obtiene ranking de comerciantes por ventas/compras
 */
export const getRankingComerciantes = async (req: Request, res: Response) => {
  try {
    const { desde, hasta, comercio_id, limite } = req.query;
    const useCase = new GetRankingComerciantesUseCase(estadisticasRepository);
    const stats = await useCase.execute(
      formatDate(desde as string | undefined),
      formatDate(hasta as string | undefined),
      comercio_id as string | undefined,
      limite ? parseInt(limite as string) : 10
    );
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener ranking de comerciantes' });
  }
};


/**
 * Obtiene todos los comercios con sus códigos
 */
export const getTodosComercios = async (req: Request, res: Response) => {
  try {
    const useCase = new GetTodosComerciosUseCase(estadisticasRepository);
    const comercios = await useCase.execute();
    res.status(200).json(comercios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de comercios' });
  }
};

/**
 * Obtiene los comerciantes asociados a un comercio específico
 */
export const getComerciantesPorComercio = async (req: Request, res: Response) => {
  try {
    const { comercio_id } = req.params;
    const useCase = new GetComerciantesPorComercioUseCase(estadisticasRepository);
    const comerciantes = await useCase.execute(comercio_id);
    res.status(200).json(comerciantes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los comerciantes del comercio' });
  }
};

/**
 * Obtiene todos los analistas del sistema
 */
export const getTodosAnalistas = async (req: Request, res: Response) => {
  try {
    const useCase = new GetTodosAnalistasUseCase(estadisticasRepository);
    const analistas = await useCase.execute();
    res.status(200).json(analistas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de analistas' });
  }
};
