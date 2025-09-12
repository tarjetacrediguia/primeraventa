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
import { GetSolicitudesFormalesByComercianteYEstadoUseCase } from '../../../application/use-cases/SolicitudFormal/GetSolicitudesFormalesByComercianteYEstadoUseCase';
import { HistorialRepositoryAdapter } from '../../adapters/repository/HistorialRepositoryAdapter';
import { GetSolicitudesFormalesByComercianteIdUseCase } from '../../../application/use-cases/SolicitudFormal/GetSolicitudesFormalesByComercianteIdUseCase';
import { AprobarRechazarSolicitudInicialUseCase } from '../../../application/use-cases/SolicitudInicial/AprobarRechazarSolicitudInicialUseCase';
import { SolicitudInicial } from '../../../domain/entities/SolicitudInicial';
import { ListSolicitudesInicialesUseCase } from '../../../application/use-cases/SolicitudInicial/ListSolicitudesInicialesUseCase';
import { ConfiguracionRepositoryAdapter } from '../../adapters/repository/ConfiguracionRepositoryAdapter';
import { CompraRepositoryAdapter } from '../../adapters/repository/CompraRepositoryAdapter';
import { CrearYAprobarSolicitudFormalUseCase } from '../../../application/use-cases/SolicitudFormal/CrearYAprobarSolicitudFormalUseCase';
import { GetSolicitudesInicialesByComercianteUseCase } from '../../../application/use-cases/SolicitudInicial/GetSolicitudesInicialesByComercianteUseCase';
import { GetSolicitudFormalBySolicitudInicialIdUseCase } from '../../../application/use-cases/SolicitudFormal/GetSolicitudFormalBySolicitudInicialIdUseCase';
import { NosisAdapter } from '../../adapters/nosis/nosisAdapter';
import { MockNosisAdapter } from '../../adapters/nosis/mockNosisAdapter';
import { GetComercianteByIdUseCase } from '../../../application/use-cases/Comerciante/GetComercianteByIdUseCase';
import { ComercianteRepositoryAdapter } from '../../adapters/repository/ComercianteRepositoryAdapter';
import { ObtenerDatosClienteComercianteUseCase } from '../../../application/use-cases/Cliente/ObtenerDatosClienteComercianteUseCase';
import { ArchivoAdjunto } from '../../../domain/entities/ArchivosAdjuntos';

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
const getSolicitudesInicialesByComerciante = new GetSolicitudesInicialesByComercianteUseCase(solicitudInicialRepo)
const configuracionRepo = new ConfiguracionRepositoryAdapter();
const compraRepository = new CompraRepositoryAdapter();
const nosisAdapter = process.env.MODO_TEST === "true" 
    ? new MockNosisAdapter() 
    : new NosisAdapter('https://ws01.nosis.com/rest/variables', process.env.API_KEY || '');

// Casos de uso inicializados
const crearSolicitudInicialUC = new CrearSolicitudInicialUseCase(
  solicitudInicialRepo,
  contratoRepo,
  solicitudFormalRepo,
  notificationService,
  clienteRepository,
  historialRepository,
  analistaRepository,
  nosisAdapter,
  process.env.NOSIS_AUTO === 'true' // Modo automático de Veraz
);

const getComerciantePorIdUC = new GetComercianteByIdUseCase( new ComercianteRepositoryAdapter());

const aprobarRechazarSolicitudInicialUC = new AprobarRechazarSolicitudInicialUseCase(
    solicitudInicialRepo,
    notificationService,
    historialRepository,
    clienteRepository
);

const getSolicitudesInicialesByEstadoUC = new GetSolicitudesInicialesByEstadoUseCase(solicitudInicialRepo);

const crearSolicitudFormalUC = new CrearSolicitudFormalUseCase(
  solicitudInicialRepo,
  solicitudFormalRepo,
  permisoRepo,
  notificationService,
  new AnalistaRepositoryAdapter(),
  contratoRepo,
  clienteRepository,
  historialRepository,
  configuracionRepo
);

