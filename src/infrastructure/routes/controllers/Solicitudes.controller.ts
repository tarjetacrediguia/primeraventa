//src/infrastructure/routes/controllers/Solicitudes.controller.ts

/**
 * CONTROLADOR: Solicitudes
 *
 * Este archivo contiene los controladores para la gestión de solicitudes iniciales y formales,
 * así como la verificación crediticia, aprobación y rechazo de solicitudes.
 * Cada función está diseñada para ser utilizada como handler de rutas Express.
 *
 * RESPONSABILIDADES:
 * - Crear, listar, aprobar, rechazar y actualizar solicitudes iniciales y formales.
 * - Verificar el estado crediticio de clientes.
 * - Obtener detalles y recibos asociados a solicitudes.
 * - Filtrar solicitudes por estado, fecha y comerciante.
 *
 * Cada función está documentada con sus parámetros, retornos y posibles errores.
 */

import { Request, Response } from 'express';
import { NotificationPort } from '../../../application/ports/NotificationPort';
import { VerazPort } from '../../../application/ports/VerazPort';
import { SolicitudInicialRepositoryPort } from '../../../application/ports/SolicitudInicialRepositoryPort';
import { ContratoRepositoryPort } from '../../../application/ports/ContratoRepositoryPort';
import { SolicitudFormalRepositoryPort } from '../../../application/ports/SolicitudFormalRepositoryPort';
import { PermisoRepositoryPort } from '../../../application/ports/PermisoRepositoryPort';
import { CrearSolicitudInicialUseCase } from '../../../application/use-cases/SolicitudInicial/CrearSolicitudInicialUseCase';
import { GetSolicitudesInicialesByEstadoUseCase } from '../../../application/use-cases/SolicitudInicial/GetSolicitudesInicialesByEstadoUseCase';
import { VerificarAprobacionSolicitudInicialUseCase } from '../../../application/use-cases/SolicitudInicial/VerificarAprobacionSolicitudInicialUseCase';
import { CrearSolicitudFormalUseCase } from '../../../application/use-cases/SolicitudFormal/CrearSolicitudFormalUseCase';
import { AprobarSolicitudesFormalesUseCase } from '../../../application/use-cases/SolicitudFormal/AprobarSolicitudesFormalesUseCase';
import { GetSolicitudesFormalesByEstadoUseCase } from '../../../application/use-cases/SolicitudFormal/GetSolicitudesFormalesByEstadoUseCase';
import { GetSolicitudesFormalesByFechaUseCase } from '../../../application/use-cases/SolicitudFormal/GetSolicitudesFormalesByFechaUseCase';
import { UpdateSolicitudFormalUseCase } from '../../../application/use-cases/SolicitudFormal/UpdateSolicitudFormalUseCase';
import { GetSolicitudesFormalesByIdUseCase } from '../../../application/use-cases/SolicitudFormal/GetSolicitudFormalByIdUseCase';
import { VerazAdapter } from '../../adapters/veraz/VerazAdapter';
import { NotificationAdapter } from '../../adapters/notification/NotificationAdapter';
import { SolicitudInicialRepositoryAdapter } from '../../adapters/repository/SolicitudInicialRepositoryAdapter';
import { ContratoRepositoryAdapter } from '../../adapters/repository/ContratoRepositoryAdapter';
import { SolicitudFormalRepositoryAdapter } from '../../adapters/repository/SolicitudFormalRepositoryAdapter';
import { PermisoRepositoryAdapter } from '../../adapters/repository/PermisoRepositoryAdapter';
import { Referente } from '../../../domain/entities/Referente';
import { AnalistaRepositoryAdapter } from '../../adapters/repository/AnalistaRepositoryAdapter';
import { ClienteRepositoryAdapter } from '../../adapters/repository/ClienteRepositoryAdapter';
import { GetSolicitudesInicialesByComercianteYEstadoUseCase } from '../../../application/use-cases/SolicitudInicial/GetSolicitudesInicialesByComercianteYEstadoUseCase';
import { GetSolicitudesFormalesByComercianteYEstadoUseCase } from '../../../application/use-cases/SolicitudFormal/GetSolicitudesFormalesByComercianteYEstadoUseCase';
import { HistorialRepositoryAdapter } from '../../adapters/repository/HistorialRepositoryAdapter';
import { GetSolicitudesFormalesByComercianteIdUseCase } from '../../../application/use-cases/SolicitudFormal/GetSolicitudesFormalesByComercianteIdUseCase';
import { AprobarRechazarSolicitudInicialUseCase } from '../../../application/use-cases/SolicitudInicial/AprobarRechazarSolicitudInicialUseCase';

