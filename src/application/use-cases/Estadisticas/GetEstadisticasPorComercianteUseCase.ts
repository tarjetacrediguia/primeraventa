// src/application/use-cases/Estadisticas/GetEstadisticasPorComercianteUseCase.ts

import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";

export class GetEstadisticasPorComercianteUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(desde?: string, hasta?: string, comerciante_id?: string): Promise<any> {
    return this.repository.getEstadisticasPorComerciante(desde, hasta, comerciante_id);
  }
}