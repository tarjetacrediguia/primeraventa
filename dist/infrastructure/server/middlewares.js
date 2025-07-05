"use strict";
//src/infrastructure/server/middlewares.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMiddlewares = void 0;
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
/**
 * Aplica los middlewares globales a la aplicación Express.
 *
 * Este método configura la seguridad, el parsing de datos, CORS y el logging
 * según el entorno de ejecución.
 *
 * @param app - Instancia de la aplicación Express
 */
const applyMiddlewares = (app) => {
    // Seguridad: CORS y headers HTTP seguros
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    // Parsing de JSON y formularios
    app.use(express_1.default.json());
    // Aumentar el límite a 10MB (o el tamaño que necesites)
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
    // Logging de peticiones HTTP
    if (process.env.NODE_ENV === 'development') {
        app.use((0, morgan_1.default)('dev')); // Desarrollo: formato detallado
    }
    else {
        app.use((0, morgan_1.default)('combined')); // Producción: formato combinado
    }
};
exports.applyMiddlewares = applyMiddlewares;
