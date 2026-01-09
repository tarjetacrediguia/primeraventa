// src/application/use-cases/Estadisticas/GetEstadisticasComprasUseCase.ts

import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";

export class GetEstadisticasComprasUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(desde?: string, hasta?: string): Promise<any> {
    return this.repository.getEstadisticasCompras(desde, hasta);
  }
}