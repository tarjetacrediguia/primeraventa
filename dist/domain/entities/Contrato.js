"use strict";
// src/domain/entities/Contrato.ts
/**
 * MÓDULO: Entidad Contrato
 *
 * Este archivo define la clase Contrato que representa un contrato de préstamo
 * generado en el sistema de gestión de préstamos.
 *
 * Responsabilidades:
 * - Representar contratos de préstamo generados
 * - Gestionar información del contrato (monto, estado, fechas)
 * - Manejar documentos PDF del contrato
 * - Proporcionar funcionalidades de generación de contratos
 * - Gestionar números de cuenta y tarjeta asociados
 *
 * @author Sistema de Gestión
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contrato = void 0;
const ConjuntoTasas_1 = require("./ConjuntoTasas");
/**
 * Clase que representa un contrato de préstamo en el sistema.
 * Contiene toda la información relacionada con el contrato, incluyendo
 * monto, estado, fechas y documentos asociados.
 */
class Contrato {
    /**
     * Constructor de la clase Contrato.
     * Inicializa un contrato con todos sus datos básicos.
     *
     * @param id - Identificador único del contrato.
     * @param fechaGeneracion - Fecha de generación del contrato.
     * @param monto - Monto del préstamo.
     * @param estado - Estado actual del contrato.
     * @param solicitudFormalId - ID de la solicitud formal asociada.
     * @param clienteId - ID del cliente beneficiario.
     * @param numeroTarjeta - Número de tarjeta asignado (opcional).
     * @param numeroCuenta - Número de cuenta asignado (opcional).
     */
    constructor(id, fechaGeneracion, estado, solicitudFormalId, clienteId, monto, numeroTarjeta, numeroCuenta, comercioNombre, comercioFecha, comercioNAutorizacion, comercioProducto, comercioSucursal, clienteNombreCompleto, clienteSexo, clienteCuitOcuil, clienteTipoDocumento, clienteDni, clienteFechaNacimiento, clienteEstadoCivil, clienteNacionalidad, clienteDomicilioCalle, clienteDomicilioNumero, clienteDomicilioPiso, clienteDomicilioDepartamento, clienteDomicilioLocalidad, clienteDomicilioProvincia, clienteDomicilioBarrio, clienteDomicilioPais, clienteDomicilioCodigoPostal, clienteDomicilioCorreoElectronico, clienteDomicilioTelefonoFijo, clienteDomicilioTelefonoCelular, clienteDatosLaboralesActividad, clienteDatosLaboralesRazonSocial, clienteDatosLaboralesCuit, clienteDatosLaboralesInicioActividades, clienteDatosLaboralesCargo, clienteDatosLaboralesSector, clienteDatosLaboralesDomicilioLegal, clienteDatosLaboralesCodigoPostal, clienteDatosLaboralesLocalidad, clienteDatosLaboralesProvincia, clienteDatosLaboralesTelefono, tasasTeaCtfFinanciacion, tasasTnaCompensatoriosFinanciacion, tasasTnaPunitorios, tasasCtfFinanciacion, tasasComisionRenovacionAnual, tasasComisionMantenimiento, tasasComisionReposicionPlastico, tasasAtraso05_31Dias, tasasAtraso32_60Dias, tasasAtraso61_90Dias, tasasPagoFacil, tasasPlatiniumPagoFacil, tasasPlatiniumTeaCtfFinanciacion, tasasPlatiniumTnaCompensatoriosFinanciacion, tasasPlatiniumTnaPunitorios, tasasPlatiniumCtfFinanciacion, tasasPlatiniumComisionRenovacionAnual, tasasPlatiniumComisionMantenimiento, tasasPlatiniumComisionReposicionPlastico, tasasPlatiniumAtraso05_31Dias, tasasPlatiniumAtraso32_60Dias, tasasPlatiniumAtraso61_90Dias) {
        this.id = id;
        this.fechaGeneracion = fechaGeneracion;
        this.estado = estado;
        this.solicitudFormalId = solicitudFormalId;
        this.clienteId = clienteId;
        this.monto = monto;
        this.numeroTarjeta = numeroTarjeta;
        this.numeroCuenta = numeroCuenta;
        this.comercioNombre = comercioNombre;
        this.comercioFecha = comercioFecha;
        this.comercioNAutorizacion = comercioNAutorizacion;
        this.comercioProducto = comercioProducto;
        this.comercioSucursal = comercioSucursal;
        this.clienteNombreCompleto = clienteNombreCompleto;
        this.clienteSexo = clienteSexo;
        this.clienteCuitOcuil = clienteCuitOcuil;
        this.clienteTipoDocumento = clienteTipoDocumento;
        this.clienteDni = clienteDni;
        this.clienteFechaNacimiento = clienteFechaNacimiento;
        this.clienteEstadoCivil = clienteEstadoCivil;
        this.clienteNacionalidad = clienteNacionalidad;
        this.clienteDomicilioCalle = clienteDomicilioCalle;
        this.clienteDomicilioNumero = clienteDomicilioNumero;
        this.clienteDomicilioPiso = clienteDomicilioPiso;
        this.clienteDomicilioDepartamento = clienteDomicilioDepartamento;
        this.clienteDomicilioLocalidad = clienteDomicilioLocalidad;
        this.clienteDomicilioProvincia = clienteDomicilioProvincia;
        this.clienteDomicilioBarrio = clienteDomicilioBarrio;
        this.clienteDomicilioPais = clienteDomicilioPais;
        this.clienteDomicilioCodigoPostal = clienteDomicilioCodigoPostal;
        this.clienteDomicilioCorreoElectronico = clienteDomicilioCorreoElectronico;
        this.clienteDomicilioTelefonoFijo = clienteDomicilioTelefonoFijo;
        this.clienteDomicilioTelefonoCelular = clienteDomicilioTelefonoCelular;
        this.clienteDatosLaboralesActividad = clienteDatosLaboralesActividad;
        this.clienteDatosLaboralesRazonSocial = clienteDatosLaboralesRazonSocial;
        this.clienteDatosLaboralesCuit = clienteDatosLaboralesCuit;
        this.clienteDatosLaboralesInicioActividades = clienteDatosLaboralesInicioActividades;
        this.clienteDatosLaboralesCargo = clienteDatosLaboralesCargo;
        this.clienteDatosLaboralesSector = clienteDatosLaboralesSector;
        this.clienteDatosLaboralesDomicilioLegal = clienteDatosLaboralesDomicilioLegal;
        this.clienteDatosLaboralesCodigoPostal = clienteDatosLaboralesCodigoPostal;
        this.clienteDatosLaboralesLocalidad = clienteDatosLaboralesLocalidad;
        this.clienteDatosLaboralesProvincia = clienteDatosLaboralesProvincia;
        this.clienteDatosLaboralesTelefono = clienteDatosLaboralesTelefono;
        this.tasasTeaCtfFinanciacion = tasasTeaCtfFinanciacion;
        this.tasasTnaCompensatoriosFinanciacion = tasasTnaCompensatoriosFinanciacion;
        this.tasasTnaPunitorios = tasasTnaPunitorios;
        this.tasasCtfFinanciacion = tasasCtfFinanciacion;
        this.tasasComisionRenovacionAnual = tasasComisionRenovacionAnual;
        this.tasasComisionMantenimiento = tasasComisionMantenimiento;
        this.tasasComisionReposicionPlastico = tasasComisionReposicionPlastico;
        this.tasasAtraso05_31Dias = tasasAtraso05_31Dias;
        this.tasasAtraso32_60Dias = tasasAtraso32_60Dias;
        this.tasasAtraso61_90Dias = tasasAtraso61_90Dias;
        this.tasasPagoFacil = tasasPagoFacil;
        this.tasasPlatiniumPagoFacil = tasasPlatiniumPagoFacil;
        this.tasasPlatiniumTeaCtfFinanciacion = tasasPlatiniumTeaCtfFinanciacion;
        this.tasasPlatiniumTnaCompensatoriosFinanciacion = tasasPlatiniumTnaCompensatoriosFinanciacion;
        this.tasasPlatiniumTnaPunitorios = tasasPlatiniumTnaPunitorios;
        this.tasasPlatiniumCtfFinanciacion = tasasPlatiniumCtfFinanciacion;
        this.tasasPlatiniumComisionRenovacionAnual = tasasPlatiniumComisionRenovacionAnual;
        this.tasasPlatiniumComisionMantenimiento = tasasPlatiniumComisionMantenimiento;
        this.tasasPlatiniumComisionReposicionPlastico = tasasPlatiniumComisionReposicionPlastico;
        this.tasasPlatiniumAtraso05_31Dias = tasasPlatiniumAtraso05_31Dias;
        this.tasasPlatiniumAtraso32_60Dias = tasasPlatiniumAtraso32_60Dias;
        this.tasasPlatiniumAtraso61_90Dias = tasasPlatiniumAtraso61_90Dias;
    }
    getMonto() {
        return this.monto;
    }
    setMonto(monto) {
        this.monto = monto;
    }
    getComercioNombre() {
        return this.comercioNombre;
    }
    setComercioNombre(comercioNombre) {
        this.comercioNombre = comercioNombre;
    }
    getComercioFecha() {
        return this.comercioFecha;
    }
    setComercioFecha(comercioFecha) {
        this.comercioFecha = comercioFecha;
    }
    getComercioNAutorizacion() {
        return this.comercioNAutorizacion;
    }
    setComercioNAutorizacion(comercioNAutorizacion) {
        this.comercioNAutorizacion = comercioNAutorizacion;
    }
    getComercioProducto() {
        return this.comercioProducto;
    }
    setComercioProducto(comercioProducto) {
        this.comercioProducto = comercioProducto;
    }
    getComercioSucursal() {
        return this.comercioSucursal;
    }
    setComercioSucursal(comercioSucursal) {
        this.comercioSucursal = comercioSucursal;
    }
    getClienteNombreCompleto() {
        return this.clienteNombreCompleto;
    }
    setClienteNombreCompleto(clienteNombreCompleto) {
        this.clienteNombreCompleto = clienteNombreCompleto;
    }
    getClienteSexo() {
        return this.clienteSexo;
    }
    setClienteSexo(clienteSexo) {
        this.clienteSexo = clienteSexo;
    }
    getClienteCuitOcuil() {
        return this.clienteCuitOcuil;
    }
    setClienteCuitOcuil(clienteCuitOcuil) {
        this.clienteCuitOcuil = clienteCuitOcuil;
    }
    getClienteTipoDocumento() {
        return this.clienteTipoDocumento;
    }
    setClienteTipoDocumento(clienteTipoDocumento) {
        this.clienteTipoDocumento = clienteTipoDocumento;
    }
    getClienteDni() {
        return this.clienteDni;
    }
    setClienteDni(clienteDni) {
        this.clienteDni = clienteDni;
    }
    getClienteFechaNacimiento() {
        return this.clienteFechaNacimiento;
    }
    setClienteFechaNacimiento(clienteFechaNacimiento) {
        this.clienteFechaNacimiento = clienteFechaNacimiento;
    }
    getClienteEstadoCivil() {
        return this.clienteEstadoCivil;
    }
    setClienteEstadoCivil(clienteEstadoCivil) {
        this.clienteEstadoCivil = clienteEstadoCivil;
    }
    getClienteNacionalidad() {
        return this.clienteNacionalidad;
    }
    setClienteNacionalidad(clienteNacionalidad) {
        this.clienteNacionalidad = clienteNacionalidad;
    }
    getClienteDomicilioCalle() {
        return this.clienteDomicilioCalle;
    }
    setClienteDomicilioCalle(clienteDomicilioCalle) {
        this.clienteDomicilioCalle = clienteDomicilioCalle;
    }
    getClienteDomicilioNumero() {
        return this.clienteDomicilioNumero;
    }
    setClienteDomicilioNumero(clienteDomicilioNumero) {
        this.clienteDomicilioNumero = clienteDomicilioNumero;
    }
    getClienteDomicilioPiso() {
        return this.clienteDomicilioPiso;
    }
    setClienteDomicilioPiso(clienteDomicilioPiso) {
        this.clienteDomicilioPiso = clienteDomicilioPiso;
    }
    getClienteDomicilioDepartamento() {
        return this.clienteDomicilioDepartamento;
    }
    setClienteDomicilioDepartamento(clienteDomicilioDepartamento) {
        this.clienteDomicilioDepartamento = clienteDomicilioDepartamento;
    }
    getClienteDomicilioLocalidad() {
        return this.clienteDomicilioLocalidad;
    }
    setClienteDomicilioLocalidad(clienteDomicilioLocalidad) {
        this.clienteDomicilioLocalidad = clienteDomicilioLocalidad;
    }
    getClienteDomicilioProvincia() {
        return this.clienteDomicilioProvincia;
    }
    setClienteDomicilioProvincia(clienteDomicilioProvincia) {
        this.clienteDomicilioProvincia = clienteDomicilioProvincia;
    }
    getClienteDomicilioBarrio() {
        return this.clienteDomicilioBarrio;
    }
    setClienteDomicilioBarrio(clienteDomicilioBarrio) {
        this.clienteDomicilioBarrio = clienteDomicilioBarrio;
    }
    getClienteDomicilioPais() {
        return this.clienteDomicilioPais;
    }
    setClienteDomicilioPais(clienteDomicilioPais) {
        this.clienteDomicilioPais = clienteDomicilioPais;
    }
    getClienteDomicilioCodigoPostal() {
        return this.clienteDomicilioCodigoPostal;
    }
    setClienteDomicilioCodigoPostal(clienteDomicilioCodigoPostal) {
        this.clienteDomicilioCodigoPostal = clienteDomicilioCodigoPostal;
    }
    getClienteDomicilioCorreoElectronico() {
        return this.clienteDomicilioCorreoElectronico;
    }
    setClienteDomicilioCorreoElectronico(clienteDomicilioCorreoElectronico) {
        this.clienteDomicilioCorreoElectronico = clienteDomicilioCorreoElectronico;
    }
    getClienteDomicilioTelefonoFijo() {
        return this.clienteDomicilioTelefonoFijo;
    }
    setClienteDomicilioTelefonoFijo(clienteDomicilioTelefonoFijo) {
        this.clienteDomicilioTelefonoFijo = clienteDomicilioTelefonoFijo;
    }
    getClienteDomicilioTelefonoCelular() {
        return this.clienteDomicilioTelefonoCelular;
    }
    setClienteDomicilioTelefonoCelular(clienteDomicilioTelefonoCelular) {
        this.clienteDomicilioTelefonoCelular = clienteDomicilioTelefonoCelular;
    }
    getClienteDatosLaboralesActividad() {
        return this.clienteDatosLaboralesActividad;
    }
    setClienteDatosLaboralesActividad(clienteDatosLaboralesActividad) {
        this.clienteDatosLaboralesActividad = clienteDatosLaboralesActividad;
    }
    getClienteDatosLaboralesRazonSocial() {
        return this.clienteDatosLaboralesRazonSocial;
    }
    setClienteDatosLaboralesRazonSocial(clienteDatosLaboralesRazonSocial) {
        this.clienteDatosLaboralesRazonSocial = clienteDatosLaboralesRazonSocial;
    }
    getClienteDatosLaboralesCuit() {
        return this.clienteDatosLaboralesCuit;
    }
    setClienteDatosLaboralesCuit(clienteDatosLaboralesCuit) {
        this.clienteDatosLaboralesCuit = clienteDatosLaboralesCuit;
    }
    getClienteDatosLaboralesInicioActividades() {
        return this.clienteDatosLaboralesInicioActividades;
    }
    setClienteDatosLaboralesInicioActividades(clienteDatosLaboralesInicioActividades) {
        this.clienteDatosLaboralesInicioActividades = clienteDatosLaboralesInicioActividades;
    }
    getClienteDatosLaboralesCargo() {
        return this.clienteDatosLaboralesCargo;
    }
    setClienteDatosLaboralesCargo(clienteDatosLaboralesCargo) {
        this.clienteDatosLaboralesCargo = clienteDatosLaboralesCargo;
    }
    getClienteDatosLaboralesSector() {
        return this.clienteDatosLaboralesSector;
    }
    setClienteDatosLaboralesSector(clienteDatosLaboralesSector) {
        this.clienteDatosLaboralesSector = clienteDatosLaboralesSector;
    }
    getClienteDatosLaboralesDomicilioLegal() {
        return this.clienteDatosLaboralesDomicilioLegal;
    }
    setClienteDatosLaboralesDomicilioLegal(clienteDatosLaboralesDomicilioLegal) {
        this.clienteDatosLaboralesDomicilioLegal = clienteDatosLaboralesDomicilioLegal;
    }
    getClienteDatosLaboralesCodigoPostal() {
        return this.clienteDatosLaboralesCodigoPostal;
    }
    setClienteDatosLaboralesCodigoPostal(clienteDatosLaboralesCodigoPostal) {
        this.clienteDatosLaboralesCodigoPostal = clienteDatosLaboralesCodigoPostal;
    }
    getClienteDatosLaboralesLocalidad() {
        return this.clienteDatosLaboralesLocalidad;
    }
    setClienteDatosLaboralesLocalidad(clienteDatosLaboralesLocalidad) {
        this.clienteDatosLaboralesLocalidad = clienteDatosLaboralesLocalidad;
    }
    getClienteDatosLaboralesProvincia() {
        return this.clienteDatosLaboralesProvincia;
    }
    setClienteDatosLaboralesProvincia(clienteDatosLaboralesProvincia) {
        this.clienteDatosLaboralesProvincia = clienteDatosLaboralesProvincia;
    }
    getClienteDatosLaboralesTelefono() {
        return this.clienteDatosLaboralesTelefono;
    }
    setClienteDatosLaboralesTelefono(clienteDatosLaboralesTelefono) {
        this.clienteDatosLaboralesTelefono = clienteDatosLaboralesTelefono;
    }
    getTasasTeaCtfFinanciacion() {
        return this.tasasTeaCtfFinanciacion;
    }
    setTasasTeaCtfFinanciacion(tasasTeaCtfFinanciacion) {
        this.tasasTeaCtfFinanciacion = tasasTeaCtfFinanciacion;
    }
    getTasasTnaCompensatoriosFinanciacion() {
        return this.tasasTnaCompensatoriosFinanciacion;
    }
    setTasasTnaCompensatoriosFinanciacion(tasasTnaCompensatoriosFinanciacion) {
        this.tasasTnaCompensatoriosFinanciacion = tasasTnaCompensatoriosFinanciacion;
    }
    getTasasTnaPunitorios() {
        return this.tasasTnaPunitorios;
    }
    setTasasTnaPunitorios(tasasTnaPunitorios) {
        this.tasasTnaPunitorios = tasasTnaPunitorios;
    }
    getTasasCtfFinanciacion() {
        return this.tasasCtfFinanciacion;
    }
    setTasasCtfFinanciacion(tasasCtfFinanciacion) {
        this.tasasCtfFinanciacion = tasasCtfFinanciacion;
    }
    getTasasComisionRenovacionAnual() {
        return this.tasasComisionRenovacionAnual;
    }
    setTasasComisionRenovacionAnual(tasasComisionRenovacionAnual) {
        this.tasasComisionRenovacionAnual = tasasComisionRenovacionAnual;
    }
    getTasasComisionMantenimiento() {
        return this.tasasComisionMantenimiento;
    }
    setTasasComisionMantenimiento(tasasComisionMantenimiento) {
        this.tasasComisionMantenimiento = tasasComisionMantenimiento;
    }
    getTasasComisionReposicionPlastico() {
        return this.tasasComisionReposicionPlastico;
    }
    setTasasComisionReposicionPlastico(tasasComisionReposicionPlastico) {
        this.tasasComisionReposicionPlastico = tasasComisionReposicionPlastico;
    }
    getTasasAtraso05_31Dias() {
        return this.tasasAtraso05_31Dias;
    }
    setTasasAtraso05_31Dias(tasasAtraso05_31Dias) {
        this.tasasAtraso05_31Dias = tasasAtraso05_31Dias;
    }
    getTasasAtraso32_60Dias() {
        return this.tasasAtraso32_60Dias;
    }
    setTasasAtraso32_60Dias(tasasAtraso32_60Dias) {
        this.tasasAtraso32_60Dias = tasasAtraso32_60Dias;
    }
    getTasasAtraso61_90Dias() {
        return this.tasasAtraso61_90Dias;
    }
    setTasasAtraso61_90Dias(tasasAtraso61_90Dias) {
        this.tasasAtraso61_90Dias = tasasAtraso61_90Dias;
    }
    getTasasPagoFacil() {
        return this.tasasPagoFacil;
    }
    setTasasPagoFacil(tasasPagoFacil) {
        this.tasasPagoFacil = tasasPagoFacil;
    }
    getTasasPlatiniumPagoFacil() {
        return this.tasasPlatiniumPagoFacil;
    }
    setTasasPlatiniumPagoFacil(tasasPlatiniumPagoFacil) {
        this.tasasPlatiniumPagoFacil = tasasPlatiniumPagoFacil;
    }
    getTasasPlatiniumTeaCtfFinanciacion() {
        return this.tasasPlatiniumTeaCtfFinanciacion;
    }
    setTasasPlatiniumTeaCtfFinanciacion(tasasPlatiniumTeaCtfFinanciacion) {
        this.tasasPlatiniumTeaCtfFinanciacion = tasasPlatiniumTeaCtfFinanciacion;
    }
    getTasasPlatiniumTnaCompensatoriosFinanciacion() {
        return this.tasasPlatiniumTnaCompensatoriosFinanciacion;
    }
    setTasasPlatiniumTnaCompensatoriosFinanciacion(tasasPlatiniumTnaCompensatoriosFinanciacion) {
        this.tasasPlatiniumTnaCompensatoriosFinanciacion = tasasPlatiniumTnaCompensatoriosFinanciacion;
    }
    getTasasPlatiniumTnaPunitorios() {
        return this.tasasPlatiniumTnaPunitorios;
    }
    setTasasPlatiniumTnaPunitorios(tasasPlatiniumTnaPunitorios) {
        this.tasasPlatiniumTnaPunitorios = tasasPlatiniumTnaPunitorios;
    }
    getTasasPlatiniumCtfFinanciacion() {
        return this.tasasPlatiniumCtfFinanciacion;
    }
    setTasasPlatiniumCtfFinanciacion(tasasPlatiniumCtfFinanciacion) {
        this.tasasPlatiniumCtfFinanciacion = tasasPlatiniumCtfFinanciacion;
    }
    getTasasPlatiniumComisionRenovacionAnual() {
        return this.tasasPlatiniumComisionRenovacionAnual;
    }
    setTasasPlatiniumComisionRenovacionAnual(tasasPlatiniumComisionRenovacionAnual) {
        this.tasasPlatiniumComisionRenovacionAnual = tasasPlatiniumComisionRenovacionAnual;
    }
    getTasasPlatiniumComisionMantenimiento() {
        return this.tasasPlatiniumComisionMantenimiento;
    }
    setTasasPlatiniumComisionMantenimiento(tasasPlatiniumComisionMantenimiento) {
        this.tasasPlatiniumComisionMantenimiento = tasasPlatiniumComisionMantenimiento;
    }
    getTasasPlatiniumComisionReposicionPlastico() {
        return this.tasasPlatiniumComisionReposicionPlastico;
    }
    setTasasPlatiniumComisionReposicionPlastico(tasasPlatiniumComisionReposicionPlastico) {
        this.tasasPlatiniumComisionReposicionPlastico = tasasPlatiniumComisionReposicionPlastico;
    }
    getTasasPlatiniumAtraso05_31Dias() {
        return this.tasasPlatiniumAtraso05_31Dias;
    }
    setTasasPlatiniumAtraso05_31Dias(tasasPlatiniumAtraso05_31Dias) {
        this.tasasPlatiniumAtraso05_31Dias = tasasPlatiniumAtraso05_31Dias;
    }
    getTasasPlatiniumAtraso32_60Dias() {
        return this.tasasPlatiniumAtraso32_60Dias;
    }
    setTasasPlatiniumAtraso32_60Dias(tasasPlatiniumAtraso32_60Dias) {
        this.tasasPlatiniumAtraso32_60Dias = tasasPlatiniumAtraso32_60Dias;
    }
    getTasasPlatiniumAtraso61_90Dias() {
        return this.tasasPlatiniumAtraso61_90Dias;
    }
    setTasasPlatiniumAtraso61_90Dias(tasasPlatiniumAtraso61_90Dias) {
        this.tasasPlatiniumAtraso61_90Dias = tasasPlatiniumAtraso61_90Dias;
    }
    /**
     * Obtiene el PDF del contrato.
     *
     * @returns Buffer | undefined - PDF del contrato o undefined si no existe.
     */
    getPdfContrato() {
        return this.pdfContrato;
    }
    /**
     * Establece el PDF del contrato.
     *
     * @param pdf - Nuevo PDF del contrato.
     */
    setPdfContrato(pdf) {
        this.pdfContrato = pdf;
    }
    /**
     * Obtiene el ID único del contrato.
     *
     * @returns number - ID del contrato.
     */
    getId() {
        return this.id;
    }
    /**
     * Obtiene la fecha de generación del contrato.
     *
     * @returns Date - Fecha de generación del contrato.
     */
    getFechaGeneracion() {
        return this.fechaGeneracion;
    }
    /**
     * Establece la fecha de generación del contrato.
     *
     * @param fechaGeneracion - Nueva fecha de generación del contrato.
     */
    setFechaGeneracion(fechaGeneracion) {
        this.fechaGeneracion = fechaGeneracion;
    }
    /**
     * Obtiene el estado actual del contrato.
     *
     * @returns string - Estado del contrato.
     */
    getEstado() {
        return this.estado;
    }
    /**
     * Establece el estado del contrato.
     *
     * @param estado - Nuevo estado del contrato.
     */
    setEstado(estado) {
        this.estado = estado;
    }
    /**
     * Obtiene el ID de la solicitud formal asociada.
     *
     * @returns number - ID de la solicitud formal.
     */
    getSolicitudFormalId() {
        return this.solicitudFormalId;
    }
    /**
     * Establece el ID de la solicitud formal asociada.
     *
     * @param solicitudFormalId - Nuevo ID de la solicitud formal.
     */
    setSolicitudFormalId(solicitudFormalId) {
        this.solicitudFormalId = solicitudFormalId;
    }
    /**
     * Obtiene el ID del cliente beneficiario.
     *
     * @returns number - ID del cliente.
     */
    getClienteId() {
        return this.clienteId;
    }
    /**
     * Establece el ID del cliente beneficiario.
     *
     * @param clienteId - Nuevo ID del cliente.
     */
    setClienteId(clienteId) {
        this.clienteId = clienteId;
    }
    /**
     * Obtiene el número de tarjeta asignado.
     *
     * @returns string | undefined - Número de tarjeta o undefined.
     */
    getNumeroTarjeta() {
        return this.numeroTarjeta;
    }
    /**
     * Establece el número de tarjeta asignado.
     *
     * @param numeroTarjeta - Nuevo número de tarjeta.
     */
    setNumeroTarjeta(numeroTarjeta) {
        this.numeroTarjeta = numeroTarjeta;
    }
    /**
     * Obtiene el número de cuenta asignado.
     *
     * @returns string | undefined - Número de cuenta o undefined.
     */
    getNumeroCuenta() {
        return this.numeroCuenta;
    }
    /**
     * Establece el número de cuenta asignado.
     *
     * @param numeroCuenta - Nuevo número de cuenta.
     */
    setNumeroCuenta(numeroCuenta) {
        this.numeroCuenta = numeroCuenta;
    }
    /**
       * Obtiene el conjunto de tasas aplicado al contrato
       *
       * @returns ConjuntoTasas | undefined
       */
    getConjuntoTasas() {
        return this.conjuntoTasas;
    }
    /**
     * Establece el conjunto de tasas aplicado al contrato
     *
     * @param conjunto - Nuevo conjunto de tasas
     */
    setConjuntoTasas(conjunto) {
        this.conjuntoTasas = conjunto;
    }
    /**
     * Genera el texto para las cláusulas de tasas del contrato
     *
     * @returns string - Texto formateado con las tasas
     */
    generarClausulasTasas() {
        if (!this.conjuntoTasas)
            return "";
        const clausulas = [];
        const tasas = this.conjuntoTasas.toPlainObject().tasas;
        for (const [codigo, valor] of Object.entries(tasas)) {
            clausulas.push(`- ${codigo}: ${valor}%`);
        }
        return "TASAS Y COMISIONES APLICABLES:\n" + clausulas.join("\n");
    }
    /**
     * Convierte el contrato a una representación de string.
     * Útil para logging y debugging.
     *
     * @returns string - Representación en string del contrato.
     */
    toString() {
        return `Contrato [id=${this.id}, fechaGeneracion=${this.fechaGeneracion}, estado=${this.estado}, solicitudFormalId=${this.solicitudFormalId}, clienteId=${this.clienteId}, numeroTarjeta=${this.numeroTarjeta || 'No asignado'}, numeroCuenta=${this.numeroCuenta || 'No asignado'}]`;
    }
    /**
     * Convierte el contrato a un objeto plano.
     * Útil para serialización y transferencia de datos.
     *
     * @returns any - Objeto plano con todos los datos del contrato.
     */
    toPlainObject() {
        return {
            id: this.id,
            fechaGeneracion: this.fechaGeneracion,
            estado: this.estado,
            solicitudFormalId: this.solicitudFormalId,
            clienteId: this.clienteId,
            monto: this.monto,
            numeroTarjeta: this.numeroTarjeta,
            numeroCuenta: this.numeroCuenta,
            comercioNombre: this.comercioNombre,
            comercioFecha: this.comercioFecha,
            comercioNAutorizacion: this.comercioNAutorizacion,
            comercioProducto: this.comercioProducto,
            comercioSucursal: this.comercioSucursal,
            clienteNombreCompleto: this.clienteNombreCompleto,
            clienteSexo: this.clienteSexo,
            clienteCuitOcuil: this.clienteCuitOcuil,
            clienteTipoDocumento: this.clienteTipoDocumento,
            clienteDni: this.clienteDni,
            clienteFechaNacimiento: this.clienteFechaNacimiento,
            clienteEstadoCivil: this.clienteEstadoCivil,
            clienteNacionalidad: this.clienteNacionalidad,
            clienteDomicilioCalle: this.clienteDomicilioCalle,
            clienteDomicilioNumero: this.clienteDomicilioNumero,
            clienteDomicilioPiso: this.clienteDomicilioPiso,
            clienteDomicilioDepartamento: this.clienteDomicilioDepartamento,
            clienteDomicilioLocalidad: this.clienteDomicilioLocalidad,
            clienteDomicilioProvincia: this.clienteDomicilioProvincia,
            clienteDomicilioBarrio: this.clienteDomicilioBarrio,
            clienteDomicilioPais: this.clienteDomicilioPais,
            clienteDomicilioCodigoPostal: this.clienteDomicilioCodigoPostal,
            clienteDomicilioCorreoElectronico: this.clienteDomicilioCorreoElectronico,
            clienteDomicilioTelefonoFijo: this.clienteDomicilioTelefonoFijo,
            clienteDomicilioTelefonoCelular: this.clienteDomicilioTelefonoCelular,
            clienteDatosLaboralesActividad: this.clienteDatosLaboralesActividad,
            clienteDatosLaboralesRazonSocial: this.clienteDatosLaboralesRazonSocial,
            clienteDatosLaboralesCuit: this.clienteDatosLaboralesCuit,
            clienteDatosLaboralesInicioActividades: this.clienteDatosLaboralesInicioActividades,
            clienteDatosLaboralesCargo: this.clienteDatosLaboralesCargo,
            clienteDatosLaboralesSector: this.clienteDatosLaboralesSector,
            clienteDatosLaboralesDomicilioLegal: this.clienteDatosLaboralesDomicilioLegal,
            clienteDatosLaboralesCodigoPostal: this.clienteDatosLaboralesCodigoPostal,
            clienteDatosLaboralesLocalidad: this.clienteDatosLaboralesLocalidad,
            clienteDatosLaboralesProvincia: this.clienteDatosLaboralesProvincia,
            clienteDatosLaboralesTelefono: this.clienteDatosLaboralesTelefono,
            tasasTeaCtfFinanciacion: this.tasasTeaCtfFinanciacion,
            tasasTnaCompensatoriosFinanciacion: this.tasasTnaCompensatoriosFinanciacion,
            tasasTnaPunitorios: this.tasasTnaPunitorios,
            tasasCtfFinanciacion: this.tasasCtfFinanciacion,
            tasasComisionRenovacionAnual: this.tasasComisionRenovacionAnual,
            tasasComisionMantenimiento: this.tasasComisionMantenimiento,
            tasasComisionReposicionPlastico: this.tasasComisionReposicionPlastico,
            tasasAtraso05_31Dias: this.tasasAtraso05_31Dias,
            tasasAtraso32_60Dias: this.tasasAtraso32_60Dias,
            tasasAtraso61_90Dias: this.tasasAtraso61_90Dias,
            tasasPagoFacil: this.tasasPagoFacil,
            tasasPlatiniumPagoFacil: this.tasasPlatiniumPagoFacil,
            tasasPlatiniumTeaCtfFinanciacion: this.tasasPlatiniumTeaCtfFinanciacion,
            tasasPlatiniumTnaCompensatoriosFinanciacion: this.tasasPlatiniumTnaCompensatoriosFinanciacion,
            tasasPlatiniumTnaPunitorios: this.tasasPlatiniumTnaPunitorios,
            tasasPlatiniumCtfFinanciacion: this.tasasPlatiniumCtfFinanciacion,
            tasasPlatiniumComisionRenovacionAnual: this.tasasPlatiniumComisionRenovacionAnual,
            tasasPlatiniumComisionMantenimiento: this.tasasPlatiniumComisionMantenimiento,
            tasasPlatiniumComisionReposicionPlastico: this.tasasPlatiniumComisionReposicionPlastico,
            tasasPlatiniumAtraso05_31Dias: this.tasasPlatiniumAtraso05_31Dias,
            tasasPlatiniumAtraso32_60Dias: this.tasasPlatiniumAtraso32_60Dias,
            tasasPlatiniumAtraso61_90Dias: this.tasasPlatiniumAtraso61_90Dias
        };
    }
    /**
     * Crea una instancia de Contrato desde un mapa de datos.
     * Método estático para crear contratos desde datos serializados.
     *
     * @param map - Mapa de datos para crear la instancia.
     * @returns Contrato - Nueva instancia de Contrato.
     */
    static fromMap(map) {
        const conjuntoTasas = map.conjuntoTasas
            ? ConjuntoTasas_1.ConjuntoTasas.fromMap(map.conjuntoTasas)
            : undefined;
        return new Contrato(map.id, map.fechaGeneracion, map.estado, map.solicitudFormalId, map.clienteId, map.monto ? parseFloat(map.monto) : undefined, map.numeroTarjeta, map.numeroCuenta, map.comercio_nombre, map.comercio_fecha, map.comercio_n_autorizacion, map.comercio_producto, map.comercio_sucursal, map.cliente_nombre_completo, map.cliente_sexo, map.cliente_cuitocuil, map.cliente_tipo_documento, map.cliente_dni, map.cliente_fecha_nacimiento, map.cliente_estado_civil, map.cliente_nacionalidad, map.cliente_domicilio_calle, map.cliente_domicilio_numero, map.cliente_domicilio_piso, map.cliente_domicilio_departamento, map.cliente_domicilio_localidad, map.cliente_domicilio_provincia, map.cliente_domicilio_barrio, map.cliente_domicilio_pais, map.cliente_domicilio_codigo_postal, map.cliente_domicilio_correo_electronico, map.cliente_domicilio_telefono_fijo, map.cliente_domicilio_telefono_celular, map.cliente_datos_laborales_actividad, map.cliente_datos_laborales_razon_social, map.cliente_datos_laborales_cuit, map.cliente_datos_laborales_inicio_actividades, map.cliente_datos_laborales_cargo, map.cliente_datos_laborales_sector, map.cliente_datos_laborales_domicilio_legal, map.cliente_datos_laborales_codigo_postal, map.cliente_datos_laborales_localidad, map.cliente_datos_laborales_provincia, map.cliente_datos_laborales_telefono, map.tasas_tea_ctf_financiacion ? parseFloat(map.tasas_tea_ctf_financiacion) : undefined, map.tasas_tna_compensatorios_financiacion ? parseFloat(map.tasas_tna_compensatorios_financiacion) : undefined, map.tasas_tna_punitorios ? parseFloat(map.tasas_tna_punitorios) : undefined, map.tasas_ctf_financiacion ? parseFloat(map.tasas_ctf_financiacion) : undefined, map.tasas_comision_renovacion_anual ? parseFloat(map.tasas_comision_renovacion_anual) : undefined, map.tasas_comision_mantenimiento ? parseFloat(map.tasas_comision_mantenimiento) : undefined, map.tasas_comision_reposicion_plastico ? parseFloat(map.tasas_comision_reposicion_plastico) : undefined, map.tasas_atraso_05_31_dias ? parseFloat(map.tasas_atraso_05_31_dias) : undefined, map.tasas_atraso_32_60_dias ? parseFloat(map.tasas_atraso_32_60_dias) : undefined, map.tasas_atraso_61_90_dias ? parseFloat(map.tasas_atraso_61_90_dias) : undefined, map.tasas_pago_facil ? parseFloat(map.tasas_pago_facil) : undefined, map.tasas_platinium_pago_facil ? parseFloat(map.tasas_platinium_pago_facil) : undefined, map.tasas_platinium_tea_ctf_financiacion ? parseFloat(map.tasas_platinium_tea_ctf_financiacion) : undefined, map.tasas_platinium_tna_compensatorios_financiacion ? parseFloat(map.tasas_platinium_tna_compensatorios_financiacion) : undefined, map.tasas_platinium_tna_punitorios ? parseFloat(map.tasas_platinium_tna_punitorios) : undefined, map.tasas_platinium_ctf_financiacion ? parseFloat(map.tasas_platinium_ctf_financiacion) : undefined, map.tasas_platinium_comision_renovacion_anual ? parseFloat(map.tasas_platinium_comision_renovacion_anual) : undefined, map.tasas_platinium_comision_mantenimiento ? parseFloat(map.tasas_platinium_comision_mantenimiento) : undefined, map.tasas_platinium_comision_reposicion_plastico ? parseFloat(map.tasas_platinium_comision_reposicion_plastico) : undefined, map.tasas_platinium_atraso_05_31_dias ? parseFloat(map.tasas_platinium_atraso_05_31_dias) : undefined, map.tasas_platinium_atraso_32_60_dias ? parseFloat(map.tasas_platinium_atraso_32_60_dias) : undefined, map.tasas_platinium_atraso_61_90_dias ? parseFloat(map.tasas_platinium_atraso_61_90_dias) : undefined);
    }
    /**
     * Genera el PDF del contrato.
     * Método que debe ser implementado para crear el documento PDF del contrato.
     *
     * @throws Error - Siempre lanza error indicando que no está implementado.
     */
    generarPDF() {
        throw new Error("Method not implemented.");
    }
}
exports.Contrato = Contrato;
