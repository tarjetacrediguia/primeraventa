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

import { ConjuntoTasas } from "./ConjuntoTasas";

/**
 * Clase que representa un contrato de préstamo en el sistema.
 * Contiene toda la información relacionada con el contrato, incluyendo
 * monto, estado, fechas y documentos asociados.
 */
export class Contrato {
  private pdfContrato?: Buffer;
  private conjuntoTasas?: ConjuntoTasas;
  
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
   * @param numeroAutorizacion - Número de tarjeta asignado (opcional).
   * @param numeroCuenta - Número de cuenta asignado (opcional).
   */

  constructor(
    public readonly id: number,
    public fechaGeneracion: Date,
    public estado: string,
    public solicitudFormalId: number,
    public clienteId: number,
    public monto?: number,
    public numeroAutorizacion?: string,
    public numeroCuenta?: string,
    public comercioNombre?: string,
    public comercioFecha?: string,
    public comercioNAutorizacion?: string,
    public comercioProducto?: string,
    public comercioSucursal?: string,
    public clienteNombreCompleto?: string,
    public clienteSexo?: string,
    public clienteCuitOcuil?: string,
    public clienteTipoDocumento?: string,
    public clienteDni?: string,
    public clienteFechaNacimiento?: string,
    public clienteEstadoCivil?: string,
    public clienteNacionalidad?: string,
    public clienteSueldoNeto?: string,
    public clienteDomicilioCalle?: string,
    public clienteDomicilioNumero?: string,
    public clienteDomicilioPiso?: string,
    public clienteDomicilioDepartamento?: string,
    public clienteDomicilioLocalidad?: string,
    public clienteDomicilioProvincia?: string,
    public clienteDomicilioBarrio?: string,
    public clienteDomicilioPais?: string,
    public clienteDomicilioCodigoPostal?: string,
    public clienteDomicilioCorreoElectronico?: string,
    public clienteDomicilioTelefonoFijo?: string,
    public clienteDomicilioTelefonoCelular?: string,
    public clienteReferente1Nombre?: string,
    public clienteReferente1Apellido?: string,
    public clienteReferente1Vinculo?: string,
    public clienteReferente1Telefono?: string,
    public clienteReferente2Nombre?: string,
    public clienteReferente2Apellido?: string,
    public clienteReferente2Vinculo?: string,
    public clienteReferente2Telefono?: string,
    public clienteDatosLaboralesActividad?: string,
    public clienteDatosLaboralesRazonSocial?: string,
    public clienteDatosLaboralesCuit?: string,
    public clienteDatosLaboralesInicioActividades?: string,
    public clienteDatosLaboralesCargo?: string,
    public clienteDatosLaboralesSector?: string,
    public clienteDatosLaboralesDomicilioLegal?: string,
    public clienteDatosLaboralesCodigoPostal?: string,
    public clienteDatosLaboralesLocalidad?: string,
    public clienteDatosLaboralesProvincia?: string,
    public clienteDatosLaboralesTelefono?: string,
    public tasasTeaCtfFinanciacion?: number,
    public tasasTnaCompensatoriosFinanciacion?: number,
    public tasasTnaPunitorios?: number,
    public tasasCtfFinanciacion?: number,
    public tasasComisionRenovacionAnual?: number,
    public tasasComisionMantenimiento?: number,
    public tasasComisionReposicionPlastico?: number,
    public tasasAtraso05_31Dias?: number,
    public tasasAtraso32_60Dias?: number,
    public tasasAtraso61_90Dias?: number,
    public tasasPagoFacil?: number,
    public tasasPlatiniumPagoFacil?: number,
    public tasasPlatiniumTeaCtfFinanciacion?: number,
    public tasasPlatiniumTnaCompensatoriosFinanciacion?: number,
    public tasasPlatiniumTnaPunitorios?: number,
    public tasasPlatiniumCtfFinanciacion?: number,
    public tasasPlatiniumComisionRenovacionAnual?: number,
    public tasasPlatiniumComisionMantenimiento?: number,
    public tasasPlatiniumComisionReposicionPlastico?: number,
    public tasasPlatiniumAtraso05_31Dias?: number,
    public tasasPlatiniumAtraso32_60Dias?: number,
    public tasasPlatiniumAtraso61_90Dias?: number
    
  ) {}


  public getClienteSueldoNeto(): string | undefined {
    return this.clienteSueldoNeto;
  }
  public setClienteSueldoNeto(clienteSueldoNeto: string): void {
    this.clienteSueldoNeto = clienteSueldoNeto;
  }

