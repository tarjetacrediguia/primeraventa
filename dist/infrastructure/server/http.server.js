"use strict";
// src/infrastructure/server/http.server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHTTPServer = void 0;
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
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("./middlewares");
const error_handler_1 = require("./error-handler");
/**
 * Crea e inicializa el servidor HTTP Express.
 *
 * Esta función configura la aplicación Express, aplica los middlewares,
 * monta el router principal y el manejador de errores.
 *
 * @param router - Router principal con las rutas de la API
 * @returns Instancia de la aplicación Express configurada
 */
const createHTTPServer = (router) => {
    const app = (0, express_1.default)();
    (0, middlewares_1.applyMiddlewares)(app);
    app.use((req, res, next) => {
        if (!req.secure && process.env.NODE_ENV === 'production') {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
        next();
    });
    app.use("/API/v1", router);
    app.use(error_handler_1.errorHandler);
    return app;
};
exports.createHTTPServer = createHTTPServer;
