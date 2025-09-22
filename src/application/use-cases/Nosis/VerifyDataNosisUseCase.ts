import { NosisResponse, NosisVariable } from "../../../domain/entities/NosisData";

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
  status: 'aprobado' | 'rechazado' | 'pendiente';
  approved: boolean;
  score?: number;
  motivo?: string;
  reglasFallidas?: string[];
  personalData?: PersonalData;
};
/**
 * Configuración de reglas de validación para variables de Nosis
 * Define las condiciones que deben cumplirse para la aprobación automática
 */
export type RuleConfig = {
  variable: string;
  operacion: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'in' | 'not-in';
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
  /**
   * Constructor del caso de uso de verificación Nosis
   * @param rules - Reglas personalizadas de validación (opcional)
   */
  constructor(rules?: RuleConfig[]) {
    // Reglas por defecto si no se proporcionan
    this.rules = rules || [
      {
        variable: 'VI_Jubilado_Es',
        operacion: '==',
        valor: 'No',
        mensaje: 'Cliente es jubilado'
      }
    ];
  }
  /**
   * Evalúa una regla de validación contra una variable de Nosis
   * @param variable - Variable de Nosis a evaluar
   * @param regla - Configuración de la regla a aplicar
   * @returns Boolean indicando si la regla se cumple
   */
  private evaluarRegla(variable: NosisVariable | undefined, regla: RuleConfig): boolean {
    if (!variable) return false;
    // Convertir valor según el tipo de variable
    const valorReal = variable.Tipo === 'ENTERO' ? parseInt(variable.Valor) : 
                     variable.Tipo === 'DECIMAL' ? parseFloat(variable.Valor) : 
                     variable.Valor;
    // Aplicar operación de comparación
    switch (regla.operacion) {
      case '>': return valorReal > regla.valor;
      case '<': return valorReal < regla.valor;
      case '>=': return valorReal >= regla.valor;
      case '<=': return valorReal <= regla.valor;
      case '==': return valorReal === regla.valor;
      case '!=': return valorReal !== regla.valor;
      case 'in': return Array.isArray(regla.valor) && regla.valor.includes(valorReal);
      case 'not-in': return Array.isArray(regla.valor) && !regla.valor.includes(valorReal);
      default: return false;
    }
  }
  /**
   * Verifica si el cliente tiene suficientes aportes registrados
   * @param variables - Lista de variables de Nosis
   * @returns Boolean indicando si cumple con el mínimo requerido
   */
  private verificarAportes(variables: NosisVariable[]): boolean {
      const pagos = parseInt(variables.find(v => v.Nombre === 'AP_12m_Empleado_Pagos_Cant')?.Valor || '0');
      const impagos = parseInt(variables.find(v => v.Nombre === 'AP_12m_Empleado_Impagos_Cant')?.Valor || '0');
      const parciales = parseInt(variables.find(v => v.Nombre === 'AP_12m_Empleado_PagoParcial_Cant')?.Valor || '0');
      const totalAportes = pagos + impagos + parciales;
      return totalAportes >= this.MINIMO_APORTES;
  }

  /**
   * Verifica si el cliente tiene tarjetas Crediguía activas
   * @param variables - Lista de variables de Nosis
   * @returns Boolean indicando si tiene tarjetas Crediguía
   */
  private tieneTarjetaCrediguia(variables: NosisVariable[]): boolean {
    const detalleTarjetas = variables.find(v => v.Nombre === 'CI_Vig_TC_Detalle')?.Valor;
    
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
        if (marca.includes('crediguía') || marca.includes('crediguia') || 
            marca.includes('guía') || marca.includes('guia')) {
          return true;
        }
      }
    } catch (error) {
      console.error('Error al parsear detalle de tarjetas:', error);
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
      const partes = match[1].split('|').map(part => part.trim());
      
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
          saldo12Meses: partes[9]
        });
      }
    }
    
    return resultados;
  }

  /**
   * Ejecuta el proceso completo de verificación de datos Nosis
   * @param nosisData - Respuesta cruda del servicio Nosis
   * @returns Promise<VerificationResult> - Resultado estructurado de la verificación
   */
  async execute(nosisData: NosisResponse): Promise<VerificationResult> {
    const variables = nosisData.Contenido.Datos.Variables.Variable;
    const reglasFallidas: string[] = [];
    
    // Buscar el score para incluirlo en el resultado
    const scoreVar = variables.find(v => v.Nombre === 'SCO_Vig');
    const score = scoreVar ? parseInt(scoreVar.Valor) : 0;

    // Evaluar reglas estándar
    for (const regla of this.rules) {
      const variable = variables.find(v => v.Nombre === regla.variable);
      if (!this.evaluarRegla(variable, regla)) {
        reglasFallidas.push(regla.mensaje);
      }
    }

    // Aportes
    if (!this.verificarAportes(variables)) {
        reglasFallidas.push('Cliente no cumple con el mínimo de aportes registrados en los últimos 12 meses');
    }

    // Verificación específica para deudas en entidades (situación 3-4-5)
    const tieneDeudaEntidades = this.verificarDeudaEntidades(variables);
    if (tieneDeudaEntidades.estado === 'rechazado') {
      reglasFallidas.push(tieneDeudaEntidades.mensaje || 'Tiene deuda en 3 o más entidades con situación 3, 4 o 5');
    }

    // Verificación específica para monotributistas
    const esMonotributista = variables.find(v => v.Nombre === 'VI_Inscrip_Monotributo_Es')?.Valor === 'Si';
    if (esMonotributista) {
      // Solo rechazamos si es monotributista Y NO tiene empleo registrado
      const tieneEmpleoRegistrado = this.tieneEmpleoRegistrado(variables);
      if (!tieneEmpleoRegistrado) {
        reglasFallidas.push('Cliente es monotributista sin empleo registrado');
      }
    }

    // Regla personalizada para situación laboral (solo para no monotributistas)
    if (!esMonotributista) {
      const tieneLaboral = this.verificarSituacionLaboral(variables);
      if (!tieneLaboral) {
        reglasFallidas.push('Cliente no tiene situación laboral registrada');
      }
    }

    //Tarjetas Crediguía
    if (this.tieneTarjetaCrediguia(variables)) {
      reglasFallidas.push('Cliente tiene tarjeta Crediguía activa');
    }


    // Extraer datos personales
    const personalData = this.extraerDatosPersonales(variables);

    
      // Determinar el estado overall
      let status: 'aprobado' | 'rechazado' | 'pendiente' = 'aprobado';
      if (reglasFallidas.length > 0) {
        status = 'rechazado';
      } else if (tieneDeudaEntidades.estado === 'pendiente') {
        status = 'pendiente';
      }

      const approved = status === 'aprobado';

      // Construir mensaje basado en el estado
      let motivo: string;
      if (status === 'aprobado') {
        motivo = "Cumple con todos los criterios de aprobación";
      } else if (status === 'pendiente') {
        motivo = tieneDeudaEntidades.mensaje || 'Requiere revisión manual por deuda en entidades';
      } else {
        motivo = `Motivos: ${reglasFallidas.join('; ')}`;
      }

      return {
        status,
        approved,
        score,
        motivo,
        reglasFallidas: status === 'rechazado' ? reglasFallidas : [],
        personalData
      };
  }

   /**
   * Verifica el estado de deudas en entidades financieras
   * @param variables - Lista de variables de Nosis
   * @returns Objeto con estado y mensaje de la verificación
   */
