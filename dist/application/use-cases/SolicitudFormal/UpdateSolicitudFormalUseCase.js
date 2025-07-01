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
exports.UpdateSolicitudFormalUseCase = void 0;
const historialActions_1 = require("../../constants/historialActions");
class UpdateSolicitudFormalUseCase {
    constructor(repository, historialRepository) {
        this.repository = repository;
        this.historialRepository = historialRepository;
    }
    execute(solicitud, usuarioId, comentario) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Obtener la versión anterior para comparar cambios
            const original = yield this.repository.getSolicitudFormalById(solicitud.getId());
            const solicitudInicialId = original === null || original === void 0 ? void 0 : original.getSolicitudInicialId();
            try {
                if (!original) {
                    throw new Error("Solicitud no encontrada");
                }
                if (original.getEstado() == "aprobada") {
                    throw new Error("No se puede actualizar una solicitud aprobada");
                }
                // 2. Detectar cambios antes de actualizar
                const cambios = this.detectarCambios(original, solicitud);
                // 3. Actualizar la solicitud
                const actualizada = yield this.repository.updateSolicitudFormal(solicitud);
                // 4. Registrar en el historial si hay cambios
                if (cambios.length > 0) {
                    yield this.historialRepository.registrarEvento({
                        usuarioId: usuarioId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.UPDATE_SOLICITUD_FORMAL,
                        entidadAfectada: 'solicitudes_formales',
                        entidadId: solicitud.getId(),
                        detalles: {
                            cambios: cambios,
                            comentario: comentario || ""
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                }
                return actualizada;
            }
            catch (error) {
                // Registrar error en el historial
                yield this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: solicitud.getId(),
                    detalles: {
                        error: error instanceof Error ? error.message : String(error),
                        etapa: "actualizacion_solicitud_formal"
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw error;
            }
        });
    }
    detectarCambios(original, actualizada) {
        const cambios = [];
        // Lista de campos a monitorear
        const campos = [
            'nombreCompleto', 'apellido', 'dni', 'telefono', 'email',
            'fechaSolicitud', 'estado', 'aceptaTarjeta', 'fechaNacimiento',
            'domicilio', 'datosEmpleador', 'referentes', 'comentarios',
            'clienteId', 'numeroTarjeta', 'numeroCuenta', 'fechaAprobacion',
            'analistaAprobadorId', 'administradorAprobadorId'
        ];
        for (const campo of campos) {
            const valorOriginal = original[campo];
            const valorActual = actualizada[campo];
            // Comparación especial para arrays y objetos
            if (Array.isArray(valorOriginal)) {
                if (!this.sonArraysIguales(valorOriginal, valorActual)) {
                    cambios.push({
                        campo,
                        anterior: valorOriginal,
                        nuevo: valorActual
                    });
                }
            }
            else if (valorOriginal !== valorActual) {
                cambios.push({
                    campo,
                    anterior: valorOriginal,
                    nuevo: valorActual
                });
            }
        }
        return cambios;
    }
    sonArraysIguales(arr1, arr2) {
        if (arr1.length !== arr2.length)
            return false;
        for (let i = 0; i < arr1.length; i++) {
            if (typeof arr1[i] === 'object') {
                if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
                    return false;
                }
            }
            else if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }
}
exports.UpdateSolicitudFormalUseCase = UpdateSolicitudFormalUseCase;
