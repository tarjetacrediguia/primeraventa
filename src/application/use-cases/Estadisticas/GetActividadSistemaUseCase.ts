import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";


export class GetActividadSistemaUseCase {
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  async execute(desde?: string, hasta?: string): Promise<any> {
    return this.repository.getActividadSistema(desde, hasta);
  }
}