// src/application/use-cases/Estadisticas/GetEstadisticasSistemaUseCase.ts

import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";

export class GetEstadisticasSistemaUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(desde?: string, hasta?: string): Promise<any> {
    return this.repository.getEstadisticasSistema(desde, hasta);
  }
}