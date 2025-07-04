//src/application/use-cases/Historial/GetHistorialBySolicitudInicial.ts

//en base al id de una solicitud inicial, obtener el historial de esa solicitud y todos los eventos relacionados
//se tiene que saber la creacion de las solicitudes iniciales
//el momento/datos de la aprobacion de la solicitud inicial
//el momento/datos de la creacion de la solicitud formal
//el momento/datos de alguna modificacion de la solicitud formal
//el momento/datos de la aprobacion/rechazo de la solicitud formal
//el momento/datos de generacion del contrato
//el momento/datos de la descarga del contrato


//todos estos eventos deben formar parte del historial de la solicitud inicial el cual se entrega en este caso de uso

import { Historial } from "../../../domain/entities/Historial";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";

export class GetHistorialBySolicitudInicialUseCase {
    constructor(private readonly historialRepository: HistorialRepositoryPort) {}

    async execute(solicitudInicialId: number): Promise<Historial[]> {
        return this.historialRepository.obtenerPorSolicitudInicial(solicitudInicialId);
    }
}
