import { EstadisticasRepositoryPort } from '../../ports/EstadisticasRepositoryPort';

export class GetTasaConversionStatsUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(desde?: Date, hasta?: Date): Promise<any> {
    return this.repository.getTasaConversionStats(desde, hasta);
  }
}