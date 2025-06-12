"use strict";
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
exports.descargarContratoPDF = exports.generarContratoPDF = void 0;
const GenerarContratoUseCase_1 = require("../../../application/use-cases/Contrato/GenerarContratoUseCase");
const DescargarContratoUseCase_1 = require("../../../application/use-cases/Contrato/DescargarContratoUseCase");
const ContratoRepositoryAdapter_1 = require("../../adapters/repository/ContratoRepositoryAdapter");
const SolicitudFormalRepositoryAdapter_1 = require("../../adapters/repository/SolicitudFormalRepositoryAdapter");
const NotificationAdapter_1 = require("../../adapters/notification/NotificationAdapter");
const pdfAdapter_1 = require("../../adapters/pdf/pdfAdapter");
const ClienteRepositoryAdapter_1 = require("../../adapters/repository/ClienteRepositoryAdapter");
// Inicializar adapters
const contratoRepository = new ContratoRepositoryAdapter_1.ContratoRepositoryAdapter();
const solicitudRepository = new SolicitudFormalRepositoryAdapter_1.SolicitudFormalRepositoryAdapter(); // Asume que existe
const pdfService = new pdfAdapter_1.PdfAdapter();
const notificationService = new NotificationAdapter_1.NotificationAdapter();
const clienteRepository = new ClienteRepositoryAdapter_1.ClienteRepositoryAdapter();
const generarContratoPDF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const solicitudId = parseInt(req.params.id, 10);
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        console.log('Solicitud ID:', solicitudId);
        // Obtener solicitud
        const solicitud = yield solicitudRepository.getSolicitudFormalById(solicitudId);
        console.log('Solicitud encontrada:', solicitud);
        if (!solicitud) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        // Verificar permisos
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.rol) === 'comerciante') {
            //const cliente = await clienteRepository.findById(solicitud.getClienteId());
            if (solicitud.getComercianteId() !== userId) {
                return res.status(403).json({ error: 'No tiene permiso para esta operación' });
            }
        }
        // Generar contrato
        const useCase = new GenerarContratoUseCase_1.GenerarContratoUseCase(solicitudRepository, contratoRepository, pdfService, notificationService, clienteRepository);
        const contrato = yield useCase.execute(solicitudId);
        console.log('Contrato generado:', contrato);
        // Devolver URL con ID de contrato, no de solicitud
        res.status(200).json({
            url: `/API/v1/contratos/${contrato.getId()}`
        });
    }
    catch (error) {
        const message = error.message || 'Error generando contrato';
        const status = message.includes('no encontrada') ? 404 : 500;
        res.status(status).json({ error: message });
    }
});
exports.generarContratoPDF = generarContratoPDF;
const descargarContratoPDF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const contratoId = req.params.id;
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        // Obtener contrato
        const contrato = yield contratoRepository.getContratoById(contratoId);
        if (!contrato) {
            return res.status(404).json({ error: 'Contrato no encontrado' });
        }
        // Obtener cliente
        const cliente = yield clienteRepository.findById(contrato.getClienteId());
        // Verificar permisos relacionar el cliente con el comerciante
        /*
        if (req.user?.rol === 'comerciante') {
          if (cliente.getComercianteId() !== userId) {
            return res.status(403).json({ error: 'No tiene permiso para este contrato' });
          }
        }
    */
        // Generar PDF
        const useCase = new DescargarContratoUseCase_1.DescargarContratoUseCase(contratoRepository, pdfService, solicitudRepository);
        const pdfBuffer = yield useCase.execute(contratoId, cliente.getDni());
        // Enviar PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=contrato-${contratoId}.pdf`);
        res.send(pdfBuffer);
    }
    catch (error) {
        const message = error.message || 'Error descargando contrato';
        const status = message.includes('no encontrado') ? 404 : 500;
        res.status(status).json({ error: message });
    }
});
exports.descargarContratoPDF = descargarContratoPDF;
