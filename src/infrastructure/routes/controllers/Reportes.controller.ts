import { Request, Response } from "express";
import { GenerarReporteClientesAprobadosSinCompraUseCase } from "../../../application/use-cases/Reportes/GenerarReporteClientesAprobadosSinCompraUseCase";
import { ClienteRepositoryAdapter } from "../../adapters/repository/ClienteRepositoryAdapter";
import { SolicitudFormalRepositoryAdapter } from "../../adapters/repository/SolicitudFormalRepositoryAdapter";
import { CompraRepositoryAdapter } from "../../adapters/repository/CompraRepositoryAdapter";
import { ComercianteRepositoryAdapter } from "../../adapters/repository/ComercianteRepositoryAdapter";

// Inicializar dependencias
const clienteRepository = new ClienteRepositoryAdapter();
const solicitudFormalRepository = new SolicitudFormalRepositoryAdapter();
const compraRepository = new CompraRepositoryAdapter();
const comercianteRepository = new ComercianteRepositoryAdapter();

const generarReporteClientesAprobadosSinCompraUC = new GenerarReporteClientesAprobadosSinCompraUseCase(
  clienteRepository,
  solicitudFormalRepository,
  compraRepository,
  comercianteRepository
);

/**
 * Genera un reporte de clientes con solicitudes aprobadas pero sin compras concretadas
 * @param req - Request de Express
 * @param res - Response de Express
 * @returns Devuelve el reporte de clientes o un error
 */
export const generarReporteClientesAprobadosSinCompra = async (req: Request, res: Response) => {
  try {
    console.log("📋 Solicitando reporte de clientes aprobados sin compra...");
    
    // Verificar permisos (solo administradores y analistas)
    if (!req.user || (req.user.rol !== 'administrador' && req.user.rol !== 'analista')) {
      return res.status(403).json({ 
        error: "No tienes permisos para acceder a este reporte",
        detalles: "Solo administradores y analistas pueden acceder a este recurso"
      });
    }

    const reporte = await generarReporteClientesAprobadosSinCompraUC.execute();

    // Formatear respuesta para incluir información útil
    const reporteFormateado = reporte.map(cliente => ({
      ...cliente,
      telefonoDisponible: !!cliente.telefono,
      emailDisponible: !!cliente.email,
      edad: cliente.fechaNacimiento ? calcularEdad(cliente.fechaNacimiento) : null,
      diasDesdeAprobacion: cliente.fechaAprobacion ? 
        calcularDiasDesde(new Date(cliente.fechaAprobacion)) : null,
      nombreCompleto: `${cliente.nombreCompleto} ${cliente.apellido}`
    }));

    const estadisticas = {
      totalClientes: reporte.length,
      clientesConTelefono: reporte.filter(c => c.telefono).length,
      clientesConEmail: reporte.filter(c => c.email).length,
      clientesConAmbosContactos: reporte.filter(c => c.telefono && c.email).length,
      clientesSinContacto: reporte.filter(c => !c.telefono && !c.email).length,
      limiteCreditoPromedio: reporte.length > 0 ? 
        reporte.reduce((sum, c) => sum + (c.limiteCredito || 0), 0) / reporte.length : 0
    };

    console.log(`📊 Reporte generado: ${estadisticas.totalClientes} clientes`);

    res.status(200).json({
      ...estadisticas,
      fechaGeneracion: new Date().toISOString(),
      generadoPor: {
        id: req.user.id,
        rol: req.user.rol
      },
      datos: reporteFormateado
    });
  } catch (error) {
    console.error("💥 Error generando reporte de clientes aprobados sin compra:", error);
    res.status(500).json({ 
      error: "Error interno del servidor al generar el reporte",
      detalles: error instanceof Error ? error.message : "Error desconocido",
      timestamp: new Date().toISOString()
    });
  }
};

// Función auxiliar para calcular edad
function calcularEdad(fechaNacimiento: Date): number {
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    return edad - 1;
  }
  return edad;
}

// Función auxiliar para calcular días desde una fecha
function calcularDiasDesde(fecha: Date): number {
  const hoy = new Date();
  const diferenciaTiempo = hoy.getTime() - fecha.getTime();
  return Math.floor(diferenciaTiempo / (1000 * 3600 * 24));
}