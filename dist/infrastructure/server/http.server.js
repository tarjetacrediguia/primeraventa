"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHTTPServer = void 0;
// src/infrastructure/server/http.server.ts
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("./middlewares");
const error_handler_1 = require("./error-handler");
const createHTTPServer = (router) => {
    const app = (0, express_1.default)();
    (0, middlewares_1.applyMiddlewares)(app);
    app.use("/API/v1", router);
    app.use(error_handler_1.errorHandler);
    return app;
};
exports.createHTTPServer = createHTTPServer;
