// src/application/use-cases/Estadisticas/GetTodosAnalistasUseCase.ts

import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";

export class GetTodosAnalistasUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(): Promise<any> {
    return this.repository.getTodosAnalistas();
  }
}