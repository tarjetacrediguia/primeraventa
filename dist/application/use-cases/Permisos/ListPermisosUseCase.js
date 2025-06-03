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
exports.ListPermisosUseCase = void 0;
class ListPermisosUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(categoria_1) {
        return __awaiter(this, arguments, void 0, function* (categoria, incluirDetalles = false) {
            const permisos = yield this.repository.getAllPermisos();
            if (!incluirDetalles) {
                return categoria
                    ? permisos.filter(p => p.startsWith(`${categoria}.`))
                    : permisos;
            }
            // Obtener detalles para cada permiso
            const permisosConDetalles = [];
            for (const permiso of permisos) {
                // Si se especificó categoría, filtrar por ella
                if (categoria && !permiso.startsWith(`${categoria}.`))
                    continue;
                const detalle = yield this.repository.getPermisoDetalle(permiso);
                if (detalle) {
                    permisosConDetalles.push({
                        nombre: permiso,
                        descripcion: detalle.descripcion,
                        categoria: detalle.categoria
                    });
                }
            }
            return permisosConDetalles;
        });
    }
}
exports.ListPermisosUseCase = ListPermisosUseCase;
