//src/infrastructure/routes/controllers/Estadisticas.controller.ts

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
