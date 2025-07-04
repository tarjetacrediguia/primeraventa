import { EstadisticasRepositoryPort } from '../../ports/EstadisticasRepositoryPort';

export class GetTiemposAprobacionStatsUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(desde?: Date, hasta?: Date): Promise<any> {
    return this.repository.getTiemposAprobacionStats(desde, hasta);
  }
}
