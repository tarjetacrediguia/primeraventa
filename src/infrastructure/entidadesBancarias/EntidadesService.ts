// src/infrastructure/entidadesBancarias/EntidadesService.ts
import entidadesData from './entidades.json';

export interface EntidadBancaria {
  codigo: number;
  entidad: string;
}

export class EntidadesService {
  private entidades: Map<number, string> = new Map();

  constructor() {
    this.cargarEntidades();
  }

  private cargarEntidades(): void {
    try {
    // Usar la importación directa del JSON
      entidadesData.data.forEach((entidad: EntidadBancaria) => {
        this.entidades.set(entidad.codigo, entidad.entidad);
      });
      
      console.log(`Cargadas ${this.entidades.size} entidades bancarias`);
    } catch (error) {
      console.error('Error cargando entidades bancarias:', error);
    }
  }

  obtenerNombreEntidad(codigo: number): string {
    return this.entidades.get(codigo) || `Entidad ${codigo}`;
  }

  obtenerNombresEntidades(codigos: number[]): string[] {
    return codigos.map(codigo => this.obtenerNombreEntidad(codigo));
  }
}