const aprobarSolicitudesUC = new AprobarSolicitudesFormalesUseCase(
  solicitudFormalRepo,
  notificationService,
  historialRepository,
  compraRepository
);

const crearYAprobarSolicitudFormalUC = new CrearYAprobarSolicitudFormalUseCase(
  crearSolicitudFormalUC,
  aprobarSolicitudesUC,
  permisoRepo
);

const getSolicitudFormalBySolicitudInicialIdUC = new GetSolicitudFormalBySolicitudInicialIdUseCase(solicitudFormalRepo);
const getSolicitudesFormalesByEstadoUC = new GetSolicitudesFormalesByEstadoUseCase(solicitudFormalRepo);
const getSolicitudesFormalesByFechaUC = new GetSolicitudesFormalesByFechaUseCase(solicitudFormalRepo);
const updateSolicitudFormalUC = new UpdateSolicitudFormalUseCase(solicitudFormalRepo,historialRepository);
const getSolicitudFormalByIdUC = new GetSolicitudesFormalesByIdUseCase(solicitudFormalRepo);
const listSolicitudesInicialesUC = new ListSolicitudesInicialesUseCase(solicitudInicialRepo);
const obtenerDatosClienteComercianteUC = new ObtenerDatosClienteComercianteUseCase(clienteRepository);

/**
 * Crea una nueva solicitud inicial.
 * @param req - Request de Express con los datos del cliente y recibo en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve la solicitud creada o un error en caso de fallo.
 */
