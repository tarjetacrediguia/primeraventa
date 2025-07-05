// src/infrastructure/server/http.server.ts

/**
 * MÓDULO: Servidor HTTP Express
 *
 * Este módulo define la función de creación del servidor HTTP principal
 * utilizando Express, aplicando los middlewares, rutas y el manejador global de errores.
 *
 * RESPONSABILIDADES:
 * - Inicializar la aplicación Express
 * - Aplicar middlewares globales (seguridad, parsing, CORS, etc.)
 * - Montar el router principal bajo el prefijo /API/v1
 * - Configurar el manejador global de errores
 */

import express from "express";
import { applyMiddlewares } from "./middlewares";
import { errorHandler } from "./error-handler";
import { Router } from "express";
import { appConfig } from "../config/server/AppConfig";

/**
 * Crea e inicializa el servidor HTTP Express.
 *
 * Esta función configura la aplicación Express, aplica los middlewares,
 * monta el router principal y el manejador de errores.
 *
 * @param router - Router principal con las rutas de la API
 * @returns Instancia de la aplicación Express configurada
 */
export const createHTTPServer = (router: Router) => {
  const app = express();

  applyMiddlewares(app);
  app.use("/API/v1", router);
  app.use(errorHandler);

  return app;
};
