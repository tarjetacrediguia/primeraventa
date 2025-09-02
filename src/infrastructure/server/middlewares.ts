// src/infrastructure/server/middlewares.ts

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

export const applyMiddlewares = (app: express.Application) => {
  // Middleware para bypass de seguridad de Ngrok
  app.use((req, res, next) => {
    res.header('ngrok-skip-browser-warning', 'true');
    res.header('bypass-tunnel-reminder', 'true');
    next();
  });

  // Configuración CORS mejorada
  const corsOptions: cors.CorsOptions = {
    origin: true, // Permite cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin',
      'ngrok-skip-browser-warning', // Añade estos headers
      'bypass-tunnel-reminder'
    ],
    exposedHeaders: [
      'Authorization', // Expone el header de autorización
      'X-Total-Count'  // Si usas paginación
    ],
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false,
    maxAge: 86400
  };

  app.use(cors(corsOptions));  // CORS first
  app.use(helmet());           // Security headers second
  
  // 3. Configure body parsing with increased limits
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ 
    limit: '10mb', 
    extended: true 
  }));
  
  // 4. Enhanced logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }
};
