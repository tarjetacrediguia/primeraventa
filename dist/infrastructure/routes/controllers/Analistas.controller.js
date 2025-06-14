"use strict";
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
exports.listAnalistas = exports.getAnalista = exports.deleteAnalista = exports.updateAnalista = exports.createAnalista = void 0;
const CreateAnalistaUseCase_1 = require("../../../application/use-cases/Analista/CreateAnalistaUseCase");
const DeleteAnalistaUseCase_1 = require("../../../application/use-cases/Analista/DeleteAnalistaUseCase");
const GetAnalistaByIdUseCase_1 = require("../../../application/use-cases/Analista/GetAnalistaByIdUseCase");
const GetAllAnalistaUseCase_1 = require("../../../application/use-cases/Analista/GetAllAnalistaUseCase");
const UpdateAnalistaUseCase_1 = require("../../../application/use-cases/Analista/UpdateAnalistaUseCase");
const AnalistaRepositoryAdapter_1 = require("../../adapters/repository/AnalistaRepositoryAdapter");
const analistaRepository = new AnalistaRepositoryAdapter_1.AnalistaRepositoryAdapter();
const createAnalista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, apellido, email, password, telefono, permisos } = req.body;
        const useCase = new CreateAnalistaUseCase_1.CreateAnalistaUseCase(analistaRepository);
        const analista = yield useCase.execute(nombre, apellido, email, password, telefono);
        res.status(201).json(analista.toPlainObject());
    }
    catch (error) {
        console.error('Error al crear analista:', error);
        if (error.message === "Todos los campos son obligatorios") {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error al crear analista' });
        }
    }
});
exports.createAnalista = createAnalista;
const updateAnalista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nombre, apellido, telefono } = req.body;
        const useCase = new UpdateAnalistaUseCase_1.UpdateAnalistaUseCase(analistaRepository);
        const analistaActualizado = yield useCase.execute(Number(id), nombre, apellido, telefono);
        res.status(200).json(analistaActualizado.toPlainObject());
    }
    catch (error) {
        if (error.message === "Analista no encontrado") {
            res.status(404).json({ error: error.message });
        }
        else if (error.message === "Todos los campos son obligatorios") {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error al actualizar analista' });
        }
    }
});
exports.updateAnalista = updateAnalista;
const deleteAnalista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const useCase = new DeleteAnalistaUseCase_1.DeleteAnalistaUseCase(analistaRepository);
        yield useCase.execute(Number(id));
        res.status(204).send();
    }
    catch (error) {
        if (error.message === "Analista no encontrado") {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error al eliminar analista' });
        }
    }
});
exports.deleteAnalista = deleteAnalista;
const getAnalista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const useCase = new GetAnalistaByIdUseCase_1.GetAnalistaByIdUseCase(analistaRepository);
        const analista = yield useCase.execute(Number(id));
        res.status(200).json(analista.toPlainObject());
    }
    catch (error) {
        if (error.message === "Analista no encontrado") {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error al obtener analista' });
        }
    }
});
exports.getAnalista = getAnalista;
const listAnalistas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const useCase = new GetAllAnalistaUseCase_1.GetAllAnalistaUseCase(analistaRepository);
        const analistas = yield useCase.execute();
        res.status(200).json(analistas.map(analista => analista.toPlainObject()));
    }
    catch (error) {
        res.status(500).json({ error: 'Error al listar analistas' });
    }
});
exports.listAnalistas = listAnalistas;
