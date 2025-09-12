// src/index.ts

/*
 * ARCHIVO PRINCIPAL: Inicialización del Servidor
 *
 * Este archivo es el punto de entrada de la aplicación backend. Configura y levanta el servidor HTTP,
 * carga la configuración principal y ejecuta tareas programadas al iniciar.
 */
import "dotenv/config";
import { createHTTPServer } from "./infrastructure/server/http.server";
import router from "./infrastructure/routes/routes";
import { appConfig } from "./infrastructure/config/server/AppConfig";
import './infrastructure/adapters/cron/ExpirarSolicitudesCron'; // Importar cron para que se ejecute al iniciar

/*
 * Función principal para iniciar el servidor HTTP.
 * Intenta levantar el servidor y maneja errores críticos de arranque.
 * No recibe parámetros.
 * @returns No retorna valor, pero termina el proceso en caso de error crítico.
 */
const start = async () => {
  try {
    // Crear servidor HTTP con el router principal
    const app = createHTTPServer(router);

        app.listen(appConfig.port, '0.0.0.0', () => {
          console.log(`
    🚀 Servidor en ejecución en modo ${appConfig.environment.toUpperCase()}
    ✅ Puerto: ${appConfig.port}
    ✅ Base URL: http://0.0.0.0:${appConfig.port}/API/v1
    ✅ JWT Secret: ${appConfig.jwtSecret ? 'Configurado' : 'NO configurado!'}
          `);
        });
  } catch (error) {
    console.error("⛔ Error crítico durante el inicio:", error);
    process.exit(1);
  }
};

start();
