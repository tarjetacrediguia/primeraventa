import {
  NosisResponse,
  NosisVariable,
} from "../../../domain/entities/NosisData";
import { EurekaAdapter } from "../../../infrastructure/adapters/eureka/eurekaAdapter";
import { EntidadesService } from "../../../infrastructure/entidadesBancarias/EntidadesService";
import { RubrosLaboralesService } from "../../../infrastructure/RubrosLaborales/RubrosLaboralesService";
import { SituacionPersonaResponse } from "../../ports/EurekaPort";
import { GetSituacionPersona } from "../Eureka/GetSituacionPersona";

/**
 * MÓDULO: Caso de Uso - Verificación de Datos Nosis
 *
 * Este módulo implementa la lógica de negocio para verificar y validar datos obtenidos del servicio Nosis.
 * Aplica reglas de negocio específicas para determinar la aprobación automática de solicitudes de crédito.
 *
 * RESPONSABILIDADES:
 * - Definir estructura de datos personales extraídos de Nosis
 * - Configurar y aplicar reglas de validación personalizables
 * - Evaluar condiciones específicas de negocio (aportes, deudas, situación laboral)
 * - Extraer y estructurar datos personales del cliente
 * - Determinar estado de aprobación (aprobado/rechazado/pendiente)
 * - Calcular score crediticio basado en variables de Nosis
 *
 * FLUJO PRINCIPAL:
 * 1. Recibir respuesta cruda de Nosis
 * 2. Extraer y estructurar datos personales
 * 3. Aplicar reglas de validación configuradas
 * 4. Verificar condiciones específicas de negocio
 * 5. Determinar estado final de aprobación
 * 6. Retornar resultado estructurado con metadata
 */

/**
 * Estructura de datos personales extraídos de la respuesta de Nosis
 * Contiene información personal, documentación, domicilio, contactos,
 * situación laboral y referencias del cliente
 */
export type PersonalData = {
  nombreCompleto: {
    nombre?: string;
    apellido?: string;
  };
  documentacion: {
    tipoDocumento?: string;
    dni?: string;
    cuil?: string;
    fechaNacimiento?: string;
    sexo?: string;
    nacionalidad?: string;
    estadoCivil?: string;
  };
  domicilio: {
    calle?: string;
    numero?: string;
    localidad?: string;
    codigoPostal?: string;
    provincia?: string;
  };
  telefonos: Array<{
    codArea?: string;
    numero?: string;
    tipo?: string;
  }>;
  datosLaborales: {
    situacionLaboral?: string;
    empleador?: {
      razonSocial?: string;
      cuit?: string;
      telefono?: string;
      domicilio?: {
        calle?: string;
        numero?: string;
        localidad?: string;
        codigoPostal?: string;
        provincia?: string;
      };
      rubro?: string | null;
    };
    monotributo?: {
      esMonotributista?: string;
      categoria?: string;
      actividad?: string;
    };
  };
  referenciasPersonales: Array<{
    nombre?: string;
    telefono?: string;
    relacion?: string;
  }>;
};
/**
 * Resultado del proceso de verificación de datos Nosis
 * Contiene el estado de aprobación, score crediticio, motivos de rechazo
 * y datos personales estructurados
 */
export type VerificationResult = {
  status: "aprobado" | "rechazado" | "pendiente";
  approved: boolean;
  score?: number;
  motivo?: string;
  motivoComerciante?: string;
  reglasFallidas?: string[];
  pendientes?: string[];
  aprobados?: string[];
  personalData?: PersonalData;
  entidadesSituacion2?: number[];
  entidadesDeuda?: number[];
  referenciasComerciales?: {
    referenciasValidas: string[];
    referenciasInvalidas: string[];
    totalValidas: number;
    totalInvalidas: number;
  };
  eurekaMensajeComerciante?: string;
  eurekaMensajeAnalista?: string;
  detallesEureka?: any;
};
/**
 * Configuración de reglas de validación para variables de Nosis
 * Define las condiciones que deben cumplirse para la aprobación automática
 */
export type RuleConfig = {
  variable: string;
  operacion: ">" | "<" | ">=" | "<=" | "==" | "!=" | "in" | "not-in";
  valor: any;
  mensaje: string;
};
/**
 * Caso de uso para verificación y validación de datos de Nosis
 *
 * Implementa el proceso completo de evaluación de datos crediticios:
 * - Aplica reglas configurables de validación
 * - Verifica condiciones específicas de negocio
 * - Extrae y estructura información personal
 * - Calcula score crediticio
 * - Determina estado de aprobación final
 */