  public getClienteReferente1Nombre(): string | undefined { 
    return this.clienteReferente1Nombre;
  }
  public setClienteReferente1Nombre(clienteReferente1Nombre: string): void {
    this.clienteReferente1Nombre = clienteReferente1Nombre;
  }
  public getClienteReferente1Apellido(): string | undefined { 
    return this.clienteReferente1Apellido;
  }
  public setClienteReferente1Apellido(clienteReferente1Apellido: string): void {
    this.clienteReferente1Apellido = clienteReferente1Apellido;
  }
  public getClienteReferente1Vinculo(): string | undefined { 
    return this.clienteReferente1Vinculo;
  }
  public setClienteReferente1Vinculo(clienteReferente1Vinculo: string): void {
    this.clienteReferente1Vinculo = clienteReferente1Vinculo;
  }
  public getClienteReferente1Telefono(): string | undefined { 
    return this.clienteReferente1Telefono;
  }
  public setClienteReferente1Telefono(clienteReferente1Telefono: string): void {
    this.clienteReferente1Telefono = clienteReferente1Telefono;
  }
  public getClienteReferente2Nombre(): string | undefined { 
    return this.clienteReferente2Nombre;
  }
  public setClienteReferente2Nombre(clienteReferente2Nombre: string): void {
    this.clienteReferente2Nombre = clienteReferente2Nombre;
  }
  public getClienteReferente2Apellido(): string | undefined { 
    return this.clienteReferente2Apellido;
  }
  public setClienteReferente2Apellido(clienteReferente2Apellido: string): void {
    this.clienteReferente2Apellido = clienteReferente2Apellido;
  }
  public getClienteReferente2Vinculo(): string | undefined { 
    return this.clienteReferente2Vinculo;
  }
  public setClienteReferente2Vinculo(clienteReferente2Vinculo: string): void {
    this.clienteReferente2Vinculo = clienteReferente2Vinculo;
  }
  public getClienteReferente2Telefono(): string | undefined { 
    return this.clienteReferente2Telefono;
  }
  public setClienteReferente2Telefono(clienteReferente2Telefono: string): void {
    this.clienteReferente2Telefono = clienteReferente2Telefono;
  }


  public getMonto(): number | undefined {
    return this.monto;
  }

  public setMonto(monto: number): void {
    this.monto = monto;
  }

  public getComercioNombre(): string | undefined {
    return this.comercioNombre;
  }
  public setComercioNombre(comercioNombre: string): void {
    this.comercioNombre = comercioNombre;
  }

  public getComercioFecha(): string | undefined {
    return this.comercioFecha;
  }
  public setComercioFecha(comercioFecha: string): void {
    this.comercioFecha = comercioFecha;
  }

  public getComercioNAutorizacion(): string | undefined {
    return this.comercioNAutorizacion;
  }
  public setComercioNAutorizacion(comercioNAutorizacion: string): void {
    this.comercioNAutorizacion = comercioNAutorizacion;
  }

  public getComercioProducto(): string | undefined {
    return this.comercioProducto;
  }
  public setComercioProducto(comercioProducto: string): void {
    this.comercioProducto = comercioProducto;
  }

  public getComercioSucursal(): string | undefined {
    return this.comercioSucursal;
  }
  public setComercioSucursal(comercioSucursal: string): void {
    this.comercioSucursal = comercioSucursal;
  }

  public getClienteNombreCompleto(): string | undefined {
    return this.clienteNombreCompleto;
  }
  public setClienteNombreCompleto(clienteNombreCompleto: string): void {
    this.clienteNombreCompleto = clienteNombreCompleto;
  }

  public getClienteSexo(): string | undefined {
    return this.clienteSexo;
  }
  public setClienteSexo(clienteSexo: string): void {
    this.clienteSexo = clienteSexo;
  }

  public getClienteCuitOcuil(): string | undefined {
    return this.clienteCuitOcuil;
  }
  public setClienteCuitOcuil(clienteCuitOcuil: string): void {
    this.clienteCuitOcuil = clienteCuitOcuil;
  }

  public getClienteTipoDocumento(): string | undefined {
    return this.clienteTipoDocumento;
  }
  public setClienteTipoDocumento(clienteTipoDocumento: string): void {
    this.clienteTipoDocumento = clienteTipoDocumento;
  }

  public getClienteDni(): string | undefined {
    return this.clienteDni;
  }
  public setClienteDni(clienteDni: string): void {
    this.clienteDni = clienteDni;
  }

