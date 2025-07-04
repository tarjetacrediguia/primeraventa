import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";


export class GetEstadisticasAnalistasUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(desde?: string, hasta?: string): Promise<any> {
    return this.repository.getEstadisticasAnalistas(desde, hasta);
  }
}