// Inyección de dependencias (deberían venir de un contenedor DI)
const verazService: VerazPort = new VerazAdapter();
const notificationService: NotificationPort = new NotificationAdapter();
const solicitudInicialRepo: SolicitudInicialRepositoryPort = new SolicitudInicialRepositoryAdapter();
const contratoRepo: ContratoRepositoryPort = new ContratoRepositoryAdapter();
const solicitudFormalRepo: SolicitudFormalRepositoryPort = new SolicitudFormalRepositoryAdapter();
const permisoRepo: PermisoRepositoryPort = new PermisoRepositoryAdapter();
const clienteRepository = new ClienteRepositoryAdapter();
const historialRepository = new HistorialRepositoryAdapter();
const analistaRepository = new AnalistaRepositoryAdapter();
const getSolicitudesInicialesByComercianteYEstado = new GetSolicitudesInicialesByComercianteYEstadoUseCase(solicitudInicialRepo)



// Casos de uso inicializados
const crearSolicitudInicialUC = new CrearSolicitudInicialUseCase(
  solicitudInicialRepo,
  contratoRepo,
  solicitudFormalRepo,
  verazService,
  notificationService,
  clienteRepository,
  historialRepository,
  analistaRepository,
  process.env.VERAZ_AUTO === 'true' // Modo automático de Veraz
);

const aprobarRechazarSolicitudInicialUC = new AprobarRechazarSolicitudInicialUseCase(
    solicitudInicialRepo,
    notificationService,
    historialRepository
);

const getSolicitudesInicialesByEstadoUC = new GetSolicitudesInicialesByEstadoUseCase(solicitudInicialRepo);
const verificarAprobacionUC = new VerificarAprobacionSolicitudInicialUseCase(
  solicitudInicialRepo,
  verazService,
  notificationService
);

const crearSolicitudFormalUC = new CrearSolicitudFormalUseCase(
  solicitudInicialRepo,
  solicitudFormalRepo,
  permisoRepo,
  notificationService,
  new AnalistaRepositoryAdapter(),
  contratoRepo,
  clienteRepository,
  historialRepository
);

const aprobarSolicitudesUC = new AprobarSolicitudesFormalesUseCase(
  solicitudFormalRepo,
  notificationService,
  historialRepository
);

const getSolicitudesFormalesByEstadoUC = new GetSolicitudesFormalesByEstadoUseCase(solicitudFormalRepo);
const getSolicitudesFormalesByFechaUC = new GetSolicitudesFormalesByFechaUseCase(solicitudFormalRepo);
const updateSolicitudFormalUC = new UpdateSolicitudFormalUseCase(solicitudFormalRepo,historialRepository);
const getSolicitudFormalByIdUC = new GetSolicitudesFormalesByIdUseCase(solicitudFormalRepo);

/**
 * Crea una nueva solicitud inicial.
 * @param req - Request de Express con los datos del cliente y recibo en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve la solicitud creada o un error en caso de fallo.
 */
export const crearSolicitudInicial = async (req: Request, res: Response) => {
  try {
    const { dniCliente, cuilCliente, reciboSueldo } = req.body;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    const comercianteId = Number(req.user.id);

    const solicitud = await crearSolicitudInicialUC.execute(
      dniCliente,
      cuilCliente,
      comercianteId,
      reciboSueldo ? Buffer.from(reciboSueldo, 'base64') : undefined
    );

    res.status(201).json(solicitud);
  } catch (error) {
    if (error instanceof Error && error.message === 'El cliente ya tiene un crédito activo') {
      res.status(409).json({ error: error.message });
    } else if (error instanceof Error) {
      if (error instanceof Error) {
        res.status(400).json({ error: (error as Error).message });
      } else {
        res.status(400).json({ error: 'Unknown error' });
      }
    } else {
      res.status(400).json({ error: 'Unknown error' });
    }
  }
};

/**
 * Lista las solicitudes iniciales filtradas por estado.
 * @param req - Request de Express con el estado en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un array de solicitudes o un error en caso de fallo.
 */
