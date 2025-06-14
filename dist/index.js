"use strict";
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
// src/index.ts
require("dotenv/config");
const http_server_1 = require("./infrastructure/server/http.server");
const routes_1 = __importDefault(require("./infrastructure/routes/routes"));
const AppConfig_1 = require("./infrastructure/config/server/AppConfig");
require("./infrastructure/adapters/cron/ExpirarSolicitudesCron"); // Importar cron para que se ejecute al iniciar
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Crear servidor HTTP con el router principal
        const app = (0, http_server_1.createHTTPServer)(routes_1.default);
        app.listen(AppConfig_1.appConfig.port, () => {
            console.log(`
      🚀 Servidor en ejecución en modo ${AppConfig_1.appConfig.environment.toUpperCase()}
      ✅ Puerto: ${AppConfig_1.appConfig.port}
      ✅ Base URL: http://localhost:${AppConfig_1.appConfig.port}/API/v1
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
