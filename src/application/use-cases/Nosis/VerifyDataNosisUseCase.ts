import { NosisResponse, NosisVariable } from "../../../domain/entities/NosisData";

export type VerificationResult = {
  status: 'aprobado' | 'rechazado' | 'pendiente';
  score?: number;
  motivo?: string;
  reglasFallidas?: string[];
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

    if (reglasFallidas.length === 0) {
      return { 
        status: 'aprobado', 
        score,
        motivo: "Cumple con todos los criterios de aprobación" 
      };
    }
    
    return { 
      status: 'rechazado', 
      score,
      motivo: `Motivos: ${reglasFallidas.join('; ')}`,
      reglasFallidas
    };
  }
}