  public getClienteFechaNacimiento(): string | undefined {
    return this.clienteFechaNacimiento;
  }
  public setClienteFechaNacimiento(clienteFechaNacimiento: string): void {
    this.clienteFechaNacimiento = clienteFechaNacimiento;
  }

  public getClienteEstadoCivil(): string | undefined {
    return this.clienteEstadoCivil;
  }
  public setClienteEstadoCivil(clienteEstadoCivil: string): void {
    this.clienteEstadoCivil = clienteEstadoCivil;
  }

  public getClienteNacionalidad(): string | undefined {
    return this.clienteNacionalidad;
  }
  public setClienteNacionalidad(clienteNacionalidad: string): void {
    this.clienteNacionalidad = clienteNacionalidad;
  }

  public getClienteDomicilioCalle(): string | undefined {
    return this.clienteDomicilioCalle;
  }
  public setClienteDomicilioCalle(clienteDomicilioCalle: string): void {
    this.clienteDomicilioCalle = clienteDomicilioCalle;
  }

  public getClienteDomicilioNumero(): string | undefined {
    return this.clienteDomicilioNumero;
  }
  public setClienteDomicilioNumero(clienteDomicilioNumero: string): void {
    this.clienteDomicilioNumero = clienteDomicilioNumero;
  }

  public getClienteDomicilioPiso(): string | undefined {
    return this.clienteDomicilioPiso;
  }
  public setClienteDomicilioPiso(clienteDomicilioPiso: string): void {
    this.clienteDomicilioPiso = clienteDomicilioPiso;
  }

  public getClienteDomicilioDepartamento(): string | undefined {
    return this.clienteDomicilioDepartamento;
  }
  public setClienteDomicilioDepartamento(clienteDomicilioDepartamento: string): void {
    this.clienteDomicilioDepartamento = clienteDomicilioDepartamento;
  }

  public getClienteDomicilioLocalidad(): string | undefined {
    return this.clienteDomicilioLocalidad;
  }
  public setClienteDomicilioLocalidad(clienteDomicilioLocalidad: string): void {
    this.clienteDomicilioLocalidad = clienteDomicilioLocalidad;
  }

  public getClienteDomicilioProvincia(): string | undefined {
    return this.clienteDomicilioProvincia;
  }
  public setClienteDomicilioProvincia(clienteDomicilioProvincia: string): void {
    this.clienteDomicilioProvincia = clienteDomicilioProvincia;
  }

  public getClienteDomicilioBarrio(): string | undefined {
    return this.clienteDomicilioBarrio;
  }
  public setClienteDomicilioBarrio(clienteDomicilioBarrio: string): void {
    this.clienteDomicilioBarrio = clienteDomicilioBarrio;
  }

  public getClienteDomicilioPais(): string | undefined {
    return this.clienteDomicilioPais;
  }
  public setClienteDomicilioPais(clienteDomicilioPais: string): void {
    this.clienteDomicilioPais = clienteDomicilioPais;
  }

  public getClienteDomicilioCodigoPostal(): string | undefined {
    return this.clienteDomicilioCodigoPostal;
  }
  public setClienteDomicilioCodigoPostal(clienteDomicilioCodigoPostal: string): void {
    this.clienteDomicilioCodigoPostal = clienteDomicilioCodigoPostal;
  }

  public getClienteDomicilioCorreoElectronico(): string | undefined {
    return this.clienteDomicilioCorreoElectronico;
  }
  public setClienteDomicilioCorreoElectronico(clienteDomicilioCorreoElectronico: string): void {
    this.clienteDomicilioCorreoElectronico = clienteDomicilioCorreoElectronico;
  }

  public getClienteDomicilioTelefonoFijo(): string | undefined {
    return this.clienteDomicilioTelefonoFijo;
  }
  public setClienteDomicilioTelefonoFijo(clienteDomicilioTelefonoFijo: string): void {
    this.clienteDomicilioTelefonoFijo = clienteDomicilioTelefonoFijo;
  }

  public getClienteDomicilioTelefonoCelular(): string | undefined {
    return this.clienteDomicilioTelefonoCelular;
  }
  public setClienteDomicilioTelefonoCelular(clienteDomicilioTelefonoCelular: string): void {
    this.clienteDomicilioTelefonoCelular = clienteDomicilioTelefonoCelular;
  }

  public getClienteDatosLaboralesActividad(): string | undefined {
    return this.clienteDatosLaboralesActividad;
  }
  public setClienteDatosLaboralesActividad(clienteDatosLaboralesActividad: string): void {
    this.clienteDatosLaboralesActividad = clienteDatosLaboralesActividad;
  }

