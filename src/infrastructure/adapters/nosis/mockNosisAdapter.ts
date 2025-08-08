import { NosisPort } from "../../../application/ports/NosisPort";
import { NosisResponse } from "../../../domain/entities/NosisData";


export class MockNosisAdapter implements NosisPort {
  private testData: NosisResponse;

  constructor(testData?: NosisResponse) {
    // Usar datos de prueba por defecto si no se proporcionan
    this.testData = testData || {
      xmlnsi: "http://www.w3.org/2001/XMLSchema-instance",
      xmlns: "http://schemas.nosis.com/sac/ws01/types",
      Contenido: {
        Pedido: {
          Usuario: "60965",
          Documento: "32368857",
          VR: "1",
          CDA: "10001",
          Timeout: "300"
        },
        Resultado: {
          Estado: "200",
          Novedad: "OK",
          Tiempo: "2611",
          FechaRecepcion: "2025-08-05T12:39:32",
          Transaccion: "715bfdb7-76a7-4a22-b305-f38f762a1da6",
          Referencia: "32368857",
          Servidor: "SACWEBZ11",
          Version: "1.3.0"
        },
        Datos: {
          Variables: {
            Variable: [
            {
              "Nombre": "VI_RazonSocial",
              "Valor": "JARAMILLO ULISES HUMBERTO ISMAEL",
              "Descripcion": "Razón Social",
              "Tipo": "TEXTO",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "VI_Apellido",
              "Valor": "JARAMILLO",
              "Descripcion": "Apellido",
              "Tipo": "TEXTO",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "VI_Nombre",
              "Valor": "ULISES HUMBERTO ISMAEL",
              "Descripcion": "Nombre",
              "Tipo": "TEXTO",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "VI_DNI",
              "Valor": "32368857",
              "Descripcion": "DNI",
              "Tipo": "DOCUMENTO",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "VI_Identificacion",
              "Valor": "20323688576",
              "Descripcion": "CUIT / CUIL / CDI",
              "Tipo": "DOCUMENTO",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "VI_FecNacimiento",
              "Valor": "1986-06-23",
              "Descripcion": "Fecha de Nacimiento",
              "Tipo": "FECHA",
              "FechaAct": "2020-02-05"
            },
            {
              "Nombre": "VI_Sexo",
              "Valor": "M",
              "Descripcion": "Género",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "VI_DomAF_Calle",
              "Valor": "RAMOS MEJIA",
              "Descripcion": "Calle",
              "Tipo": "TEXTO",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "VI_DomAF_Nro",
              "Valor": "1134",
              "Descripcion": "Número",
              "Tipo": "TEXTO",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "VI_DomAF_Loc",
              "Valor": "NEUQUEN",
              "Descripcion": "Localidad",
              "Tipo": "TEXTO",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "VI_DomAF_CP",
              "Valor": "8300",
              "Descripcion": "Código Postal",
              "Tipo": "TEXTO",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "VI_DomAF_Prov",
              "Valor": "Neuquen",
              "Descripcion": "Provincia",
              "Tipo": "TEXTO",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "VI_Tel1_CodArea",
              "Valor": "",
              "Descripcion": "Código de Área, del Teléfono Nº1",
              "Tipo": "TEL_AREA"
            },
            {
              "Nombre": "VI_Tel1_Nro",
              "Valor": "",
              "Descripcion": "Número, del Teléfono Nº1",
              "Tipo": "TEL_NUMERO"
            },
            {
              "Nombre": "VI_Inscrip_Monotributo",
              "Valor": "A",
              "Descripcion": "Categoría Monotributo",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "VI_Inscrip_Monotributo_Act",
              "Valor": "Locaciones de Servicios",
              "Descripcion": "Actividad Monotributo",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "VI_Empleador_Es",
              "Valor": "No",
              "Descripcion": "Es Empleador",
              "Tipo": "BOOLEANO",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "VI_Jubilado_Es",
              "Valor": "No",
              "Descripcion": "Es Jubilado",
              "Tipo": "BOOLEANO"
            },
            {
              "Nombre": "VI_Empleado_Es",
              "Valor": "No",
              "Descripcion": "Es Empleado",
              "Tipo": "BOOLEANO",
              "FechaAct": "2020-02-05"
            },
            {
              "Nombre": "VI_Empleador_RZ",
              "Valor": "",
              "Descripcion": "Razón Social / Nombre",
              "Tipo": "TEXTO",
              "FechaAct": "2020-02-05"
            },
            {
              "Nombre": "VI_Empleador_CUIT",
              "Valor": "",
              "Descripcion": "CUIT",
              "Tipo": "DOCUMENTO",
              "FechaAct": "2020-02-05"
            },
            {
              "Nombre": "VI_Empleador_Domicilio",
              "Valor": "",
              "Descripcion": "Domicilio Completo",
              "Tipo": "TEXTO",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "VI_Empleador_TelCodArea",
              "Valor": "",
              "Descripcion": "Código Área del Teléfono",
              "Tipo": "TEL_AREA",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "VI_Empleador_TelNro",
              "Valor": "",
              "Descripcion": "Número de Teléfono",
              "Tipo": "TEL_NUMERO",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "AP_3m_Empleadores_Cant",
              "Valor": "0",
              "Descripcion": "Cantidad empleadores - Últimos 3 meses",
              "Tipo": "ENTERO",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "AP_12m_Empleado_Impagos_Cant",
              "Valor": "0",
              "Descripcion": "Cantidad impagos - Últimos 12 meses",
              "Tipo": "ENTERO",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "AP_12m_Empleado_Pagos_Cant",
              "Valor": "0",
              "Descripcion": "Cantidad pagos - Últimos 12 meses",
              "Tipo": "ENTERO",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "AP_12m_Empleado_PagoParcial_Cant",
              "Valor": "0",
              "Descripcion": "Cantidad pago parcial - Últimos 12 meses",
              "Tipo": "ENTERO",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "AP_12m_Empleador_Impagos_Cant",
              "Valor": "0",
              "Descripcion": "Cantidad impagos - Últimos 12 meses",
              "Tipo": "ENTERO",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "AP_12m_Empleador_Pagos_Cant",
              "Valor": "0",
              "Descripcion": "Cantidad pagos - Últimos 12 meses",
              "Tipo": "ENTERO",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "AP_12m_Empleador_PagoParcial_Cant",
              "Valor": "0",
              "Descripcion": "Cantidad pago parcial - Últimos 12 meses",
              "Tipo": "ENTERO",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "SRT_Aseguradora",
              "Valor": "",
              "Descripcion": "Aseguradora",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "SSS_OS_Nombre",
              "Valor": "",
              "Descripcion": "Obra Social",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "SSS_OS_FecDesde",
              "Valor": "",
              "Descripcion": "Fecha alta",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "SSS_OS_Titular_Condicion",
              "Valor": "",
              "Descripcion": "Condición titular",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "SSS_OS_Titular_Parentesco",
              "Valor": "",
              "Descripcion": "Parentesco con titular",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CI_Vig_Li_CC_Cant",
              "Valor": "",
              "Descripcion": "Cantidad Líneas",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "CI_Vig_Li_CC_Monto",
              "Valor": "0",
              "Descripcion": "Monto Total",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_OT_Cant",
              "Valor": "2",
              "Descripcion": "Cantidad líneas",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "CI_Vig_Li_OT_Monto",
              "Valor": "582950",
              "Descripcion": "Monto total",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_HI_Cant",
              "Valor": "",
              "Descripcion": "Cantidad préstamos hipotecarios",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "CI_Vig_Li_HI_Monto",
              "Valor": "0",
              "Descripcion": "Saldo actual",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_PR_Cant",
              "Valor": "",
              "Descripcion": "Cantidad préstamos prendarios automotor",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "CI_Vig_Li_PR_Monto",
              "Valor": "0",
              "Descripcion": "Saldo actual",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_OPR_Cant",
              "Valor": "",
              "Descripcion": "Cantidad otros préstamos prendarios",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "CI_Vig_Li_OPR_Monto",
              "Valor": "0",
              "Descripcion": "Saldo actual",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_OPR_SitMay2_Tiene",
              "Valor": "No",
              "Descripcion": "Situación negativa",
              "Tipo": "BOOLEANO"
            },
            {
              "Nombre": "CI_Vig_Li_PP_Cant",
              "Valor": "0",
              "Descripcion": "Cantidad préstamos personales",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "CI_Vig_Li_PP_Monto",
              "Valor": "0",
              "Descripcion": "Saldo actual",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_TC_Cant",
              "Valor": "2",
              "Descripcion": "Cantidad tarjetas de crédito",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "CI_Vig_TC_Monto",
              "Valor": "351000",
              "Descripcion": "Saldo actual",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_CompMensual",
              "Valor": "71255",
              "Descripcion": "Compromiso mensual",
              "Tipo": "MONEDA",
              "FechaAct": "2025-06-30"
            },
            {
              "Nombre": "CI_Vig_Ratio_DeudaTotal",
              "Valor": "0.33",
              "Descripcion": "Deuda total / NSE",
              "Tipo": "DECIMAL",
              "FechaAct": "2025-06-30"
            },
            {
              "Nombre": "CI_Vig_Ratio_CompMensual",
              "Valor": "0.03",
              "Descripcion": "Compromiso mensual / NSE",
              "Tipo": "DECIMAL",
              "FechaAct": "2025-06-30"
            },
            {
              "Nombre": "CI_Vig_Ratio_DeudaTotal_a6m",
              "Valor": "3.74",
              "Descripcion": "Endeudamiento actual / endeudamiento promedio - Últ. 6 meses",
              "Tipo": "DECIMAL",
              "FechaAct": "2025-06-30"
            },
            {
              "Nombre": "VR_12m_Cumplimiento",
              "Valor": "1",
              "Descripcion": "Perfil Cumplimiento del Deudor",
              "Tipo": "ENTERO",
              "FechaAct": "2025-06-30"
            },
            {
              "Nombre": "VR_Vig_CapacidadEndeu_Deuda",
              "Valor": "1868377",
              "Descripcion": "Disponibilidad mensual, para nuevo endeudamiento",
              "Tipo": "MONEDA",
              "FechaAct": "2025-06-30"
            },
            {
              "Nombre": "VR_Vig_CapacidadEndeu_TC",
              "Valor": "3736755",
              "Descripcion": "Capacidad endeudamiento T. Crédito",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "DX_Es",
              "Valor": "No",
              "Descripcion": "Es moroso",
              "Tipo": "BOOLEANO"
            },
            {
              "Nombre": "JU_12m_Cant",
              "Valor": "0",
              "Descripcion": "Juicios cantidad - Últ. 12 meses",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "CQ_12m_Cant",
              "Valor": "0",
              "Descripcion": "Concursos y quiebras cantidad - Últ. 12 meses",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "RC_12m_Cant",
              "Valor": "0",
              "Descripcion": "Cantidad - Últ. 12 meses",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "RC_12m_Fuente",
              "Valor": "",
              "Descripcion": "Fuente - Últ. 12 meses",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "SCO_Vig",
              "Valor": "625",
              "Descripcion": "Score",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "NSE",
              "Valor": "C1",
              "Descripcion": "Nivel Socioeconómico",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "FE",
              "Valor": "",
              "Descripcion": "Facturación Estimada",
              "Detalle": "Solo para empresas.",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "CDA",
              "Valor": "Aprobado",
              "Descripcion": "Criterio de aceptación definido por el usuario",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_DICT",
              "Valor": "APROBADO",
              "Descripcion": "Dictamen",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_AF",
              "Valor": "Ok",
              "Descripcion": "Identidad Válida",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_VI.EDAD",
              "Valor": "Ok",
              "Descripcion": "Edad",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_VI.FCS",
              "Valor": "N/C",
              "Descripcion": "Fecha Contrato Social",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_VI.ACT",
              "Valor": "N/C",
              "Descripcion": "Actividades",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_AP",
              "Valor": "N/C",
              "Descripcion": "Aportes Patronales",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_CI",
              "Valor": "Ok",
              "Descripcion": "Bureau de Crédito del BCRA",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_OJ",
              "Valor": "Ok",
              "Descripcion": "Oficios Judiciales",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_HC",
              "Valor": "N/C",
              "Descripcion": "Cheques Rechazados del BCRA",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_DE",
              "Valor": "Ok",
              "Descripcion": "Deudores Ent. Liquidadas",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_QU.1",
              "Valor": "Ok",
              "Descripcion": "Concurso o Quiebra",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_QU.2",
              "Valor": "Ok",
              "Descripcion": "Pedido Quiebra",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_QU.3",
              "Valor": "Ok",
              "Descripcion": "Juicios - Demandado",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_BC",
              "Valor": "Ok",
              "Descripcion": "Comunicaciones del BCRA y de Fuentes Directas",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_RC.P",
              "Valor": "Ok",
              "Descripcion": "Referencias Comerciales Propias",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_RC.T",
              "Valor": "Ok",
              "Descripcion": "Referencias Comerciales de Terceros",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_FA",
              "Valor": "N/C",
              "Descripcion": "Facturas Apócrifas",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_LD",
              "Valor": "N/C",
              "Descripcion": "Laudos Incumplidos",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_DF",
              "Valor": "N/C",
              "Descripcion": "Antecedentes Fiscales",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_DC",
              "Valor": "N/C",
              "Descripcion": "Documentos Cuestionados",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_DP",
              "Valor": "N/C",
              "Descripcion": "Deudores Previsionales",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_SCO",
              "Valor": "Ok",
              "Descripcion": "Score",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_Valor.SCO",
              "Valor": "625",
              "Descripcion": "Score",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_NSE",
              "Valor": "Ok",
              "Descripcion": "Nivel Socioeconomico",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_Valor.NSE",
              "Valor": "C1",
              "Descripcion": "Nivel Socioeconomico",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CDA_COMPMENSUALES",
              "Valor": "71255",
              "Descripcion": "Compromisos mensuales",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "PQ_12m_Cant",
              "Valor": "0",
              "Descripcion": "Pedido Quiebras Cantidad - Últ. 12 Meses",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "AP_12m_Empleado_FecAntigua",
              "Valor": "000000",
              "Descripcion": "Fecha más antigua  - Últ. 12 meses",
              "Tipo": "PERIODO",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "HC_24m_Cant",
              "Valor": "0",
              "Descripcion": "Cantidad - Últ. 24 meses",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "DC_Version",
              "Valor": "",
              "Descripcion": "Descripción de versión del documento cuestionado informado.",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CI_24m_Detalle",
              "Valor": "<Detalle><D>7|202506|1|425971</D><D>150|202505|1|492000</D><D>150|202504|1|351000</D><D>150|202503|1|152000</D><D>150|202502|1|361000</D><D>150|202501|1|116000</D><D>150|202410|1|42000</D><D>150|202409|1|39000</D><D>150|202406|1|6000</D><D>150|202405|1|49000</D><D>150|202404|1|77000</D><D>150|202403|1|141000</D><D>150|202402|1|131000</D><D>150|202401|1|190000</D><D>150|202312|1|236000</D><D>150|202311|1|131000</D><D>150|202310|1|146000</D><D>150|202309|1|24000</D><D>97|202308|1|36000</D><D>150|202308|1|74000</D></Detalle>",
              "Descripcion": "Detalle últimos 24 meses",
              "Tipo": "XML",
              "FechaAct": "2025-06-30"
            },
            {
              "Nombre": "VI_Empleador_Act01_Cod",
              "Valor": "",
              "Descripcion": "Código Actividad Principal del Empleador",
              "Tipo": "ENTERO",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "VI_Empleador_Act01_Descrip",
              "Valor": "",
              "Descripcion": "Descripción Actividad Principal del Empleador",
              "Tipo": "TEXTO",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "VI_AntiguedadLaboral",
              "Valor": "0",
              "Descripcion": "Antigüedad Laboral",
              "Tipo": "ENTERO",
              "FechaAct": "2020-02-05"
            },
            {
              "Nombre": "VI_Inscrip_Monotributo_Es",
              "Valor": "Si",
              "Descripcion": "Es Monotributista",
              "Tipo": "BOOLEANO"
            },
            {
              "Nombre": "VI_Inscrip_Monotributo_Tipo",
              "Valor": "",
              "Descripcion": "Tipo Monotributo",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "VI_Inscrip_Autonomo_Es",
              "Valor": "No",
              "Descripcion": "Es Autónomo",
              "Tipo": "BOOLEANO",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "VI_EmpleadoDomestico_Es",
              "Valor": "No",
              "Descripcion": "Es Empleado Doméstico",
              "Tipo": "BOOLEANO",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "DX_Cant",
              "Valor": "0",
              "Descripcion": "Cantidad entidades en Mora",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "DX_Entidades",
              "Valor": "",
              "Descripcion": "Entidades en Mora",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CI_24m_Detalle_PorPeriodo",
              "Valor": "<Detalle><D>202506|1|425971</D><D>202505|1|492000</D><D>202504|1|351000</D><D>202503|1|152000</D><D>202502|1|361000</D><D>202501|1|116000</D><D>202410|1|42000</D><D>202409|1|39000</D><D>202406|1|6000</D><D>202405|1|49000</D><D>202404|1|77000</D><D>202403|1|141000</D><D>202402|1|131000</D><D>202401|1|190000</D><D>202312|1|236000</D><D>202311|1|131000</D><D>202310|1|146000</D><D>202309|1|24000</D><D>202308|1|110000</D></Detalle>",
              "Descripcion": "Detalle últimos 24 meses - Por Periodo",
              "Tipo": "XML",
              "FechaAct": "2025-06-30"
            },
            {
              "Nombre": "FEX_BCRA_FecAct",
              "Valor": "2025-06-30",
              "Descripcion": "BCRA - Fecha Últ. Actualización",
              "Tipo": "FECHA",
              "FechaAct": "2025-06-30"
            },
            {
              "Nombre": "FEX_BCRA_FecVenc",
              "Valor": "2025-07-30",
              "Descripcion": "BCRA - Fecha Próxima Actualización",
              "Tipo": "FECHA",
              "FechaAct": "2025-06-30"
            },
            {
              "Nombre": "FEX_RD_FecAct",
              "Valor": "2020-02-05",
              "Descripcion": "Anses [RD] - Fecha Últ. Actualización",
              "Tipo": "FECHA",
              "FechaAct": "2020-02-05"
            },
            {
              "Nombre": "FEX_RD_FecVenc",
              "Valor": "2020-05-05",
              "Descripcion": "Anses [RD] - Fecha Próxima Actualización",
              "Tipo": "FECHA",
              "FechaAct": "2020-02-05"
            },
            {
              "Nombre": "FEX_SRT_FecAct",
              "Valor": "",
              "Descripcion": "SRT - Fecha Últ. Actualización",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "FEX_SRT_FecVenc",
              "Valor": "2025-08-05",
              "Descripcion": "SRT - Fecha Próxima Actualización",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "FEX_AFInscrip_FecAct",
              "Valor": "2025-02-13",
              "Descripcion": "AFIP Inscripciones - Fecha Últ. Actualización",
              "Tipo": "FECHA",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "FEX_AFInscrip_FecVenc",
              "Valor": "2025-03-15",
              "Descripcion": "AFIP Inscripciones - Fecha Próxima Actualización",
              "Tipo": "FECHA",
              "FechaAct": "2025-02-13"
            },
            {
              "Nombre": "FEX_SSS_FecAct",
              "Valor": "",
              "Descripcion": "SSSalud - Fecha Últ. Actualización",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "FEX_SSS_FecVenc",
              "Valor": "2025-08-05",
              "Descripcion": "SSSalud - Fecha Próxima Actualización",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "FEX_AFAP_FecAct",
              "Valor": "2016-07-22",
              "Descripcion": "AFIP Aportes Patronales - Fecha Últ. Actualización",
              "Tipo": "FECHA",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "FEX_AFAP_FecVenc",
              "Valor": "2016-08-21",
              "Descripcion": "AFIP Aportes Patronales - Fecha Próxima Actualización",
              "Tipo": "FECHA",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "FEX_SIPA_FecAct",
              "Valor": "",
              "Descripcion": "Anses Beneficios - Fecha Últ. Actualización",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "FEX_SIPA_FecVenc",
              "Valor": "2025-08-05",
              "Descripcion": "Anses Beneficios - Fecha Próxima Actualización",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "FEX_AFOC_FecAct",
              "Valor": "",
              "Descripcion": "AFIP Padrón - Fecha Últ. Actualización",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "FEX_AFOC_FecVenc",
              "Valor": "2025-08-05",
              "Descripcion": "AFIP Padrón - Fecha Próxima Actualización",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "FEX_MNP_FecAct",
              "Valor": "2025-01-01",
              "Descripcion": "SSS - Monotributo Pagos - Fecha Últ. Actualización",
              "Tipo": "FECHA",
              "FechaAct": "2025-01-01"
            },
            {
              "Nombre": "FEX_MNP_FecVenc",
              "Valor": "2025-04-01",
              "Descripcion": "SSS - Monotributo Pagos - Fecha Próxima Actualización",
              "Tipo": "FECHA",
              "FechaAct": "2025-01-01"
            },
            {
              "Nombre": "FEX_MN_FecAct",
              "Valor": "2025-01-01",
              "Descripcion": "SSS - Monotributo Padrón - Fecha Últ. Actualización",
              "Tipo": "FECHA",
              "FechaAct": "2025-01-01"
            },
            {
              "Nombre": "FEX_MN_FecVenc",
              "Valor": "2025-04-01",
              "Descripcion": "SSS - Monotributo Padrón - Fecha Próxima Actualización",
              "Tipo": "FECHA",
              "FechaAct": "2025-01-01"
            },
            {
              "Nombre": "AS_Beneficios_Detalle",
              "Valor": "<Detalle></Detalle>",
              "Descripcion": "Detalle Beneficios ANSES",
              "Tipo": "XML"
            },
            {
              "Nombre": "CI_24m_Bancarizado",
              "Valor": "Si",
              "Descripcion": "Bancarizado - Últ. 24 Meses",
              "Tipo": "BOOLEANO",
              "FechaAct": "2025-06-30"
            },
            {
              "Nombre": "FEX_CN_FecAct",
              "Valor": "",
              "Descripcion": "Certificación Negativa [CN] - Fecha Últ. Actualización",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "FEX_CN_FecVenc",
              "Valor": "2025-08-05",
              "Descripcion": "Certificación Negativa [CN] - Fecha Próxima Actualización",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "NSE_IngresoProm",
              "Valor": "2020681",
              "Descripcion": "Nivel Socioeconómico - Ingreso Promedio",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "RC_Vig_Cant",
              "Valor": "0",
              "Descripcion": "Cantidad - Vigente",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "RC_Vig_Fuente",
              "Valor": "",
              "Descripcion": "Fuente - Vigente",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "AP_12m_Empleadores_Cant",
              "Valor": "0",
              "Descripcion": "Cantidad Empleadores - Últimos 12 meses",
              "Tipo": "ENTERO",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "MN_24m_Cant",
              "Valor": "2",
              "Descripcion": "Cantidad Periodos Pagos - Últ. 24 meses",
              "Tipo": "ENTERO",
              "FechaAct": "2025-01-01"
            },
            {
              "Nombre": "MN_ObraSocial_Descrip",
              "Valor": "OBRA SOCIAL DE LOS EMPLEADOS DE COMERCIO Y ACTIVIDADES CIVILES",
              "Descripcion": "Obra Social - Descripción",
              "Tipo": "TEXTO",
              "FechaAct": "2025-01-01"
            },
            {
              "Nombre": "MN_ObraSocial_PeriodoMin",
              "Valor": "202406",
              "Descripcion": "Obra Social - Periodo Inicio",
              "Tipo": "PERIODO",
              "FechaAct": "2025-01-01"
            },
            {
              "Nombre": "MN_ObraSocial_PeriodoMax",
              "Valor": "",
              "Descripcion": "Obra Social - Periodo Fin",
              "Tipo": "PERIODO",
              "FechaAct": "2025-01-01"
            },
            {
              "Nombre": "VI_AntiguedadLaboral_EmpleadorActual",
              "Valor": "",
              "Descripcion": "Antigüedad Laboral - Empleador Actual",
              "Tipo": "ENTERO",
              "FechaAct": "2020-02-05"
            },
            {
              "Nombre": "AP_Vig_Empleado_DeclaracionJurada",
              "Valor": "",
              "Descripcion": "Estado de la Declaración Jurada",
              "Tipo": "TEXTO",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "AP_Vig_Empleado_Estado_Cod",
              "Valor": "0",
              "Descripcion": "Estado de los Aportes Patronales",
              "Tipo": "ENTERO",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "VI_Empleado_Es_UltFecha",
              "Valor": "201711",
              "Descripcion": "Última fecha registrada",
              "Tipo": "PERIODO"
            },
            {
              "Nombre": "AP_Vig_Empleador_Estado_Cod",
              "Valor": "0",
              "Descripcion": "Estado de los Aportes Patronales - Como Empleador",
              "Tipo": "ENTERO",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "VI_HistoriaLaboral_Empleadores",
              "Valor": "<Detalle><D>33712270549|SABORES DEL SUR SRL|201302|201405</D><D>30640745602|DLS ARGENTINA LTD SUCURSAL ARGENTINA|201408|201602</D><D>30999278376|CONSEJO PROVINCIAL DE EDUCACION DEL NEUQUEN|201711|201711</D></Detalle>",
              "Descripcion": "Historia Laboral - Empleadores",
              "Tipo": "XML"
            },
            {
              "Nombre": "CI_Vig_Li_HI_UVA_Monto",
              "Valor": "0",
              "Descripcion": "Saldo actual",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_PR_UVA_Monto",
              "Valor": "0",
              "Descripcion": "Saldo actual",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_OPR_UVA_Monto",
              "Valor": "0",
              "Descripcion": "Saldo actual",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_PP_UVA_Monto",
              "Valor": "0",
              "Descripcion": "Saldo actual",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_OT_UVA_Monto",
              "Valor": "0",
              "Descripcion": "Monto total",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "VI_Empleado_12m_Es",
              "Valor": "No",
              "Descripcion": "Es Empleado - Últimos 12 Meses",
              "Tipo": "BOOLEANO"
            },
            {
              "Nombre": "BAF_Estado",
              "Valor": "",
              "Descripcion": "BAF - Coincidencias",
              "Tipo": "BOOLEANO"
            },
            {
              "Nombre": "CI_Vig_CompMensual_BcoPropio",
              "Valor": "0",
              "Descripcion": "Compromiso mensual - Banco Propio",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_CompMensual_SinBcoPropio",
              "Valor": "71255",
              "Descripcion": "Compromiso mensual - Banco Sin  Propio",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "RC_12m_Tiene",
              "Valor": "No",
              "Descripcion": "Tiene Referencias - Últ. 12 Meses",
              "Tipo": "BOOLEANO"
            },
            {
              "Nombre": "AS_Hist_Beneficios_Detalle",
              "Valor": "<Detalle></Detalle>",
              "Descripcion": "Detalle histórico Beneficios ANSES",
              "Tipo": "XML"
            },
            {
              "Nombre": "RC_Vig_FuentesCant",
              "Valor": "0",
              "Descripcion": "Referencias Vigentes - Cantidad de Fuentes",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "VI_Empleador_Dom_Calle",
              "Valor": "",
              "Descripcion": "Calle",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "VI_Empleador_Dom_Nro",
              "Valor": "",
              "Descripcion": "Número",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "VI_Empleador_Dom_Loc",
              "Valor": "",
              "Descripcion": "Localidad",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "VI_Empleador_Dom_CP",
              "Valor": "",
              "Descripcion": "Código postal",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "VI_Empleador_Dom_Prov",
              "Valor": "",
              "Descripcion": "Provincia",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "AP_12m_Empleador_Detalle",
              "Valor": "<Detalle></Detalle>",
              "Descripcion": "Detalle de Aportes últimos 12 meses - Empleador",
              "Tipo": "XML",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "AP_12m_EmpleadoDomestico_Detalle",
              "Valor": "<Detalle></Detalle>",
              "Descripcion": "Detalle de Aportes últimos 12 meses - Empleado Doméstico",
              "Tipo": "XML",
              "FechaAct": "2016-07-22"
            },
            {
              "Nombre": "RC_Vig_Detalle",
              "Valor": "<Detalle></Detalle>",
              "Descripcion": "Detalle de Referencia Comerciales vigentes por rubro.",
              "Tipo": "XML"
            },
            {
              "Nombre": "VI_Mail",
              "Valor": "",
              "Descripcion": "Email",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "VI_Empleador_Act01_Sector",
              "Valor": "",
              "Descripcion": "Sector Actividad Principal del Empleador (Nº1)",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CI_Vig_Pago_TC",
              "Valor": "68602",
              "Descripcion": "Pago de tarjetas de crédito",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_PR_Monto_Total",
              "Valor": "0",
              "Descripcion": "Saldo total actual",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_HI_Monto_Total",
              "Valor": "0",
              "Descripcion": "Saldo total actual",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_PP_Monto_Total",
              "Valor": "0",
              "Descripcion": "Saldo total actual",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_HI_Monto_Total_SinBancoPropio",
              "Valor": "0",
              "Descripcion": "Saldo total actual sin banco Propio",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_PP_Monto_Total_SinBancoPropio",
              "Valor": "0",
              "Descripcion": "Saldo total actual sin banco Propio",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_PR_Monto_Total_SinBancoPropio",
              "Valor": "0",
              "Descripcion": "Saldo total actual sin banco Propio",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Total_MontoVencido",
              "Valor": "0",
              "Descripcion": "Monto total vencido",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "VR_24m_Atraso_Cumplimiento",
              "Valor": "No",
              "Descripcion": "Perfil Cumplimiento del Deudor",
              "Tipo": "BOOLEANO"
            },
            {
              "Nombre": "COM_SO_Es",
              "Valor": "No",
              "Descripcion": "CUIL/CUIT consultado es Sujeto Obligado",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "COM_PEP_Es",
              "Valor": "",
              "Descripcion": "CUIL/CUIT consultado es  Persona expuesta políticamente",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "COM_Homonimos_LAFT_Cant",
              "Valor": "0",
              "Descripcion": "Cantidad de homónimos en base LA/FT encontrados según Razón Social o Nombre y apellido",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "COM_Homonimos_LAFT_Link",
              "Valor": "https://compliance.nosis.com/baseLAFT/Resultado?q=JARAMILLO%20ULISES%20HUMBERTO%20ISMAEL",
              "Descripcion": "Enlace de homónimos en base LA/FT encontrados según Razón Social o Nombre y apellido",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CI_Vig_PeorSit_BCRA",
              "Valor": "1",
              "Descripcion": "Peor situación en el BCRA",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "CI_Vig_Li_PR_Monto_Total_v2",
              "Valor": "0",
              "Descripcion": "Saldo total actual prendarios, más otras líneas.",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_PP_Monto_Total_v2",
              "Valor": "0",
              "Descripcion": "Saldo total actual personales, más otras líneas.",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "CI_Vig_Li_PP_Monto_Total_SinBancoPropio_v2",
              "Valor": "0",
              "Descripcion": "Saldo total actual personales, más otras líneas, sin banco Propio.",
              "Tipo": "MONEDA"
            },
            {
              "Nombre": "RC_12m_Cant_Fin_Fact",
              "Valor": "0",
              "Descripcion": "Cantidad Referencias Financieras con últimas actualizaciones - Últ. 12 meses",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "FEX_CNE_FecAct",
              "Valor": "",
              "Descripcion": "(CNE) Cumplimiento Censal - Fecha Últ. Actualización",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "FEX_CNE_FecVenc",
              "Valor": "",
              "Descripcion": "(CNE) Cumplimiento Censal - Fecha Próxima Actualización",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "VI_Pensionado_Es",
              "Valor": "No",
              "Descripcion": "Es Pensionado",
              "Tipo": "BOOLEANO"
            },
            {
              "Nombre": "VI_12m_Empleador_FecAntigua",
              "Valor": "000000",
              "Descripcion": "Periodo más antiguo como empleador en los últimos 12 meses",
              "Tipo": "PERIODO"
            },
            {
              "Nombre": "COM_PEP_Directo",
              "Valor": "No",
              "Descripcion": "CUIL consultado PEP Directo",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "COM_PEP_Cargo",
              "Valor": "",
              "Descripcion": "Cargo de CUIL con marca de PEP",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "COM_PEP_Organismo",
              "Valor": "",
              "Descripcion": "Organismo al que pertenece el CUIL con marca de PEP",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "COM_PEP_Estado",
              "Valor": "",
              "Descripcion": "Tipo de Estado al que pertenece el CUIL con marca de PEP",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "COM_PEP_Indirecto_Vinculo_Detalle",
              "Valor": "<Detalle><D /></Detalle>",
              "Descripcion": "Detalle del vínculo familiar o por domicilio por el cual el CUIL recibe marca de PEP Indirecto",
              "Tipo": "XML"
            },
            {
              "Nombre": "COM_PEP_Indirecto_Relacionado_Detalle",
              "Valor": "<Detalle><D /></Detalle>",
              "Descripcion": "Detalle del PEP directo con el que está relacionado el documento consultado",
              "Tipo": "XML"
            },
            {
              "Nombre": "COM_PEP_Indirecto_Cargo_Detalle",
              "Valor": "<Detalle><D /></Detalle>",
              "Descripcion": "Detalle del cargo del PEP directo con el que está relacionado el documento consultado",
              "Tipo": "XML"
            },
            {
              "Nombre": "CI_Vig_TC_Es",
              "Valor": "Si",
              "Descripcion": "Posee tarjeta de crédito",
              "Tipo": "BOOLEANO"
            },
            {
              "Nombre": "CI_Vig_Li_CC_Es",
              "Valor": "No",
              "Descripcion": "Posee descubiertos en cuenta corriente",
              "Tipo": "BOOLEANO"
            },
            {
              "Nombre": "CI_Vig_Li_Hi_CantTotal",
              "Valor": "0",
              "Descripcion": "Cantidad total de préstamos hipotecarios",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "CI_Vig_Li_HI_Es",
              "Valor": "No",
              "Descripcion": "Posee préstamos hipotecarios",
              "Tipo": "BOOLEANO"
            },
            {
              "Nombre": "CI_Vig_Li_PP_CantTotal_v2",
              "Valor": "0",
              "Descripcion": "Cantidad total préstamos personales",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "CI_Vig_Li_OT_Es_v2",
              "Valor": "Si",
              "Descripcion": "Posee productos de otras líneas",
              "Tipo": "BOOLEANO"
            },
            {
              "Nombre": "CI_Vig_LineasActivas_Cant_Atraso",
              "Valor": "0",
              "Descripcion": "Cantidad productos con atrasos",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "FEX_AFWS_FecAct",
              "Valor": "2025-02-13",
              "Descripcion": "AFIP - WS - Fecha Últ. Actualización",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "FEX_AFWS_FecVenc",
              "Valor": "2025-03-15",
              "Descripcion": "AFIP - WS - Fecha Próxima Actualización",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "SSS_RD_OS_Cod",
              "Valor": "0",
              "Descripcion": "Código Obra Social",
              "Tipo": "ENTERO"
            },
            {
              "Nombre": "SSS_RD_OS_Nombre",
              "Valor": "",
              "Descripcion": "Obra Social",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "SSS_RD_OS_FecDesde",
              "Valor": "",
              "Descripcion": "Fecha Alta",
              "Tipo": "FECHA"
            },
            {
              "Nombre": "SSS_RD_OS_Titular_Condicion",
              "Valor": "",
              "Descripcion": "Condición Titular",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "SSS_RD_OS_Titular_Parentesco",
              "Valor": "",
              "Descripcion": "Parentesco con Titular",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "COM_PEP_Indirecto_Organismo",
              "Valor": "",
              "Descripcion": "Detalle del organismo al que pertenece el PEP directo relacionado al documento consultado",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "VI_Empresa_Activa_Es",
              "Valor": "",
              "Descripcion": "Empresa Activa",
              "Detalle": "Solo para empresas.",
              "Tipo": "BOOLEANO"
            },
            {
              "Nombre": "VR_24m_Atraso_Cumplimiento_v2",
              "Valor": "No",
              "Descripcion": "Perfil Cumplimiento del Deudor - Últimos 24 meses",
              "Tipo": "BOOLEANO"
            },
            {
              "Nombre": "COM_ExPEP_Directo",
              "Valor": "",
              "Descripcion": "CUIL/CUIT consultado fue P.E.P. Directo.",
              "Tipo": "TEXTO"
            },
            {
              "Nombre": "COM_ExPEP_Indirecto",
              "Valor": "",
              "Descripcion": "CUIL/CUIT consultado fue P.E.P. Indirecto",
              "Tipo": "TEXTO"
            }
          ]
          }
        }
      }
    };
  }

  async getData(cuil: string): Promise<NosisResponse> {
    // Modificar el CUIL en los datos de prueba para reflejar la entrada
    this.testData.Contenido.Pedido.Documento = cuil;
    const identificacion = this.testData.Contenido.Datos.Variables.Variable.find(
      v => v.Nombre === 'VI_Identificacion'
    );
    if (identificacion) {
      identificacion.Valor = cuil;
    }
    
    return this.testData;
  }
}