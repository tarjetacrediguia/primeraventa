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
exports.listAdministradores = exports.getAdministrador = exports.deleteAdministrador = exports.updateAdministrador = exports.createAdministrador = void 0;
const CreateAdminUseCase_1 = require("../../../application/use-cases/Administrador/CreateAdminUseCase");
const DeleteAdminUseCase_1 = require("../../../application/use-cases/Administrador/DeleteAdminUseCase");
const GetAdminByIdUseCase_1 = require("../../../application/use-cases/Administrador/GetAdminByIdUseCase");
const GetAllAdminUseCase_1 = require("../../../application/use-cases/Administrador/GetAllAdminUseCase");
const UpdateAdminUseCase_1 = require("../../../application/use-cases/Administrador/UpdateAdminUseCase");
const AdministradorRepositoryAdapter_1 = require("../../adapters/repository/AdministradorRepositoryAdapter");
const administradorRepository = new AdministradorRepositoryAdapter_1.AdministradorRepositoryAdapter();
const createAdministrador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, apellido, email, password, telefono } = req.body;
        const useCase = new CreateAdminUseCase_1.CreateAdminUseCase(administradorRepository);
        const nuevoAdmin = yield useCase.execute(nombre, apellido, email, password, telefono);
        res.status(201).json(nuevoAdmin.toPlainObject());
    }
    catch (error) {
        console.error('Error al crear administrador:', error);
        if (error.message === "Todos los campos son obligatorios") {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error al crear administrador' });
        }
    }
});
exports.createAdministrador = createAdministrador;
const updateAdministrador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const { nombre, apellido, telefono } = req.body;
        const useCase = new UpdateAdminUseCase_1.UpdateAdminUseCase(administradorRepository);
        const adminActualizado = yield useCase.execute(id, nombre, apellido, telefono);
        res.status(200).json(adminActualizado.toPlainObject());
    }
    catch (error) {
        if (error.message === "Administrador no encontrado") {
            res.status(404).json({ error: error.message });
        }
        else if (error.message === "Todos los campos son obligatorios") {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error al actualizar administrador' });
        }
    }
});
exports.updateAdministrador = updateAdministrador;
const deleteAdministrador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const useCase = new DeleteAdminUseCase_1.DeleteAdminUseCase(administradorRepository);
        const response = yield useCase.execute(id);
        res.status(204).send(response);
    }
    catch (error) {
        if (error.message === "Administrador no encontrado") {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error al eliminar administrador' });
        }
    }
});
exports.deleteAdministrador = deleteAdministrador;
const getAdministrador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const useCase = new GetAdminByIdUseCase_1.GetAdminByIdUseCase(administradorRepository);
        const admin = yield useCase.execute(id);
        res.status(200).json(admin.toPlainObject());
    }
    catch (error) {
        if (error.message === "Administrador no encontrado") {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error al obtener administrador' });
        }
    }
});
exports.getAdministrador = getAdministrador;
const listAdministradores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const useCase = new GetAllAdminUseCase_1.GetAllAdminUseCase(administradorRepository);
        const administradores = yield useCase.execute();
        res.status(200).json(administradores.map(admin => admin.toPlainObject()));
    }
    catch (error) {
        res.status(500).json({ error: 'Error al listar administradores' });
    }
});
exports.listAdministradores = listAdministradores;
