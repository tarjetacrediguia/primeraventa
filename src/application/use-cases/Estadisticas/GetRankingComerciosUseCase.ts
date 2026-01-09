// src/application/use-cases/Estadisticas/GetRankingComerciosUseCase.ts

import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";

export class GetRankingComerciosUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(desde?: string, hasta?: string, limite: number = 10): Promise<any> {
    return this.repository.getRankingComercios(desde, hasta, limite);
  }
}