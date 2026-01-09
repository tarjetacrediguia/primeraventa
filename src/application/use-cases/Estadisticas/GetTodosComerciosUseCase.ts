// src/application/use-cases/Estadisticas/GetTodosComerciosUseCase.ts

import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";

export class GetTodosComerciosUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(): Promise<any> {
    return this.repository.getTodosComercios();
  }
}