export const listarSolicitudesIniciales = async (req: Request, res: Response) => {
  try {
    const estado = req.query.estado as string;
    const solicitudes = await getSolicitudesInicialesByEstadoUC.execute(estado);
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

/**
 * Verifica el estado crediticio de un cliente.
 * @param req - Request de Express con el dni y cuil en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve el resultado de la verificación o un error en caso de fallo.
 */
export const verificarEstadoCrediticio = async (req: Request, res: Response) => {
  try {
    const { dni, cuil } = req.body;
    const resultado = await verazService.checkClienteStatus(dni);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

/**
 * Crea una nueva solicitud formal.
 * @param req - Request de Express con los datos de la solicitud formal en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve la solicitud formal creada o un error en caso de fallo.
 */
export const crearSolicitudFormal = async (req: Request, res: Response) => {
  try {
    const { idSolicitudInicial, cliente, referentes } = req.body;
    // Validar que el recibo sea proporcionado
    if (!cliente.recibo) {
      return res.status(400).json({ error: 'El recibo es obligatorio' });
    }
    // Convertir base64 a Buffer
    const reciboBuffer = Buffer.from(cliente.recibo, 'base64');
    
    // Validar que sea una imagen JPG
    const mimeType = await getImageMimeType(reciboBuffer);
    if (mimeType !== 'image/jpeg') {
      return res.status(400).json({ error: 'El recibo debe ser una imagen JPG' });
    }
    
    // Validar tamaño máximo (5MB)
    if (reciboBuffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'El recibo no puede exceder los 5MB' });
    }
    
    // Reemplazar el string base64 con el Buffer
    cliente.recibo = reciboBuffer;

    // Validar referentes (código existente)
    if (!referentes || !Array.isArray(referentes)) {
      return res.status(400).json({ error: 'Se requiere un array de referentes' });
    }
    if (referentes.length !== 2) {
      return res.status(400).json({ error: 'Se requieren exactamente dos referentes' });
    }

    const referentesInstances = referentes.map(ref => {
      if (!ref.nombreCompleto || !ref.apellido || !ref.vinculo || !ref.telefono) {
        throw new Error('Cada referente debe tener: nombreCompleto, apellido, vinculo y telefono');
      }
      return new Referente(
        ref.nombreCompleto,
        ref.apellido,
        ref.vinculo,
        ref.telefono
      );
    });

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    const comercianteId = Number(req.user.id);

    const solicitudFormal = await crearSolicitudFormalUC.execute(
      idSolicitudInicial,
      comercianteId,
      {
        nombreCompleto: cliente.nombreCompleto,
        apellido: cliente.apellido,
        dni: cliente.dni,
        telefono: cliente.telefono,
        email: cliente.email,
        recibo: cliente.recibo, // Ahora es un Buffer
        aceptaTarjeta: cliente.aceptaTarjeta,
        fechaNacimiento: new Date(cliente.fechaNacimiento),
        domicilio: cliente.domicilio,
        datosEmpleador: cliente.datosEmpleador,
        referentes: referentesInstances
      }
    );

    res.status(201).json(solicitudFormal);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Solicitud inicial no encontrada') {
        res.status(404).json({ error: error.message });
      } else if (
        error.message === 'La solicitud inicial no está aprobada' ||
        error.message === 'Ya existe una solicitud formal para esta solicitud inicial'
      ) {
        res.status(409).json({ error: error.message });
      } else if (error.message.includes('Cada referente debe tener')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

/**
 * Obtiene el tipo MIME de una imagen a partir de su buffer.
 * @param buffer - Buffer de la imagen.
 * @returns Devuelve el tipo MIME como string o null si no se puede determinar.
 */
async function getImageMimeType(buffer: Buffer): Promise<string | null> {
  try {
    // Verificar la firma del archivo (magic number)
    if (buffer.length < 3) return null;
    
    // Verificar firma JPG: FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return 'image/jpeg';
    }
    
    // Verificar firma alternativa para JPG
    if (buffer.length > 6 && 
        buffer[0] === 0xFF && 
        buffer[1] === 0xD8 && 
        buffer[2] === 0xFF && 
        buffer[3] === 0xE0 && 
        buffer[6] === 'J'.charCodeAt(0) && 
        buffer[7] === 'F'.charCodeAt(0) && 
        buffer[8] === 'I'.charCodeAt(0) && 
        buffer[9] === 'F'.charCodeAt(0)) {
      return 'image/jpeg';
    }
    
    return null;
  } catch (error) {
    console.error('Error al detectar tipo MIME:', error);
    return null;
  }
}

/**
 * Obtiene el recibo de una solicitud formal por su ID.
 * @param req - Request de Express con el ID de la solicitud en los parámetros.
 * @param res - Response de Express para enviar la imagen del recibo.
 * @returns Devuelve la imagen del recibo o un error en caso de fallo.
 */
export const obtenerReciboSolicitudFormal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const solicitud = await getSolicitudFormalByIdUC.execute(Number(id));
    
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    const reciboBuffer = solicitud.getRecibo();
    
    // Establecer encabezados
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `inline; filename="recibo-${id}.jpg"`);
    res.setHeader('Content-Length', reciboBuffer.length);
    
    // Enviar imagen
    res.end(reciboBuffer);
    
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

/**
 * Aprueba una solicitud formal.
 * @param req - Request de Express con el ID de la solicitud en los parámetros y datos de aprobación en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve la solicitud aprobada o un error en caso de fallo.
 */
export const aprobarSolicitudFormal = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { numeroTarjeta, numeroCuenta, generarTarjeta, comentario } = req.body;
    
    if (!req.user || !req.user.id || !req.user.rol) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    
    const esAdministrador = req.user.rol === 'administrador';
    const aprobadorId = Number(req.user.id);

    const solicitudActualizada = await aprobarSolicitudesUC.aprobarSolicitud(
      Number(id),
      numeroTarjeta,
      numeroCuenta,
      aprobadorId,
      esAdministrador,
      comentario
    );

    res.status(200).json(solicitudActualizada);
  } catch (error) {
    if ((error as any).message === 'Solicitud formal no encontrada') {
      res.status(404).json({ error: (error as any).message });
    } else if ((error as any).message === 'Solo se pueden aprobar solicitudes pendientes') {
      res.status(403).json({ error: (error as any).message });
    } else {
      res.status(400).json({ error: (error as any).message });
    }
  }
};