  public getClienteDatosLaboralesRazonSocial(): string | undefined {
    return this.clienteDatosLaboralesRazonSocial;
  }
  public setClienteDatosLaboralesRazonSocial(clienteDatosLaboralesRazonSocial: string): void {
    this.clienteDatosLaboralesRazonSocial = clienteDatosLaboralesRazonSocial;
  }

  public getClienteDatosLaboralesCuit(): string | undefined {
    return this.clienteDatosLaboralesCuit;
  }
  public setClienteDatosLaboralesCuit(clienteDatosLaboralesCuit: string): void {
    this.clienteDatosLaboralesCuit = clienteDatosLaboralesCuit;
  }

  public getClienteDatosLaboralesInicioActividades(): string | undefined {
    return this.clienteDatosLaboralesInicioActividades;
  }
  public setClienteDatosLaboralesInicioActividades(clienteDatosLaboralesInicioActividades: string): void {
    this.clienteDatosLaboralesInicioActividades = clienteDatosLaboralesInicioActividades;
  }

  public getClienteDatosLaboralesCargo(): string | undefined {
    return this.clienteDatosLaboralesCargo;
  }
  public setClienteDatosLaboralesCargo(clienteDatosLaboralesCargo: string): void {
    this.clienteDatosLaboralesCargo = clienteDatosLaboralesCargo;
  }

  public getClienteDatosLaboralesSector(): string | undefined {
    return this.clienteDatosLaboralesSector;
  }
  public setClienteDatosLaboralesSector(clienteDatosLaboralesSector: string): void {
    this.clienteDatosLaboralesSector = clienteDatosLaboralesSector;
  }

  public getClienteDatosLaboralesDomicilioLegal(): string | undefined {
    return this.clienteDatosLaboralesDomicilioLegal;
  }
  public setClienteDatosLaboralesDomicilioLegal(clienteDatosLaboralesDomicilioLegal: string): void {
    this.clienteDatosLaboralesDomicilioLegal = clienteDatosLaboralesDomicilioLegal;
  }

  public getClienteDatosLaboralesCodigoPostal(): string | undefined {
    return this.clienteDatosLaboralesCodigoPostal;
  }
  public setClienteDatosLaboralesCodigoPostal(clienteDatosLaboralesCodigoPostal: string): void {
    this.clienteDatosLaboralesCodigoPostal = clienteDatosLaboralesCodigoPostal;
  }

  public getClienteDatosLaboralesLocalidad(): string | undefined {
    return this.clienteDatosLaboralesLocalidad;
  }
  public setClienteDatosLaboralesLocalidad(clienteDatosLaboralesLocalidad: string): void {
    this.clienteDatosLaboralesLocalidad = clienteDatosLaboralesLocalidad;
  }

  public getClienteDatosLaboralesProvincia(): string | undefined {
    return this.clienteDatosLaboralesProvincia;
  }
  public setClienteDatosLaboralesProvincia(clienteDatosLaboralesProvincia: string): void {
    this.clienteDatosLaboralesProvincia = clienteDatosLaboralesProvincia;
  }

  public getClienteDatosLaboralesTelefono(): string | undefined {
    return this.clienteDatosLaboralesTelefono;
  }
  public setClienteDatosLaboralesTelefono(clienteDatosLaboralesTelefono: string): void {
    this.clienteDatosLaboralesTelefono = clienteDatosLaboralesTelefono;
  }

  public getTasasTeaCtfFinanciacion(): number | undefined {
    return this.tasasTeaCtfFinanciacion;
  }
  public setTasasTeaCtfFinanciacion(tasasTeaCtfFinanciacion: number): void {
    this.tasasTeaCtfFinanciacion = tasasTeaCtfFinanciacion;
  }

  public getTasasTnaCompensatoriosFinanciacion(): number | undefined {
    return this.tasasTnaCompensatoriosFinanciacion;
  }
  public setTasasTnaCompensatoriosFinanciacion(tasasTnaCompensatoriosFinanciacion: number): void {
    this.tasasTnaCompensatoriosFinanciacion = tasasTnaCompensatoriosFinanciacion;
  }

  public getTasasTnaPunitorios(): number | undefined {
    return this.tasasTnaPunitorios;
  }
  public setTasasTnaPunitorios(tasasTnaPunitorios: number): void {
    this.tasasTnaPunitorios = tasasTnaPunitorios;
  }