export class VerifyDataNosisUseCase {
  // Reglas de validación configuradas
  private rules: RuleConfig[];
  // Mínimo requerido de aportes para aprobación
  private readonly MINIMO_APORTES = 4;
  // Servicio para obtener nombres de entidades bancarias
  private entidadesService: EntidadesService;
  // Servicio para obtener rubros laborales
  private rubrosLaboralesService: RubrosLaboralesService;
  // Caso de uso para obtener situación de persona desde Eureka
  private getSituacionPersona: GetSituacionPersona;
  /**
   * Constructor del caso de uso de verificación Nosis
   * @param rules - Reglas personalizadas de validación (opcional)
   */
  constructor(
    rules?: RuleConfig[],
    entidadesService?: EntidadesService,
    rubrosLaboralesService?: RubrosLaboralesService,
    getSituacionPersona?: GetSituacionPersona
  ) {
    // Reglas por defecto si no se proporcionan
    this.rules = rules || [
      {
        variable: "VI_Jubilado_Es",
        operacion: "==",
        valor: "No",
        mensaje: "Cliente es jubilado",
      },
    ];
    this.entidadesService = entidadesService || new EntidadesService();
    this.rubrosLaboralesService =
      rubrosLaboralesService || new RubrosLaboralesService();
    this.getSituacionPersona =
      getSituacionPersona || new GetSituacionPersona(new EurekaAdapter());
  }
  /*

    Agregar método para verificar situación en SGCG Eureka
    */
  private async verificarSituacionEureka(cuil: string): Promise<{
  estado: "aprobado" | "rechazado" | "pendiente";
  mensajeComerciante: string;
  mensajeAnalista: string;
  detallesEureka?: any;
}> {
  try {
    const situacion = await this.getSituacionPersona.execute(cuil);
    
    const situacionBase = situacion.Situacion;
    const detalle = situacion.Detalle || '';
    const issues = situacion.Issues || [];
    
    let mensajeComerciante: string = "";
    let mensajeAnalista: string;
    let estadoFinal: "aprobado" | "rechazado" | "pendiente" = "pendiente";

    // ✅ FUNCIÓN PARA DETERMINAR RECHAZOS ESPECÍFICOS BASADOS EN EL DETALLE
    const determinarRechazoPorDetalle = (detalleTexto: string): { rechazado: boolean; mensaje?: string } => {
      const detalleLower = detalleTexto.toLowerCase();
      
      // Casos de RECHAZO automático
      if (detalleLower.includes("titular de cuenta") && detalleLower.includes("activa y con deuda")) {
        return { rechazado: true, mensaje: "❌ Cliente tiene cuenta activa con deuda en Crediguía" };
      }
      if (detalleLower.includes("titular de tarjeta crediguía") || detalleLower.includes("titular de tarjeta crediguia")) {
        return { rechazado: true, mensaje: "❌ Cliente tiene tarjeta Crediguía activa" };
      }
      if (detalleLower.includes("adicional de tarjeta crediguía") || detalleLower.includes("adicional de tarjeta crediguia")) {
        return { rechazado: true, mensaje: "❌ Cliente es adicional de tarjeta Crediguía" };
      }
      if (detalleLower.includes("adicional con consumos de cuenta activa")) {
        return { rechazado: true, mensaje: "❌ Adicional con consumos de cuenta activa" };
      }
      if (detalleLower.includes("titular de cuenta") && 
          (detalleLower.includes("estado gme") || detalleLower.includes("gme") || detalleLower.includes("gestión judicial"))) {
        return { rechazado: true, mensaje: "❌ Deuda judicial CG" };
      }
      
      return { rechazado: false };
    };

    // ✅ PRIMERO: Verificar si el DETALLE PRINCIPAL indica rechazo
    const rechazoDetallePrincipal = determinarRechazoPorDetalle(detalle);
    if (rechazoDetallePrincipal.rechazado) {
      estadoFinal = "rechazado";
      mensajeComerciante = rechazoDetallePrincipal.mensaje!;
    }
    // ✅ SEGUNDO: Verificar si alguno de los ISSUES indica rechazo
    else if (issues.length > 0) {
      let rechazoEncontrado = false;
      
      for (const issue of issues) {
        const rechazoIssue = determinarRechazoPorDetalle(issue.Detalle);
        if (rechazoIssue.rechazado && issue.Situacion === "RECHAZAR") {
          estadoFinal = "rechazado";
          mensajeComerciante = rechazoIssue.mensaje!;
          rechazoEncontrado = true;
          break;
        }
      }
      
      // Si no encontramos rechazo específico en issues, usar lógica normal
      if (!rechazoEncontrado) {
        estadoFinal = this.mapearEstadoEureka(situacionBase);
        mensajeComerciante = this.obtenerMensajeComerciantePorEstado(situacionBase, detalle);
      }
    }
    // ✅ TERCERO: Casos normales sin rechazo específico
    else {
      estadoFinal = this.mapearEstadoEureka(situacionBase);
      mensajeComerciante = this.obtenerMensajeComerciantePorEstado(situacionBase, detalle);
    }

    // Construir mensaje detallado para analista
    mensajeAnalista = this.construirMensajeAnalista(situacion, estadoFinal);

    return {
      estado: estadoFinal,
      mensajeComerciante,
      mensajeAnalista,
      detallesEureka: situacion
    };
  } catch (error) {
    console.error("Error al verificar situación en Eureka:", error);
    const mensajeError = "No se pudo verificar la situación en sistema anterior";
    return {
      estado: "pendiente",
      mensajeComerciante: mensajeError,
      mensajeAnalista: `${mensajeError}. Error: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
}

/**
 * Obtiene mensaje para comerciante basado en estado general
 */
private obtenerMensajeComerciantePorEstado(estado: string, detalle: string): string {
  switch (estado) {
    case "OK":
      return "✅ Cliente aprobado en sistema SGCG";
    case "OPERADOR":
      return "⏳ Cliente en revisión por operador";
    case "RECHAZAR":
      // Si llegamos aquí y es RECHAZAR pero no capturamos un caso específico
      if (detalle.includes("Persona no registrada en SGCG")) {
        return "✅ Cliente no registrado en sistema anterior";
      }
      return "❌ Cliente rechazado por sistema SGCG";
    default:
      return "⏳ Situación del cliente en revisión";
  }
}

/**
 * Construye mensaje detallado para analistas
 */
private construirMensajeAnalista(situacion: any, estadoFinal: string): string {
  const { Situacion, Detalle, CUILT, Nombres, Apellidos, InfoAdicional1, InfoAdicional2, Issues, Meta } = situacion;
  
  let mensaje = `SITUACIÓN SGCG - ${estadoFinal.toUpperCase()}\n` +
                `• Detalle: ${Detalle || 'N/A'}\n` +
                `• CUILT: ${CUILT || 'No disponible'}\n` +
                `• Nombre: ${Nombres || 'No disponible'} ${Apellidos || ''}\n` +
                `• Issues: ${Issues?.length || 0} problemas detectados`;

  if (Issues && Issues.length > 0) {
    mensaje += `\n• Detalles de Issues:\n`;
    Issues.forEach((issue: any, index: number) => {
      mensaje += `  ${index + 1}. ${issue.Situacion}: ${issue.Detalle}`;
      if (issue.InfoAdicional) {
        mensaje += ` (${issue.InfoAdicional})`;
      }
      mensaje += '\n';
    });
  }

  return mensaje;
}

  /**
 * Mapea el estado de Eureka a nuestro sistema interno
 */
private mapearEstadoEureka(estadoEureka: string): "aprobado" | "rechazado" | "pendiente" {
  switch (estadoEureka) {
    case "OK":
      return "aprobado";
    case "RECHAZAR":
      return "rechazado";
    case "OPERADOR":
    default:
      return "pendiente";
  }
}

  /**
   * Verifica si el cliente trabaja en rubros de construcción o contratación de personal,
   * no tiene deudas y tiene 12 meses de aportes completos
   */
  private verificarRubrosConstruccionContratacion(variables: NosisVariable[]): {
  esRubroConstruccionContratacion: boolean;
  estado: "aprobado" | "rechazado" | "pendiente";
  mensaje: string;
  codigoRubro?: string;
  descripcionRubro?: string;
} {
  // Obtener el código del rubro del empleador
  const codigoRubroEmpleador = variables.find(
    (v) => v.Nombre === "VI_Empleador_Act01_Cod"
  )?.Valor;

  if (!codigoRubroEmpleador) {
    return {
      esRubroConstruccionContratacion: false,
      estado: "aprobado", // No aplica la regla especial
      mensaje: "",
    };
  }

  // Verificar si pertenece a los rubros de construcción/contratación
  const esRubroConstruccionContratacion =
    this.rubrosLaboralesService.esRubroConstruccionOContratacion(
      codigoRubroEmpleador
    );

  if (!esRubroConstruccionContratacion) {
    return {
      esRubroConstruccionContratacion: false,
      estado: "aprobado", // No aplica la regla especial
      mensaje: "",
    };
  }

  // Obtener descripción del rubro
  const descripcionRubro =
    this.rubrosLaboralesService.obtenerDescripcionRubro(codigoRubroEmpleador);

  // Verificar deudas en situación 3-4-5
  const verificacionDeudas = this.verificarDeudaEntidades(variables);
  const cantidadDeudas = verificacionDeudas.entidades?.length || 0;

  // Verificar referencias comerciales
  const resultadoReferencias = this.verificarReferenciasComerciales(variables);
  const cantidadReferencias = resultadoReferencias.totalValidas;

  // Verificar que tenga 12 meses de aportes completos
  const tiene12Aportes = this.verificar12MesesAportesCompletos(variables);

  // Calcular total de "problemas" (deudas + referencias)
  const totalProblemas = cantidadDeudas + cantidadReferencias;

  // CONDICIONES SEGÚN LOS NUEVOS REQUISITOS:
  if (!tiene12Aportes) {
    return {
      esRubroConstruccionContratacion: true,
      estado: "pendiente",
      codigoRubro: codigoRubroEmpleador,
      descripcionRubro: descripcionRubro,
      mensaje: `Trabaja en rubro de construcción/contratación (${codigoRubroEmpleador} - ${descripcionRubro}) PENDIENTE - no tiene 12 meses de aportes completos`,
    };
  }

  // Tiene 12 meses de aportes
  if (totalProblemas === 0) {
    return {
      esRubroConstruccionContratacion: true,
      estado: "aprobado",
      codigoRubro: codigoRubroEmpleador,
      descripcionRubro: descripcionRubro,
      mensaje: `APROBADO - Trabaja en rubro de construcción/contratación (${codigoRubroEmpleador} - ${descripcionRubro}) sin deudas ni referencias comerciales y con 12 meses de aportes completos`,
    };
  } else if (totalProblemas === 1) {
    let motivo = `PENDIENTE - Trabaja en rubro de construcción/contratación (${codigoRubroEmpleador} - ${descripcionRubro}) con 12 meses de aportes completos`;
    if (cantidadDeudas === 1) {
      motivo += " y 1 deuda";
    }
    if (cantidadReferencias === 1) {
      motivo += cantidadDeudas === 1 ? " y 1 referencia comercial" : " y 1 referencia comercial";
    }
    return {
      esRubroConstruccionContratacion: true,
      estado: "pendiente",
      codigoRubro: codigoRubroEmpleador,
      descripcionRubro: descripcionRubro,
      mensaje: motivo,
    };
  } else {
    // 2 o más problemas (deudas + referencias)
    return {
      esRubroConstruccionContratacion: true,
      estado: "rechazado",
      codigoRubro: codigoRubroEmpleador,
      descripcionRubro: descripcionRubro,
      mensaje: `RECHAZADO - Trabaja en rubro de construcción/contratación (${codigoRubroEmpleador} - ${descripcionRubro}) con 12 meses de aportes completos, ${cantidadDeudas} deudas y ${cantidadReferencias} referencias comerciales`,
    };
  }
}

  /**
   * Evalúa una regla de validación contra una variable de Nosis
   * @param variable - Variable de Nosis a evaluar
   * @param regla - Configuración de la regla a aplicar
   * @returns Boolean indicando si la regla se cumple
   */
  private evaluarRegla(
    variable: NosisVariable | undefined,
    regla: RuleConfig
  ): boolean {
    if (!variable) return false;
    // Convertir valor según el tipo de variable
    const valorReal =
      variable.Tipo === "ENTERO"
        ? parseInt(variable.Valor)
        : variable.Tipo === "DECIMAL"
        ? parseFloat(variable.Valor)
        : variable.Valor;
    // Aplicar operación de comparación
    switch (regla.operacion) {
      case ">":
        return valorReal > regla.valor;
      case "<":
        return valorReal < regla.valor;
      case ">=":
        return valorReal >= regla.valor;
      case "<=":
        return valorReal <= regla.valor;
      case "==":
        return valorReal === regla.valor;
      case "!=":
        return valorReal !== regla.valor;
      case "in":
        return Array.isArray(regla.valor) && regla.valor.includes(valorReal);
      case "not-in":
        return Array.isArray(regla.valor) && !regla.valor.includes(valorReal);
      default:
        return false;
    }
  }
  /**
   * Verifica si el cliente tiene suficientes aportes registrados
   * @param variables - Lista de variables de Nosis
   * @returns Boolean indicando si cumple con el mínimo requerido
   */
  private verificarAportes(variables: NosisVariable[]): boolean {
    const pagos = parseInt(
      variables.find((v) => v.Nombre === "AP_12m_Empleado_Pagos_Cant")?.Valor ||
        "0"
    );
    const impagos = parseInt(
      variables.find((v) => v.Nombre === "AP_12m_Empleado_Impagos_Cant")
        ?.Valor || "0"
    );
    const parciales = parseInt(
      variables.find((v) => v.Nombre === "AP_12m_Empleado_PagoParcial_Cant")
        ?.Valor || "0"
    );
    const totalAportes = pagos + impagos + parciales;
    return totalAportes >= this.MINIMO_APORTES;
  }

  /**
   * Verifica si el cliente tiene tarjetas Crediguía activas
   * @param variables - Lista de variables de Nosis
   * @returns Boolean indicando si tiene tarjetas Crediguía
   */
  private tieneTarjetaCrediguia(variables: NosisVariable[]): boolean {
    const detalleTarjetas = variables.find(
      (v) => v.Nombre === "CI_Vig_TC_Detalle"
    )?.Valor;

    if (!detalleTarjetas) {
      return false;
    }

    try {
      // Parsear el XML para extraer las líneas de tarjetas
      const lineas = this.parsearDetalleTarjetas(detalleTarjetas);

      // Buscar tarjetas Crediguía en las marcas de tarjeta
      for (const tarjeta of lineas) {
        const marca = tarjeta.marcaTarjeta.toLowerCase();
        // Verificar diferentes variaciones del nombre Crediguía
        if (
          marca.includes("crediguía") ||
          marca.includes("crediguia") ||
          marca.includes("guía") ||
          marca.includes("guia")
        ) {
          return true;
        }
      }
    } catch (error) {
      console.error("Error al parsear detalle de tarjetas:", error);
    }

    return false;
  }

  /**
   * Parsea el string de detalle de tarjetas de crédito
   * @param detalleTarjetas - String XML con información de tarjetas
   * @returns Array de objetos con información estructurada de tarjetas
   */
  private parsearDetalleTarjetas(detalleTarjetas: string): Array<{
    entidadEmisora: string;
    codigoEntidad: string;
    fechaUltimaInfo: string;
    marcaTarjeta: string;
    fechaAlta: string;
    activa: string;
    limiteCompra: string;
    saldoTotal: string;
    pagoMinimo: string;
    saldo12Meses: string;
  }> {
    const resultados = [];

    // Expresión regular para extraer cada registro <D>
    const regex = /<D>(.*?)<\/D>/g;
    let match;

    while ((match = regex.exec(detalleTarjetas)) !== null) {
      const partes = match[1].split("|").map((part) => part.trim());

      if (partes.length >= 10) {
        resultados.push({
          entidadEmisora: partes[0],
          codigoEntidad: partes[1],
          fechaUltimaInfo: partes[2],
          marcaTarjeta: partes[3],
          fechaAlta: partes[4],
          activa: partes[5],
          limiteCompra: partes[6],
          saldoTotal: partes[7],
          pagoMinimo: partes[8],
          saldo12Meses: partes[9],
        });
      }
    }

    return resultados;
  }

  /**
   * Verifica las referencias comerciales del cliente según los criterios especificados
   * @param variables - Lista de variables de Nosis
   * @returns Objeto con estado y detalles de las referencias
   */
  private verificarReferenciasComerciales(variables: NosisVariable[]): {
    estado: "aprobado" | "pendiente" | "rechazado";
    mensaje?: string;
    referenciasValidas: string[];
    referenciasInvalidas: string[];
    totalValidas: number;
    totalInvalidas: number;
  } {
    // Variables a excluir (no se tienen en cuenta)
    const EXCLUIR_FUENTES = [
      "Telecom Argentina SA",
      "Claro",
      "Telefónica Moviles Argentina SA",
      "DirecTv",
      "DIRECTV ARGENTINA SA"
    ];

    // Obtener cantidad total de referencias VIGENTES
    const cantidadRefVigentes = parseInt(
      variables.find((v) => v.Nombre === "RC_Vig_Cant")?.Valor || "0"
    );

    // Obtener fuentes de referencias VIGENTES
    const fuentesRefVigentes = variables.find(
      (v) => v.Nombre === "RC_Vig_Fuente"
    )?.Valor;

    // También considerar referencias de últimos 12 meses
    const cantidadRef12m = parseInt(
      variables.find((v) => v.Nombre === "RC_12m_Cant")?.Valor || "0"
    );

    const fuentesRef12m = variables.find(
      (v) => v.Nombre === "RC_12m_Fuente"
    )?.Valor;

    let referenciasValidas: string[] = [];
    let referenciasInvalidas: string[] = [];

        console.log("=== DEPURACIÓN REFERENCIAS ===");
    console.log("Referencias vigentes:", fuentesRefVigentes);
    console.log("Cantidad vigentes:", cantidadRefVigentes);
    console.log("Referencias 12m:", fuentesRef12m);
    console.log("Cantidad 12m:", cantidadRef12m);

    // 🔥 CORRECCIÓN: Priorizar referencias VIGENTES sobre las de 12 meses
    if (fuentesRefVigentes && cantidadRefVigentes > 0) {
        const fuentes = fuentesRefVigentes.split('/')
            .map((f) => f.trim())
            .filter((f) => f && f !== "");

        console.log("Fuentes procesadas vigentes:", fuentes);

        fuentes.forEach((fuente) => {
            const esExcluida = EXCLUIR_FUENTES.some((excluida) =>
                fuente.toLowerCase().includes(excluida.toLowerCase())
            );
            
            if (esExcluida) {
                referenciasInvalidas.push(fuente);
                console.log(`❌ Referencia excluida: ${fuente}`);
            } else {
                referenciasValidas.push(fuente);
                console.log(`✅ Referencia válida: ${fuente}`);
            }
        });
    }
    // Solo usar referencias de 12 meses si NO hay referencias vigentes
    else if (referenciasValidas.length === 0 && fuentesRef12m && cantidadRef12m > 0) {
        const fuentes = fuentesRef12m.split('/')
            .map((f) => f.trim())
            .filter((f) => f && f !== "");

        console.log("Fuentes procesadas 12m:", fuentes);

        fuentes.forEach((fuente) => {
            const esExcluida = EXCLUIR_FUENTES.some((excluida) =>
                fuente.toLowerCase().includes(excluida.toLowerCase())
            );
            
            if (esExcluida) {
                referenciasInvalidas.push(fuente);
                console.log(`❌ Referencia excluida (12m): ${fuente}`);
            } else {
                referenciasValidas.push(fuente);
                console.log(`✅ Referencia válida (12m): ${fuente}`);
            }
        });
    }

    const totalValidas = referenciasValidas.length;
    const totalInvalidas = referenciasInvalidas.length;

        console.log("Resultado final referencias:");
    console.log("- Válidas:", referenciasValidas, "Total:", totalValidas);
    console.log("- Invalidas:", referenciasInvalidas, "Total:", totalInvalidas);

    // 🔥 LÓGICA SIMPLE SOLO PARA REFERENCIAS
    if (totalValidas === 0) {
        return {
            estado: "aprobado",
            mensaje: "No tiene referencias comerciales válidas",
            referenciasValidas,
            referenciasInvalidas,
            totalValidas,
            totalInvalidas,
        };
    } else if (totalValidas === 1) {
        return {
            estado: "pendiente",
            mensaje: `Tiene 1 referencia comercial válida: ${referenciasValidas[0]}`,
            referenciasValidas,
            referenciasInvalidas,
            totalValidas,
            totalInvalidas,
        };
    } else if (totalValidas === 2) {
        return {
            estado: "pendiente",
            mensaje: `Tiene 2 referencias comerciales válidas: ${referenciasValidas.join(", ")}`,
            referenciasValidas,
            referenciasInvalidas,
            totalValidas,
            totalInvalidas,
        };
    } else {
        // 3+ referencias válidas
        return {
            estado: "rechazado",
            mensaje: `Tiene ${totalValidas} referencias comerciales válidas (máximo permitido: 2): ${referenciasValidas.join(", ")}`,
            referenciasValidas,
            referenciasInvalidas,
            totalValidas,
            totalInvalidas,
        };
    }
  }

  /**
   * Verifica que el cliente tenga entre 18 y 74 años
   */
  private verificarEdad(variables: NosisVariable[]): {
    cumple: boolean;
    edad?: number;
    mensaje?: string;
  } {
    const fechaNacimientoStr = variables.find(
      (v) => v.Nombre === "VI_FecNacimiento"
    )?.Valor;

    if (!fechaNacimientoStr) {
      return {
        cumple: false,
        mensaje: "No se pudo obtener la fecha de nacimiento",
      };
    }

    // Formato: YYYYMMDD
    const año = parseInt(fechaNacimientoStr.substring(0, 4));
    const mes = parseInt(fechaNacimientoStr.substring(4, 6)) - 1;
    const dia = parseInt(fechaNacimientoStr.substring(6, 8));

    const fechaNacimiento = new Date(año, mes, dia);
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();

    // Ajustar si aún no ha pasado el mes de nacimiento o si es el mes pero no el día
    if (mesActual < mes || (mesActual === mes && diaActual < dia)) {
      edad--;
    }

    if (edad < 18) {
      return {
        cumple: false,
        edad,
        mensaje: `El cliente es menor de edad (${edad} años)`,
      };
    } else if (edad > 74) {
      return {
        cumple: false,
        edad,
        mensaje: `El cliente supera la edad máxima (${edad} años)`,
      };
    }

    return { cumple: true, edad };
  }

  /**
   * Ejecuta el proceso completo de verificación de datos Nosis
   * @param nosisData - Respuesta cruda del servicio Nosis
   * @returns Promise<VerificationResult> - Resultado estructurado de la verificación
   */
  async execute(  nosisData: NosisResponse,
  situacionEureka?: SituacionPersonaResponse): Promise<VerificationResult> {
    const variables = nosisData.Contenido.Datos.Variables.Variable;
    const reglasFallidas: string[] = [];
    const pendientes: string[] = [];
    const aprobados: string[] = [];
    let motivoComerciante: string = "";

    // Buscar el score para incluirlo en el resultado
    const scoreVar = variables.find((v) => v.Nombre === "SCO_Vig");
    const score = scoreVar ? parseInt(scoreVar.Valor) : 0;

    // Extraer CUIL para verificación en Eureka
    const cuil = variables.find((v) => v.Nombre === "VI_Identificacion")?.Valor;

  // ✅ VERIFICACIÓN EN EUREKA (SGCG)
  let eurekaMensajeComerciante: string | undefined;
  let eurekaMensajeAnalista: string | undefined;
  let detallesEureka: SituacionPersonaResponse | undefined = situacionEureka;
  let estadoEureka: "aprobado" | "rechazado" | "pendiente" = "pendiente";

  if (situacionEureka) {
    // Usar los datos de Eureka proporcionados
    estadoEureka = this.mapearEstadoEureka(situacionEureka.Situacion);
    eurekaMensajeComerciante = this.obtenerMensajeComerciantePorEstado(situacionEureka.Situacion, situacionEureka.Detalle);
    eurekaMensajeAnalista = this.construirMensajeAnalista(situacionEureka, estadoEureka);
    
    // Solo agregar a las listas si NO es aprobado
    if (estadoEureka !== "aprobado") {
      switch (estadoEureka) {
        case "pendiente":
          pendientes.push(eurekaMensajeComerciante);
          break;
        case "rechazado":
          reglasFallidas.push(eurekaMensajeComerciante);
          break;
      }
    } else {
      aprobados.push(eurekaMensajeComerciante);
    }

    // ✅ Agregar información específica de Issues si existe
    if (situacionEureka.Issues && situacionEureka.Issues.length > 0) {
      const issuesMensajes = situacionEureka.Issues.map(issue => 
        `${issue.Situacion}: ${issue.Detalle}${issue.InfoAdicional ? ` (${issue.InfoAdicional})` : ''}`
      );
      eurekaMensajeAnalista += `\n• Issues de Eureka: ${issuesMensajes.join('; ')}`;
    }

  } else {
    const mensaje = "No se pudo obtener información del sistema anterior (Eureka)";
    pendientes.push(mensaje);
    eurekaMensajeComerciante = mensaje;
    eurekaMensajeAnalista = mensaje;
  }

    // Extraer datos personales (siempre se hace)
    const personalData = this.extraerDatosPersonales(variables);

    // ✅ VERIFICACIÓN DE EDAD
    const verificacionEdad = this.verificarEdad(variables);
    if (!verificacionEdad.cumple) {
        reglasFallidas.push(verificacionEdad.mensaje!);
    } else {
        aprobados.push(`Edad válida (${verificacionEdad.edad} años)`);
    }

    // ✅ VERIFICACIÓN DE EMPLEADO DOMÉSTICO
    const verificacionEmpleadoDomestico = this.verificarEmpleadoDomesticoSinDeudas(variables);
    if (verificacionEmpleadoDomestico.esEmpleadoDomestico) {
        if (verificacionEmpleadoDomestico.estado === "aprobado") {
            aprobados.push(verificacionEmpleadoDomestico.mensaje);
        } else if(verificacionEmpleadoDomestico.estado === "pendiente") {
            pendientes.push(verificacionEmpleadoDomestico.mensaje);
        } else {
            reglasFallidas.push(verificacionEmpleadoDomestico.mensaje);
        }
    }

    // ✅ VERIFICACIÓN DE RUBROS CONSTRUCCIÓN/CONTRATACIÓN
    const verificacionRubrosConstruccion = this.verificarRubrosConstruccionContratacion(variables);
    if (verificacionRubrosConstruccion.esRubroConstruccionContratacion) {
        if (verificacionRubrosConstruccion.estado === "aprobado") {
            aprobados.push(verificacionRubrosConstruccion.mensaje);
        } else if(verificacionRubrosConstruccion.estado === "pendiente") {
            pendientes.push(verificacionRubrosConstruccion.mensaje);
        } else {
            reglasFallidas.push(verificacionRubrosConstruccion.mensaje);
        }
    }

    // ✅ VERIFICACIÓN DE JUBILADOS/PENSIONADOS
    const esJubilado = variables.find((v) => v.Nombre === "VI_Jubilado_Es")?.Valor === "Si";
    const esPensionado = variables.find((v) => v.Nombre === "VI_Pensionado_Es")?.Valor === "Si";

    if (esPensionado) {
        reglasFallidas.push("Cliente es pensionado - no permitido");
    } else if (esJubilado) {
        pendientes.push("Cliente es jubilado - pendiente de verificación de número de beneficio");
    }

    // ✅ EVALUAR REGLAS ESTÁNDAR
    for (const regla of this.rules) {
        const variable = variables.find((v) => v.Nombre === regla.variable);
        if (!this.evaluarRegla(variable, regla)) {
            reglasFallidas.push(regla.mensaje);
        }
    }

    // ✅ VERIFICACIÓN DE APORTES
    const totalAportes = this.calcularTotalAportes(variables);
    if (totalAportes >= this.MINIMO_APORTES) {
    // Solo agregar si no existe ya
    if (!aprobados.some(a => a.includes('aporte'))) {
        aprobados.push(`Cumple con el mínimo de aportes requerido (${totalAportes} aportes)`);
    }
} else {
    // Solo agregar si no existe ya  
    if (!reglasFallidas.some(r => r.includes('aporte'))) {
        pendientes.push(`Cliente no cumple con el mínimo de aportes registrados en los últimos 12 meses (${totalAportes} de ${this.MINIMO_APORTES} requeridos)`);
    }
}

    // ✅ VERIFICACIÓN DE ENTIDADES EN SITUACIÓN 2
    const resultadoSituacion2 = this.verificarEntidadesSituacion2(variables);
    if (resultadoSituacion2.estado === "rechazado") {
        reglasFallidas.push(resultadoSituacion2.mensaje!);
    } else if (resultadoSituacion2.estado === "pendiente") {
        pendientes.push(resultadoSituacion2.mensaje!);
    } else {
        aprobados.push("No tiene entidades en situación 2");
    }

    // ✅ VERIFICACIÓN DE DEUDAS EN ENTIDADES
    const tieneDeudaEntidades = this.verificarDeudaEntidades(variables);
    if (tieneDeudaEntidades.estado === "rechazado") {
        reglasFallidas.push(tieneDeudaEntidades.mensaje!);
    } else if (tieneDeudaEntidades.estado === "pendiente") {
        pendientes.push(tieneDeudaEntidades.mensaje!);
    } else {
        aprobados.push("No tiene deudas en entidades con situación 3-4-5");
    }

    // ✅ VERIFICACIÓN DE REFERENCIAS COMERCIALES
    const resultadoReferencias = this.verificarReferenciasComerciales(variables);
    if (resultadoReferencias.estado === "rechazado") {
        reglasFallidas.push(resultadoReferencias.mensaje!);
    } else if (resultadoReferencias.estado === "pendiente") {
        pendientes.push(resultadoReferencias.mensaje!);
    } else {
        aprobados.push("Cumple con criterios de referencias comerciales");
    }



    // ✅ VERIFICACIÓN DE SITUACIÓN LABORAL Y MONOTRIBUTO
    const esMonotributista = variables.find((v) => v.Nombre === "VI_Inscrip_Monotributo_Es")?.Valor === "Si";
    const cambioLaboral = this.verificarPerdidaEmpleoReciente(variables);

    if (cambioLaboral.perdioEmpleo) {
        pendientes.push(cambioLaboral.motivo);
    } else if (esMonotributista) {
        const tieneEmpleoRegistrado = this.tieneEmpleoRegistrado(variables);
        if (tieneEmpleoRegistrado) {
            const tieneAportesRecientes = this.tieneAportesRecientes(variables);
            if (tieneAportesRecientes) {
                aprobados.push("Monotributista con empleo registrado y aportes recientes validados");
            } else {
                pendientes.push("Monotributista con empleo pero sin aportes recientes suficientes");
            }
        } else {
            pendientes.push("Cliente es monotributista sin empleo registrado");
        }
    } else if (!cambioLaboral.perdioEmpleo) {
        const tieneLaboral = this.verificarSituacionLaboral(variables);
        if (tieneLaboral) {
            aprobados.push("Situación laboral validada");
        } else {
            pendientes.push("Cliente no tiene situación laboral registrada");
        }
    }

    // ✅ VERIFICACIÓN DE TARJETAS CREDIGUÍA
    if (this.tieneTarjetaCrediguia(variables)) {
        reglasFallidas.push("Cliente tiene tarjeta Crediguía activa");
    } else {
        aprobados.push("No tiene tarjetas Crediguía activas");
    }

    // ✅ VERIFICACIÓN DE COMBINACIÓN REFERENCIAS + DEUDAS + SITUACIÓN 2
const combinacionReferenciasDeudas = this.verificarCombinacionReferenciasDeudas(
    resultadoReferencias,
    tieneDeudaEntidades,
    resultadoSituacion2 
);

// COMBINACIÓN DETERMINA RECHAZO O PENDIENTE, TIENE PRIORIDAD ABSOLUTA
if (combinacionReferenciasDeudas.estado === "rechazado") {
    // LIMPIAR cualquier pendiente anterior y agregar solo el rechazo de combinación
    pendientes.length = 0;
    reglasFallidas.push(combinacionReferenciasDeudas.mensaje!);
} else if (combinacionReferenciasDeudas.estado === "pendiente") {
    // LIMPIAR cualquier pendiente de referencias individuales y agregar solo el de combinación
    const pendientesFiltrados = pendientes.filter(p => 
        !p.includes('referencias comerciales') && 
        !p.includes('referencia comercial')
    );
    pendientes.length = 0;
    pendientes.push(...pendientesFiltrados);
    pendientes.push(combinacionReferenciasDeudas.mensaje!);
}

    // ===== DETERMINAR ESTADO FINAL CON PRIORIDAD CORRECTA =====

    let status: "aprobado" | "rechazado" | "pendiente" = "aprobado";

    // 🔥 LOGS TEMPORALES PARA DEPURACIÓN
console.log("=== DEPURACIÓN ESTADO FINAL ===");
console.log("Reglas fallidas:", reglasFallidas);
console.log("Pendientes:", pendientes);
console.log("Resultado referencias:", resultadoReferencias.estado, "total válidas:", resultadoReferencias.totalValidas);
console.log("Combinación:", combinacionReferenciasDeudas.estado);

    // 🔥 NUEVA LÓGICA: Priorizar rechazos sobre aprobaciones
    // Si hay REGLAS FALLIDAS (rechazos), el estado es RECHAZADO independientemente de Eureka
    if (reglasFallidas.length > 0) {
        status = "rechazado";
        // Construir motivo principal con los rechazos más importantes
        motivoComerciante = this.construirMotivoPrincipalComerciante(reglasFallidas);
    } 
    // Si hay PENDIENTES pero NO rechazos, el estado es PENDIENTE
    else if (pendientes.length > 0) {
        status = "pendiente";
        motivoComerciante = this.construirMotivoPendienteComerciante(pendientes);
    }
    // Solo si NO hay rechazos NI pendientes, verificar Eureka
    else {
        // Si Eureka rechaza, priorizar ese rechazo
        if (estadoEureka === "rechazado") {
            status = "rechazado";
            motivoComerciante = eurekaMensajeComerciante || "Solicitud rechazada por sistema anterior";
        } 
        // Si Eureka está pendiente
        else if (estadoEureka === "pendiente") {
            status = "pendiente";
            motivoComerciante = eurekaMensajeComerciante || "Solicitud en revisión por sistema anterior";
        }
        // Solo si todo está bien (incluyendo Eureka), aprobar
        else {
            status = "aprobado";
            motivoComerciante = "Solicitud aprobada";
        }
    }

    const approved = status === "aprobado";

    // ===== CONSTRUIR MENSAJE DETALLADO UNIFICADO =====
    const motivo = this.construirMensajeDetallado(
        status,
        aprobados,
        reglasFallidas,
        pendientes
    );

  return {
    status,
    approved,
    score,
    motivo,
    motivoComerciante,
    reglasFallidas,
    pendientes,
    aprobados,
    personalData,
    entidadesSituacion2: resultadoSituacion2.entidades || [],
    entidadesDeuda: tieneDeudaEntidades.entidades || [],
    referenciasComerciales: {
      referenciasValidas: resultadoReferencias.referenciasValidas,
      referenciasInvalidas: resultadoReferencias.referenciasInvalidas,
      totalValidas: resultadoReferencias.totalValidas,
      totalInvalidas: resultadoReferencias.totalInvalidas,
    },
    eurekaMensajeComerciante,
    eurekaMensajeAnalista,
    detallesEureka,
  };
}

  /**
 * Construye el motivo principal para el comerciante basado en los rechazos más importantes
 */
private construirMotivoPrincipalComerciante(reglasFallidas: string[]): string {
    // Priorizar los motivos de rechazo más importantes
    const motivosPrioritarios = [];

    // 1. Deudas y situación 2 (más críticos)
    const deudasSituacion2 = reglasFallidas.filter(motivo => 
        motivo.includes('entidades en situación 2') || 
        motivo.includes('entidades con deuda')
    );
    
    // 2. Aportes insuficientes
    const aportesInsuficientes = reglasFallidas.filter(motivo => 
        motivo.includes('aporte')
    );
    
    // 3. Situación laboral
    const situacionLaboral = reglasFallidas.filter(motivo => 
        motivo.includes('monotributista') || 
        motivo.includes('situación laboral') ||
        motivo.includes('empleo')
    );
    
    // 4. Referencias comerciales
    const referencias = reglasFallidas.filter(motivo => 
        motivo.includes('referencias comerciales')
    );
    
    // 5. Otros motivos
    const otros = reglasFallidas.filter(motivo => 
        !deudasSituacion2.includes(motivo) &&
        !aportesInsuficientes.includes(motivo) &&
        !situacionLaboral.includes(motivo) &&
        !referencias.includes(motivo)
    );

    // Tomar los motivos más relevantes (máximo 2 para no saturar)
    if (deudasSituacion2.length > 0) {
        motivosPrioritarios.push(...deudasSituacion2.slice(0, 1));
    }
    if (aportesInsuficientes.length > 0 && motivosPrioritarios.length < 2) {
        motivosPrioritarios.push(...aportesInsuficientes.slice(0, 1));
    }
    if (situacionLaboral.length > 0 && motivosPrioritarios.length < 2) {
        motivosPrioritarios.push(...situacionLaboral.slice(0, 1));
    }

    // Si no hay motivos prioritarios, tomar los primeros 2
    if (motivosPrioritarios.length === 0 && reglasFallidas.length > 0) {
        motivosPrioritarios.push(...reglasFallidas.slice(0, 2));
    }

    // Simplificar los mensajes para el comerciante
    const motivosSimplificados = motivosPrioritarios.map(motivo => {
        if (motivo.includes('entidades en situación 2')) {
            const match = motivo.match(/(\d+) entidades/);
            return match ? `tiene ${match[1]} entidades en situación 2` : 'tiene entidades en situación 2';
        }
        if (motivo.includes('entidades con deuda')) {
            const match = motivo.match(/(\d+) entidades/);
            return match ? `tiene deuda con ${match[1]} entidades` : 'tiene deudas con entidades';
        }
        if (motivo.includes('aporte')) {
            return 'no cumple con el mínimo de aportes requerido';
        }
        if (motivo.includes('monotributista')) {
            return 'es monotributista sin empleo registrado';
        }
        if (motivo.includes('referencias comerciales')) {
            return 'no cumple con criterios de referencias comerciales';
        }
        return motivo.split(':')[0] || motivo;
    });

    return `Solicitud rechazada: ${motivosSimplificados.join(', ')}`;
}

/**
 * Construye el motivo para pendientes
 */
private construirMotivoPendienteComerciante(pendientes: string[]): string {
    const motivosPrincipales = pendientes.slice(0, 2).map(pendiente => {
        if (pendiente.includes('entidades en situación 2')) {
            return 'tiene 1 entidad en situación 2';
        }
        if (pendiente.includes('entidades con deuda')) {
            return 'tiene deuda con algunas entidades';
        }
        if (pendiente.includes('referencias comerciales')) {
            return 'tiene referencias comerciales a validar';
        }
        return pendiente.toLowerCase();
    });

    return `Solicitud en revisión: ${motivosPrincipales.join(', ')}`;
}

  /**
   * Construye el mensaje detallado unificado para todas las situaciones
   */
  private construirMensajeDetallado(
    status: "aprobado" | "rechazado" | "pendiente",
    aprobados: string[],
    reglasFallidas: string[],
    pendientes: string[]
  ): string {
    switch (status) {
      case "aprobado":
        return (
          "APROBADO - Cumple con todos los criterios:\n" +
          `✅ Criterios aprobados: ${aprobados.join("; ")}`
        );

      case "pendiente":
        return (
          "PENDIENTE - Requiere revisión manual:\n" +
          (pendientes.length > 0
            ? `⏳ Motivos pendientes: ${pendientes.join("; ")}\n`
            : "") +
          (aprobados.length > 0
            ? `✅ Criterios aprobados: ${aprobados.join("; ")}`
            : "")
        );

      case "rechazado":
        let mensaje =
          "RECHAZADO - No cumple con los criterios:\n" +
          `❌ Motivos de rechazo: ${reglasFallidas.join("; ")}`;

        if (pendientes.length > 0) {
          mensaje += `\n⏳ Motivos pendientes: ${pendientes.join("; ")}`;
        }
        if (aprobados.length > 0) {
          mensaje += `\n✅ Criterios aprobados: ${aprobados.join("; ")}`;
        }

        return mensaje;

      default:
        return "Estado no determinado";
    }
  }

/**
 * Verifica la combinación específica entre:
 * - Referencias comerciales 
 * - Entidades en situación 2
 * - Entidades con deuda activa (sit 3-4-5)
 * Según las reglas de negocio:
 * - Suma total de problemas >= 3: RECHAZADO
 * - Suma total de problemas = 2: PENDIENTE  
 * - Suma total de problemas <= 1: APROBADO
 */
private verificarCombinacionReferenciasDeudas(
    resultadoReferencias: {
        estado: "aprobado" | "pendiente" | "rechazado";
        mensaje?: string;
        referenciasValidas: string[];
        totalValidas: number;
    },
    resultadoDeudas: {
        estado: "aprobado" | "pendiente" | "rechazado";
        mensaje?: string;
        entidades?: number[];
    },
    resultadoSituacion2: {
        estado: "aprobado" | "pendiente" | "rechazado";
        mensaje?: string;
        entidades?: number[];
    }
): {
    estado: "aprobado" | "pendiente" | "rechazado";
    mensaje?: string;
} {
    // 🔥 SOLO considerar referencias VÁLIDAS (las excluidas no cuentan)
        const cantidadReferenciasValidas = resultadoReferencias.totalValidas;
    const cantidadSituacion2 = resultadoSituacion2.entidades?.length || 0;
    const cantidadDeudas = resultadoDeudas.entidades?.length || 0;

    const totalProblemas = cantidadReferenciasValidas + cantidadSituacion2 + cantidadDeudas;

        console.log("=== DEPURACIÓN COMBINACIÓN ===");
    console.log("Referencias válidas:", cantidadReferenciasValidas);
    console.log("Lista referencias:", resultadoReferencias.referenciasValidas);

    // ✅ OBTENER NOMBRES DE ENTIDADES (USANDO SERVICIO EXISTENTE)
    const nombresSituacion2 = resultadoSituacion2.entidades 
        ? this.entidadesService.obtenerNombresEntidades(resultadoSituacion2.entidades)
        : [];
    const nombresDeudas = resultadoDeudas.entidades 
        ? this.entidadesService.obtenerNombresEntidades(resultadoDeudas.entidades)
        : [];

    // ✅ REGLAS COMBINADAS CON NOMBRES
    if (totalProblemas >= 3) {
        return {
            estado: "rechazado",
            mensaje: `Combinación rechazada: ${cantidadReferenciasValidas} referencia(s) comercial(es) + ${cantidadSituacion2} entidad(es) en situación 2 + ${cantidadDeudas} entidad(es) con deuda = RECHAZADO (total: ${totalProblemas}) - Solicitar libres de deuda: ${[...nombresSituacion2, ...nombresDeudas].join(", ")}`
        };
    }

    // ✅ MANTENER LÓGICA ORIGINAL PARA REFERENCIAS + NUEVA LÓGICA COMBINADA
    if (cantidadReferenciasValidas >= 1) {
        if (cantidadReferenciasValidas === 1) {
            return {
                estado: "pendiente",
                mensaje: `1 referencia comercial válida (${resultadoReferencias.referenciasValidas[0]}) - requiere validación manual (solicitar libre de deuda)`,
            };
        } else {
            return {
                estado: "pendiente", 
                mensaje: `${cantidadReferenciasValidas} referencias comerciales válidas (${resultadoReferencias.referenciasValidas.join(", ")}) - requiere validación manual (solicitar libres de deuda)`,
            };
        }
    }

    // ✅ CASOS DE 2 PROBLEMAS (SITUACIÓN 2 + DEUDAS)
    if (totalProblemas === 2) {
        return {
            estado: "pendiente",
            mensaje: `Combinación pendiente: ${cantidadSituacion2} entidad(es) en situación 2 + ${cantidadDeudas} entidad(es) con deuda = PENDIENTE (total: 2) - Solicitar libres de deuda: ${[...nombresSituacion2, ...nombresDeudas].join(", ")}`
        };
    }

    // ✅ CASOS DE 1 PROBLEMA INDIVIDUAL
    if (cantidadSituacion2 === 1) {
        return {
            estado: "pendiente",
            mensaje: `1 entidad en situación 2 (${nombresSituacion2[0]}) - requiere validación manual (solicitar libre de deuda)`
        };
    }

    if (cantidadDeudas === 1) {
        return {
            estado: "pendiente",
            mensaje: `1 entidad con deuda (${nombresDeudas[0]}) - requiere validación manual (solicitar libre de deuda)`
        };
    }

    return { estado: "aprobado" };
}

  /**
   * Verifica si el cliente perdió su empleo recientemente
   * Detecta tanto cambio a monotributo como pérdida de empleo sin reconversión
   */
  private verificarPerdidaEmpleoReciente(variables: NosisVariable[]): {
    perdioEmpleo: boolean;
    seHizoMonotributista: boolean;
    motivo: string;
  } {
    const esEmpleadoActual =
      variables.find((v) => v.Nombre === "VI_Empleado_Es")?.Valor === "Si";
    const esMonotributistaActual =
      variables.find((v) => v.Nombre === "VI_Inscrip_Monotributo_Es")?.Valor ===
      "Si";

    // Si sigue empleado, no perdió el trabajo
    if (esEmpleadoActual) {
      return { perdioEmpleo: false, seHizoMonotributista: false, motivo: "" };
    }

    // Verificar si tenía empleo en los últimos 12 meses
    const variableEmpleado12Meses = variables.find(
      (v) => v.Nombre === "VI_Empleado_12m_Es"
    );
    const fueEmpleado12Meses = variableEmpleado12Meses
      ? variableEmpleado12Meses.Valor === "Si"
      : false;

    // Verificar última fecha de empleo
    const variableUltimaFechaEmpleo = variables.find(
      (v) => v.Nombre === "VI_Empleado_Es_UltFecha"
    );
    const ultimaFechaEmpleo = variableUltimaFechaEmpleo?.Valor;
    const tuvoEmpleoReciente =
      ultimaFechaEmpleo && ultimaFechaEmpleo !== "000000";

    // Verificar aportes recientes (últimos 3 meses)
    const tieneAportesRecientes = this.tieneAportesRecientes(variables);

    // 🔍 DETECCIÓN DE LOS ESCENARIOS
    if ((fueEmpleado12Meses || tuvoEmpleoReciente) && !tieneAportesRecientes) {
      if (esMonotributistaActual) {
        // ESCENARIO 2: Dejó empleo y se hizo monotributista
        return {
          perdioEmpleo: true,
          seHizoMonotributista: true,
          motivo:
            "Dejó empleo registrado y se convirtió en monotributista sin aportes recientes",
        };
      } else {
        // ESCENARIO 1: Perdió empleo y no se reconvirtió
        return {
          perdioEmpleo: true,
          seHizoMonotributista: false,
          motivo:
            "Perdió empleo registrado sin reconversión laboral y sin aportes recientes",
        };
      }
    }

    return { perdioEmpleo: false, seHizoMonotributista: false, motivo: "" };
  }

  /**
   * Verifica si el monotributista tiene suficiente antigüedad
   */
  private verificarAntiguedadMonotributo(variables: NosisVariable[]): boolean {
    // Buscar fecha de inicio de monotributo
    const fechaInicioMonotributo = variables.find(
      (v) => v.Nombre === "VI_Inscrip_Monotributo_Fecha"
    )?.Valor;

    if (!fechaInicioMonotributo) {
      return false; // No hay fecha de inicio registrada
    }

    const fechaInicio = new Date(fechaInicioMonotributo);
    const fechaActual = new Date();

    // Calcular diferencia en meses
    const diffMeses =
      (fechaActual.getFullYear() - fechaInicio.getFullYear()) * 12 +
      (fechaActual.getMonth() - fechaInicio.getMonth());

    // Requerir al menos 6 meses de antigüedad como monotributista
    return diffMeses >= 6;
  }

  /**
   * Calcula el total de aportes del cliente
   * @param variables - Lista de variables de Nosis
   * @returns Número total de aportes
   */
  private calcularTotalAportes(variables: NosisVariable[]): number {
    const pagos = parseInt(
      variables.find((v) => v.Nombre === "AP_12m_Empleado_Pagos_Cant")?.Valor ||
        "0"
    );
    const impagos = parseInt(
      variables.find((v) => v.Nombre === "AP_12m_Empleado_Impagos_Cant")
        ?.Valor || "0"
    );
    const parciales = parseInt(
      variables.find((v) => v.Nombre === "AP_12m_Empleado_PagoParcial_Cant")
        ?.Valor || "0"
    );

    return pagos + impagos + parciales;
  }

  /**
   * Verifica si el cliente cambió de empleado a monotributista sin aportes recientes
   * @param variables - Lista de variables de Nosis
   * @returns Boolean indicando si cambió a monotributista sin empleo reciente
   */
  private verificarCambioMonotributo(variables: NosisVariable[]): boolean {
    const esMonotributista =
      variables.find((v) => v.Nombre === "VI_Inscrip_Monotributo_Es")?.Valor ===
      "Si";

    if (!esMonotributista) {
      return false;
    }

    // Verificar si NO es empleado actualmente
    const esEmpleadoActual =
      variables.find((v) => v.Nombre === "VI_Empleado_Es")?.Valor === "Si";
    if (esEmpleadoActual) {
      return false; // Sigue siendo empleado, no hay cambio
    }

    // Verificar si tenía empleo en los últimos 12 meses pero ya no
    const variableEmpleado12Meses = variables.find(
      (v) => v.Nombre === "VI_Empleado_12m_Es"
    );
    const fueEmpleado12Meses = variableEmpleado12Meses
      ? variableEmpleado12Meses.Valor === "Si"
      : false;

    // Obtener la última fecha de empleo registrada
    const variableUltimaFechaEmpleo = variables.find(
      (v) => v.Nombre === "VI_Empleado_Es_UltFecha"
    );
    const tieneUltimaFechaEmpleo =
      !!variableUltimaFechaEmpleo?.Valor &&
      variableUltimaFechaEmpleo.Valor !== "000000";

    // Verificar aportes en los últimos 3 meses
    const tieneAportesRecientes = this.tieneAportesRecientes(variables);

    // Si fue empleado pero ya no lo es, y no tiene aportes recientes, detectamos el cambio
    return (
      (fueEmpleado12Meses || tieneUltimaFechaEmpleo) && !tieneAportesRecientes
    );
  }

  /**
   * Verifica si el cliente tiene aportes en los últimos 3 meses
   * @param variables - Lista de variables de Nosis
   * @returns Boolean indicando si tiene aportes recientes
   */
  private tieneAportesRecientes(variables: NosisVariable[]): boolean {
    // Obtener la fecha más reciente de aportes
    const fechaAporteReciente = variables.find(
      (v) => v.Nombre === "AP_12m_Empleado_FecAntigua"
    )?.Valor;

    if (!fechaAporteReciente || fechaAporteReciente === "000000") {
      return false;
    }

    // Convertir fecha de aporte (formato YYYYMM) a Date
    const año = parseInt(fechaAporteReciente.substring(0, 4));
    const mes = parseInt(fechaAporteReciente.substring(4, 6)) - 1;
    const fechaAporte = new Date(año, mes, 1);

    // Calcular fecha límite (últimos 3 meses)
    const tresMesesAtras = new Date();
    tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);

    // Verificar si el aporte es de los últimos 3 meses
    return fechaAporte >= tresMesesAtras;
  }

  /**
   * Verifica las entidades en situación 2 según los nuevos criterios
   * Considera los 2 períodos MÁS RECIENTES disponibles en los datos de Nosis
   * - 1 entidad en situación 2 en últimos 2 períodos disponibles → Pendiente
   * - 2+ entidades en situación 2 en últimos 2 períodos disponibles → Rechazo
   */
  private verificarEntidadesSituacion2(variables: NosisVariable[]): {
    estado: "aprobado" | "pendiente" | "rechazado";
    mensaje?: string;
    entidades?: number[];
    datosDesactualizados?: boolean;
  } {
    const detalleDeudas = variables.find(
      (v) => v.Nombre === "CI_24m_Detalle"
    )?.Valor;

    if (!detalleDeudas) {
      return { estado: "aprobado" };
    }

    // Verificar actualización de datos
    const datosDesactualizados = this.verificarActualizacionDatos(variables);

    const registros = this.parsearDetalleDeudas(detalleDeudas);

    // Agrupar por entidad y encontrar el registro más reciente de CADA ENTIDAD
    const entidadesMap = new Map<
      string,
      { periodo: number; situacion: number; monto: number }
    >();

    for (const registro of registros) {
      const entidad = registro.entidad;

      // Para cada entidad, mantener solo el registro MÁS RECIENTE
      if (
        !entidadesMap.has(entidad) ||
        registro.periodo > entidadesMap.get(entidad)!.periodo
      ) {
        entidadesMap.set(entidad, registro);
      }
    }

    const entidadesSituacion2 = new Set<number>();

    for (const [entidad, registroMasReciente] of entidadesMap.entries()) {
      const esSituacion2 = registroMasReciente.situacion === 2;

      if (esSituacion2) {
        const codigoEntidad = parseInt(entidad);
        if (!isNaN(codigoEntidad)) {
          entidadesSituacion2.add(codigoEntidad);
          console.log(
            `⚠️ Entidad ${entidad} en SITUACIÓN 2 (período: ${registroMasReciente.periodo})`
          );
        }
      }
    }

    const cantidadEntidades = entidadesSituacion2.size;
    const entidadesArray = Array.from(entidadesSituacion2);
    const nombresEntidades = this.entidadesService.obtenerNombresEntidades(entidadesArray);

    let mensaje = "";

    // Mostrar la cantidad de entidades
    if (cantidadEntidades >= 3) {
        mensaje = `Tiene ${cantidadEntidades} entidades en situación 2: ${nombresEntidades.join(", ")}`;
    } else if (cantidadEntidades >= 1) {
        mensaje = `Tiene ${cantidadEntidades} entidades en situación 2: ${nombresEntidades.join(", ")}`;
    }

    if (cantidadEntidades >= 3) {
      return {
        estado: "rechazado",
        mensaje,
        entidades: entidadesArray,
        datosDesactualizados,
      };
    } else if (cantidadEntidades >= 1) {
      return {
        estado: "pendiente",
        mensaje,
        entidades: entidadesArray,
        datosDesactualizados,
      };
    }

    return { estado: "aprobado" };
  }

  // Agrega este método en la clase VerifyDataNosisUseCase

  /**
   * Verifica si el cliente es empleado doméstico, no tiene deudas y tiene 12 meses de aportes completos
   * @param variables - Lista de variables de Nosis
   * @returns Objeto con estado y mensaje de verificación
   */
  private verificarEmpleadoDomesticoSinDeudas(variables: NosisVariable[]): {
  esEmpleadoDomestico: boolean;
  estado: "aprobado" | "rechazado" | "pendiente";
  mensaje: string;
} {
  const esEmpleadoDomestico =
    variables.find((v) => v.Nombre === "VI_EmpleadoDomestico_Es")?.Valor ===
    "Si";

  if (!esEmpleadoDomestico) {
    return {
      esEmpleadoDomestico: false,
      estado: "aprobado", // No aplica la regla especial
      mensaje: "",
    };
  }

  // Verificar deudas en situación 3-4-5
  const verificacionDeudas = this.verificarDeudaEntidades(variables);
  const cantidadDeudas = verificacionDeudas.entidades?.length || 0;

  // Verificar referencias comerciales
  const resultadoReferencias = this.verificarReferenciasComerciales(variables);
  const cantidadReferencias = resultadoReferencias.totalValidas;

  // Verificar que tenga 12 meses de aportes completos
  const tiene12Aportes = this.verificar12MesesAportesCompletos(variables);

  // Calcular total de "problemas" (deudas + referencias)
  const totalProblemas = cantidadDeudas + cantidadReferencias;

  // CONDICIONES SEGÚN LOS NUEVOS REQUISITOS:
  if (!tiene12Aportes) {
    return {
      esEmpleadoDomestico: true,
      estado: "pendiente",
      mensaje: "Empleado doméstico PENDIENTE - no tiene 12 meses de aportes completos",
    };
  }

  // Tiene 12 meses de aportes
  if (totalProblemas === 0) {
    return {
      esEmpleadoDomestico: true,
      estado: "aprobado",
      mensaje: "APROBADO - Empleado doméstico sin deudas ni referencias comerciales y con 12 meses de aportes completos",
    };
  } else if (totalProblemas === 1) {
    let motivo = "PENDIENTE - Empleado doméstico con 12 meses de aportes completos";
    if (cantidadDeudas === 1) {
      motivo += " y 1 deuda";
    }
    if (cantidadReferencias === 1) {
      motivo += cantidadDeudas === 1 ? " y 1 referencia comercial" : " y 1 referencia comercial";
    }
    return {
      esEmpleadoDomestico: true,
      estado: "pendiente",
      mensaje: motivo,
    };
  } else {
    // 2 o más problemas (deudas + referencias)
    return {
      esEmpleadoDomestico: true,
      estado: "rechazado",
      mensaje: `RECHAZADO - Empleado doméstico con 12 meses de aportes completos, ${cantidadDeudas} deudas y ${cantidadReferencias} referencias comerciales`,
    };
  }
}

  /**
   * Verifica si el cliente tiene 12 meses de aportes completos
   * @param variables - Lista de variables de Nosis
   * @returns Boolean indicando si tiene 12 meses de aportes completos
   */
  private verificar12MesesAportesCompletos(
    variables: NosisVariable[]
  ): boolean {
    // Para los rubros especiales (construcción, doméstico, contratación)
    // se consideran TODOS los tipos de aportes: pagos, impagos y parciales
    const aportesPagos = parseInt(
      variables.find((v) => v.Nombre === "AP_12m_Empleado_Pagos_Cant")?.Valor ||
        "0"
    );
    const aportesImpagos = parseInt(
      variables.find((v) => v.Nombre === "AP_12m_Empleado_Impagos_Cant")
        ?.Valor || "0"
    );
    const aportesParciales = parseInt(
      variables.find((v) => v.Nombre === "AP_12m_Empleado_PagoParcial_Cant")
        ?.Valor || "0"
    );

    const totalAportes = aportesPagos + aportesImpagos + aportesParciales;

    return totalAportes >= 12;
  }

  /**
   * Convierte un período en formato AAAAMM a Date de manera más robusta
   */
  private convertirPeriodoAFecha(periodo: number): Date {
    try {
      const periodoStr = periodo.toString().padStart(6, "0");

      if (periodoStr.length !== 6) {
        console.warn("❌ Formato de período inválido:", periodo);
        return new Date(0); // Fecha muy antigua
      }

      const año = parseInt(periodoStr.substring(0, 4));
      const mes = parseInt(periodoStr.substring(4, 6)) - 1; // Meses en Date son 0-based

      if (isNaN(año) || isNaN(mes) || mes < 0 || mes > 11) {
        console.warn(
          "❌ Período con valores inválidos:",
          periodo,
          "Año:",
          año,
          "Mes:",
          mes
        );
        return new Date(0); // Fecha muy antigua
      }

      const fecha = new Date(año, mes, 1);
      return fecha;
    } catch (error) {
      console.error(
        "❌ Error en convertirPeriodoAFecha:",
        error,
        "Periodo:",
        periodo
      );
      return new Date(0); // Fecha muy antigua
    }
  }

  /**
   * Verifica el estado de deudas en entidades financieras
   * SOLO considera deuda si en el período MÁS RECIENTE la situación es 3, 4 o 5
   */
private verificarDeudaEntidades(variables: NosisVariable[]): {
    estado: "aprobado" | "pendiente" | "rechazado";
    mensaje?: string;
    entidades?: number[];
} {
    const detalleDeudas = variables.find(
        (v) => v.Nombre === "CI_24m_Detalle"
    )?.Valor;
    if (!detalleDeudas) return { estado: "aprobado" };

    const registros = this.parsearDetalleDeudas(detalleDeudas);
    const entidadesConDeuda = new Set<number>();

    // Por cada entidad, buscar el ÚLTIMO registro disponible
    const entidadesMap = new Map<
        string, 
        { 
            ultimoPeriodo: number; 
            ultimaSituacion: number;
            tieneDeudaActiva: boolean;
            periodoDeuda: number;
        }
    >();

    // Primero: encontrar el último registro de CADA entidad
    for (const registro of registros) {
        const entidad = registro.entidad;
        const codigoEntidad = parseInt(entidad);
        
        if (!entidadesMap.has(entidad) || 
            registro.periodo > entidadesMap.get(entidad)!.ultimoPeriodo) {
            
            entidadesMap.set(entidad, {
                ultimoPeriodo: registro.periodo,
                ultimaSituacion: registro.situacion,
                tieneDeudaActiva: registro.situacion >= 3 && registro.situacion <= 5,
                periodoDeuda: registro.situacion >= 3 && registro.situacion <= 5 ? registro.periodo : 0
            });
        }
    }

    // Considerar que si el último estado conocido es 3-4-5, es deuda ACTIVA
    // aunque no sea el período global más reciente
    for (const [entidad, datos] of entidadesMap.entries()) {
        if (datos.tieneDeudaActiva) {
            const codigoEntidad = parseInt(entidad);
            entidadesConDeuda.add(codigoEntidad);
            console.log(`❌ ENTIDAD ${entidad} con DEUDA ACTIVA en período ${datos.periodoDeuda} (situación ${datos.ultimaSituacion})`);
        }
    }

    const cantidad = entidadesConDeuda.size;
    const entidadesArray = Array.from(entidadesConDeuda);
    const nombresEntidades = this.entidadesService.obtenerNombresEntidades(entidadesArray);

    let mensaje = "";

    if (cantidad >= 3) {
        mensaje = `Tiene deuda ACTIVA en 3 o más entidades con situación 3, 4 o 5: ${nombresEntidades.join(", ")}`;
        return { estado: "rechazado", mensaje, entidades: entidadesArray };
    } else if (cantidad >= 1) {
        mensaje = `Tiene deuda ACTIVA en ${cantidad} entidades con situación 3, 4 o 5: ${nombresEntidades.join(", ")}`;
        return { estado: "pendiente", mensaje, entidades: entidadesArray };
    }

    return { estado: "aprobado" };
}

  /**
   * Verifica si los datos de Nosis están actualizados
   * Compara la fecha de actualización más reciente con la fecha actual
   */
  private verificarActualizacionDatos(variables: NosisVariable[]): boolean {
    try {
      // Buscar la fecha de actualización más reciente en las variables
      const fechaActualizacionBCRA = variables.find(
        (v) => v.Nombre === "FEX_BCRA_FecAct"
      )?.Valor;

      if (!fechaActualizacionBCRA) return true; // Si no hay fecha, asumir desactualizado

      const fechaActual = new Date();
      const fechaActualizacion = new Date(fechaActualizacionBCRA);

      // Calcular diferencia en meses
      const diffMeses =
        (fechaActual.getFullYear() - fechaActualizacion.getFullYear()) * 12 +
        (fechaActual.getMonth() - fechaActualizacion.getMonth());

      // Considerar desactualizado si tiene más de 1 mes de antigüedad
      const desactualizado = diffMeses > 1;

      return desactualizado;
    } catch (error) {
      console.error("Error verificando actualización de datos:", error);
      return true; // En caso de error, asumir desactualizado
    }
  }
  /**
   * Mejorar el parsing de detalle de deudas con mejor manejo de errores
   */
  private parsearDetalleDeudas(detalleDeudas: string): Array<{
    entidad: string;
    periodo: number;
    situacion: number;
    monto: number;
  }> {
    const resultados: Array<{
      entidad: string;
      periodo: number;
      situacion: number;
      monto: number;
    }> = [];

    try {
      const regex = /<D>(.*?)<\/D>/g;
      let match;

      while ((match = regex.exec(detalleDeudas)) !== null) {
        const partes = match[1].split("|").map((part) => part.trim());

        if (partes.length >= 4) {
          const codigoEntidad = partes[0];

          // Validar que el código de entidad sea numérico
          if (codigoEntidad && /^\d+$/.test(codigoEntidad)) {
            resultados.push({
              entidad: codigoEntidad,
              periodo: parseInt(partes[1]) || 0,
              situacion: parseInt(partes[2]) || 0,
              monto: parseInt(partes[3]) || 0,
            });
          } else {
            console.warn(
              "❌ Código de entidad inválido (no numérico):",
              codigoEntidad
            );
          }
        } else {
          console.warn("❌ Registro con formato incorrecto:", partes);
        }
      }
    } catch (error) {
      console.error("❌ Error en parsearDetalleDeudas:", error);
    }

    return resultados;
  }
  /**
   * Verifica si el cliente tiene empleo registrado estable
   * @param variables - Lista de variables de Nosis
   * @returns Boolean indicando si tiene empleo registrado
   */
  private tieneEmpleoRegistrado(variables: NosisVariable[]): boolean {
    const esEmpleado =
      variables.find((v) => v.Nombre === "VI_Empleado_Es")?.Valor === "Si";
    const pagos = parseInt(
      variables.find((v) => v.Nombre === "AP_12m_Empleado_Pagos_Cant")?.Valor ||
        "0"
    );

    // Considerar empleo estable si está empleado actualmente O tiene al menos 3 pagos regulares
    return esEmpleado || pagos >= 3;
  }
  /**
   * Verifica la situación laboral del cliente
   * @param variables - Lista de variables de Nosis
   * @returns Boolean indicando si tiene situación laboral válida
   */
  private verificarSituacionLaboral(variables: NosisVariable[]): boolean {
    const esEmpleado =
      variables.find((v) => v.Nombre === "VI_Empleado_Es")?.Valor === "Si";
    const esEmpleador =
      variables.find((v) => v.Nombre === "VI_Empleador_Es")?.Valor === "Si";
    const esJubilado =
      variables.find((v) => v.Nombre === "VI_Jubilado_Es")?.Valor === "Si";
    const esPensionado =
      variables.find((v) => v.Nombre === "VI_Pensionado_Es")?.Valor === "Si";

    const aportes =
      variables.find((v) => v.Nombre === "AP_12m_Empleado_Pagos_Cant")?.Valor ||
      "0";
    const totalAportes = this.calcularTotalAportes(variables);

    // ✅ Considerar que tiene situación laboral si:
    // - Es empleado, empleador, jubilado o pensionado
    // - O tiene aportes registrados (aunque no esté activo actualmente)
    return (
      esEmpleado ||
      esEmpleador ||
      esJubilado ||
      esPensionado ||
      totalAportes > 0
    );
  }
  /**
   * Extrae y estructura datos personales de las variables de Nosis
   * @param variables - Lista de variables de Nosis
   * @returns Objeto PersonalData con información estructurada
   */
  private extraerDatosPersonales(variables: NosisVariable[]): PersonalData {
    const getValor = (nombre: string): string | undefined => {
      const variable = variables.find((v) => v.Nombre === nombre);
      return variable?.Valor;
    };

    // Nombre completo
    const nombre = getValor("VI_Nombre");
    const apellido = getValor("VI_Apellido");

    // Documentación
    const dni = getValor("VI_DNI");
    const cuil = getValor("VI_Identificacion");
    const fechaNacimiento = getValor("VI_FecNacimiento");
    const sexo = getValor("VI_Sexo");
    const nacionalidad = getValor("VI_Nacionalidad"); // Variable hipotética
    const estadoCivil = getValor("VI_EstadoCivil"); // Variable hipotética
    const tipoDocumento = "DNI"; // En Nosis generalmente es DNI

    // Domicilio
    const calle = getValor("VI_DomAF_Calle");
    const numero = getValor("VI_DomAF_Nro");
    const localidad = getValor("VI_DomAF_Loc");
    const codigoPostal = getValor("VI_DomAF_CP");
    const provincia = getValor("VI_DomAF_Prov");

    // Teléfonos
    const telefonos = [];
    for (let i = 1; i <= 3; i++) {
      const codArea = getValor(`VI_Tel${i}_CodArea`);
      const numeroTel = getValor(`VI_Tel${i}_Nro`);
      if (codArea || numeroTel) {
        telefonos.push({
          codArea,
          numero: numeroTel,
          tipo: i === 1 ? "Principal" : `Alternativo ${i - 1}`,
        });
      }
    }

    // Datos laborales
    const situacionLaboral =
      getValor("VI_Empleado_Es") === "Si"
        ? "Empleado"
        : getValor("VI_Empleador_Es") === "Si"
        ? "Empleador"
        : getValor("VI_Jubilado_Es") === "Si"
        ? "Jubilado"
        : getValor("VI_Pensionado_Es") === "Si"
        ? "Pensionado"
        : "Otro";

    const esMonotributista = getValor("VI_Inscrip_Monotributo_Es");
    const categoriaMonotributo = getValor("VI_Inscrip_Monotributo");
    const actividadMonotributo = getValor("VI_Inscrip_Monotributo_Act");

    // Obtener datos del empleador
    const razonSocialEmpleador = getValor("VI_Empleador_RZ");
    const cuitEmpleador = getValor("VI_Empleador_CUIT");
    const telCodAreaEmpleador = getValor("VI_Empleador_TelCodArea");
    const telNroEmpleador = getValor("VI_Empleador_TelNro");
    const telefonoEmpleador =
      telCodAreaEmpleador && telNroEmpleador
        ? `${telCodAreaEmpleador}${telNroEmpleador}`
        : undefined;

    // Domicilio del empleador
    const calleEmpleador = getValor("VI_Empleador_Dom_Calle");
    const numeroEmpleador = getValor("VI_Empleador_Dom_Nro");
    const localidadEmpleador = getValor("VI_Empleador_Dom_Loc");
    const codigoPostalEmpleador = getValor("VI_Empleador_Dom_CP");
    const provinciaEmpleador = getValor("VI_Empleador_Dom_Prov");
    const codigoRubroEmpleador = getValor("VI_Empleador_Act01_Cod");
    let rubroEmpleador = null;

    if (codigoRubroEmpleador) {
      // Usar el servicio de rubros para obtener la descripción corta
      rubroEmpleador =
        this.rubrosLaboralesService.obtenerDescripcionCorta(
          codigoRubroEmpleador
        ) || codigoRubroEmpleador;
    }

    // Construir objeto empleador solo si existe razón social
    const empleador = razonSocialEmpleador
      ? {
          razonSocial: razonSocialEmpleador,
          cuit: cuitEmpleador,
          telefono: telefonoEmpleador,
          domicilio: {
            calle: calleEmpleador,
            numero: numeroEmpleador,
            localidad: localidadEmpleador,
            codigoPostal: codigoPostalEmpleador,
            provincia: provinciaEmpleador,
          },
          rubro: rubroEmpleador,
        }
      : undefined;

    // Referencias personales
    const referenciasPersonales = [];
    for (let i = 1; i <= 2; i++) {
      const nombreRef = getValor(`VI_Ref${i}_Nombre`);
      const telefonoRef = getValor(`VI_Ref${i}_Telefono`);
      const relacionRef = getValor(`VI_Ref${i}_Relacion`);

      if (nombreRef || telefonoRef || relacionRef) {
        referenciasPersonales.push({
          nombre: nombreRef,
          telefono: telefonoRef,
          relacion: relacionRef,
        });
      }
    }

    return {
      nombreCompleto: { nombre, apellido },
      documentacion: {
        tipoDocumento,
        dni,
        cuil,
        fechaNacimiento,
        sexo,
        nacionalidad,
        estadoCivil,
      },
      domicilio: { calle, numero, localidad, codigoPostal, provincia },
      telefonos,
      datosLaborales: {
        situacionLaboral,
        empleador,
        monotributo: {
          esMonotributista,
          categoria: categoriaMonotributo,
          actividad: actividadMonotributo,
        },
      },
      referenciasPersonales,
    };
  }
}