/**
 * Rechaza una solicitud formal.
 * @param req - Request de Express con el ID de la solicitud en los parámetros y comentario en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve la solicitud rechazada o un error en caso de fallo.
 */
export const rechazarSolicitudFormal = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { comentario } = req.body;
    
    if (!req.user || !req.user.id || !req.user.rol) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    
    const esAdministrador = req.user.rol === 'administrador';
    const aprobadorId = Number(req.user.id);

    const solicitudActualizada = await aprobarSolicitudesUC.rechazarSolicitud(
      Number(id),
      comentario,
      aprobadorId,
      esAdministrador
    );

    res.status(200).json(solicitudActualizada);
  } catch (error) {
    if (error instanceof Error && error.message === 'Solicitud formal no encontrada') {
      res.status(404).json({ error: error.message });
    } else if (error instanceof Error && error.message === 'Solo se pueden rechazar solicitudes pendientes') {
      res.status(403).json({ error: error.message });
    } else if (error instanceof Error && error.message.includes('El comentario es obligatorio')) {
      res.status(400).json({ error: (error as Error).message });
    } else if (error instanceof Error) {
      res.status(400).json({ error: (error as Error).message });
    } else {
      res.status(400).json({ error: 'Unknown error' });
    }
  }
};

/**
 * Lista las solicitudes formales filtradas por estado y/o fecha.
 * @param req - Request de Express con los filtros en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un array de solicitudes formales o un error en caso de fallo.
 */
