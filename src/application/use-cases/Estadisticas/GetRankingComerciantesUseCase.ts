// src/application/use-cases/Estadisticas/GetRankingComerciantesUseCase.ts

import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";

export class GetRankingComerciantesUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(desde?: string, hasta?: string, comercio_id?: string, limite: number = 10): Promise<any> {
    return this.repository.getRankingComerciantes(desde, hasta, comercio_id, limite);
  }
}