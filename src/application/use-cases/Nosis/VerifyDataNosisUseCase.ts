import {
  NosisResponse,
  NosisVariable,
} from "../../../domain/entities/NosisData";
import { EntidadesService } from "../../../infrastructure/entidadesBancarias/EntidadesService";

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
  /**
   * Constructor del caso de uso de verificación Nosis
   * @param rules - Reglas personalizadas de validación (opcional)
   */
  constructor(rules?: RuleConfig[], entidadesService?: EntidadesService) {
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
    ];

    // Obtener cantidad total de referencias
    const cantidadRef = parseInt(
      variables.find((v) => v.Nombre === "RC_12m_Cant")?.Valor || "0"
    );

    // Obtener fuentes de referencias
    const fuentesRef = variables.find(
      (v) => v.Nombre === "RC_12m_Fuente"
    )?.Valor;

    let referenciasValidas: string[] = [];
    let referenciasInvalidas: string[] = [];

    if (fuentesRef) {
      // Separar las fuentes (pueden venir separadas por | o ;)
      const fuentes = fuentesRef
        .split(/[|;]/)
        .map((f) => f.trim())
        .filter((f) => f);

      // Clasificar las fuentes
      fuentes.forEach((fuente) => {
        if (
          EXCLUIR_FUENTES.some((excluida) =>
            fuente.toLowerCase().includes(excluida.toLowerCase())
          )
        ) {
          referenciasInvalidas.push(fuente);
        } else {
          referenciasValidas.push(fuente);
        }
      });
    }

    const totalValidas = referenciasValidas.length;
    const totalInvalidas = referenciasInvalidas.length;

    // Aplicar reglas de negocio
    if (totalValidas === 0) {
      // No tiene referencias válidas - APROBADO
      let mensaje = "No tiene referencias comerciales válidas";
      if (totalInvalidas > 0) {
        mensaje += `. Referencias no consideradas: ${referenciasInvalidas.join(
          ", "
        )}`;
      }

      return {
        estado: "aprobado",
        mensaje,
        referenciasValidas,
        referenciasInvalidas,
        totalValidas,
        totalInvalidas,
      };
    } else if (totalValidas >= 1 && totalValidas <= 2) {
      // 1-2 referencias válidas - PENDIENTE
      let mensaje = `Tiene ${totalValidas} referencia(s) comercial(es) válida(s): ${referenciasValidas.join(
        ", "
      )}`;
      if (totalInvalidas > 0) {
        mensaje += `. Referencias no consideradas: ${referenciasInvalidas.join(
          ", "
        )}`;
      }

      return {
        estado: "pendiente",
        mensaje,
        referenciasValidas,
        referenciasInvalidas,
        totalValidas,
        totalInvalidas,
      };
    } else {
      // 3+ referencias válidas - RECHAZADO
      let mensaje = `Tiene ${totalValidas} referencias comerciales válidas (máximo permitido: 2): ${referenciasValidas.join(
        ", "
      )}`;
      if (totalInvalidas > 0) {
        mensaje += `. Referencias no consideradas: ${referenciasInvalidas.join(
          ", "
        )}`;
      }

      return {
        estado: "rechazado",
        mensaje,
        referenciasValidas,
        referenciasInvalidas,
        totalValidas,
        totalInvalidas,
      };
    }
  }

  /**
   * Ejecuta el proceso completo de verificación de datos Nosis
   * @param nosisData - Respuesta cruda del servicio Nosis
   * @returns Promise<VerificationResult> - Resultado estructurado de la verificación
   */
  async execute(nosisData: NosisResponse): Promise<VerificationResult> {
    const variables = nosisData.Contenido.Datos.Variables.Variable;
    const reglasFallidas: string[] = [];
    const pendientes: string[] = [];
    const aprobados: string[] = [];
    let motivoComerciante: string = "";

    // Buscar el score para incluirlo en el resultado
    const scoreVar = variables.find((v) => v.Nombre === "SCO_Vig");
    const score = scoreVar ? parseInt(scoreVar.Valor) : 0;
    // Evaluar si es monotributista
    const esMonotributista =
      variables.find((v) => v.Nombre === "VI_Inscrip_Monotributo_Es")?.Valor ===
      "Si";

    // Evaluar reglas estándar
    for (const regla of this.rules) {
      const variable = variables.find((v) => v.Nombre === regla.variable);
      if (!this.evaluarRegla(variable, regla)) {
        reglasFallidas.push(regla.mensaje);
      }
    }

    // Aportes
    const totalAportes = this.calcularTotalAportes(variables);
    const pagosRecientes = this.tieneAportesRecientes(variables);
    if (totalAportes < this.MINIMO_APORTES) {
      reglasFallidas.push(
        `Cliente no cumple con el mínimo de aportes registrados en los últimos 12 meses (${totalAportes} de ${this.MINIMO_APORTES} requeridos)`
      );
      if (!motivoComerciante && !esMonotributista) {
        motivoComerciante =
          "Solicitud rechazada: no cumple con el mínimo de aportes requerido";
      }
    } else if (!pagosRecientes && esMonotributista) {
      // Para monotributistas, destacar la falta de aportes recientes
      aprobados.push(
        `Cumple con el mínimo de aportes requerido (${totalAportes} aportes históricos)`
      );
    } else {
      aprobados.push(
        `Cumple con el mínimo de aportes requerido (${totalAportes} aportes)`
      );
    }

    // ===== VERIFICACIONES QUE PUEDEN CAUSAR RECHAZO INMEDIATO =====

    // 1. Entidades en situación 2
    const resultadoSituacion2 = this.verificarEntidadesSituacion2(variables);
    if (resultadoSituacion2.estado === "rechazado") {
      reglasFallidas.push(resultadoSituacion2.mensaje!);
    } else if (resultadoSituacion2.estado === "pendiente") {
      pendientes.push(resultadoSituacion2.mensaje!);
    } else {
      aprobados.push("No tiene entidades en situación 2");
    }

    // 2. Deudas en entidades (situación 3-4-5)
    const tieneDeudaEntidades = this.verificarDeudaEntidades(variables);
    if (tieneDeudaEntidades.estado === "rechazado") {
      reglasFallidas.push(tieneDeudaEntidades.mensaje!);
    } else if (tieneDeudaEntidades.estado === "pendiente") {
      pendientes.push(tieneDeudaEntidades.mensaje!);
    } else {
      aprobados.push("No tiene deudas en entidades con situación 3-4-5");
    }

    // 3. Referencias comerciales
    const resultadoReferencias =
      this.verificarReferenciasComerciales(variables);
    if (resultadoReferencias.estado === "rechazado") {
      reglasFallidas.push(resultadoReferencias.mensaje!);
    } else if (resultadoReferencias.estado === "pendiente") {
      pendientes.push(resultadoReferencias.mensaje!);
    } else {
      aprobados.push("Cumple con criterios de referencias comerciales");
    }

    // 4. Monotributistas sin empleo registrado (RECHAZO INMEDIATO)
    
    if (esMonotributista) {
      const tieneEmpleoRegistrado = this.tieneEmpleoRegistrado(variables);
      const cambioMonotributo = this.verificarCambioMonotributo(variables);
      const tieneAportesRecientes = this.tieneAportesRecientes(variables);

      if (!tieneEmpleoRegistrado) {
        if (cambioMonotributo) {
          // Mensaje claro y específico para el analista
          reglasFallidas.push(
            "Cliente es monotributista y cambió de empleo registrado a monotributo sin aportes recientes"
          );

          // Mensaje para el comerciante (más genérico pero informativo)
          if (!motivoComerciante) {
            motivoComerciante =
              "Solicitud rechazada: Cliente es monotributista sin empleo registrado estable";
          }
        } else {
          reglasFallidas.push(
            "Cliente es monotributista sin empleo registrado estable"
          );
          if (!motivoComerciante) {
            motivoComerciante =
              "Solicitud rechazada: Cliente es monotributista sin empleo registrado estable";
          }
        }
      } else {
        aprobados.push("Monotributista con empleo registrado validado");
      }
    } else {
      aprobados.push("No es monotributista");
    }

    // 5. Situación laboral (solo para no monotributistas)
    if (!esMonotributista) {
      const tieneLaboral = this.verificarSituacionLaboral(variables);
      if (!tieneLaboral) {
        reglasFallidas.push("Cliente no tiene situación laboral registrada");
      } else {
        aprobados.push("Situación laboral validada");
      }
    }

    // 6. Tarjetas Crediguía
    if (this.tieneTarjetaCrediguia(variables)) {
      reglasFallidas.push("Cliente tiene tarjeta Crediguía activa");
    } else {
      aprobados.push("No tiene tarjetas Crediguía activas");
    }

    // Extraer datos personales
    const personalData = this.extraerDatosPersonales(variables);

    // ===== DETERMINAR ESTADO FINAL CON PRIORIDAD CORRECTA =====
    let status: "aprobado" | "rechazado" | "pendiente" = "aprobado";

    // PRIORIDAD: Cualquier motivo de rechazo → RECHAZADO
    if (reglasFallidas.length > 0) {
      status = "rechazado";

      // Mensaje genérico para comerciante si no se definió uno específico
      if (!motivoComerciante) {
        motivoComerciante =
          "Solicitud rechazada: no cumple con los requisitos establecidos";
      }
    }
    // Si no hay rechazos, pero hay pendientes → PENDIENTE
    else if (pendientes.length > 0) {
      status = "pendiente";
      motivoComerciante =
        "Solicitud en revisión: requiere verificación adicional";
    }
    // Solo si no hay rechazos ni pendientes → APROBADO
    else {
      status = "aprobado";
      motivoComerciante = "Solicitud aprobada";
    }

    const approved = status === "aprobado";

    // Construir mensaje detallado con TODOS los motivos
    let motivo: string;
    if (status === "aprobado") {
      motivo =
        "APROBADO - Cumple con todos los criterios:\n" +
        `✅ Criterios aprobados: ${aprobados.join("; ")}`;
    } else if (status === "pendiente") {
      motivo =
        "PENDIENTE - Requiere revisión manual:\n" +
        `⏳ Motivos pendientes: ${pendientes.join("; ")}\n` +
        `✅ Criterios aprobados: ${aprobados.join("; ")}`;
    } else {
      motivo =
        "RECHAZADO - No cumple con los criterios:\n" +
        `❌ Motivos de rechazo: ${reglasFallidas.join("; ")}\n`;

      if (pendientes.length > 0) {
        motivo += `⏳ Motivos pendientes: ${pendientes.join("; ")}\n`;
      }
      if (aprobados.length > 0) {
        motivo += `✅ Criterios aprobados: ${aprobados.join("; ")}`;
      }
    }

    return {
      status,
      approved,
      score,
      motivo,
      motivoComerciante,
      reglasFallidas: reglasFallidas,
      pendientes: pendientes,
      aprobados: aprobados,
      personalData,
      entidadesSituacion2: resultadoSituacion2.entidades,
      entidadesDeuda: tieneDeudaEntidades.entidades,
      referenciasComerciales: {
        referenciasValidas: resultadoReferencias.referenciasValidas,
        referenciasInvalidas: resultadoReferencias.referenciasInvalidas,
        totalValidas: resultadoReferencias.totalValidas,
        totalInvalidas: resultadoReferencias.totalInvalidas,
      },
    };
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
 * - 1 entidad en situación 2 en últimos 2 meses → Pendiente
 * - 2+ entidades en situación 2 en últimos 2 meses → Rechazo
 */
private verificarEntidadesSituacion2(variables: NosisVariable[]): {
  estado: "aprobado" | "pendiente" | "rechazado";
  mensaje?: string;
  entidades?: number[];
} {
  const detalleDeudas = variables.find(
    (v) => v.Nombre === "CI_24m_Detalle"
  )?.Valor;
  
  if (!detalleDeudas) {
    return { estado: "aprobado" };
  }

  const registros = this.parsearDetalleDeudas(detalleDeudas);

  // Obtener fecha actual para cálculo
  const fechaActual = new Date();
  
  // Calcular fecha límite (últimos 2 meses completos)
  // Usamos el primer día del mes actual y retrocedemos 2 meses
  const primerDiaMesActual = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
  const dosMesesAtras = new Date(primerDiaMesActual);
  dosMesesAtras.setMonth(dosMesesAtras.getMonth() - 2);
  

  const entidadesSituacion2 = new Set<number>();

  for (const registro of registros) {
    // Filtrar por situación 2 y que sea de los últimos 2 meses completos
    const fechaRegistro = this.convertirPeriodoAFecha(registro.periodo);
    const esSituacion2 = registro.situacion === 2;
    const esReciente = fechaRegistro >= dosMesesAtras;
    

    if (esSituacion2 && esReciente) {
      const codigoEntidad = parseInt(registro.entidad);
      if (!isNaN(codigoEntidad)) {
        entidadesSituacion2.add(codigoEntidad);
      }
    }
  }

  const cantidadEntidades = entidadesSituacion2.size;
  const entidadesArray = Array.from(entidadesSituacion2);
  const nombresEntidades = this.entidadesService.obtenerNombresEntidades(entidadesArray);

  if (cantidadEntidades >= 2) {
    return {
      estado: "rechazado",
      mensaje: `Tiene ${cantidadEntidades} entidades en situación 2 en los últimos 2 meses: ${nombresEntidades.join(", ")}`,
      entidades: entidadesArray,
    };
  } else if (cantidadEntidades === 1) {
    return {
      estado: "pendiente",
      mensaje: `Tiene 1 entidad en situación 2 en los últimos 2 meses: ${nombresEntidades.join(", ")}`,
      entidades: entidadesArray,
    };
  }

  return { estado: "aprobado" };
}

  /**
 * Convierte un período en formato AAAAMM a Date de manera más robusta
 */
private convertirPeriodoAFecha(periodo: number): Date {
  try {
    const periodoStr = periodo.toString().padStart(6, '0');
    
    if (periodoStr.length !== 6) {
      console.warn('❌ Formato de período inválido:', periodo);
      return new Date(0); // Fecha muy antigua
    }

    const año = parseInt(periodoStr.substring(0, 4));
    const mes = parseInt(periodoStr.substring(4, 6)) - 1; // Meses en Date son 0-based

    if (isNaN(año) || isNaN(mes) || mes < 0 || mes > 11) {
      console.warn('❌ Período con valores inválidos:', periodo, 'Año:', año, 'Mes:', mes);
      return new Date(0); // Fecha muy antigua
    }

    const fecha = new Date(año, mes, 1);
    return fecha;
  } catch (error) {
    console.error('❌ Error en convertirPeriodoAFecha:', error, 'Periodo:', periodo);
    return new Date(0); // Fecha muy antigua
  }
}

  /**
   * Verifica el estado de deudas en entidades financieras
   * @param variables - Lista de variables de Nosis
   * @returns Objeto con estado y mensaje de la verificación
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

    for (const registro of registros) {
      if (registro.situacion >= 3 && registro.situacion <= 5) {
        // Convertir el código de entidad de string a número
        const codigoEntidad = parseInt(registro.entidad, 10);
        if (!isNaN(codigoEntidad)) {
          entidadesConDeuda.add(codigoEntidad);
        } else {
          console.warn(
            "No se pudo convertir código de entidad a número:",
            registro.entidad
          );
        }
      }
    }

    const cantidad = entidadesConDeuda.size;
    const entidadesArray = Array.from(entidadesConDeuda);
    const nombresEntidades =
      this.entidadesService.obtenerNombresEntidades(entidadesArray);

    if (cantidad >= 3) {
      return {
        estado: "rechazado",
        mensaje: `Tiene deuda en 3 o más entidades con situación 3, 4 o 5: ${nombresEntidades.join(
          ", "
        )}`,
        entidades: entidadesArray,
      };
    } else if (cantidad >= 1) {
      return {
        estado: "pendiente",
        mensaje: `Tiene deuda en ${cantidad} entidades con situación 3, 4 o 5: ${nombresEntidades.join(
          ", "
        )}`,
        entidades: entidadesArray,
      };
    }

    return { estado: "aprobado" };
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
          console.warn("❌ Código de entidad inválido (no numérico):", codigoEntidad);
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
    //const esAutonomo = variables.find(v => v.Nombre === 'VI_Inscrip_Autonomo_Es')?.Valor === 'Si';
    //const esDomestico = variables.find(v => v.Nombre === 'VI_EmpleadoDomestico_Es')?.Valor === 'Si';
    const aportes =
      variables.find((v) => v.Nombre === "AP_12m_Empleado_Pagos_Cant")?.Valor ||
      "0";

    return esEmpleado || parseInt(aportes) > 0;
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