  public getTasasCtfFinanciacion(): number | undefined {
    return this.tasasCtfFinanciacion;
  }
  public setTasasCtfFinanciacion(tasasCtfFinanciacion: number): void {
    this.tasasCtfFinanciacion = tasasCtfFinanciacion;
  }

  public getTasasComisionRenovacionAnual(): number | undefined {
    return this.tasasComisionRenovacionAnual;
  }
  public setTasasComisionRenovacionAnual(tasasComisionRenovacionAnual: number): void {
    this.tasasComisionRenovacionAnual = tasasComisionRenovacionAnual;
  }

  public getTasasComisionMantenimiento(): number | undefined {
    return this.tasasComisionMantenimiento;
  }
  public setTasasComisionMantenimiento(tasasComisionMantenimiento: number): void {
    this.tasasComisionMantenimiento = tasasComisionMantenimiento;
  }

  public getTasasComisionReposicionPlastico(): number | undefined {
    return this.tasasComisionReposicionPlastico;
  }
  public setTasasComisionReposicionPlastico(tasasComisionReposicionPlastico: number): void {
    this.tasasComisionReposicionPlastico = tasasComisionReposicionPlastico;
  }

  public getTasasAtraso05_31Dias(): number | undefined {
    return this.tasasAtraso05_31Dias;
  }
  public setTasasAtraso05_31Dias(tasasAtraso05_31Dias: number): void {
    this.tasasAtraso05_31Dias = tasasAtraso05_31Dias;
  }

  public getTasasAtraso32_60Dias(): number | undefined {
    return this.tasasAtraso32_60Dias;
  }
  public setTasasAtraso32_60Dias(tasasAtraso32_60Dias: number): void {
    this.tasasAtraso32_60Dias = tasasAtraso32_60Dias;
  }

  public getTasasAtraso61_90Dias(): number | undefined {
    return this.tasasAtraso61_90Dias;
  }
  public setTasasAtraso61_90Dias(tasasAtraso61_90Dias: number): void {
    this.tasasAtraso61_90Dias = tasasAtraso61_90Dias;
  }

  public getTasasPagoFacil(): number | undefined {
    return this.tasasPagoFacil;
  }
  public setTasasPagoFacil(tasasPagoFacil: number): void {
    this.tasasPagoFacil = tasasPagoFacil;
  }

  public getTasasPlatiniumPagoFacil(): number | undefined {
    return this.tasasPlatiniumPagoFacil;
  }
  public setTasasPlatiniumPagoFacil(tasasPlatiniumPagoFacil: number): void {
    this.tasasPlatiniumPagoFacil = tasasPlatiniumPagoFacil;
  }

  public getTasasPlatiniumTeaCtfFinanciacion(): number | undefined {
    return this.tasasPlatiniumTeaCtfFinanciacion;
  }
  public setTasasPlatiniumTeaCtfFinanciacion(tasasPlatiniumTeaCtfFinanciacion: number): void {
    this.tasasPlatiniumTeaCtfFinanciacion = tasasPlatiniumTeaCtfFinanciacion;
  }

  public getTasasPlatiniumTnaCompensatoriosFinanciacion(): number | undefined {
    return this.tasasPlatiniumTnaCompensatoriosFinanciacion;
  }
  public setTasasPlatiniumTnaCompensatoriosFinanciacion(tasasPlatiniumTnaCompensatoriosFinanciacion: number): void {
    this.tasasPlatiniumTnaCompensatoriosFinanciacion = tasasPlatiniumTnaCompensatoriosFinanciacion;
  }

  public getTasasPlatiniumTnaPunitorios(): number | undefined {
    return this.tasasPlatiniumTnaPunitorios;
  }
  public setTasasPlatiniumTnaPunitorios(tasasPlatiniumTnaPunitorios: number): void {
    this.tasasPlatiniumTnaPunitorios = tasasPlatiniumTnaPunitorios;
  }

  public getTasasPlatiniumCtfFinanciacion(): number | undefined {
    return this.tasasPlatiniumCtfFinanciacion;
  }
  public setTasasPlatiniumCtfFinanciacion(tasasPlatiniumCtfFinanciacion: number): void {
    this.tasasPlatiniumCtfFinanciacion = tasasPlatiniumCtfFinanciacion;
  }

  public getTasasPlatiniumComisionRenovacionAnual(): number | undefined {
    return this.tasasPlatiniumComisionRenovacionAnual;
  }
  public setTasasPlatiniumComisionRenovacionAnual(tasasPlatiniumComisionRenovacionAnual: number): void {
    this.tasasPlatiniumComisionRenovacionAnual = tasasPlatiniumComisionRenovacionAnual;
  }

