"use strict";
// src/index.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_server_1 = require("./infrastructure/server/http.server");
const routes_1 = __importDefault(require("./infrastructure/routes/routes"));
const AppConfig_1 = require("./infrastructure/config/server/AppConfig");
require("./infrastructure/adapters/cron/ExpirarSolicitudesCron");
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const app = (0, http_server_1.createHTTPServer)(routes_1.default);
        // Configuración de certificados SSL
        const sslOptions = {
            key: fs_1.default.readFileSync(path_1.default.resolve(__dirname, './certs/privkey.pem')),
            cert: fs_1.default.readFileSync(path_1.default.resolve(__dirname, './certs/fullchain.pem'))
        };
        // Crear servidor HTTPS
        const httpsServer = https_1.default.createServer(sslOptions, app);
        httpsServer.listen(AppConfig_1.appConfig.httpsPort, '0.0.0.0', () => {
            console.log(`
    🚀 Servidor HTTPS en ejecución en modo ${AppConfig_1.appConfig.environment.toUpperCase()}
    ✅ Puerto seguro: ${AppConfig_1.appConfig.httpsPort}
    ✅ Base URL: https://0.0.0.0:${AppConfig_1.appConfig.httpsPort}/API/v1
    ✅ JWT Secret: ${AppConfig_1.appConfig.jwtSecret ? 'Configurado' : 'NO configurado!'}
      `);
        });
    }
    catch (error) {
        console.error("⛔ Error crítico durante el inicio:", error);
        process.exit(1);
    }
});
start();
/*

 * ARCHIVO PRINCIPAL: Inicialización del Servidor
 *
 * Este archivo es el punto de entrada de la aplicación backend. Configura y levanta el servidor HTTP,
 * carga la configuración principal y ejecuta tareas programadas al iniciar.
 
import "dotenv/config";
import { createHTTPServer } from "./infrastructure/server/http.server";
import router from "./infrastructure/routes/routes";
import { appConfig } from "./infrastructure/config/server/AppConfig";
import './infrastructure/adapters/cron/ExpirarSolicitudesCron'; // Importar cron para que se ejecute al iniciar


 * Función principal para iniciar el servidor HTTP.
 * Intenta levantar el servidor y maneja errores críticos de arranque.
 * No recibe parámetros.
 * @returns No retorna valor, pero termina el proceso en caso de error crítico.
 
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
*/ 
