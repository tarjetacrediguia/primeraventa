//src/infrastructure/server/middlewares.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";



// Middlewares globales de la aplicación
export const applyMiddlewares = (app: express.Application) => {
  // Seguridad
  app.use(cors());
  app.use(helmet());
  
  // Parsing de JSON
  app.use(express.json());
  
  // Logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Desarrollo: formato detallado
  } else {
    app.use(morgan('combined')); // Producción: formato combinado
  }
};

