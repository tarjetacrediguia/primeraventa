"use strict";
// src/infrastructure/routes/controllers/Contrato.controller.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarYDescargarContratoPDF = void 0;
const ContratoRepositoryAdapter_1 = require("../../adapters/repository/ContratoRepositoryAdapter");
const SolicitudFormalRepositoryAdapter_1 = require("../../adapters/repository/SolicitudFormalRepositoryAdapter");
const NotificationAdapter_1 = require("../../adapters/notification/NotificationAdapter");
const pdfAdapter_1 = require("../../adapters/pdf/pdfAdapter");
const ClienteRepositoryAdapter_1 = require("../../adapters/repository/ClienteRepositoryAdapter");
const HistorialRepositoryAdapter_1 = require("../../adapters/repository/HistorialRepositoryAdapter");
const SolicitudInicialRepositoryAdapter_1 = require("../../adapters/repository/SolicitudInicialRepositoryAdapter");
const ComercianteRepositoryAdapter_1 = require("../../adapters/repository/ComercianteRepositoryAdapter");
const GenerarYDescargarContratoUseCase_1 = require("../../../application/use-cases/Contrato/GenerarYDescargarContratoUseCase");
const CompraRepositoryAdapter_1 = require("../../adapters/repository/CompraRepositoryAdapter");
const TasasRepositoryAdapter_1 = require("../../adapters/repository/TasasRepositoryAdapter");
// Inicializar adapters
const contratoRepository = new ContratoRepositoryAdapter_1.ContratoRepositoryAdapter();
const solicitudRepository = new SolicitudFormalRepositoryAdapter_1.SolicitudFormalRepositoryAdapter();
const pdfService = new pdfAdapter_1.PdfAdapter();
const notificationService = new NotificationAdapter_1.NotificationAdapter();
const clienteRepository = new ClienteRepositoryAdapter_1.ClienteRepositoryAdapter();
const solicitudInicialRepository = new SolicitudInicialRepositoryAdapter_1.SolicitudInicialRepositoryAdapter();
const comercianteRepository = new ComercianteRepositoryAdapter_1.ComercianteRepositoryAdapter();
const historialRepository = new HistorialRepositoryAdapter_1.HistorialRepositoryAdapter();
const compraRepository = new CompraRepositoryAdapter_1.CompraRepositoryAdapter();
const tasasRepository = new TasasRepositoryAdapter_1.TasasRepositoryAdapter();
// Inicializar el nuevo caso de uso unificado
const generacionYDescargaUC = new GenerarYDescargarContratoUseCase_1.GeneracionYDescargaContratoUseCase(solicitudRepository, contratoRepository, pdfService, notificationService, clienteRepository, historialRepository, solicitudInicialRepository, comercianteRepository, compraRepository, tasasRepository);
const generarYDescargarContratoPDF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const compraId = parseInt(req.params.id, 10);
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        // Ejecutar generación y descarga en un solo paso
        const { pdf } = yield generacionYDescargaUC.execute(compraId, userId);
        // Enviar el PDF directamente como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=contrato.pdf`);
        res.send(pdf);
    }
    catch (error) {
        const message = error.message || 'Error generando y descargando contrato';
        const status = message.includes('no encontrada') ? 404 : 500;
        res.status(status).json({ error: message });
    }
});
exports.generarYDescargarContratoPDF = generarYDescargarContratoPDF;
