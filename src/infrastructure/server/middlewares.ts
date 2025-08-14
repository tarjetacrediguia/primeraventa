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

/*
(origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, etc)
      if (!origin) return callback(null, true);
      
      // Debugging: Log incoming origin
      console.log(`[CORS] Received origin: ${origin}`);

      // Update Vercel preview regex pattern
      const vercelPreviewRegex = /^https:\/\/preview-crediguia-api-primera-venta-[a-z0-9]+\.vusercontent\.net$/;
      
      // Development environments
      if (process.env.NODE_ENV === 'development') {
        if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) {
          console.log(`[CORS] Allowed localhost: ${origin}`);
          return callback(null, true);
        }
      }

      // Production allowed domains
      const productionDomains = [
        'https://tu-app-produccion.com',
        // Add other production domains here
      ];

      // Check against allowed patterns
      if (
        vercelPreviewRegex.test(origin) || 
        productionDomains.includes(origin)
      ) {
        console.log(`[CORS] Allowed origin: ${origin}`);
        return callback(null, true);
      }

      // Log and reject unauthorized origins
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(new Error('Acceso no permitido por política de CORS'), false);
    }

*/