export const listarSolicitudesFormales = async (req: Request, res: Response) => {
  try {
    const estado = req.query.estado as string;
    const fecha = req.query.fecha ? new Date(req.query.fecha as string) : null;
    // Validar fecha
    if (fecha && isNaN(fecha.getTime())) {
      return res.status(400).json({ error: 'Formato de fecha inválido' });
    }

    let solicitudes = [];
    
    if (estado && fecha) {
      // Implementar en repositorio: getByEstadoYFecha()
      const porEstado = await getSolicitudesFormalesByEstadoUC.execute(estado);
      solicitudes = porEstado.filter(s => s.getFechaSolicitud().toISOString().split('T')[0] === fecha.toISOString().split('T')[0]);
    } else if (estado) {
      solicitudes = await getSolicitudesFormalesByEstadoUC.execute(estado);
    } else if (fecha) {
      solicitudes = await getSolicitudesFormalesByFechaUC.execute(fecha);
    } else {
      // Si no hay filtros, obtener todas
      solicitudes = await solicitudFormalRepo.getAllSolicitudesFormales();
    }

    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

/**
 * Obtiene las solicitudes formales de un comerciante por su ID y estado.
 * @param req - Request de Express con el ID del comerciante y estado en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un array de solicitudes formales o un error en caso de fallo.
 */
export const actualizarSolicitudFormal = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updates = req.body;
    const userId = parseInt(req.user?.id ?? '0', 10);
    const userRole = req.user?.rol;
    
    const solicitudExistente = await getSolicitudFormalByIdUC.execute(id);
    if (!solicitudExistente) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Validar y convertir referentes si se proporcionan
    if (updates.referentes) {
      if (!Array.isArray(updates.referentes)) {
        return res.status(400).json({ error: 'Referentes debe ser un array' });
      }

      
      
      const referentesInstances = updates.referentes.map((ref: any) => {
        if (!ref.nombreCompleto || !ref.apellido || !ref.vinculo || !ref.telefono) {
          throw new Error('Cada referente debe tener: nombreCompleto, apellido, vinculo y telefono');
        }
        return new Referente(
          ref.nombreCompleto,
          ref.apellido,
          ref.vinculo,
          ref.telefono
        );
      });
      
      solicitudExistente.setReferentes(referentesInstances);
    }

    // Actualizar campos del cliente
    if (updates.cliente) {
      const cliente = updates.cliente;
      
      if (cliente.nombreCompleto !== undefined) solicitudExistente.setNombreCompleto(cliente.nombreCompleto);
      if (cliente.apellido !== undefined) solicitudExistente.setApellido(cliente.apellido);
      if (cliente.dni !== undefined) solicitudExistente.setDni(cliente.dni);
      if (cliente.telefono !== undefined) solicitudExistente.setTelefono(cliente.telefono);
      if (cliente.email !== undefined) solicitudExistente.setEmail(cliente.email);
      if (cliente.aceptaTarjeta !== undefined) solicitudExistente.setAceptaTarjeta(cliente.aceptaTarjeta);
      if (cliente.domicilio !== undefined) solicitudExistente.setDomicilio(cliente.domicilio);
      if (cliente.datosEmpleador !== undefined) solicitudExistente.setDatosEmpleador(cliente.datosEmpleador);
      
      // Manejar conversión de fecha
      if (cliente.fechaNacimiento !== undefined) {
        solicitudExistente.setFechaNacimiento(new Date(cliente.fechaNacimiento));
      }
      
      // Manejar recibo (base64 a Buffer)
    if (cliente.recibo !== undefined) {
      const reciboBuffer = Buffer.from(cliente.recibo, 'base64');
      
      // Validar que sea JPG
      if (!(reciboBuffer[0] === 0xFF && reciboBuffer[1] === 0xD8 && reciboBuffer[2] === 0xFF)) {
        return res.status(400).json({ error: 'El recibo debe ser una imagen JPG válida' });
      }
      
      solicitudExistente.setRecibo(reciboBuffer);
    }
    }

    
    const solicitudActualizada = await updateSolicitudFormalUC.execute(solicitudExistente, userId);
    res.status(200).json(solicitudActualizada);
  } catch (error) {
    if ((error as Error).message === 'Solicitud no encontrada') {
      res.status(404).json({ error: (error as Error).message });
    } else if ((error as Error).message.includes('Cada referente debe tener')) {
      res.status(400).json({ error: (error as Error).message });
    } else {
      res.status(400).json({ error: (error as Error).message });
    }
  }
};

/**
 * Obtiene el detalle de una solicitud formal por su ID.
 * @param req - Request de Express con el ID de la solicitud en los parámetros.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve el detalle de la solicitud formal o un error en caso de fallo.
 * @throws 404 si la solicitud no existe.
 */
export const obtenerDetalleSolicitudFormal = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const solicitud = await getSolicitudFormalByIdUC.execute(id);
    
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.status(200).json(solicitud);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

/**
 * Lista las solicitudes iniciales de un comerciante filtradas por estado.
 * @param req - Request de Express con el id del comerciante y el estado en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un array de solicitudes iniciales o un error en caso de fallo.
 * @throws 400 si faltan parámetros obligatorios.
 */
