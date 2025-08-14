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
        variable: 'SCO_Vig',
        operacion: '>=',
        valor: 600,
        mensaje: 'Score insuficiente'
      },
      {
        variable: 'DX_Es',
        operacion: '==',
        valor: 'No',
        mensaje: 'Cliente moroso'
      },
      {
        variable: 'NSE',
        operacion: 'in',
        valor: ['C1', 'C2', 'C3'],
        mensaje: 'Nivel socioeconómico no permitido'
      },
      {
        variable: 'VI_Jubilado_Es',
        operacion: '==',
        valor: 'No',
        mensaje: 'Cliente es jubilado'
      },
      {
        variable: 'VI_Inscrip_Monotributo_Es',
        operacion: '==',
        valor: 'No',
        mensaje: 'Cliente es monotributista'
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

    // Evaluar todas las reglas
    for (const regla of this.rules) {
      const variable = variables.find(v => v.Nombre === regla.variable);
      if (!this.evaluarRegla(variable, regla)) {
        reglasFallidas.push(regla.mensaje);
      }
    }

    // Extraer datos personales
    const personalData = this.extraerDatosPersonales(variables);

    console.log('Datos personales extraídos:', personalData);
    
    const isApproved = reglasFallidas.length === 0;
    
    if (isApproved) {
      return { 
        status: 'aprobado',
        approved: true,
        score,
        motivo: "Cumple con todos los criterios de aprobación",
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
        empleador: {
          razonSocial: getValor('VI_Empleador_RZ'),
          cuit: getValor('VI_Empleador_CUIT')
        },
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