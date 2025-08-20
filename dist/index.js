"use strict";
// src/index.ts
/*
import "dotenv/config";
import { createHTTPServer } from "./infrastructure/server/http.server";
import router from "./infrastructure/routes/routes";
import { appConfig } from "./infrastructure/config/server/AppConfig";
import './infrastructure/adapters/cron/ExpirarSolicitudesCron';
import https from 'https';
import fs from 'fs';
import path from 'path';

const start = async () => {
  try {
    const app = createHTTPServer(router);
    
    // Configuración de certificados SSL
    const sslOptions = {
      key: fs.readFileSync(path.resolve(__dirname, './certs/privkey.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './certs/fullchain.pem'))
    };

    // Crear servidor HTTPS
    const httpsServer = https.createServer(sslOptions, app);

    httpsServer.listen(appConfig.httpsPort, '0.0.0.0', () => {
      console.log(`
    🚀 Servidor HTTPS en ejecución en modo ${appConfig.environment.toUpperCase()}
    ✅ Puerto seguro: ${appConfig.httpsPort}
    ✅ Base URL: https://0.0.0.0:${appConfig.httpsPort}/API/v1
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
/*
 * ARCHIVO PRINCIPAL: Inicialización del Servidor
 *
 * Este archivo es el punto de entrada de la aplicación backend. Configura y levanta el servidor HTTP,
 * carga la configuración principal y ejecuta tareas programadas al iniciar.
 */
require("dotenv/config");
const http_server_1 = require("./infrastructure/server/http.server");
const routes_1 = __importDefault(require("./infrastructure/routes/routes"));
const AppConfig_1 = require("./infrastructure/config/server/AppConfig");
require("./infrastructure/adapters/cron/ExpirarSolicitudesCron"); // Importar cron para que se ejecute al iniciar
/*
 * Función principal para iniciar el servidor HTTP.
 * Intenta levantar el servidor y maneja errores críticos de arranque.
 * No recibe parámetros.
 * @returns No retorna valor, pero termina el proceso en caso de error crítico.
 */
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Crear servidor HTTP con el router principal
        const app = (0, http_server_1.createHTTPServer)(routes_1.default);
        app.listen(AppConfig_1.appConfig.port, '0.0.0.0', () => {
            console.log(`
    🚀 Servidor en ejecución en modo ${AppConfig_1.appConfig.environment.toUpperCase()}
    ✅ Puerto: ${AppConfig_1.appConfig.port}
    ✅ Base URL: http://0.0.0.0:${AppConfig_1.appConfig.port}/API/v1
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