  public getTasasPlatiniumComisionMantenimiento(): number | undefined {
    return this.tasasPlatiniumComisionMantenimiento;
  }
  public setTasasPlatiniumComisionMantenimiento(tasasPlatiniumComisionMantenimiento: number): void {
    this.tasasPlatiniumComisionMantenimiento = tasasPlatiniumComisionMantenimiento;
  }

  public getTasasPlatiniumComisionReposicionPlastico(): number | undefined {
    return this.tasasPlatiniumComisionReposicionPlastico;
  }
  public setTasasPlatiniumComisionReposicionPlastico(tasasPlatiniumComisionReposicionPlastico: number): void {
    this.tasasPlatiniumComisionReposicionPlastico = tasasPlatiniumComisionReposicionPlastico;
  }

  public getTasasPlatiniumAtraso05_31Dias(): number | undefined {
    return this.tasasPlatiniumAtraso05_31Dias;
  }
  public setTasasPlatiniumAtraso05_31Dias(tasasPlatiniumAtraso05_31Dias: number): void {
    this.tasasPlatiniumAtraso05_31Dias = tasasPlatiniumAtraso05_31Dias;
  }

  public getTasasPlatiniumAtraso32_60Dias(): number | undefined {
    return this.tasasPlatiniumAtraso32_60Dias;
  }
  public setTasasPlatiniumAtraso32_60Dias(tasasPlatiniumAtraso32_60Dias: number): void {
    this.tasasPlatiniumAtraso32_60Dias = tasasPlatiniumAtraso32_60Dias;
  }

  public getTasasPlatiniumAtraso61_90Dias(): number | undefined {
    return this.tasasPlatiniumAtraso61_90Dias;
  }
  public setTasasPlatiniumAtraso61_90Dias(tasasPlatiniumAtraso61_90Dias: number): void {
    this.tasasPlatiniumAtraso61_90Dias = tasasPlatiniumAtraso61_90Dias;
  }

  /**
   * Obtiene el PDF del contrato.
   * 
   * @returns Buffer | undefined - PDF del contrato o undefined si no existe.
   */
  getPdfContrato(): Buffer | undefined {
    return this.pdfContrato;
  }

  /**
   * Establece el PDF del contrato.
   * 
   * @param pdf - Nuevo PDF del contrato.
   */
  setPdfContrato(pdf: Buffer): void {
    this.pdfContrato = pdf;
  }

  /**
   * Obtiene el ID único del contrato.
   * 
   * @returns number - ID del contrato.
   */
  public getId(): number {
    return this.id;
  }

  /**
   * Obtiene la fecha de generación del contrato.
   * 
   * @returns Date - Fecha de generación del contrato.
   */
  public getFechaGeneracion(): Date {
    return this.fechaGeneracion;
  }

  /**
   * Establece la fecha de generación del contrato.
   * 
   * @param fechaGeneracion - Nueva fecha de generación del contrato.
   */
  public setFechaGeneracion(fechaGeneracion: Date): void {
    this.fechaGeneracion = fechaGeneracion;
  }


  /**
   * Obtiene el estado actual del contrato.
   * 
   * @returns string - Estado del contrato.
   */
  public getEstado(): string {
    return this.estado;
  }

  /**
   * Establece el estado del contrato.
   * 
   * @param estado - Nuevo estado del contrato.
   */
  public setEstado(estado: string): void {
    this.estado = estado;
  }

  /**
   * Obtiene el ID de la solicitud formal asociada.
   * 
   * @returns number - ID de la solicitud formal.
   */
  public getSolicitudFormalId(): number {
    return this.solicitudFormalId;
  }

  /**
   * Establece el ID de la solicitud formal asociada.
   * 
   * @param solicitudFormalId - Nuevo ID de la solicitud formal.
   */
  public setSolicitudFormalId(solicitudFormalId: number): void {
    this.solicitudFormalId = solicitudFormalId;
  }

  /**
   * Obtiene el ID del cliente beneficiario.
   * 
   * @returns number - ID del cliente.
   */
  public getClienteId(): number {
    return this.clienteId;
  }

  /**
   * Establece el ID del cliente beneficiario.
   * 
   * @param clienteId - Nuevo ID del cliente.
   */
  public setClienteId(clienteId: number): void {
    this.clienteId = clienteId;
  }

  /**
   * Obtiene el número de tarjeta asignado.
   * 
   * @returns string | undefined - Número de tarjeta o undefined.
   */
  public getNumeroAutorizacion(): string | undefined {
    return this.numeroAutorizacion;
  }