export const crearSolicitudInicial = async (req: Request, res: Response) => {
  try {
    const { dniCliente, cuilCliente } = req.body;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    const comercianteId = Number(req.user.id);

    const result  = await crearSolicitudInicialUC.execute(
      dniCliente,
      cuilCliente,
      comercianteId
    );

    const nombreComercio = await getComerciantePorIdUC.execute(comercianteId).then(c => c ? c.getNombreComercio() : 'N/A');

    const response = {
        ...result.solicitud.toPlainObject(),
        nosisData: result.nosisData,
        motivoRechazo: result.motivoRechazo,
        reglasFallidas: result.reglasFallidas,
        nombreComercio: nombreComercio
    };

    res.status(201).json(response);
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
        let solicitudes: SolicitudInicial[];
        
        if (estado) {
            // Filtrar por estado si se proporciona
            solicitudes = await getSolicitudesInicialesByEstadoUC.execute(estado);
        } else {
            // Obtener todas las solicitudes si no hay filtro
            solicitudes = await listSolicitudesInicialesUC.execute();
        }
        
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
  //TODO: cambiar nombre de cliente a DatosCliente para no generar confusión con el cliente de la API
  try {
    const { idSolicitudInicial, cliente, referentes,importeNeto,solicitaAmpliacionDeCredito,comentarioInicial,datosEmpleador,archivosAdjuntos  } = req.body;
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

    // Procesar archivos adjuntos
    const archivosValidos: Array<{nombre: string, tipo: string, contenido: Buffer}> = [];
    
    if (archivosAdjuntos && Array.isArray(archivosAdjuntos)) {
      for (const archivo of archivosAdjuntos) {
        if (!archivo.nombre || !archivo.tipo || !archivo.contenido) {
          return res.status(400).json({ error: 'Cada archivo adjunto debe tener: nombre, tipo y contenido' });
        }
        
        const contenidoBuffer = Buffer.from(archivo.contenido, 'base64');
        
        // Validar tipo y tamaño (5MB máximo)
        if (!validarArchivo(contenidoBuffer, archivo.tipo)) {
          return res.status(400).json({ error: `Tipo de archivo no permitido: ${archivo.nombre}` });
        }
        
        if (contenidoBuffer.length > 5 * 1024 * 1024) {
          return res.status(400).json({ error: `El archivo ${archivo.nombre} excede el tamaño máximo de 5MB` });
        }
        
        archivosValidos.push({
          nombre: archivo.nombre,
          tipo: archivo.tipo,
          contenido: contenidoBuffer
        });
      }
    }

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
        telefono: cliente.telefono,
        email: cliente.email,
        recibo: cliente.recibo, // Ahora es un Buffer
        aceptaTarjeta: cliente.aceptaTarjeta,
        fechaNacimiento: new Date(cliente.fechaNacimiento),
        domicilio: cliente.domicilio,
        numeroDomicilio: cliente.numeroDomicilio,
        referentes: referentesInstances,
        importeNeto: importeNeto,
        sexo: cliente.sexo,
        codigoPostal: cliente.codigoPostal,
        localidad: cliente.localidad,
        provincia: cliente.provincia,
        barrio: cliente.barrio,
        archivosAdjuntos: archivosValidos
      },
      comentarioInicial,
      solicitaAmpliacionDeCredito,
      datosEmpleador

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

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47 &&
        buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A) {
      return 'image/png';
    }
    
    // WEBP: 52 49 46 46 xx xx xx xx 57 45 42 50
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
      return 'image/webp';
    }
    
    // GIF: 47 49 46 38
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && 
        (buffer[3] === 0x37 || buffer[3] === 0x39) && buffer[4] === 0x61) {
      return 'image/gif';
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
    const { comentario } = req.body;
    
    if (!req.user || !req.user.id || !req.user.rol) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    
    const aprobadorId = Number(req.user.id);

    const solicitudActualizada = await aprobarSolicitudesUC.aprobarSolicitud(
      Number(id),
      aprobadorId,
      req.user.rol,
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

    console.log('Actualizando solicitud formal ID:', id, 'con datos:', updates, 'por usuario ID:', userId, 'rol:', userRole);
    
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
      if (cliente.telefono !== undefined) solicitudExistente.setTelefono(cliente.telefono);
      if (cliente.email !== undefined) solicitudExistente.setEmail(cliente.email);
      if (cliente.aceptaTarjeta !== undefined) solicitudExistente.setAceptaTarjeta(cliente.aceptaTarjeta);
      if (cliente.domicilio !== undefined) solicitudExistente.setDomicilio(cliente.domicilio);
      if (cliente.sexo !== undefined) solicitudExistente.setSexo(cliente.sexo);
      if (cliente.codigoPostal !== undefined) solicitudExistente.setCodigoPostal(cliente.codigoPostal);
      if (cliente.localidad !== undefined) solicitudExistente.setLocalidad(cliente.localidad);
      if (cliente.provincia !== undefined) solicitudExistente.setProvincia(cliente.provincia);
      if (cliente.numeroDomicilio !== undefined) solicitudExistente.setNumeroDomicilio(cliente.numeroDomicilio);
      if (cliente.barrio !== undefined) solicitudExistente.setBarrio(cliente.barrio);
      
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

    // Actualizar campos del empleador
    if (updates.datosEmpleador) {
      const empleador = updates.datosEmpleador;
      if (empleador.razonSocialEmpleador !== undefined) solicitudExistente.setRazonSocialEmpleador(empleador.razonSocialEmpleador);
      if (empleador.cuitEmpleador !== undefined) solicitudExistente.setCuitEmpleador(empleador.cuitEmpleador);
      if (empleador.cargoEmpleador !== undefined) solicitudExistente.setCargoEmpleador(empleador.cargoEmpleador);
      if (empleador.sectorEmpleador !== undefined) solicitudExistente.setSectorEmpleador(empleador.sectorEmpleador);
      if (empleador.codigoPostalEmpleador !== undefined) solicitudExistente.setCodigoPostalEmpleador(empleador.codigoPostalEmpleador);
      if (empleador.localidadEmpleador !== undefined) solicitudExistente.setLocalidadEmpleador(empleador.localidadEmpleador);
      if (empleador.provinciaEmpleador !== undefined) solicitudExistente.setProvinciaEmpleador(empleador.provinciaEmpleador);
      if (empleador.telefonoEmpleador !== undefined) solicitudExistente.setTelefonoEmpleador(empleador.telefonoEmpleador);
    }

    // Procesar archivos adjuntos si se proporcionan
    if (updates.archivosAdjuntos) {
      if (!Array.isArray(updates.archivosAdjuntos)) {
        return res.status(400).json({ error: 'Archivos adjuntos debe ser un array' });
      }
      
      const archivosValidos: ArchivoAdjunto[] = [];
      
      for (const archivo of updates.archivosAdjuntos) {
        if (!archivo.nombre || !archivo.tipo || !archivo.contenido) {
          return res.status(400).json({ error: 'Cada archivo adjunto debe tener: nombre, tipo y contenido' });
        }
        
        const contenidoBuffer = Buffer.from(archivo.contenido, 'base64');
        
        // Validar tipo y tamaño
        if (!validarArchivo(contenidoBuffer, archivo.tipo)) {
          return res.status(400).json({ error: `Tipo de archivo no permitido: ${archivo.nombre}` });
        }
        
        if (contenidoBuffer.length > 5 * 1024 * 1024) {
          return res.status(400).json({ error: `El archivo ${archivo.nombre} excede el tamaño máximo de 5MB` });
        }
        
        archivosValidos.push(new ArchivoAdjunto(
          archivo.id || 0, // Si tiene ID, es un archivo existente
          archivo.nombre,
          archivo.tipo,
          contenidoBuffer
        ));
      }
      
      solicitudExistente.setArchivosAdjuntos(archivosValidos);
    }

    console.log('Solicitud antes de actualizar:', solicitudExistente.toPlainObject());
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
export const listarSolicitudesInicialesByComerciante = async (req: Request, res: Response) => {
    try {
        const comercianteId = req.user?.id;

        // Headers cruciales
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Authorization, X-Total-Count');

        // Validar parámetros
        if (!comercianteId) {
            return res.status(400).json({ error: 'Se requieren id y estado' });
        }
        // Filtro combinado
        const useCase = getSolicitudesInicialesByComerciante;
        const solicitudes = await useCase.execute(Number(comercianteId));
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

export const obtenerSolicitudFormalAnalista = async (req: Request, res: Response) => {
    try {
        const idSolicitudInicial = Number(req.params.idSolicitudInicial);
        
        const solicitud = await getSolicitudFormalBySolicitudInicialIdUC.execute(idSolicitudInicial);

        console.log('Solicitud formal obtenida:', solicitud);
        
        if (!solicitud) {
            return res.status(404).json({ error: 'Solicitud formal no encontrada' });
        }
        
        // Para analistas, devolvemos todos los datos incluyendo el recibo
        const obj = solicitud.toPlainObject();
        res.status(200).json(obj);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const obtenerSolicitudFormalPoridSolicitudInicial = async (req: Request, res: Response) => {
    try {
        const idSolicitudInicial = Number(req.params.idSolicitudInicial); // Ahora es el ID de la solicitud inicial
        const solicitud = await getSolicitudFormalBySolicitudInicialIdUC.execute(idSolicitudInicial);
        
        if (!solicitud) {
            return res.status(404).json({ error: 'Solicitud formal no encontrada' });
        }
        
        // Verificar que el comerciante solo pueda acceder a sus propias solicitudes
        if (req.user?.rol === 'comerciante') {
            const comercianteId = Number(req.user.id);
            if (solicitud.getComercianteId() !== comercianteId) {
                return res.status(403).json({ error: 'No tienes permisos para acceder a esta solicitud' });
            }
        }
        
        const obj = solicitud.toPlainObject();
        delete obj.recibo; // Elimina el recibo del objeto para no enviarlo al cliente
        res.status(200).json(obj);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

/**
 * Obtiene una solicitud formal por ID con verificación de pertenencia al comerciante
 * @param req - Request de Express con el ID de la solicitud en los parámetros
 * @param res - Response de Express para enviar la respuesta
 * @returns Devuelve la solicitud formal si existe y pertenece al comerciante
 */
export const obtenerSolicitudFormalPorIdComerciante = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const solicitud = await getSolicitudFormalByIdUC.execute(id);
        
        if (!solicitud) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        // Verificar que el comerciante solo pueda acceder a sus propias solicitudes
        if (req.user?.rol === 'comerciante') {
            const comercianteId = Number(req.user.id);
            if (solicitud.getComercianteId() !== comercianteId) {
                return res.status(403).json({ error: 'No tienes permisos para acceder a esta solicitud' });
            }
        }
        const obj = solicitud.toPlainObject();
        delete obj.recibo;//elimina el recibo del objeto para no enviarlo al cliente
        res.status(200).json(obj);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
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
        const comercianteId = req.user?.id;
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

export const crearYAprobarSolicitudFormal = async (req: Request, res: Response) => {
  try {
    const { idSolicitudInicial, cliente, referentes, importeNeto, solicitaAmpliacionDeCredito, comentarioInicial,datosEmpleador } = req.body;
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

    const solicitudFormal = await crearYAprobarSolicitudFormalUC.execute(
      idSolicitudInicial,
      comercianteId,
      req.user.rol,
      {
        nombreCompleto: cliente.nombreCompleto,
        apellido: cliente.apellido,
        cuil: cliente.cuil,
        telefono: cliente.telefono,
        email: cliente.email,
        recibo: cliente.recibo,
        aceptaTarjeta: cliente.aceptaTarjeta,
        fechaNacimiento: new Date(cliente.fechaNacimiento),
        domicilio: cliente.domicilio,
        datosEmpleador: cliente.datosEmpleador,
        numeroDomicilio: cliente.numeroDomicilio,
        referentes: referentesInstances,
        importeNeto: importeNeto,
        sexo: cliente.sexo,
        codigoPostal: cliente.codigoPostal,
        localidad: cliente.localidad,
        provincia: cliente.provincia,
        barrio: cliente.barrio
      },
      comentarioInicial,
      solicitaAmpliacionDeCredito,
      datosEmpleador
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

export const obtenerDatosClienteComerciante = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        
        const comercianteId = Number(req.user.id);
        const cliente = await obtenerDatosClienteComercianteUC.execute(Number(id), comercianteId);
        
        res.status(200).json(cliente.toPlainObject());
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('no encontrado') || error.message.includes('no pertenece')) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(400).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};
// Función auxiliar para validar archivos
const validarArchivo = (contenido: Buffer, tipo: string): boolean => {
  // Validar tipo MIME
  const tiposPermitidos = [
    'image/jpeg', 'image/png', 'image/gif', 'application/pdf'
  ];
  
  // Detectar tipo MIME
  let mimeType = 'application/octet-stream';
  if (contenido.length > 4) {
    // Verificar firma PDF
    if (contenido[0] === 0x25 && contenido[1] === 0x50 && contenido[2] === 0x44 && contenido[3] === 0x46) {
      mimeType = 'application/pdf';
    }
    // Verificar firma JPG
    else if (contenido[0] === 0xFF && contenido[1] === 0xD8 && contenido[2] === 0xFF) {
      mimeType = 'image/jpeg';
    }
    // Verificar firma PNG
    else if (contenido[0] === 0x89 && contenido[1] === 0x50 && contenido[2] === 0x4E && contenido[3] === 0x47) {
      mimeType = 'image/png';
    }
  }
  
  return tiposPermitidos.includes(mimeType) && mimeType === tipo;
};

export const descargarArchivoAdjunto = async (req: Request, res: Response) => {
  try {
    const { id, archivoId } = req.params;
    
    // Obtener la solicitud para verificar permisos
    const solicitud = await getSolicitudFormalByIdUC.execute(Number(id));
    
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    // Verificar permisos (solo el comerciante dueño o analistas/administradores)
    if (req.user?.rol === 'comerciante') {
      const comercianteId = Number(req.user.id);
      if (solicitud.getComercianteId() !== comercianteId) {
        return res.status(403).json({ error: 'No tienes permisos para acceder a este archivo' });
      }
    }
    
    // Obtener el archivo
    const archivo = solicitud.getArchivosAdjuntos().find(a => a.getId() === Number(archivoId));
    
    if (!archivo) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    // Configurar headers
    res.setHeader('Content-Type', archivo.getTipo());
    res.setHeader('Content-Disposition', `attachment; filename="${archivo.getNombre()}"`);
    res.setHeader('Content-Length', archivo.getContenido().length);
    
    // Enviar archivo
    res.end(archivo.getContenido());
    
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
