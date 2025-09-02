"use strict";
// src/application/use-cases/SolicitudFormal/UpdateSolicitudFormalUseCase.ts
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
/**
 * Caso de uso para actualizar solicitudes formales de crédito.
 *
 * Esta clase implementa la lógica para actualizar solicitudes formales,
 * incluyendo la detección automática de cambios y el registro de modificaciones
 * en el historial del sistema para auditoría.
 */
class UpdateSolicitudFormalUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de solicitudes formales
     * @param historialRepository - Puerto para registro de eventos en historial
     */
    constructor(repository, historialRepository) {
        this.repository = repository;
        this.historialRepository = historialRepository;
    }
    /**
     * Ejecuta la actualización de una solicitud formal.
     *
     * Este método implementa el flujo completo de actualización:
     * 1. Obtiene la versión original de la solicitud
     * 2. Valida que la solicitud no esté aprobada
     * 3. Detecta cambios entre la versión original y la actualizada
     * 4. Actualiza la solicitud en la base de datos
     * 5. Registra los cambios en el historial si los hay
     *
     * @param solicitud - La solicitud formal con los datos actualizados
     * @param usuarioId - ID del usuario que realiza la actualización
     * @param comentario - Comentario opcional sobre la actualización
     * @returns Promise<SolicitudFormal> - La solicitud formal actualizada
     * @throws Error - Si la solicitud no existe, está aprobada o ocurre un error en el proceso
     */
    execute(solicitud, usuarioId, comentario) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Obtener la versión anterior para comparar cambios
            const original = yield this.repository.getSolicitudFormalById(solicitud.getId());
            const solicitudInicialId = original === null || original === void 0 ? void 0 : original.getSolicitudInicialId();
            try {
                if (!original) {
                    throw new Error("Solicitud no encontrada");
                }
                /*
                if (original.getEstado() == "aprobada") {
                    throw new Error("No se puede actualizar una solicitud aprobada");
                }
                */
                // 2. Detectar cambios antes de actualizar
                const cambios = this.detectarCambios(original, solicitud);
                console.log("Cambios detectados:", cambios);
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
    /**
     * Detecta cambios entre la versión original y la actualizada de una solicitud formal.
     *
     * Este método privado compara todos los campos relevantes de la solicitud
     * y retorna un array con los cambios detectados, incluyendo el campo modificado,
     * el valor anterior y el nuevo valor.
     *
     * @param original - La solicitud formal original
     * @param actualizada - La solicitud formal con los cambios
     * @returns any[] - Array con los cambios detectados
     */
    detectarCambios(original, actualizada) {
        const cambios = [];
        // Lista de campos válidos que existen en SolicitudFormal y tienen getters
        const campos = [
            'nombreCompleto', 'apellido', 'telefono', 'email',
            'fechaSolicitud', 'estado', 'aceptaTarjeta', 'fechaNacimiento',
            'domicilio', 'referentes', 'comentarios', 'clienteId',
            'fechaAprobacion', 'analistaAprobadorId', 'administradorAprobadorId',
            'comercianteAprobadorId', 'importeNeto', 'limiteBase', 'limiteCompleto',
            'ponderador', 'solicitaAmpliacionDeCredito', 'nuevoLimiteCompletoSolicitado',
            'razonSocialEmpleador', 'cuitEmpleador', 'cargoEmpleador', 'sectorEmpleador',
            'codigoPostalEmpleador', 'localidadEmpleador', 'provinciaEmpleador', 'telefonoEmpleador',
            'sexo', 'codigoPostal', 'localidad', 'provincia', 'numeroDomicilio', 'barrio'
        ];
        for (const campo of campos) {
            try {
                const getterName = `get${campo.charAt(0).toUpperCase() + campo.slice(1)}`;
                // Verificar que el getter exista en el objeto
                if (typeof original[getterName] !== 'function') {
                    console.warn(`Getter ${getterName} no encontrado`);
                    continue; // Saltar campos sin getter
                }
                const valorOriginal = original[getterName]();
                const valorActual = actualizada[getterName]();
                if (Array.isArray(valorOriginal)) {
                    if (!this.sonArraysIguales(valorOriginal, valorActual)) {
                        cambios.push({
                            campo,
                            anterior: valorOriginal,
                            nuevo: valorActual
                        });
                    }
                }
                else if (valorOriginal instanceof Date && valorActual instanceof Date) {
                    // Comparar fechas por su valor de tiempo
                    if (valorOriginal.getTime() !== valorActual.getTime()) {
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
            catch (error) {
                // Ignorar errores de getters que no existen
                console.warn(`Error al obtener el campo ${campo}:`, error);
            }
        }
        return cambios;
    }
    /**
     * Compara si dos arrays son iguales, incluyendo comparación de objetos.
     *
     * Este método privado realiza una comparación profunda de arrays,
     * manejando tanto valores primitivos como objetos mediante JSON.stringify.
     *
     * @param arr1 - Primer array a comparar
     * @param arr2 - Segundo array a comparar
     * @returns boolean - true si los arrays son iguales, false en caso contrario
     */
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
