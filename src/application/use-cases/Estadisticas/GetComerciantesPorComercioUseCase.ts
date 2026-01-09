// src/application/use-cases/Estadisticas/GetComerciantesPorComercioUseCase.ts

import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";

export class GetComerciantesPorComercioUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(comercio_id: string): Promise<any> {
    return this.repository.getComerciantesPorComercio(comercio_id);
  }
}