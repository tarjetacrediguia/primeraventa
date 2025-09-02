"use strict";
// src/infrastructure/server/middlewares.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMiddlewares = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const applyMiddlewares = (app) => {
    // Middleware para bypass de seguridad de Ngrok
    app.use((req, res, next) => {
        res.header('ngrok-skip-browser-warning', 'true');
        res.header('bypass-tunnel-reminder', 'true');
        next();
    });
    // Configuración CORS mejorada
    const corsOptions = {
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
            'X-Total-Count' // Si usas paginación
        ],
        credentials: true,
        optionsSuccessStatus: 204,
        preflightContinue: false,
        maxAge: 86400
    };
    app.use((0, cors_1.default)(corsOptions)); // CORS first
    app.use((0, helmet_1.default)()); // Security headers second
    // 3. Configure body parsing with increased limits
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({
        limit: '10mb',
        extended: true
    }));
    // 4. Enhanced logging
    if (process.env.NODE_ENV === 'development') {
        app.use((0, morgan_1.default)('dev'));
    }
    else {
        app.use((0, morgan_1.default)('combined'));
    }
};
exports.applyMiddlewares = applyMiddlewares;
