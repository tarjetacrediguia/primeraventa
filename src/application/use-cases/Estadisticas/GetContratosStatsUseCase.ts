import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";


export class GetContratosStatsUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(desde?: Date, hasta?: Date): Promise<any> {
    return this.repository.getContratosStats(desde, hasta);
  }
}
