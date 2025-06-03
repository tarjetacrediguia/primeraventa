// src/index.ts
import "dotenv/config";
import { createHTTPServer } from "./infrastructure/server/http.server";
import router from "./infrastructure/routes/routes";
import { appConfig } from "./infrastructure/config/server/AppConfig";

const start = async () => {
  try {
    // Crear servidor HTTP con el router principal
    const app = createHTTPServer(router);

    app.listen(appConfig.port, () => {
      console.log(`
      🚀 Servidor en ejecución en modo ${appConfig.environment.toUpperCase()}
      ✅ Puerto: ${appConfig.port}
      ✅ Base URL: http://localhost:${appConfig.port}/API/v1
      ✅ JWT Secret: ${appConfig.jwtSecret ? 'Configurado' : 'NO configurado!'}
      `);
    });
  } catch (error) {
    console.error("⛔ Error crítico durante el inicio:", error);
    process.exit(1);
  }
};

start();