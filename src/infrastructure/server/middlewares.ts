//src/infrastructure/server/middlewares.ts

/**
 * MÓDULO: Middlewares Globales de Express
 *
 * Este módulo define y aplica los middlewares globales utilizados por la aplicación Express,
 * incluyendo seguridad, parsing, CORS y logging.
 *
 * RESPONSABILIDADES:
 * - Aplicar políticas de seguridad HTTP (helmet)
 * - Habilitar CORS para el acceso cruzado
 * - Configurar el parsing de JSON y formularios
 * - Configurar el logging de peticiones HTTP
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

/**
 * Aplica los middlewares globales a la aplicación Express.
 *
 * Este método configura la seguridad, el parsing de datos, CORS y el logging
 * según el entorno de ejecución.
 *
 * @param app - Instancia de la aplicación Express
 */
export const applyMiddlewares = (app: express.Application) => {
  // Seguridad: CORS y headers HTTP seguros
  app.use(cors());
  app.use(helmet());
  
  // Parsing de JSON y formularios
  app.use(express.json());
  // Aumentar el límite a 10MB (o el tamaño que necesites)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  
  // Logging de peticiones HTTP
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Desarrollo: formato detallado
  } else {
    app.use(morgan('combined')); // Producción: formato combinado
  }
};

