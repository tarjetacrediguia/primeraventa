// src/infrastructure/RubrosLaborales/RubrosLaboralesService.ts

import rubrosLaboralesData from './rubrosLaborales.json';

export interface RubroLaboral {
  code: string;
  short_description: string;
  long_description: string;
}

export class RubrosLaboralesService {
  private rubros: RubroLaboral[];

  constructor() {
    this.rubros = rubrosLaboralesData as RubroLaboral[];
  }

  /**
   * Obtiene todos los rubros laborales
   */
  obtenerTodosLosRubros(): RubroLaboral[] {
    return this.rubros;
  }

  /**
   * Verifica si un código pertenece a los rubros de construcción y contratación
   */
  esRubroConstruccionOContratacion(codigo: string): boolean {
    const rubrosConstruccionContratacion = [
      "162201", "162202", "239201", "239202", "239209", "239310", 
      "239410", "239421", "239422", "239510", "239591", "239592", 
      "239593", "239600", "239900", "251101", "251102", "251200", 
      "282400", "410011", "410021", "421000", "422100", "422200", 
      "429010", "429090", "431100", "431210", "432110", "432190", 
      "432200", "432910", "432920", "432990", "433010", "433020", 
      "433030", "433040", "433090", "439100", "439910", "439990", 
      "711001", "711009", "773030", "780000"
    ];

    return rubrosConstruccionContratacion.includes(codigo);
  }

  /**
   * Obtiene la descripción de un rubro por código
   */
  obtenerDescripcionRubro(codigo: string): string | undefined {
    const rubro = this.rubros.find(r => r.code === codigo);
    return rubro ? rubro.long_description : undefined;
  }

  /**
   * Obtiene información completa del rubro por código
   */
  obtenerRubroPorCodigo(codigo: string): RubroLaboral | undefined {
    return this.rubros.find(r => r.code === codigo);
  }

  /**
   * Obtiene la descripción corta de un rubro por código
   */
  obtenerDescripcionCorta(codigo: string): string | undefined {
    const rubro = this.rubros.find(r => r.code === codigo);
    return rubro ? rubro.short_description : undefined;
  }

  /**
   * Obtiene la descripción larga de un rubro por código
   */
  obtenerDescripcionLarga(codigo: string): string | undefined {
    const rubro = this.rubros.find(r => r.code === codigo);
    return rubro ? rubro.long_description : undefined;
  }
}