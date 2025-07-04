import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";


export class GetEstadisticasComerciantesUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(desde?: string, hasta?: string): Promise<any> {
    return this.repository.getEstadisticasComerciantes(desde, hasta);
  }
}
