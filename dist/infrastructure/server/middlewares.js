"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMiddlewares = void 0;
//src/infrastructure/server/middlewares.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// Middlewares globales de la aplicación
const applyMiddlewares = (app) => {
    // Seguridad
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    // Parsing de JSON
    app.use(express_1.default.json());
    // Aumentar el límite a 10MB (o el tamaño que necesites)
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
    // Logging
    if (process.env.NODE_ENV === 'development') {
        app.use((0, morgan_1.default)('dev')); // Desarrollo: formato detallado
    }
    else {
        app.use((0, morgan_1.default)('combined')); // Producción: formato combinado
    }
};
exports.applyMiddlewares = applyMiddlewares;
