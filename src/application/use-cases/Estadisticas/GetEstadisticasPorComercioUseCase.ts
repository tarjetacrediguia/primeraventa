// src/application/use-cases/Estadisticas/GetEstadisticasPorComercioUseCase.ts

import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";

export class GetEstadisticasPorComercioUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(desde?: string, hasta?: string, comercio_id?: string): Promise<any> {
    return this.repository.getEstadisticasPorComercio(desde, hasta, comercio_id);
  }
}