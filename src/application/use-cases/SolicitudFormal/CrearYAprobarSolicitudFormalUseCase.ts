// src/application/use-cases/SolicitudFormal/CrearYAprobarSolicitudFormalUseCase.ts

import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";
import { AprobarSolicitudesFormalesUseCase } from "./AprobarSolicitudesFormalesUseCase";
import { CrearSolicitudFormalUseCase } from "./CrearSolicitudFormalUseCase";


export class CrearYAprobarSolicitudFormalUseCase {
  constructor(
    private crearUseCase: CrearSolicitudFormalUseCase,
    private aprobarUseCase: AprobarSolicitudesFormalesUseCase,
    private permisoRepo: PermisoRepositoryPort
  ) {}

  async execute(
    solicitudInicialId: number,
    comercianteId: number,
    rol: string,
    datosSolicitud: any,
    comentario: string = "Solicitud creada y aprobada por comerciante",
    solicitaAmpliacionDeCredito: boolean,
    datosEmpleador?: any
  ): Promise<SolicitudFormal> {
    // Crear solicitud
    const solicitudCreada = await this.crearUseCase.execute(
      solicitudInicialId,
      comercianteId,
      datosSolicitud,
      comentario,
      solicitaAmpliacionDeCredito,
      datosEmpleador
    );

    // Aprobar inmediatamente
    const solicitudAprobada = await this.aprobarUseCase.aprobarSolicitud(
      solicitudCreada.getId(),
      comercianteId,
      rol || 'comerciante',
      comentario
    );

    return solicitudAprobada;
  }
}