  /**
   * Establece el número de tarjeta asignado.
   * 
   * @param numeroAutorizacion - Nuevo número de tarjeta.
   */
  public setNumeroAutorizacion(numeroAutorizacion: string): void {
    this.numeroAutorizacion = numeroAutorizacion;
  }

  /**
   * Obtiene el número de cuenta asignado.
   * 
   * @returns string | undefined - Número de cuenta o undefined.
   */
  public getNumeroCuenta(): string | undefined {
    return this.numeroCuenta;
  }

  /**
   * Establece el número de cuenta asignado.
   * 
   * @param numeroCuenta - Nuevo número de cuenta.
   */
  public setNumeroCuenta(numeroCuenta: string): void {
    this.numeroCuenta = numeroCuenta;
  }

  /**
     * Obtiene el conjunto de tasas aplicado al contrato
     * 
     * @returns ConjuntoTasas | undefined
     */
    public getConjuntoTasas(): ConjuntoTasas | undefined {
        return this.conjuntoTasas;
    }

    /**
     * Establece el conjunto de tasas aplicado al contrato
     * 
     * @param conjunto - Nuevo conjunto de tasas
     */
    public setConjuntoTasas(conjunto: ConjuntoTasas): void {
        this.conjuntoTasas = conjunto;
    }

