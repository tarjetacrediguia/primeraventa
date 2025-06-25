import { EstadisticasRepositoryPort } from '../../ports/EstadisticasRepositoryPort';

export class GetSolicitudesFormalesStatsUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(desde?: Date, hasta?: Date): Promise<any> {
    return this.repository.getSolicitudesFormalesStats(desde, hasta);
  }
}