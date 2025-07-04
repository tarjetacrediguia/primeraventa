import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";


export class GetTiemposResolucionUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(desde?: string, hasta?: string): Promise<any> {
    return this.repository.getTiemposResolucion(desde, hasta);
  }
}