    /**
     * Genera el texto para las cláusulas de tasas del contrato
     * 
     * @returns string - Texto formateado con las tasas
     */
    public generarClausulasTasas(): string {
        if (!this.conjuntoTasas) return "";
        
        const clausulas: string[] = [];
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
  public toString(): string {
    return `Contrato [id=${this.id}, fechaGeneracion=${this.fechaGeneracion}, estado=${this.estado}, solicitudFormalId=${this.solicitudFormalId}, clienteId=${this.clienteId}, numeroAutorización=${this.numeroAutorizacion || 'No asignado'}, numeroCuenta=${this.numeroCuenta || 'No asignado'}]`;
  }

  /**
   * Convierte el contrato a un objeto plano.
   * Útil para serialización y transferencia de datos.
   * 
   * @returns any - Objeto plano con todos los datos del contrato.
   */
  public toPlainObject(): any {
    return {
      id: this.id,
      fechaGeneracion: this.fechaGeneracion,
      estado: this.estado,
      solicitudFormalId: this.solicitudFormalId,
      clienteId: this.clienteId,
      monto: this.monto,
      numeroAutorizacion: this.numeroAutorizacion,
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
      clienteSueldoNeto: this.clienteSueldoNeto,
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
      clienteReferente1Nombre: this.clienteReferente1Nombre,
      clienteReferente1Apellido: this.clienteReferente1Apellido,
      clienteReferente1Vinculo: this.clienteReferente1Vinculo,
      clienteReferente1Telefono: this.clienteReferente1Telefono,
      clienteReferente2Nombre: this.clienteReferente2Nombre,
      clienteReferente2Apellido: this.clienteReferente2Apellido,
      clienteReferente2Vinculo: this.clienteReferente2Vinculo,
      clienteReferente2Telefono: this.clienteReferente2Telefono,
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
      tasasPlatiniumAtraso61_90Dias: this.tasasPlatiniumAtraso61_90Dias,

    };
  }

  /**
   * Crea una instancia de Contrato desde un mapa de datos.
   * Método estático para crear contratos desde datos serializados.
   * 
   * @param map - Mapa de datos para crear la instancia.
   * @returns Contrato - Nueva instancia de Contrato.
   */
  public static fromMap(map: any): Contrato {
        const conjuntoTasas = map.conjuntoTasas 
            ? ConjuntoTasas.fromMap(map.conjuntoTasas)
            : undefined;
            
        return new Contrato(
            map.id,
            map.fechaGeneracion,
            map.estado,
            map.solicitudFormalId,
            map.clienteId,
            map.monto ? parseFloat(map.monto) : undefined,
            map.numeroAutorizacion,
            map.numeroCuenta,
            map.comercio_nombre,
            map.comercio_fecha,
            map.comercio_n_autorizacion,
            map.comercio_producto,
            map.comercio_sucursal,
            map.cliente_nombre_completo,
            map.cliente_sexo,
            map.cliente_cuitocuil,
            map.cliente_tipo_documento,
            map.cliente_dni,
            map.cliente_fecha_nacimiento,
            map.cliente_estado_civil,
            map.cliente_nacionalidad,
            map.cliente_Sueldo_Neto,
            map.cliente_domicilio_calle,
            map.cliente_domicilio_numero,
            map.cliente_domicilio_piso,
            map.cliente_domicilio_departamento,
            map.cliente_domicilio_localidad,
            map.cliente_domicilio_provincia,
            map.cliente_domicilio_barrio,
            map.cliente_domicilio_pais,
            map.cliente_domicilio_codigo_postal,
            map.cliente_domicilio_correo_electronico,
            map.cliente_domicilio_telefono_fijo,
            map.cliente_domicilio_telefono_celular,
            map.cliente_referente1_nombre,
            map.cliente_referente1_apellido,
            map.cliente_referente1_vinculo,
            map.cliente_referente1_telefono,
            map.cliente_referente2_nombre,
            map.cliente_referente2_apellido,
            map.cliente_referente2_vinculo,
            map.cliente_referente2_telefono,
            map.cliente_datos_laborales_actividad,
            map.cliente_datos_laborales_razon_social,
            map.cliente_datos_laborales_cuit,
            map.cliente_datos_laborales_inicio_actividades,
            map.cliente_datos_laborales_cargo,
            map.cliente_datos_laborales_sector,
            map.cliente_datos_laborales_domicilio_legal,
            map.cliente_datos_laborales_codigo_postal,
            map.cliente_datos_laborales_localidad,
            map.cliente_datos_laborales_provincia,
            map.cliente_datos_laborales_telefono,
            map.tasas_tea_ctf_financiacion ? parseFloat(map.tasas_tea_ctf_financiacion) : undefined,
            map.tasas_tna_compensatorios_financiacion ? parseFloat(map.tasas_tna_compensatorios_financiacion) : undefined,
            map.tasas_tna_punitorios ? parseFloat(map.tasas_tna_punitorios) : undefined,
            map.tasas_ctf_financiacion ? parseFloat(map.tasas_ctf_financiacion) : undefined,
            map.tasas_comision_renovacion_anual ? parseFloat(map.tasas_comision_renovacion_anual) : undefined,
            map.tasas_comision_mantenimiento ? parseFloat(map.tasas_comision_mantenimiento) : undefined,
            map.tasas_comision_reposicion_plastico ? parseFloat(map.tasas_comision_reposicion_plastico) : undefined,
            map.tasas_atraso_05_31_dias ? parseFloat(map.tasas_atraso_05_31_dias) : undefined,
            map.tasas_atraso_32_60_dias ? parseFloat(map.tasas_atraso_32_60_dias) : undefined,
            map.tasas_atraso_61_90_dias ? parseFloat(map.tasas_atraso_61_90_dias) : undefined,
            map.tasas_pago_facil ? parseFloat(map.tasas_pago_facil) : undefined
            , map.tasas_platinium_pago_facil ? parseFloat(map.tasas_platinium_pago_facil) : undefined,
            map.tasas_platinium_tea_ctf_financiacion ? parseFloat(map.tasas_platinium_tea_ctf_financiacion) : undefined,
            map.tasas_platinium_tna_compensatorios_financiacion ? parseFloat(map.tasas_platinium_tna_compensatorios_financiacion) : undefined,
            map.tasas_platinium_tna_punitorios ? parseFloat(map.tasas_platinium_tna_punitorios) : undefined,
            map.tasas_platinium_ctf_financiacion ? parseFloat(map.tasas_platinium_ctf_financiacion) : undefined,
            map.tasas_platinium_comision_renovacion_anual ? parseFloat(map.tasas_platinium_comision_renovacion_anual) : undefined,
            map.tasas_platinium_comision_mantenimiento ? parseFloat(map.tasas_platinium_comision_mantenimiento) : undefined,
            map.tasas_platinium_comision_reposicion_plastico ? parseFloat(map.tasas_platinium_comision_reposicion_plastico) : undefined,
            map.tasas_platinium_atraso_05_31_dias ? parseFloat(map.tasas_platinium_atraso_05_31_dias) : undefined,
            map.tasas_platinium_atraso_32_60_dias ? parseFloat(map.tasas_platinium_atraso_32_60_dias) : undefined,
            map.tasas_platinium_atraso_61_90_dias ? parseFloat(map.tasas_platinium_atraso_61_90_dias) : undefined,

        );
    }

  /**
   * Genera el PDF del contrato.
   * Método que debe ser implementado para crear el documento PDF del contrato.
   * 
   * @throws Error - Siempre lanza error indicando que no está implementado.
   */
  public generarPDF(): void {
    throw new Error("Method not implemented.");
  }
}
