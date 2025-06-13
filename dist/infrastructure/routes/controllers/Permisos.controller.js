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
exports.asignarPermisosAUsuario = exports.asignarPermisosARol = exports.listarPermisos = exports.crearPermiso = void 0;
const PermisoRepositoryAdapter_1 = require("../../adapters/repository/PermisoRepositoryAdapter");
const CreatePermisoUseCase_1 = require("../../../application/use-cases/Permisos/CreatePermisoUseCase");
const ListPermisosUseCase_1 = require("../../../application/use-cases/Permisos/ListPermisosUseCase");
const AsignarPermisosRolUseCase_1 = require("../../../application/use-cases/Permisos/AsignarPermisosRolUseCase");
const AsignarPermisoUseCase_1 = require("../../../application/use-cases/Permisos/AsignarPermisoUseCase");
const permisoRepository = new PermisoRepositoryAdapter_1.PermisoRepositoryAdapter();
const crearPermiso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, descripcion } = req.body;
        if (!nombre || !descripcion) {
            return res.status(400).json({ error: 'Nombre y descripción son obligatorios' });
        }
        const useCase = new CreatePermisoUseCase_1.CreatePermisoUseCase(permisoRepository);
        const permiso = yield useCase.execute(nombre, descripcion);
        res.status(201).json(permiso.toPlainObject());
    }
    catch (error) {
        console.error('Error al crear permiso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.crearPermiso = crearPermiso;
const listarPermisos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const useCase = new ListPermisosUseCase_1.ListPermisosUseCase(permisoRepository);
        const permisos = yield useCase.execute();
        res.status(200).json(permisos.map(permiso => permiso.toPlainObject()));
    }
    catch (error) {
        console.error('Error al listar permisos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.listarPermisos = listarPermisos;
const asignarPermisosARol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rol = req.params.rol;
        const { permisos } = req.body;
        if (!permisos || !Array.isArray(permisos)) {
            return res.status(400).json({ error: 'Se esperaba un arreglo de permisos' });
        }
        console.log('Rol:', rol);
        console.log('Permisos:', permisos);
        const useCase = new AsignarPermisosRolUseCase_1.AsignarPermisosRolUseCase(permisoRepository);
        yield useCase.execute(rol, permisos);
        res.status(200).json({ message: 'Permisos asignados correctamente al rol' });
    }
    catch (error) {
        if (error.message.includes('Rol inválido') ||
            error.message.includes('Permisos inválidos')) {
            res.status(400).json({ error: error.message });
        }
        else if (error.message.includes('no encontrado')) {
            res.status(404).json({ error: error.message });
        }
        else {
            console.error('Error al asignar permisos al rol:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});
exports.asignarPermisosARol = asignarPermisosARol;
const asignarPermisosAUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarioId = parseInt(req.params.id, 10);
        const { permisos } = req.body;
        if (!permisos || !Array.isArray(permisos)) {
            return res.status(400).json({ error: 'Se esperaba un arreglo de permisos' });
        }
        if (isNaN(usuarioId)) {
            return res.status(400).json({ error: 'ID de usuario inválido' });
        }
        // Transformar permisos a array de strings si vienen como objetos
        const nombresPermisos = permisos.map(p => typeof p === 'string' ? p : p.nombre);
        const useCase = new AsignarPermisoUseCase_1.AsignarPermisoUseCase(permisoRepository);
        const usuario = yield useCase.execute(usuarioId, nombresPermisos);
        res.status(200).json({ message: 'Permisos asignados correctamente al usuario' });
    }
    catch (error) {
        if (error.message === 'Usuario no encontrado') {
            res.status(404).json({ error: error.message });
        }
        else if (error.message.includes('Permisos inválidos')) {
            res.status(400).json({ error: error.message });
        }
        else {
            console.error('Error al asignar permisos al usuario:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});
exports.asignarPermisosAUsuario = asignarPermisosAUsuario;
