// src/application/use-cases/SolicitudFormal/GetSolicitudFormalBySolicitudInicialIdUseCase.ts
import { SolicitudFormalRepositoryPort } from '../../ports/SolicitudFormalRepositoryPort';

export class GetSolicitudFormalBySolicitudInicialIdUseCase {
  constructor(private solicitudFormalRepository: SolicitudFormalRepositoryPort) {}

  async execute(solicitudInicialId: number) {
    const solicitudes = await this.solicitudFormalRepository.getSolicitudesFormalesBySolicitudInicialId(solicitudInicialId);
    
    if (solicitudes.length === 0) {
      throw new Error('No se encontró solicitud formal para la solicitud inicial proporcionada');
    }

    return solicitudes[0];
  }
}