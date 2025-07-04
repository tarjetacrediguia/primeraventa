// src/infrastructure/cron/ExpirarSolicitudesCron.ts
import cron from 'node-cron';
import { SolicitudInicialRepositoryAdapter } from '../repository/SolicitudInicialRepositoryAdapter';
import { ConfiguracionRepositoryAdapter } from '../repository/ConfiguracionRepositoryAdapter';
import { ClienteRepositoryAdapter } from '../repository/ClienteRepositoryAdapter';
import { NotificationAdapter } from '../notification/NotificationAdapter';
import { ExpirarSolicitudesInicialesUseCase } from '../../../application/use-cases/tareas/ExpirarSolicitudesInicialesUseCase';
import { ComercianteRepositoryAdapter } from '../repository/ComercianteRepositoryAdapter';
import { AnalistaRepositoryAdapter } from '../repository/AnalistaRepositoryAdapter';
import { HistorialRepositoryAdapter } from '../repository/HistorialRepositoryAdapter';

// Ejecutar todos los días a la 1:00 AM
cron.schedule('0 1 * * *', async () => {
    try {
        const solicitudRepo = new SolicitudInicialRepositoryAdapter();
        const configRepo = new ConfiguracionRepositoryAdapter();
        const clienteRepo = new ClienteRepositoryAdapter();
        const comercianteRepository = new ComercianteRepositoryAdapter();
        const analistaRepository = new AnalistaRepositoryAdapter();
        const notificationService = new NotificationAdapter();
        const historialRepository = new HistorialRepositoryAdapter();
        
        const useCase = new ExpirarSolicitudesInicialesUseCase(
            solicitudRepo, 
            configRepo,
            clienteRepo,
            analistaRepository,
            comercianteRepository,
            notificationService,
            historialRepository
        );
        
        await useCase.execute();
        
    } catch (error) {
        console.error('❌ Error en la tarea de expiración de solicitudes:', error);
    }
});