private verificarDeudaEntidades(variables: NosisVariable[]): { estado: 'aprobado' | 'pendiente' | 'rechazado', mensaje?: string } {
    const detalleDeudas = variables.find(v => v.Nombre === 'CI_24m_Detalle')?.Valor;
    if (!detalleDeudas) return { estado: 'aprobado' };

    const registros = this.parsearDetalleDeudas(detalleDeudas);
    
    const entidadesConDeuda = new Set<string>();
    
    for (const registro of registros) {
        if (registro.situacion >= 3 && registro.situacion <= 5) {
            entidadesConDeuda.add(registro.entidad);
        }
    }

    const cantidad = entidadesConDeuda.size;
    if (cantidad >= 3) {
        return {
            estado: 'rechazado',
            mensaje: 'Tiene deuda en 3 o más entidades con situación 3, 4 o 5'
        };
    } else if (cantidad >= 1) {
        return {
            estado: 'pendiente',
            mensaje: 'Tiene deuda en 1 o 2 entidades con situación 3, 4 o 5'
        };
    }
    
    return { estado: 'aprobado' };
}
  /**
   * Parsea el string de detalle de deudas en estructura manejable
   * @param detalleDeudas - String crudo con información de deudas
   * @returns Array de objetos con información estructurada de deudas
   */
  private parsearDetalleDeudas(detalleDeudas: string): Array<{entidad: string, periodo: number, situacion: number, monto: number}> {
    const resultados: Array<{entidad: string, periodo: number, situacion: number, monto: number}> = [];
    
    // Usar una expresión regular para extraer cada registro <D>
    const regex = /<D>(.*?)<\/D>/g;
    let match;
    
    while ((match = regex.exec(detalleDeudas)) !== null) {
      const partes = match[1].split('|');
      if (partes.length === 4) {
        resultados.push({
          entidad: partes[0],
          periodo: parseInt(partes[1]),
          situacion: parseInt(partes[2]),
          monto: parseInt(partes[3])
        });
      }
    }
    
    return resultados;
  }
  /**
   * Verifica si el cliente tiene empleo registrado
   * @param variables - Lista de variables de Nosis
   * @returns Boolean indicando si tiene empleo registrado
   */
  private tieneEmpleoRegistrado(variables: NosisVariable[]): boolean {
    const esEmpleado = variables.find(v => v.Nombre === 'VI_Empleado_Es')?.Valor === 'Si';
    const tieneAportes = parseInt(variables.find(v => v.Nombre === 'AP_12m_Empleado_Pagos_Cant')?.Valor || '0') > 0;
    
    return esEmpleado || tieneAportes;
  }
  /**
   * Verifica la situación laboral del cliente
   * @param variables - Lista de variables de Nosis
   * @returns Boolean indicando si tiene situación laboral válida
   */
    private verificarSituacionLaboral(variables: NosisVariable[]): boolean {
    const esEmpleado = variables.find(v => v.Nombre === 'VI_Empleado_Es')?.Valor === 'Si';
    //const esAutonomo = variables.find(v => v.Nombre === 'VI_Inscrip_Autonomo_Es')?.Valor === 'Si';
    //const esDomestico = variables.find(v => v.Nombre === 'VI_EmpleadoDomestico_Es')?.Valor === 'Si';
    const aportes = variables.find(v => v.Nombre === 'AP_12m_Empleado_Pagos_Cant')?.Valor || '0';
    
    return esEmpleado || parseInt(aportes) > 0;
    }
    /**
   * Extrae y estructura datos personales de las variables de Nosis
   * @param variables - Lista de variables de Nosis
   * @returns Objeto PersonalData con información estructurada
   */
    private extraerDatosPersonales(variables: NosisVariable[]): PersonalData {
    const getValor = (nombre: string): string | undefined => {
      const variable = variables.find(v => v.Nombre === nombre);
      return variable?.Valor;
    };

    // Nombre completo
    const nombre = getValor('VI_Nombre');
    const apellido = getValor('VI_Apellido');

    // Documentación
    const dni = getValor('VI_DNI');
    const cuil = getValor('VI_Identificacion');
    const fechaNacimiento = getValor('VI_FecNacimiento');
    const sexo = getValor('VI_Sexo');
    const nacionalidad = getValor('VI_Nacionalidad'); // Variable hipotética
    const estadoCivil = getValor('VI_EstadoCivil'); // Variable hipotética
    const tipoDocumento = "DNI"; // En Nosis generalmente es DNI

    // Domicilio
    const calle = getValor('VI_DomAF_Calle');
    const numero = getValor('VI_DomAF_Nro');
    const localidad = getValor('VI_DomAF_Loc');
    const codigoPostal = getValor('VI_DomAF_CP');
    const provincia = getValor('VI_DomAF_Prov');

    // Teléfonos
    const telefonos = [];
    for (let i = 1; i <= 3; i++) {
      const codArea = getValor(`VI_Tel${i}_CodArea`);
      const numeroTel = getValor(`VI_Tel${i}_Nro`);
      if (codArea || numeroTel) {
        telefonos.push({ 
          codArea, 
          numero: numeroTel,
          tipo: i === 1 ? "Principal" : `Alternativo ${i-1}`
        });
      }
    }

    // Datos laborales
    const situacionLaboral = 
      getValor('VI_Empleado_Es') === 'Si' ? 'Empleado' :
      getValor('VI_Empleador_Es') === 'Si' ? 'Empleador' :
      getValor('VI_Jubilado_Es') === 'Si' ? 'Jubilado' :
      getValor('VI_Pensionado_Es') === 'Si' ? 'Pensionado' :
      'Otro';

    const esMonotributista = getValor('VI_Inscrip_Monotributo_Es');
    const categoriaMonotributo = getValor('VI_Inscrip_Monotributo');
    const actividadMonotributo = getValor('VI_Inscrip_Monotributo_Act');

    // Obtener datos del empleador
    const razonSocialEmpleador = getValor('VI_Empleador_RZ');
    const cuitEmpleador = getValor('VI_Empleador_CUIT');
    const telCodAreaEmpleador = getValor('VI_Empleador_TelCodArea');
    const telNroEmpleador = getValor('VI_Empleador_TelNro');
    const telefonoEmpleador = telCodAreaEmpleador && telNroEmpleador ? 
      `${telCodAreaEmpleador}${telNroEmpleador}` : undefined;

    // Domicilio del empleador
    const calleEmpleador = getValor('VI_Empleador_Dom_Calle');
    const numeroEmpleador = getValor('VI_Empleador_Dom_Nro');
    const localidadEmpleador = getValor('VI_Empleador_Dom_Loc');
    const codigoPostalEmpleador = getValor('VI_Empleador_Dom_CP');
    const provinciaEmpleador = getValor('VI_Empleador_Dom_Prov');

    // Construir objeto empleador solo si existe razón social
    const empleador = razonSocialEmpleador ? {
      razonSocial: razonSocialEmpleador,
      cuit: cuitEmpleador,
      telefono: telefonoEmpleador,
      domicilio: {
        calle: calleEmpleador,
        numero: numeroEmpleador,
        localidad: localidadEmpleador,
        codigoPostal: codigoPostalEmpleador,
        provincia: provinciaEmpleador
      }
    } : undefined;

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
          relacion: relacionRef
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
        estadoCivil 
      },
      domicilio: { calle, numero, localidad, codigoPostal, provincia },
      telefonos,
      datosLaborales: {
        situacionLaboral,
        empleador,
        monotributo: {
          esMonotributista,
          categoria: categoriaMonotributo,
          actividad: actividadMonotributo
        }
      },
      referenciasPersonales
    };
  }
}