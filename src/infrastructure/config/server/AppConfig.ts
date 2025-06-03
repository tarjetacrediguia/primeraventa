// src/infrastructure/config/app.config.ts
interface AppConfig {
  environment: string;
  port: number;
  jwtSecret: string;
  systemToken: string;
  // Agregar otras configuraciones necesarias
}

// Validar que JWT_SECRET esté configurado en producción
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error("⛔ JWT_SECRET no configurado en producción");
}

export const appConfig: AppConfig = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_key', 
  systemToken: process.env.SYSTEM_TOKEN || 'dev_system_token',
};