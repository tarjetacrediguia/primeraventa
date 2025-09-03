import { NosisResponse, NosisVariable } from "../../../domain/entities/NosisData";


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

export type VerificationResult = {
  status: 'aprobado' | 'rechazado' | 'pendiente';
  approved: boolean;
  score?: number;
  motivo?: string;
  reglasFallidas?: string[];
  personalData?: PersonalData;
};

export type RuleConfig = {
  variable: string;
  operacion: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'in' | 'not-in';
  valor: any;
  mensaje: string;
};

export class VerifyDataNosisUseCase {
  private rules: RuleConfig[];

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

  private evaluarRegla(variable: NosisVariable | undefined, regla: RuleConfig): boolean {
    if (!variable) return false;
    
    const valorReal = variable.Tipo === 'ENTERO' ? parseInt(variable.Valor) : 
                     variable.Tipo === 'DECIMAL' ? parseFloat(variable.Valor) : 
                     variable.Valor;

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

    // Verificación específica para deudas en entidades (situación 3-4-5)
    const tieneDeudaEntidades = this.verificarDeudaEntidades(variables);
    if (tieneDeudaEntidades) {
      reglasFallidas.push('Tiene deuda en 3 o más entidades con situación 3, 4 o 5');
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
    // Extraer datos personales
    const personalData = this.extraerDatosPersonales(variables);

    
    const isApproved = reglasFallidas.length === 0;
    
    if (isApproved) {
      return { 
        status: 'aprobado',
        approved: true,
        score,
        motivo: "Cumple con todos los criterios de aprobación",
        reglasFallidas: [],
        personalData
      };
    }
    return {
      status: 'rechazado',
      approved: false,
      score,
      motivo: `Motivos: ${reglasFallidas.join('; ')}`,
      reglasFallidas,
      personalData
    };
  }

   private verificarDeudaEntidades(variables: NosisVariable[]): boolean {
    const detalleDeudas = variables.find(v => v.Nombre === 'CI_24m_Detalle')?.Valor;
    if (!detalleDeudas) return false;

    // Parsear el XML para obtener los registros
    const registros = this.parsearDetalleDeudas(detalleDeudas);
    
    // Contar entidades únicas con situación 3, 4 o 5
    const entidadesConDeuda = new Set<string>();
    
    for (const registro of registros) {
      if (registro.situacion >= 3 && registro.situacion <= 5) {
        entidadesConDeuda.add(registro.entidad);
      }
    }
    return entidadesConDeuda.size >= 3;
  }

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

  private tieneEmpleoRegistrado(variables: NosisVariable[]): boolean {
    const esEmpleado = variables.find(v => v.Nombre === 'VI_Empleado_Es')?.Valor === 'Si';
    const tieneAportes = parseInt(variables.find(v => v.Nombre === 'AP_12m_Empleado_Pagos_Cant')?.Valor || '0') > 0;
    
    return esEmpleado || tieneAportes;
  }
    private verificarSituacionLaboral(variables: NosisVariable[]): boolean {
    const esEmpleado = variables.find(v => v.Nombre === 'VI_Empleado_Es')?.Valor === 'Si';
    //const esAutonomo = variables.find(v => v.Nombre === 'VI_Inscrip_Autonomo_Es')?.Valor === 'Si';
    //const esDomestico = variables.find(v => v.Nombre === 'VI_EmpleadoDomestico_Es')?.Valor === 'Si';
    const aportes = variables.find(v => v.Nombre === 'AP_12m_Empleado_Pagos_Cant')?.Valor || '0';
    
    return esEmpleado || parseInt(aportes) > 0;
    }
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