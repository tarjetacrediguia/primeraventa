"use strict";
// src/infrastructure/routes/controllers/Configuracion.controller.ts
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
exports.createConfiguracion = exports.updateConfiguracion = exports.getConfiguracion = void 0;
const GetConfUseCase_1 = require("../../../application/use-cases/Configuraciones/GetConfUseCase");
const UpdateConfUseCase_1 = require("../../../application/use-cases/Configuraciones/UpdateConfUseCase");
const CreateConfUseCase_1 = require("../../../application/use-cases/Configuraciones/CreateConfUseCase");
const ConfiguracionRepositoryAdapter_1 = require("../../adapters/repository/ConfiguracionRepositoryAdapter");
const Configuracion_1 = require("../../../domain/entities/Configuracion");
const configuracionRepository = new ConfiguracionRepositoryAdapter_1.ConfiguracionRepositoryAdapter();
/**
 * Obtiene la configuración general del sistema.
 * @param req - Request de Express.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve la configuración actual o un error en caso de fallo.
 */
const getConfiguracion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const useCase = new GetConfUseCase_1.GetConfUseCase(configuracionRepository);
        const configuraciones = yield useCase.execute();
        res.status(200).json(configuraciones.map(conf => conf.toPlainObject()));
    }
    catch (error) {
        console.error('Error al obtener configuración:', error);
        res.status(500).json({ error: 'Error al obtener configuración' });
    }
});
exports.getConfiguracion = getConfiguracion;
/**
 * Actualiza la configuración general del sistema.
 * @param req - Request de Express con los datos de configuración en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve la configuración actualizada o un error en caso de fallo.
 */
const updateConfiguracion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clave, valor } = req.body;
        if (!clave || valor === undefined) {
            return res.status(400).json({ error: "Clave y valor son obligatorios" });
        }
        const useCase = new UpdateConfUseCase_1.UpdateConfUseCase(configuracionRepository);
        const configuracionActualizada = yield useCase.execute(clave, valor);
        res.status(200).json({ mensaje: "Configuración Actualizada" });
    }
    catch (error) {
        console.error('Error al actualizar configuración:', error);
        if (error.message.startsWith('Configuración con clave')) {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error al actualizar configuración' });
        }
    }
});
exports.updateConfiguracion = updateConfiguracion;
const createConfiguracion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clave, valor, descripcion } = req.body;
        if (!clave || valor === undefined) {
            return res.status(400).json({ error: "Clave y valor son obligatorios" });
        }
        const nuevaConfig = new Configuracion_1.Configuracion(clave, valor, descripcion);
        const useCase = new CreateConfUseCase_1.CreateConfUseCase(configuracionRepository);
        const configuracionCreada = yield useCase.execute(nuevaConfig);
        res.status(201).json(configuracionCreada.toPlainObject());
    }
    catch (error) {
        console.error('Error al crear configuración:', error);
        if (error.message.includes('duplicate key value')) {
            res.status(409).json({ error: 'La clave ya existe' });
        }
        else {
            res.status(500).json({ error: 'Error al crear configuración' });
        }
    }
});
exports.createConfiguracion = createConfiguracion;
