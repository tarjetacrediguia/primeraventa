"use strict";
//src/application/use-cases/SolicitudFormal/EnviarSolicitudFormalDeCreditoUseCase.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnviarSolicitudFormalDeCreditoUseCase = void 0;
//el comerciante desde el panel de control selecciona una solicitud inicial y envia la solicitud formal de credito.
//si la solicitud inicial no existe, se notifica al comerciante que no existe la solicitud inicial.
//si la solciitud existe y esta en un estado "aprobado", se completa el formulario de solicitud formal de credito.
//se crea una nueva solicitud formal de credito con los datos del cliente y del comerciante, en estado "pendiente".
//se registra la solicitud formal de credito en la base de datos, con los datos de la solicitud inicial y del cliente que la solicito.
//se notifica al cliente por email/telefono/SMS/popup del sistema, que su solicitud formal de credito fue enviada.
//se notifica a los analistas que hay una solicitud formal de credito pendiente de aprobación.
//en caso de error, se notifica al comerciante que hubo un error al enviar la solicitud formal de credito.
//en caso de que la solicitud inicial no este en estado "aprobado", se notifica al comerciante que no se puede enviar la solicitud formal de credito.
//en caso de que la solicitud formal de credito ya exista, se notifica al comerciante que ya existe una solicitud formal de credito.
//en caso de que el cliente no exista, se notifica al comerciante que no existe el cliente.
//en caso de que el comerciante no tenga permisos para enviar la solicitud formal de credito, se notifica al comerciante que no tiene permisos para enviar la solicitud formal de credito.
// src/application/use-cases/SolicitudFormal/EnviarSolicitudFormalDeCreditoUseCase.ts
// Este caso de uso es idéntico a CrearSolicitudFormalUseCase
// Podemos simplemente reexportar la misma clase
var CrearSolicitudFormalUseCase_1 = require("./CrearSolicitudFormalUseCase");
Object.defineProperty(exports, "EnviarSolicitudFormalDeCreditoUseCase", { enumerable: true, get: function () { return CrearSolicitudFormalUseCase_1.CrearSolicitudFormalUseCase; } });
