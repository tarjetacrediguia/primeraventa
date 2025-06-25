//src/infrastructure/routes/controllers/Solicitudes.controller.ts

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

// Inyección de dependencias (deberían venir de un contenedor DI)
const verazService: VerazPort = new VerazAdapter();
const notificationService: NotificationPort = new NotificationAdapter();
const solicitudInicialRepo: SolicitudInicialRepositoryPort = new SolicitudInicialRepositoryAdapter();
const contratoRepo: ContratoRepositoryPort = new ContratoRepositoryAdapter();
const solicitudFormalRepo: SolicitudFormalRepositoryPort = new SolicitudFormalRepositoryAdapter();
const permisoRepo: PermisoRepositoryPort = new PermisoRepositoryAdapter();
const clienteRepository = new ClienteRepositoryAdapter();

// Casos de uso inicializados
const crearSolicitudInicialUC = new CrearSolicitudInicialUseCase(
  solicitudInicialRepo,
  contratoRepo,
  solicitudFormalRepo,
  verazService,
  notificationService,
  clienteRepository
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
  clienteRepository
);

const aprobarSolicitudesUC = new AprobarSolicitudesFormalesUseCase(
  solicitudFormalRepo,
  notificationService
);

const getSolicitudesFormalesByEstadoUC = new GetSolicitudesFormalesByEstadoUseCase(solicitudFormalRepo);
const getSolicitudesFormalesByFechaUC = new GetSolicitudesFormalesByFechaUseCase(solicitudFormalRepo);
const updateSolicitudFormalUC = new UpdateSolicitudFormalUseCase(solicitudFormalRepo);
const getSolicitudFormalByIdUC = new GetSolicitudesFormalesByIdUseCase(solicitudFormalRepo);

// Controladores
export const crearSolicitudInicial = async (req: Request, res: Response) => {
  try {
    const { dniCliente, cuilCliente, reciboSueldo } = req.body;
    console.log(`Creando solicitud inicial para cliente DNI: ${dniCliente}, CUIL: ${cuilCliente}`);
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    const comercianteId = Number(req.user.id);
    console.log(`Creando solicitud inicial para comerciante ID: ${comercianteId}`);

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

export const listarSolicitudesIniciales = async (req: Request, res: Response) => {
  try {
    const estado = req.query.estado as string;
    console.log(`Listando solicitudes iniciales con estado: ${estado}`);
    const solicitudes = await getSolicitudesInicialesByEstadoUC.execute(estado);
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const verificarEstadoCrediticio = async (req: Request, res: Response) => {
  try {
    const { dni, cuil } = req.body;
    const resultado = await verazService.checkClienteStatus(dni);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const crearSolicitudFormal = async (req: Request, res: Response) => {
  try {
    const { idSolicitudInicial, cliente, referentes } = req.body;
    console.log(`Creando solicitud formal para solicitud inicial ID: ${idSolicitudInicial}`);
    
    // Validar campos obligatorios
    /*
    if (!cliente.recibo) {
      return res.status(400).json({ error: 'El recibo es obligatorio' });
    }
*/
    // Validar que se proporcionen exactamente dos referentes
    if (!referentes || !Array.isArray(referentes)) {
      return res.status(400).json({ error: 'Se requiere un array de referentes' });
    }
    if (referentes.length !== 2) {
      return res.status(400).json({ error: 'Se requieren exactamente dos referentes' });
    }

    // Validar estructura de cada referente
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
        recibo: Buffer.from(cliente.recibo, 'base64') ,
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

export const actualizarSolicitudFormal = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updates = req.body;
    
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
        solicitudExistente.setRecibo(Buffer.from(cliente.recibo, 'base64'));
      }
    }

    console.log(`Actualizando solicitud formal ID: ${id} con datos:`, updates);
    
    const solicitudActualizada = await updateSolicitudFormalUC.execute(solicitudExistente);
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