export const listarSolicitudesInicialesByComercianteYEstado = async (req: Request, res: Response) => {
    try {
        const comercianteId = req.query.id ? parseInt(req.query.id as string) : undefined;
        const estado = req.query.estado as string;

        // Validar parámetros
        if (!comercianteId || !estado) {
            return res.status(400).json({ error: 'Se requieren id y estado' });
        }
        // Filtro combinado
        const useCase = getSolicitudesInicialesByComercianteYEstado;
        const solicitudes = await useCase.execute(comercianteId, estado);
        res.json(solicitudes);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
};

/**
 * Lista las solicitudes formales de un comerciante filtradas por estado.
 * @param req - Request de Express con el id del comerciante y el estado en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un array de solicitudes formales o un error en caso de fallo.
 * @throws 400 si faltan parámetros obligatorios.
 */
export const listarSolicitudesFormalesByComercianteYEstado = async (req: Request, res: Response) => {
    try {
        const comercianteId = req.query.id ? parseInt(req.query.id as string) : undefined;
        const estado = req.query.estado as string;

        // Validar parámetros
        if (!comercianteId || !estado) {
            return res.status(400).json({ error: 'Se requieren id y estado' });
        }
        // Filtro combinado
        const useCase = new GetSolicitudesFormalesByComercianteYEstadoUseCase(solicitudFormalRepo);
        const solicitudes = await useCase.execute(comercianteId, estado);
        res.json(solicitudes);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
};

/**
 * Lista todas las solicitudes formales de un comerciante por su ID.
 * @param req - Request de Express con el id del comerciante en los parámetros.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un array de solicitudes formales o un error en caso de fallo.
 * @throws 400 si falta el parámetro id.
 */
export const listarSolicitudesFormalesByComerciante = async (req: Request, res: Response) => {
    try {
        const comercianteId = req.params.id;
        // Validar parámetros
        if (!comercianteId) {
            return res.status(400).json({ error: 'Se requieren id' });
        }
        // Filtro combinado
        const useCase = new GetSolicitudesFormalesByComercianteIdUseCase(solicitudFormalRepo);
        const solicitudes = await useCase.execute(Number(comercianteId));
        res.json(solicitudes);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
};

/**
 * Aprueba una solicitud inicial por su ID.
 * @param req - Request de Express con el id de la solicitud en los parámetros y comentario en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve la solicitud aprobada o un error en caso de fallo.
 * @throws 401 si el usuario no está autenticado.
 */
export const aprobarSolicitudInicial = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { comentario } = req.body;
        if (!req.user?.id || !req.user?.rol) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const esAdministrador = req.user.rol === 'administrador';
        const aprobadorId = Number(req.user.id);
        const solicitudActualizada = await aprobarRechazarSolicitudInicialUC.aprobarSolicitud(
            Number(id),
            aprobadorId,
            esAdministrador,
            comentario
        );
        res.status(200).json(solicitudActualizada);
    } catch (error: any) {
        handleErrorResponse(res, error);
    }
};

/**
 * Rechaza una solicitud inicial por su ID.
 * @param req - Request de Express con el id de la solicitud en los parámetros y comentario en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve la solicitud rechazada o un error en caso de fallo.
 * @throws 401 si el usuario no está autenticado.
 */
export const rechazarSolicitudInicial = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { comentario } = req.body;
        if (!req.user?.id || !req.user?.rol) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const esAdministrador = req.user.rol === 'administrador';
        const aprobadorId = Number(req.user.id);
        const solicitudActualizada = await aprobarRechazarSolicitudInicialUC.rechazarSolicitud(
            Number(id),
            comentario,
            aprobadorId,
            esAdministrador
        );
        res.status(200).json(solicitudActualizada);
    } catch (error: any) {
        handleErrorResponse(res, error);
    }
};

// Función auxiliar para manejar respuestas de error de forma uniforme.
function handleErrorResponse(res: Response, error: any) {
    const message = error.message || 'Error desconocido';
    if (message.includes('no encontrada')) {
        res.status(404).json({ error: message });
    } else if (message.includes('pendientes') || message.includes('obligatorio')) {
        res.status(400).json({ error: message });
    } else {
        res.status(500).json({ error: message });
    }
}
