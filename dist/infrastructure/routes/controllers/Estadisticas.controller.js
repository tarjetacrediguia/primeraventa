"use strict";
//src/infrastructure/routes/controllers/Estadisticas.controller.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTiemposResolucion = exports.getActividadSistema = exports.getEstadisticasAnalistas = exports.getEstadisticasComerciantes = exports.getContratosStats = exports.getTasaConversionStats = exports.getTiemposAprobacionStats = exports.getSolicitudesFormalesStats = exports.getSolicitudesInicialesStats = void 0;
const GetSolicitudesInicialesStatsUseCase_1 = require("../../../application/use-cases/Estadisticas/GetSolicitudesInicialesStatsUseCase");
const GetSolicitudesFormalesStatsUseCase_1 = require("../../../application/use-cases/Estadisticas/GetSolicitudesFormalesStatsUseCase");
const GetTiemposAprobacionStatsUseCase_1 = require("../../../application/use-cases/Estadisticas/GetTiemposAprobacionStatsUseCase");
const GetTasaConversionStatsUseCase_1 = require("../../../application/use-cases/Estadisticas/GetTasaConversionStatsUseCase");
const GetContratosStatsUseCase_1 = require("../../../application/use-cases/Estadisticas/GetContratosStatsUseCase");
const EstadisticasRepositoryAdapter_1 = require("../../adapters/repository/EstadisticasRepositoryAdapter");
const GetTiemposResolucionUseCase_1 = require("../../../application/use-cases/Estadisticas/GetTiemposResolucionUseCase");
const GetActividadSistemaUseCase_1 = require("../../../application/use-cases/Estadisticas/GetActividadSistemaUseCase");
const GetEstadisticasAnalistasUseCase_1 = require("../../../application/use-cases/Estadisticas/GetEstadisticasAnalistasUseCase");
const GetEstadisticasComerciantesUseCase_1 = require("../../../application/use-cases/Estadisticas/GetEstadisticasComerciantesUseCase");
const estadisticasRepository = new EstadisticasRepositoryAdapter_1.EstadisticasRepositoryAdapter();
/**
 * Obtiene estadísticas de solicitudes iniciales en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de solicitudes iniciales o un error en caso de fallo.
 */
const getSolicitudesInicialesStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { desde, hasta } = req.query;
        const useCase = new GetSolicitudesInicialesStatsUseCase_1.GetSolicitudesInicialesStatsUseCase(estadisticasRepository);
        const stats = yield useCase.execute(desde ? new Date(desde) : undefined, hasta ? new Date(hasta) : undefined);
        res.status(200).json(stats);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas de solicitudes iniciales' });
    }
});
exports.getSolicitudesInicialesStats = getSolicitudesInicialesStats;
/**
 * Obtiene estadísticas de solicitudes formales en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de solicitudes formales o un error en caso de fallo.
 */
const getSolicitudesFormalesStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { desde, hasta } = req.query;
        const useCase = new GetSolicitudesFormalesStatsUseCase_1.GetSolicitudesFormalesStatsUseCase(estadisticasRepository);
        const stats = yield useCase.execute(desde ? new Date(desde) : undefined, hasta ? new Date(hasta) : undefined);
        res.status(200).json(stats);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas de solicitudes formales' });
    }
});
exports.getSolicitudesFormalesStats = getSolicitudesFormalesStats;
/**
 * Obtiene estadísticas de tiempos de aprobación en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de tiempos de aprobación o un error en caso de fallo.
 */
const getTiemposAprobacionStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { desde, hasta } = req.query;
        const useCase = new GetTiemposAprobacionStatsUseCase_1.GetTiemposAprobacionStatsUseCase(estadisticasRepository);
        const stats = yield useCase.execute(desde ? new Date(desde) : undefined, hasta ? new Date(hasta) : undefined);
        res.status(200).json(stats);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener tiempos de aprobación' });
    }
});
exports.getTiemposAprobacionStats = getTiemposAprobacionStats;
/**
 * Obtiene estadísticas de tasa de conversión en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de tasa de conversión o un error en caso de fallo.
 */
const getTasaConversionStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { desde, hasta } = req.query;
        const useCase = new GetTasaConversionStatsUseCase_1.GetTasaConversionStatsUseCase(estadisticasRepository);
        const stats = yield useCase.execute(desde ? new Date(desde) : undefined, hasta ? new Date(hasta) : undefined);
        res.status(200).json(stats);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener tasa de conversión' });
    }
});
exports.getTasaConversionStats = getTasaConversionStats;
/**
 * Obtiene estadísticas de contratos en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de contratos o un error en caso de fallo.
 */
const getContratosStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { desde, hasta } = req.query;
        const useCase = new GetContratosStatsUseCase_1.GetContratosStatsUseCase(estadisticasRepository);
        const stats = yield useCase.execute(desde ? new Date(desde) : undefined, hasta ? new Date(hasta) : undefined);
        res.status(200).json(stats);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas de contratos' });
    }
});
exports.getContratosStats = getContratosStats;
/**
 * Obtiene estadísticas de comerciantes en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de comerciantes o un error en caso de fallo.
 */
const getEstadisticasComerciantes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { desde, hasta } = req.query;
        const useCase = new GetEstadisticasComerciantesUseCase_1.GetEstadisticasComerciantesUseCase(estadisticasRepository);
        const stats = yield useCase.execute(formatDate(desde), formatDate(hasta));
        res.status(200).json(stats);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener estadísticas de comerciantes' });
    }
});
exports.getEstadisticasComerciantes = getEstadisticasComerciantes;
// Convertir a formato ISO y ajustar a UTC
const formatDate = (dateString) => {
    if (!dateString)
        return undefined;
    const date = new Date(dateString);
    return date.toISOString();
};
/**
 * Obtiene estadísticas de analistas en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de analistas o un error en caso de fallo.
 */
const getEstadisticasAnalistas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { desde, hasta } = req.query;
        const useCase = new GetEstadisticasAnalistasUseCase_1.GetEstadisticasAnalistasUseCase(estadisticasRepository);
        const stats = yield useCase.execute(formatDate(desde), formatDate(hasta));
        res.status(200).json(stats);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas de analistas' });
    }
});
exports.getEstadisticasAnalistas = getEstadisticasAnalistas;
/**
 * Obtiene estadísticas de actividad del sistema en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de actividad del sistema o un error en caso de fallo.
 */
const getActividadSistema = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { desde, hasta } = req.query;
        const useCase = new GetActividadSistemaUseCase_1.GetActividadSistemaUseCase(estadisticasRepository);
        const stats = yield useCase.execute(formatDate(desde), formatDate(hasta));
        res.status(200).json(stats);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener actividad del sistema' });
    }
});
exports.getActividadSistema = getActividadSistema;
/**
 * Obtiene estadísticas de tiempos de resolución en un rango de fechas.
 * @param req - Request de Express con los parámetros de fecha en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve las estadísticas de tiempos de resolución o un error en caso de fallo.
 */
const getTiemposResolucion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { desde, hasta } = req.query;
        const useCase = new GetTiemposResolucionUseCase_1.GetTiemposResolucionUseCase(estadisticasRepository);
        const stats = yield useCase.execute(formatDate(desde), formatDate(hasta));
        res.status(200).json(stats);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener tiempos de resolución' });
    }
});
exports.getTiemposResolucion = getTiemposResolucion;
