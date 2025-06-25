import { EstadisticasRepositoryPort } from '../../ports/EstadisticasRepositoryPort';

export class GetSolicitudesInicialesStatsUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(desde?: Date, hasta?: Date): Promise<any> {
    return this.repository.getSolicitudesInicialesStats(desde, hasta);
  }
}