// src/infrastructure/cron/ExpirarSolicitudesCron.ts

/**
 * MÓDULO: Tarea Programada de Expiración de Solicitudes
 *
 * Este archivo implementa una tarea programada (cron job) que se ejecuta automáticamente
 * para gestionar la expiración de solicitudes iniciales que han superado su tiempo límite.
 * 
 * Responsabilidades:
 * - Ejecutar automáticamente la expiración de solicitudes vencidas
 * - Notificar a usuarios sobre solicitudes expiradas
 * - Actualizar el estado de solicitudes en la base de datos
 * - Registrar eventos en el historial del sistema
 * - Gestionar notificaciones automáticas
 * 
 * Programación: Se ejecuta todos los días a la 1:00 AM
 * 
 * @author Sistema de Gestión
 * @version 1.0.0
 */

import cron from 'node-cron';
import { SolicitudInicialRepositoryAdapter } from '../repository/SolicitudInicialRepositoryAdapter';
import { ConfiguracionRepositoryAdapter } from '../repository/ConfiguracionRepositoryAdapter';
import { ClienteRepositoryAdapter } from '../repository/ClienteRepositoryAdapter';
import { NotificationAdapter } from '../notification/NotificationAdapter';
import { ExpirarSolicitudesInicialesUseCase } from '../../../application/use-cases/tareas/ExpirarSolicitudesInicialesUseCase';
import { ComercianteRepositoryAdapter } from '../repository/ComercianteRepositoryAdapter';
import { AnalistaRepositoryAdapter } from '../repository/AnalistaRepositoryAdapter';
import { HistorialRepositoryAdapter } from '../repository/HistorialRepositoryAdapter';

/**
 * Tarea programada que ejecuta automáticamente la expiración de solicitudes iniciales.
 * 
 * Esta tarea se ejecuta diariamente a la 1:00 AM y realiza las siguientes acciones:
 * - Identifica solicitudes iniciales que han superado su tiempo límite
 * - Actualiza el estado de las solicitudes a "expirada"
 * - Envía notificaciones a los usuarios afectados
 * - Registra los eventos en el historial del sistema
 * - Gestiona las configuraciones de expiración del sistema
 * 
 * @cron '0 1 * * *' - Ejecución diaria a la 1:00 AM
 */
cron.schedule('0 1 * * *', async () => {
    try {
        // Inicialización de adaptadores de repositorio
        const solicitudRepo = new SolicitudInicialRepositoryAdapter();
        const configRepo = new ConfiguracionRepositoryAdapter();
        const clienteRepo = new ClienteRepositoryAdapter();
        const comercianteRepository = new ComercianteRepositoryAdapter();
        const analistaRepository = new AnalistaRepositoryAdapter();
        const notificationService = new NotificationAdapter();
        const historialRepository = new HistorialRepositoryAdapter();
        
        // Creación y ejecución del caso de uso
        const useCase = new ExpirarSolicitudesInicialesUseCase(
            solicitudRepo, 
            configRepo,
            clienteRepo,
            analistaRepository,
            comercianteRepository,
            notificationService,
            historialRepository
        );
        
        // Ejecutar la tarea de expiración
        await useCase.execute();
        
    } catch (error) {
        console.error('❌ Error en la tarea de expiración de solicitudes:', error);
    }
});
