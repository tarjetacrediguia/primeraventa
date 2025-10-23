import { ClienteRepositoryPort } from "../../ports/ClienteRepositoryPort";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";
import { EstadoCompra } from "../../../domain/entities/Compra";

export interface ClienteAprobadoSinCompra {
  id: number;
  nombreCompleto: string;
  apellido: string;
  telefono: string | null;
  email: string | null;
  dni: string;
  cuil: string;
  fechaNacimiento: Date | null;
  solicitudFormalId: number;
  fechaAprobacion: Date | null;
  comercianteId: number;
  nombreComercio?: string;
  fechaCreacionSolicitud: Date;
  limiteCredito?: number;
}

export class GenerarReporteClientesAprobadosSinCompraUseCase {
  constructor(
    private readonly clienteRepository: ClienteRepositoryPort,
    private readonly solicitudFormalRepository: SolicitudFormalRepositoryPort,
    private readonly compraRepository: CompraRepositoryPort,
    private readonly comercianteRepository: ComercianteRepositoryPort
  ) {}

  async execute(): Promise<ClienteAprobadoSinCompra[]> {
    try {
      console.log("🔍 Iniciando generación de reporte de clientes aprobados sin compra...");
      
      // Obtener todas las solicitudes formales aprobadas
      const solicitudesAprobadas = await this.solicitudFormalRepository.getSolicitudesFormalesByEstado("aprobada");
      console.log(`📊 Encontradas ${solicitudesAprobadas.length} solicitudes aprobadas`);
      
      const clientesAprobadosSinCompra: ClienteAprobadoSinCompra[] = [];

      for (const solicitud of solicitudesAprobadas) {
        try {
          // Verificar si tiene compras asociadas
          const compras = await this.compraRepository.getComprasBySolicitudFormalIdReporte(solicitud.getId());
          
          // Si no tiene compras o todas están rechazadas, incluir en el reporte
          const tieneComprasActivas = compras.some((compra: { getEstado: () => EstadoCompra; }) => 
            compra.getEstado() === EstadoCompra.APROBADA || 
            compra.getEstado() === EstadoCompra.PENDIENTE
          );

          if (!tieneComprasActivas) {
            console.log(`✅ Cliente sin compras activas encontrado - Solicitud ID: ${solicitud.getId()}`);
            
            // Obtener datos del cliente
            const cliente = await this.clienteRepository.findById(solicitud.getClienteId());
            
            // Obtener nombre del comercio
            let nombreComercio = "No disponible";
            try {
              const comerciante = await this.comercianteRepository.findById(solicitud.getComercianteId());
              nombreComercio = comerciante.getNombreComercio();
            } catch (error) {
              console.warn(`⚠️ No se pudo obtener comerciante para ID: ${solicitud.getComercianteId()}`);
            }

            clientesAprobadosSinCompra.push({
              id: cliente.getId(),
              nombreCompleto: cliente.getNombreCompleto(),
              apellido: cliente.getApellido(),
              telefono: cliente.getTelefono(),
              email: cliente.getEmail(),
              dni: cliente.getDni(),
              cuil: cliente.getCuil(),
              fechaNacimiento: cliente.getFechaNacimiento(),
              solicitudFormalId: solicitud.getId(),
              fechaAprobacion: solicitud.getFechaAprobacion() || null,
              comercianteId: solicitud.getComercianteId(),
              nombreComercio: nombreComercio,
              fechaCreacionSolicitud: solicitud.getFechaSolicitud(),
              limiteCredito: solicitud.getLimiteCompleto()
            });
          }
        } catch (error) {
          console.error(`❌ Error procesando solicitud ID ${solicitud.getId()}:`, error);
          // Continuar con la siguiente solicitud
          continue;
        }
      }

      // Ordenar por fecha de aprobación (más recientes primero)
      const resultadoOrdenado = clientesAprobadosSinCompra.sort((a, b) => {
        const fechaA = a.fechaAprobacion || new Date(0);
        const fechaB = b.fechaAprobacion || new Date(0);
        return fechaB.getTime() - fechaA.getTime();
      });

      console.log(`📈 Reporte generado exitosamente: ${resultadoOrdenado.length} clientes encontrados`);
      
      return resultadoOrdenado;
    } catch (error) {
      console.error("❌ Error crítico generando reporte:", error);
      throw new Error(
        `Error al generar reporte de clientes aprobados sin compra: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}