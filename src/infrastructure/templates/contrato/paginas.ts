export const paginas = {
  pagina1: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CrediGuía - Solicitud de Tarjeta</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 0;          /* Sin márgenes en la impresora */
        }
        body {
            margin: 0;
            padding: 20px;
            background-color: white;
            box-sizing: border-box;
            font-size: 8.5pt;   /* Un punto más pequeño */
            line-height: 1.05;  /* Reduce interlineado */
        }

        .flex-cell,
        .gray-header,
        .white-header,
        .red-header,
        .section-title {
            padding-top: 3px !important;
            padding-bottom: 3px !important;
        }
        
        .header {
            background-color: #0080c7;
            color: white;
            padding: 7px;
            text-align: center;
            font-size: 15pt;
            font-weight: bold;
            font-family: 'Times New Roman', Times, serif;
        }
        
        .page-number {
            text-align: right;
            font-size: 10px;
            color: #666;
            margin-bottom: 5px;
        }
        
        .form-row {
            display: flex;
            border-bottom: 1px solid #ccc;
        }
        
        .form-row:last-child {
            border-bottom: none;
        }
        
        .form-cell {
            border-right: 1px solid #ccc;
            padding: 4px 6px;
        }
        
        .form-cell:last-child {
            border-right: none;
        }
        
        .gray-header {
            background-color: #d3d3d3;
            font-weight: lighter;
            font-size: 7.5pt;
        }

        .gray-header-small{
            background-color: #d3d3d3;
            font-weight: lighter;
            text-align: left;
            text-align: start;
            font-size: 5pt;
        }

        .white-header-small{
            background-color: #FBFAF8;
            font-weight: lighter;
            text-align: left;
            text-align: start;
            font-size: 5pt;
        }
        
        .blue-header {
            background-color: #0080c7;
            color: white;
            font-weight: bold;
            font-size: 11px;
            padding: 6px;
        }
        
        .red-header {
            background-color: #c41e3a;
            color: white;
            font-weight: bold;
            font-size: 9pt;
            padding: 6px;
        }

        .white-header{
            background-color: white;
            color: black;
            font-weight: bold;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            padding: 6px;
        }
        
        .section-title {
            background-color: #0080c7;
            color: white;
            padding: 6px;
            font-weight: bold;
            font-size: 11px;
            margin-top: 10px;
        }
        
        .flex-table {
            width: 100%;
            display: flex;
            flex-direction: column;
            margin-top: 5px;
        }
        
        .flex-row {
            display: flex;
            width: 100%;
        }
        
        .flex-cell {
            padding: 8px;
            box-sizing: border-box;
            flex: 1 1 0;
            margin: 1px;
        }
        
        .flex-table .flex-row:first-child .flex-cell {
            border-top: none;
        }
        
        .flex-table .flex-row .flex-cell:first-child {
            border-left: none;
        }
        
        .input-field {
            border: none;
            background: transparent;
            width: 100%;
            font-size: 9px;
        }
        
        .checkbox-group {
            display: flex;
            gap: 20px;
            margin-top: 10px;
        }
        
        .small-text {
            font-size: 8px;
            line-height: 1.2;
            margin: 10px 0;
        }
        
        .signature-section {
            margin-top: 15px;
            display: flex;
            justify-content: space-between;
        }
        
        .signature-box {
            width: 200px;
            height: 40px;
            margin-top: 10px;
        }
        
        .bottom-section {
            margin-top: 20px;
            padding-top: 10px;
        }
        
        .payment-line {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 0;
        }
        
        .underline {
            border-bottom: 1px solid #000;
            display: inline-block;
            min-width: 100px;
        }
        
        .long-underline {
            border-bottom: 1px solid #000;
            display: inline-block;
            min-width: 300px;
        }
        
        .very-long-underline {
            border-bottom: 1px solid #000;
            display: inline-block;
            min-width: 400px;
        }

        .titulo-table-row {
            font-weight: bold;
            font-size: 15pt;
            text-align: right;
            font-family: 'Times New Roman', Times, serif;
        }
        .titulo-table-row-left {
            font-weight: lighter;
            font-size: 15pt;
            text-align: left;
            font-family: 'Times New Roman', Times, serif;
        }
        .gray-header-small,
        .white-header-small {
            min-height: 15px;          
            height: 15px;
            display: flex;             /* Hace que align-items / justify-content funcionen */
            align-items: flex-start;   /* texto pegado arriba */
            justify-content: flex-start;/* texto pegado a la izquierda */
            padding-top: 2px;          /* pequeño respiro superior */
            padding-left: 3px;
        }
        .gray-header-small,
        .white-header-small {
            line-height: 1.1;
            vertical-align: top;
        }
        @media print {
            body {
                transform: scale(.98);   /* 98 % del tamaño real */
                transform-origin: top left;
            }
        }
            .fuente-dato {
            font-family: monospace;
            font-size: 7.5pt; 
        }
    </style>
</head>
<body>
    <div class="form-container">

        <!-- Tabla convertida a flex -->
        <div class="flex-table header">
            <div class="flex-row">
                <div class="flex-cell titulo-table-row" style="flex-grow: 1; ">CrediGuía</div>
                <div class="flex-cell titulo-table-row-left" style="flex-grow: 3;">SOLICITUD DE TARJETA POR PRIMERA VENTA</div>
            </div>
        </div>
        
        <!-- Tabla convertida a flex -->
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell gray-header" style="flex-grow: 3;">FECHA: <span class="fuente-dato">{{FECHA}}</span></div>
                <div class="flex-cell gray-header" style="flex-grow: 3;">Nº AUTORIZACIÓN: <span class="fuente-dato">{{Nº_AUTORIZACIÓN}}</span></div>
                <div class="flex-cell gray-header" style="flex-grow: 6;">NOMBRE DEL COMERCIO: <span class="fuente-dato">{{NOMBRE_DEL_COMERCIO}}</span></div>
            </div>
            <div class="flex-row">
                <div class="flex-cell gray-header" style="flex-grow: 5;">Nº DE CUENTA: <span class="fuente-dato">{{Nº_DE_CUENTA}}</span></div>
                <div class="flex-cell gray-header" style="flex-grow: 4;">PRODUCTO: <span class="fuente-dato">{{PRODUCTO}}</span></div>
                <div class="flex-cell gray-header" style="flex-grow: 3;">SUCURSAL Nº: <span class="fuente-dato">{{SUCURSAL_Nº}}</span></div>
            </div>
        </div>
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell red-header" style="flex-grow: 10;">DATOS DEL SOLICITANTE (APELLIDOS Y NOMBRES)</div>
                <div class="flex-cell red-header" style="flex-grow: 2;">SEXO</div>
            </div>
        </div>
        <div class="flex-table data-table">
        <div class="flex-row">
                <div class="flex-cell white-header" style="flex-grow: 10;">
                    <span class="fuente-dato">{{SOLICITANTE_NOMBRE}}</span>
                </div>
                <div class="flex-cell white-header" style="flex-grow: 2;">
                    <span class="fuente-dato">{{SOLICITANTE_SEXO}}</span>
                </div>
            </div>
        </div>
        <!-- Tabla convertida a flex -->
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell gray-header-small" style="flex-grow: 2;">N° CUIT O CUIL: <span class="fuente-dato">{{CUIL_CUIT}}</span></div>
                <div class="flex-cell gray-header-small" style="flex-grow: 2;">TIPO DOC: <span class="fuente-dato">DNI</span></div>
                <div class="flex-cell gray-header-small" style="flex-grow: 2;">NÚMERO: <span class="fuente-dato">{{DNI}}</span></div>
                <div class="flex-cell gray-header-small" style="flex-grow: 2;">FECHA DE NACIMIENTO: <span class="fuente-dato">{{FECHA_NACIMIENTO}}</span></div>
                <div class="flex-cell gray-header-small" style="flex-grow: 2;">ESTADO CIVIL: <span class="fuente-dato">{{ESTADO_CIVIL}}</span></div>
                <div class="flex-cell gray-header-small" style="flex-grow: 2;">NACIONALIDAD: <span class="fuente-dato">{{NACIONALIDAD}}</span></div>
            </div>
        </div>
        
        <!-- Tabla convertida a flex -->
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell white-header-small" style="flex-grow: 6;">APELLIDOS Y NOMBRES DEL PADRE: </div>
                <div class="flex-cell white-header-small" style="flex-grow: 6;">APELLIDOS Y NOMBRES DE LA MADRE: </div>
            </div>
        </div>
        
        <div class="section-title">REFERENCIAS PERSONALES</div>
        
        <!-- Tabla convertida a flex -->
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">1-APELLIDOS Y NOMBRES / VÍNCULO *: <span class="fuente-dato">{{REFERENTE1_NOMBRE_COMPLETO}} / </span><span class="fuente-dato">{{REFERENTE1_VINCULO}}</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">2-APELLIDOS Y NOMBRES / VÍNCULO *: <span class="fuente-dato">{{REFERENTE2_NOMBRE_COMPLETO}} / <span class="fuente-dato">{{REFERENTE2_VINCULO}}</div>
            </div>
            <div class="flex-row">
                <div class="flex-cell white-header-small" style="flex-grow: 6;">DIRECCIÓN / TELÉFONOS *: <span class="fuente-dato">{{REFERENTE1_TELEFONO}}</div>
                <div class="flex-cell white-header-small" style="flex-grow: 6;">DIRECCIÓN / TELÉFONOS *: <span class="fuente-dato">{{REFERENTE2_TELEFONO}}</div>
            </div>
        </div>
        
        <div class="section-title">DOMICILIO PARTICULAR</div>
        
        <!-- Tabla convertida a flex -->
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell white-header-small" style="flex-grow: 5;">CALLE / N°: <span class="fuente-dato">{{DOMICILIO_CALLE}}</span></div>
                <div class="flex-cell white-header-small" style="flex-grow: 3;">ESQUINA</div>
                <div class="flex-cell white-header-small" style="flex-grow: 4;">REF POSTALES</div>
            </div>
        </div>
        
        <!-- Tabla convertida a flex -->
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">MZ</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">LT</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">CS</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">DX</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">PL</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">ENT</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">ACC</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">ESC</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">SECC</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">SECT</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">MK</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">MOD</div>
            </div>
        </div>
        
        <!-- Tabla convertida a flex -->
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">TR</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">TRR</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">LC</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">OF</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">PS</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 3;">DPTO</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 1;">JM</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 3;">CHACRA</div>
            </div>
        </div>
        
        <!-- Tabla convertida a flex -->
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell white-header-small" style="flex-grow: 1;">COD POSTAL: <span class="fuente-dato">{{CODIGO_POSTAL}}</span></div>
                <div class="flex-cell white-header-small" style="flex-grow: 1;">LOCALIDAD: <span class="fuente-dato">{{LOCALIDAD}}</span></div>
                <div class="flex-cell white-header-small" style="flex-grow: 1;">PROVINCIA: <span class="fuente-dato">{{PROVINCIA}}</span></div>
                <div class="flex-cell white-header-small" style="flex-grow: 1;">BARRIO: <span class="fuente-dato">{{BARRIO}}</span></div> 
                <div class="flex-cell white-header-small" style="flex-grow: 1;">SECTOR</div>
            </div>
        </div>
        
        <!-- Tabla convertida a flex -->
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell gray-header-small" style="flex-grow: 3;">TELÉFONO FIJO *: <span class="fuente-dato">{{TELEFONO_FIJO}}</span></div>
                <div class="flex-cell gray-header-small" style="flex-grow: 3;">TELÉFONO CELULAR *: <span class="fuente-dato">{{TELEFONO_CELULAR}}</span></div>
                <div class="flex-cell gray-header-small" style="flex-grow: 6;"></div>
            </div>
        </div>
        
        <div style="font-size: 9px; font-weight: bold; margin: 10px 0;">
            POR MEDIO DE LA PRESENTE SOLICITO ENVÍO DE RESUMEN AL E-MAIL: <span class="fuente-dato">{{EMAIL}}</span>
        </div>
        
        <!-- Tabla convertida a flex -->
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell red-header" style="flex-grow: 5;">DATOS LABORALES DEL SOLICITANTE</div>
                <div class="flex-cell red-header" style="flex-grow: 2;">Dependiente</div>
                <div class="flex-cell red-header" style="flex-grow: 2;">Independiente</div>
                <div class="flex-cell red-header" style="flex-grow: 2;">Pasivos</div>
                <div class="flex-cell red-header" style="flex-grow: 1;">Otros</div>
            </div>
        </div>
        
        <!-- Tabla convertida a flex -->
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell white-header-small" style="flex-grow: 4;">EMPRESA / RAZÓN SOCIAL: <span class="fuente-dato">{{EMPRESA}}</span></div>
                <div class="flex-cell white-header-small" style="flex-grow: 3;">ACTIVIDAD: <span class="fuente-dato">{{ACTIVIDAD}}</span></div>
                <div class="flex-cell white-header-small" style="flex-grow: 2;">NUMERO DE CUIT: <span class="fuente-dato">{{CUIT_EMPRESA}}</span></div>
                <div class="flex-cell white-header-small" style="flex-grow: 2;">INGRESO / INICIO ACT.</div>
            </div>
        </div>
        
        <!-- Tabla convertida a flex -->
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell gray-header-small" style="flex-grow: 4;">CARGO / FUNCIÓN: <span class="fuente-dato">{{CARGO}}</span></div>
                <div class="flex-cell gray-header-small" style="flex-grow: 4;">SECTOR: <span class="fuente-dato">{{SECTOR}}</span></div>
                <div class="flex-cell gray-header-small" style="flex-grow: 4;">DOMICILIO LEGAL: <span class="fuente-dato">{{DOMICILIO_LEGAL}}</span></div>
            </div>
        </div>
        
        <!-- Tabla convertida a flex -->
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell white-header-small" style="flex-grow: 3;">COD POSTAL:  <span class="fuente-dato">{{EMPLEADOR_COD_POSTAL}}</span></div>
                <div class="flex-cell white-header-small" style="flex-grow: 3;">LOCALIDAD:  <span class="fuente-dato">{{EMPLEADOR_LOCALIDAD}}</span></div>
                <div class="flex-cell white-header-small" style="flex-grow: 3;">PROVINCIA:  <span class="fuente-dato">{{EMPLEADOR_PROVINCIA}}</span></div>
                <div class="flex-cell white-header-small" style="flex-grow: 3;">TELÉFONO *:  <span class="fuente-dato">{{EMPLEADOR_TELEFONO}}</span></div>
            </div>
        </div>
        
        <div class="section-title">DATOS COMPLEMENTARIOS</div>
        
        <!-- Tabla convertida a flex -->
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell gray-header-small" style="flex-grow: 4;">OTRA OCUPACIÓN O PROFESIÓN</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 3;">SUELDO INGRESO NETO MENSUAL $ : <span class="fuente-dato">{{SUELDO}}</span></div>
                <div class="flex-cell gray-header-small" style="flex-grow: 3;">OTROS INGRESOS DEMOSTRABLES $</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 2;">TOTAL DE INGRESOS $</div>
            </div>
        </div>
        
        <div class="small-text">
            El/los que suscribe/n, declara/n que los datos consignados en este formulario son correctos y completos y que han confeccionado el mismo sin omitir ni falsear dato alguno que deba contener. siendo fiel expresión de la verdad. Asimismo se compromete/n irrevocablemente a notificar por escrito al domicilio legal de la Sucursal donde se encuentra/n vinculado/s como cliente/s, en un plazo de 5 días hábiles, cualquier variación que en ellos pudiera producirse en el futuro, mientras se mantenga su relación con la Cooperativa. Autoriza/n en el envío de e-mails a las casillas informadas.
        </div>
        
        <div class="signature-section">
            <div class="flex-table data-table">
                <div class="flex-row">
                    <div class="flex-cell gray-header signature-box"style="font-size: 9px; font-weight: bold;flex-grow: 6;">FIRMA TITULAR *</div>
                    <div class="flex-cell gray-header signature-box" style="font-size: 9px; font-weight: bold;flex-grow: 6;">ACLARACIÓN</div>
                </div>
            </div>
                
            
        </div>
        
        <div class="red-header" style="margin-top: 5px;">PARA USO INTERNO</div>
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell small-text" style="flex-grow: 5;">
                    Por la presente dejo constancia que la documentación que se adjunta, ha sido verificada por mi persona, y se comprobó su veracidad contra los originales que me son presentados y corresponde al titular solicitante de la operación Sr. / Sra.:
                </div>
        
                <div class="flex-cell" style="font-size: 9px; flex-grow: 5; align-self: flex-end;">_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                </div>
        
        
                <div class="flex-cell" style="font-size: 9px;flex-grow: 2; align-self:center;">Fecha _ _ _ _ _ _ _ _ _ _ _ _ _ _</div>
        
            </div>
        
        </div>
        
        <div class="flex-table data-table">
            <div class="flex-row">
                
                <div class="flex-cell" style="font-size: 9px; flex-grow: 4;">
                Firma por Comercio _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                </div>
        
                <div class="flex-cell" style="font-size: 9px; flex-grow: 4;">
                Aclaración _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
            </div>
        
                <div class="flex-cell" style="font-size: 9px; flex-grow: 4;">Tipo y Número de Documento   _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</div>
            
        
        </div>
        
        
        <div class="bottom-section">
            <div style="font-size: 9px; text-align: center; margin-bottom: 10px;">
                -------------------- Corte aquí.
                --------------------&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--------------------
                Corte aquí ---------------------------.
            </div>
            <div class="flex-table data-table">
                <div class="flex-row">
                    <div class="flex-cell" style="font-size: 12px; font-weight: bold;flex-grow: 1; text-align:justify;">
                        NÚMERO
                    </div>
                    <div class="flex-cell gray-header signature-box" style="font-size: 9px; font-weight: bold;flex-grow: 4;">
                    </div>
                    <div class="flex-cell" style="font-size: 12px; flex-grow: 1; text-align:justify; ">
                        $
                    </div>
                    <div class="flex-cell gray-header signature-box" style="font-size: 9px; font-weight: bold;flex-grow: 6;">
                    </div>
        
                </div>
            </div>
            <div style="font-size: 9px; margin: 15px 0;">
                Neuquén  <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> de <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> de <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>
            
            <div style="font-size: 9px; margin: 15px 0;">
                Pagará a la vista y sin protesto (art. 50 Cta. Ley 5965/63) a Cooperativa Guía Ltda.. o a su orden la suma de PESOS _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
            </div>
            
            <div style="font-size: 9px; margin: 15px 0;">
                 _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ pagadero en _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
            </div>
            
            <div style="font-size: 9px; margin: 15px 0;">
                Nombre y Domicilio del Deudor <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>
            
            <div style="font-size: 9px; margin: 15px 0;">
                (*) Campos obligatorios 
            </div>
            <div class="flex-table data-table">
                <div class="flex-row">
                    <div class="flex-cell" style="font-size: 9px; font-weight: bold;flex-grow: 4; text-align:left;">
                        (*) Campos obligatorios
                    </div>
                    <div class="flex-cell" style="font-size: 9px; flex-grow: 2; text-align:justify; ">
                        Firma del Deudor *
                    </div>
                    <div class="flex-cell gray-header-small signature-box" style="font-size: 9px; font-weight: bold;flex-grow: 4;">
                    </div>
                    <div class="flex-cell" style="font-size: 9px; flex-grow: 1; text-align:justify; ">
                        Aclaración *
                    </div>
                    <div class="flex-cell gray-header-small signature-box" style="font-size: 9px; font-weight: bold;flex-grow: 2;">
                    </div>
        
                </div>
                
            </div>
            
        </div>
        
    </div>
</body>
</html>`,
  pagina2: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contrato de Tarjeta de Crédito CREDI GUIA</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            line-height: 1.2;
            margin: 0;
            padding: 20px;
            background-color: white;
            font-size: 8.5pt;   /* Un punto más pequeño */
            line-height: 1.05;  /* Reduce interlineado */
            width: 210mm;       /* Ancho real de A4 */
            height: 297mm;      /* Alto real de A4 */
        }
    
        
        .header {
            background-color: #cc0000;
            color: white;
            padding: 8px;
            text-align: center;
            font-weight: bold;
            font-size: 10.5pt;
        }
        
        .subheader {
            background-color: #cc0000;
            color: white;
            padding: 4px 8px;
            font-size: 6pt;
            text-align: left;
            text-transform: uppercase;
        }
        
        .content {
            padding: 15px;
            text-align: justify;
            font-size: 8pt;
            font-family: sans-serif;
        }
        p {
        line-height: 17px;
        }
        
        .section-header {
            background-color: #cc0000;
            color: white;
            padding: 4px 8px;
            font-weight: bold;
            font-size: 9pt;
            margin: 10px 0 5px 0;
            text-align: start;
        }
        
        .section-content {
            margin: 10px 0;
            line-height: 15px;
        }
        
        .underline {
            text-decoration: underline;
        }
        
        .bold {
            font-weight: bold;
        }
        
        .page-number {
            text-align: right;
            color: #999;
            font-size: 8px;
            margin-top: 10px;
        }
        
        .footer{
            display:flex;
            justify-content:space-between;
            margin-top:20px;
            font-size:9px;
            color:#0066cc;
        }

        .footer-col{
            flex:1;
            text-align:center;
            margin:0 10px;
        }

        .signature-line{
            border-bottom:1px dashed #000;
            margin-bottom:4px;
            height:20px;
        }
        
        .numbered-section {
            margin: 15px 0;
        }
        
        .subsection {
            margin: 8px 0;
            line-height: 15px;
        }
        
        .title-block {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #cc0000;
            color: white;
            padding: 10px;
            font-family: 'Times New Roman', Times, serif;
            font-size: 18px;
            margin: 10px;
        }

.title-block div {
    flex: 1;
}

.title-block .title-left {
    flex-grow: 3; /* Occupa el 30% del espacio */
    text-align: right;
}

.title-block .title-right {
    flex-grow: 9; /* Occupa el 70% del espacio */
    text-align: left;
}
    .fuente-dato {
            font-family: monospace;
            font-size: 7.5pt; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="page-number">2 de 8</div>
    
        <div class="title-block">
            <div class="title-left" style="padding: 20px;">Credi Guía</div>
            <div class="title-right">
                CONTRATO DE TARJETA DE CRÉDITO CREDI GUIA<br>
                <div class="subheader">CONDICIONES GENERALES Y PARTICULARES QUE RIGEN EL OTORGAMIENTO Y USO DE LA TARJETA</div>
            </div>
            
        </div>
        
        <div class="content">
            <div class="red-line">
                <p>
                    En la ciudad de Neuquén, a los 25 días del mes de Mar del año 2025 entre la empresa Cooperativa de Servicios de Administración de Ventas a Crédito y de Crédito Guía Limitada, CUIT 30-58401237-0, domicilio Legal Corrientes 231, en adelante el <span class="bold">"EMISOR"</span>, y 
                    __<span class="fuente-dato">{{TITULAR_NOMBRE}}</span>___, DNI N° ___<span class="fuente-dato">{{TITULAR_DNI}}</span>_____, CUIL/CUIT/CDI __<span class="fuente-dato">{{TITULAR_CUIT}}</span>___, domicilio ___<span class="fuente-dato">{{TITULAR_DOMICILIO}}</span>____, 
                    en adelante el <span class="bold">"TITULAR"</span>, acuerdan celebrar el presente contrato de Emisión de tarjeta de Crédito <span class="bold">"CREDI GUIA"</span>,
                    en adelante el <span class="bold">"CONTRATO"</span>, el que se integra con las Condiciones Generales que se siguen y el <span class="bold">Anexo I de condiciones Particulares que forma parte del mismo</span>.
                </p>
                
                <p>
                    El <span class="bold">"TITULAR"</span> solicita la emisión de una Tarjeta de Crédito <span class="bold">CREDI GUIA</span> y de las tarjetas adicionales, 
                    según consta en el presente. Las obligaciones de las partes darán comienzo cuando la tarjeta solicitada se emita y sea recibida por el <span class="bold">TITULAR</span> 
                    o quien lo represente.
                </p>
            </div>
            
            <div class="section-header">
                CONDICIONES GENERALES
            </div>
            
            <div class="numbered-section">
                <div class="bold" style="color: #0066cc; font-size: 9pt;">1. VIGENCIA DEL CONTRATO:</div>
                <div class="section-content">
                    El "CONTRATO" tendrá vigencia por ________( ) años a partir de la fecha arriba indicada y hasta el último día del igual mes del año en que se finalice. 
                    Las partes convienen la renovación automática y por tiempo indeterminado del "CONTRATO" en uso de las facultades conferidas por el ART. 10 de la 
                    Ley 25065, de no mediar comunicación fehaciente en contrario dirigida al <span class="bold">"EMISOR"</span> por parte del <span class="bold">"TITULAR"</span> 
                    con una antelación de (30) días al vencimiento del contrato, obligándose el "EMISOR" a notificar al <span class="bold">"TITULAR"</span> en los tres(3) 
                    últimos resúmenes de cuenta anteriores al vencimiento de la relación contractual, la fecha en que opera dicho vencimiento.
                </div>
            </div>
            
            <div class="numbered-section">
                <div class="bold" style="color: #0066cc; font-size: 9pt;">2. DE LA TARJETA DE CRÉDITO:</div>
                
                <div class="subsection">
                    <div class="bold">2.01 Emisión y entrega:</div> Una vez suscrito el presente contrato, el <span class="bold">"EMISOR"</span> entregará al 
                    <span class="bold">"TITULAR"</span> una tarjeta de crédito <span class="bold">"CREDIGUIA"</span>, que extendida a su nombre será intransferible y 
                    de uso personal y exclusivo del Titular. Otras tarjetas podrán, a solicitud del <span class="bold">"TITULAR"</span>, extenderse a 
                    nombre de las personas físicas que éste designe, en adelante denominadas <span class="bold">"ADICIONALES"</span> cumplimentando las 
                    condiciones exigidas para el <span class="bold">"EMISOR"</span> y con cargo a la cuenta del Titular. Resultando tanto el Titular como los 
                    Adicionales solidaria e ilimitadamente responsables frente al <span class="bold">"EMISOR"</span> por todas las obligaciones, saldos, 
                    cargos, gastos y demás conceptos que se causen por el uso de la tarjeta tanto sea la titular como las adicionales, todas ellas denominadas 
                    en adelante las <span class="bold">"TARJETAS"</span>. La recepción de las tarjetas por el titular, importa la ratificación de todas 
                    y cada una de las cláusulas contenidas en el presente.
                </div>
                
                <div class="subsection">
                    Tanto la Tarjeta Titular como las Adicionales solicitadas deberán ser retiradas en el domicilio del <span class="bold">"EMISOR"</span>. 
                    No obstante, éste podrá enviar para su entrega a la Tarjeta Titular o a las Adicionales el domicilio del <span class="bold">"TITULAR"</span>. 
                    En todos los casos, el <span class="bold">"TITULAR"</span> resulta personalmente a los <span class="bold">"ADICIONALES"</span> 
                    para recibir, en su nombre, tanto la Tarjeta Titular como las Adicionales.
                </div>
                
                <div class="subsection">
                    <div class="bold">2.02 Vigencia y Renovación:</div> La Tarjeta será emitida con un plazo de vigencia de hasta ____( ) años, y caduca en la fecha de vencimiento 
                    consignada en la misma. En ningún caso, podrá utilizarse la Tarjeta antes de la fecha a partir de la cual tenga validez o con posterioridad a la fecha en la 
                    que haya caducado. Siempre que no medie oposición del <span class="bold">"EMISOR"</span>, la <span class="bold">"TARJETA"</span> será renovada 
                    periódicamente hasta ____________( ) años, salvo aviso por escrito del <span class="bold">"TITULAR"</span> efectuado con no menos de treinta (30) días 
                    de anterioridad al vencimiento correspondiente.
                </div>
                
                <div class="subsection">
                    Recibida la Tarjeta solicitada el <span class="bold">"TITULAR"</span> y/o los <span class="bold">"ADICIONALES"</span> deberán firmar la que a cada uno le corresponda, 
                    en el lugar destinado a tal fin, al dorso de la misma.
                </div>
                
                <div class="subsection">
                    La Tarjetas adicionales se extinguen en la fecha de vencimiento o siempre que cesique, por la razón que sea, la Tarjeta Titular.
                </div>
                
                <div class="subsection">
                    <div class="bold">2.03 Utilización de la tarjeta y responsabilidad por uso de adicionales:</div> La <span class="bold">"TARJETA"</span> 
                    será utilizada por el Titular y los Titulares Adicionales, con el objeto de solemnizar como usuario habitual para efectuar las operaciones de compra o 
                    locación de bienes, servicios u otras, en los comercios y establecimientos adheridos a su satisfacción. Una vez concluida la operación, 
                    el usuario de la <span class="bold">"TARJETA"</span> deberá firmar los disputas o comprobantes venta respectivos. El <span class="bold">"EMISOR"</span> 
                    no es de ninguna manera, salvo error de facto, alieno ajeno a las compras y/o servicios efectuados y abonará mediante el uso de la Tarjeta.
                </div>
                
                <div class="subsection">
                    El <span class="bold">"TITULAR"</span> y <span class="bold">"ADICIONALES"</span> declaran y aceptan que los montos por compras y/o servicios 
                    y los gastos imputados por motivos del uso de la <span class="bold">"TARJETA"</span>. En consecuencia, el <span class="bold">"TITULAR"</span> 
                    y <span class="bold">"ADICIONALES"</span> se constituyen recíprocamente en fisos, llanos y principales pagadores, sin beneficio de retracción 
                    ni división ni excusión ni información respecto de todos los compras y/o gastos efectuados mediante cualquiera de las Tarjetas.
                </div>
                
                <div class="subsection">
                    <div class="bold">2.04 Robo, hurto, extravío. Responsabilidad:</div> En caso de extravío, robo, hurto o uso indebido de la Tarjeta del Titular 
                    y/o los Adicionales si las hubiese, el <span class="bold">"TITULAR"</span> procederá de inmediato a dar aviso al <span class="bold">"EMISOR"</span> 
                    en forma telefónica durante las 24 horas de cada día, o bien efectuarlo por telegrama o personalmente, al que tendrá carácter precautorio. 
                    Dentro de las 72 horas de dicho aviso, el Titular deberá ratificarlo personalmente en el domicilio del <span class="bold">"EMISOR"</span> 
                    acompañando al original o constancia de la denuncia que efectuare ante la autoridad policial o la que resultare autorizada o competente en 
                    razón del lugar del hecho. Cuando el hecho de extravío, robo o hurto se produjere en el exterior de la República Argentina o en alguna 
                    localidad del país donde el <span class="bold">"EMISOR"</span> no opera con su sistema de Tarjeta, el <span class="bold">"TITULAR"</span> 
                    y/o en su caso los <span class="bold">"ADICIONALES"</span>, efectuarán la denuncia en la localidad de situación donde al encontrarse el 
                    <span class="bold">"EMISOR"</span>. El <span class="bold">"TITULAR"</span> y/o <span class="bold">"ADICIONALES"</span> serán responsables 
                    de cualquier compra y/o gasto que se efectuaron con las tarjetas en la forma antes indicada. No obstante el <span class="bold">"EMISOR"</span> 
                    se reserva el derecho de verificar las transacciones efectuadas en ese día, a efectos de determinar las operaciones genuinas del Titular 
                    y/o Adicionales y las consideradas fraudulentas, aún en el caso de que las tarjetas fueren recuperadas o devueltas por terceros antes del aviso. 
                    Si el <span class="bold">"TITULAR"</span> y/o sus <span class="bold">"ADICIONALES"</span> omitieren el trámite del aviso precautorio, 
                    serán responsables de todos los gastos y/o compras que se produjeren con las tarjetas hasta su vencimiento o eventual recupero.
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-col">
                    <div class="signature-line"></div>
                    <p>p/Cooperativa Guía Ltda.</p>
                </div>
                <div class="footer-col">
                    <div class="signature-line"></div>
                    <p>Firma</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`,
  pagina3: `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Condiciones de Tarjeta – Pág. 3 de 8</title>
    <style>
        body{
            margin:0;
            padding:20px;
            font-family:Arial, sans-serif;
            font-size:8.5pt;          /* igual que 2º doc */
            line-height:1.05;
            width:210mm;
            height:297mm;
            background:#fff;
            color:#000;
        }
        .container{ width:100%; }

        /* --- cabecera roja --- */
        .section-header{
            background:#cc0000;
            color:#fff;
            padding:4px 8px;
            font-weight:bold;
            font-size:9pt;
            margin:10px 0 5px 0;
            text-transform:uppercase;
        }

        /* --- párrafos --- */
        .content{ padding:0 15px; text-align:justify; }
        p{ margin:0 0 10px 0; line-height:15px; }

        /* --- negritas / cursivas / subrayado --- */
        .bold{ font-weight:bold; }
        .italic{ font-style:italic; }
        .underline{ text-decoration:underline; }

        /* --- “comillas” angulares --- */
        .quotes{ font-weight:bold; }

        /* --- numeración de página --- */
        .page-number{
            text-align:right;
            color:#999;
            font-size:8px;
            margin:0 15px 5px 0;
        }

        /* --- footer bipartito con líneas --- */
        .footer{
            display:flex;
            justify-content:space-between;
            margin-top:30px;
            font-size:9px;
            color:#0066cc;
        }
        .footer-col{
            flex:1;
            margin:0 10px;
            text-align:center;
        }
        .signature-line{
            border-bottom:1px dashed #000;
            height:20px;
            margin-bottom:4px;
        }
            .fuente-dato {
            font-family: monospace;
            font-size: 7.5pt; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="page-number">3 de 8</div>

        <div class="content">
            <p>
                En caso que el <span class="quotes">"TITULAR"</span> y/o <span class="quotes">"ADICIONALES"</span> recuperen la/s Tarjeta/s robadas, hurtadas o perdidas, se comprometen en el momento en que las mismas retornen a su poder por cualquier circunstancia, a restituirlas al <span class="quotes">"EMISOR"</span> para su posterior destrucción.
            </p>

            <p>
                <span class="bold">2.05 Comisiones y Cargos:</span> El <span class="quotes">"TITULAR"</span> y/o <span class="quotes">"ADICIONALES"</span> se comprometen, a partir de la fecha de emisión de la Tarjeta, a abonar a cada vencimiento, junto con el resumen de cuenta de sus compras y/o gastos, los importes estipulados en el Anexo I de Condiciones Particulares del presente <span class="quotes">"CONTRATO"</span>, correspondiente a la comisión por renovación anual, comisión por mantenimiento de cuenta, comisión por reposición de plásticos, cargo por gestión de cobranzas, cargo por cobranza médicos electrónicos, costo de financiamiento por diferimiento de pago, y todo otro concepto contemplado en el art. 6 inc. b de la Ley 25.065. El <span class="quotes">"TITULAR"</span> y <span class="quotes">"ADICIONALES"</span> manifiestan su conformidad con dichas comisiones y cargos y autorizan al <span class="quotes">"EMISOR"</span> para debitar los montos que resulten por tales conceptos en el Resumen de Cuenta Mensual que corresponda.
            </p>

            <p>
                <span class="bold">2.06 Suspensión de las Tarjetas:</span> La tarjeta del Titular y/o Adicionales son propiedad del <span class="bold">EMISOR</span> quien podrá suspender el funcionamiento de la tarjeta por mora en el pago del resumen de cuenta mensual conforme los apartados 4 y 5 del presente contrato. También podrá el emisor efectuar la suspensión en cualquier momento en que se considere afectada la situación patrimonial que el titular declara o desactualización de los datos personales esenciales del contrato.
            </p>
        </div>

        <!-- Sección 3 -->
        <div class="bold" style="color: #0066cc; font-size: 9pt;margin-bottom: 10px;">
            3. LÍMITE DE COMPRA. LÍMITE DE CRÉDITO
        </div>
        <div class="content">
            <p>
                La tarjeta Titular, así como las que se emitan a nombre de los Adicionales autorizados por el mismo, tienen en conjunto un <span class="quotes">"Límite Asignado"</span> o <span class="quotes">"Límite de Compra"</span> que constituye la capacidad máxima de endeudamiento mensual que surge de la evaluación crediticia efectuada por la Cooperativa, que será informado oportunamente al Titular. Dicho límite significará que el monto de la deuda financiada, más la originada por compras, contrataciones y/o gastos del mes, no podrán exceder dicho límite. El titular podrá asignar a sus Adicionales, siempre dentro del Límite Asignado, un porcentaje menor al límite de compra, siempre y cuando así lo consigne en el presente contrato o en comunicación fehaciente posterior. De tal manera el Límite de Compra de los Adicionales quedará acotado al tope que al así fije el Titular.
            </p>
        </div>

        <!-- Sección 4 -->
        <div class="bold" style="color: #0066cc; font-size: 9pt;margin-bottom: 10px;">
            4. DEL RESUMEN DE CUENTA MENSUAL
        </div>

        <div class="content">
            <p class="bold" style="font-size:9pt;">4.01 Envío, Recepción y Pago del Resumen:</p>
            <p>
                Mensualmente el <span class="bold">EMISOR</span>, con una antelación mínima de cinco días a la fecha de su vencimiento, informará al <span class="quotes">"TITULAR"</span> por cualquiera de los medios válidos de información al Resumen de Cuenta con el detalle de todas las operaciones e importes por los conceptos de bienes o servicios que el usuario o su acreedor de Titular de la Tarjeta y/o los <span class="quotes">"Adicionales"</span> de la misma hubieren efectuado en los Proveedores adheridos al Sistema de la Tarjeta de Crédito <span class="quotes">"CREDI-GUÍA"</span>, el que incluirá además, los respectivos débitos por todo otro cargo o comisión que corresponda a su condición de usuario y particularmente del Sistema auditado. El <span class="quotes">"TITULAR"</span> está obligado a abonar dentro de la fecha de vencimiento del Resumen de Cuenta el importe total del mismo, de conformidad con las previsiones establecidas en estas Condiciones Generales.
            </p>
            <p>
                La falta de recepción por cualquier causa del resumen de las operaciones mensuales, no eximirá al <span class="quotes">"TITULAR"</span> del pago en tiempo y forma de las sumas adeudadas, así como tampoco lo excusará de la obligación de satisfacer en término el hecho de que se estuviere ausente del domicilio fijado para que el Emisor le remita el Resumen de Cuenta.
            </p>
            <p>
                La no recepción del Resumen aludido dentro de las 48 horas anteriores a la fecha de vencimiento, le crea al <span class="quotes">"TITULAR"</span> la obligación de retirar una copia del mismo de la sucursal del <span class="quotes">"EMISOR"</span> que le emitió la Tarjeta y/o hacer el pago correspondiente en la fecha consignada en el mismo o bien ejercer la opción de informarse en tiempo oportuno y cuantas veces sea necesario a través del canal de comunicación telefónica de la casa central del <span class="quotes">"EMISOR"</span>, que estará a disposición del Titular durante las veinticuatro (24) horas del día, que le permitirá obtener el saldo de cuenta y el monto de pago mínimo a realizar.
            </p>

            <p class="bold" style="font-size:9pt;">4.02 Impugnación de los Resúmenes de Cuenta:</p>
            <p>
                El <span class="quotes">"EMISOR"</span> considerará aceptados y conformados los Resúmenes y las operaciones y cargos en ellos comprendidos, si transcurridos treinta (30) días corridos desde la fecha de recepción del resumen por parte del <span class="quotes">"TITULAR"</span> éste no fueron objetados o impugnados por éste, mediante comunicación efectuada por escrito y dirigida al <span class="quotes">"EMISOR"</span>, detallando claramente el error atribuido y aportando todo dato útil para esclarecer la situación. La impugnación no exime al titular del pago en término de las operaciones de crédito no impugnadas, sean estas anteriores o explicitadas en el resumen de cuenta en cuestión.
            </p>

            <p class="bold" style="font-size:9pt;">4.03 Cupones o Comprobantes de Compra:</p>
            <p>
                Producida la aceptación del <span class="quotes">"TITULAR"</span> respecto de la liquidación mensual contenida en el Resumen de Cuenta, conforme al procedimiento indicado (ítems 4.01 y 4.02) en el presente Contrato, el <span class="quotes">"EMISOR"</span> queda facultado para la destrucción de los comprobantes de cargo, boletas o cupones correspondientes a los consumos efectuados por el Titular y Adicionales, sin posibilidad de reclamo posterior alguno por parte de aquél.
            </p>
        </div>

        <!-- Sección 5 -->
        <div class="bold" style="color: #0066cc; font-size: 9pt; margin-bottom: 10px;">
            5. MORA EN EL PAGO
        </div>
        <div class="content">
            <p>
                La falta de pago en término y forma en las presentes condiciones, hará incurrir en mora al Titular, a los Adicionales y a los codeudores si los hubiera, sin necesidad de interpelación previa judicial o extrajudicial alguna, produciéndose la caducidad de los plazos no vencidos, generándose a partir de esa fecha el devengamiento de los respectivos intereses compensatorios y punitorios hasta la cancelación de lo adeudado, que incluye el resarcimiento de los gastos judiciales o extrajudiciales, impuestos, gastos de intimación, protesto u otros de índole similar, todos los cuales serán a cargo del Titular. El monto del pago mínimo coincide con el importe a pagar indicado para la fecha de vencimiento.
            </p>
        </div>

        <!-- Footer idéntico al 2º doc -->
        <div class="footer">
            <div class="footer-col">
                <div class="signature-line"></div>
                <p>p/Cooperativa Guía Ltda.</p>
            </div>
            <div class="footer-col">
                <div class="signature-line"></div>
                <p>Firma</p>
            </div>
        </div>
    </div>
</body>
</html>`,
  pagina4: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Condiciones de Tarjeta – Pág. 4 de 8</title>
    <style>
        body{
            margin:0;
            padding:20px;
            font-family:Arial, sans-serif;
            font-size:8.5pt;
            line-height:1.05;
            width:210mm;
            height:297mm;
            background:#fff;
            color:#000;
        }
        .container{ width:100%; }

        /* --- títulos azules --- */
        .section-title-blue{
            font-weight:bold;
            color:#0066cc;
            font-size:9pt;
            margin:15px 0 5px 0;
        }

        /* --- párrafos --- */
        .content{ padding:0 15px; text-align:justify; }
        p{ margin:0 0 10px 0; line-height:15px; }

        /* --- negritas y comillas --- */
        .bold{ font-weight:bold; }
        .quotes{ font-weight:bold; }

        /* --- numeración de página --- */
        .page-number{
            text-align:right;
            color:#999;
            font-size:8px;
            margin:0 15px 5px 0;
        }

        /* --- footer bipartito --- */
        .footer{
            display:flex;
            justify-content:space-between;
            margin-top:30px;
            font-size:9px;
            color:#0066cc;
        }
        .footer-col{
            flex:1;
            margin:0 10px;
            text-align:center;
        }
        .signature-line{
            border-bottom:1px dashed #000;
            height:20px;
            margin-bottom:4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="page-number">4 de 8</div>

        <!-- Sección 6 -->
        <div class="section-title-blue">6. INTERESES Y OTROS CARGOS:</div>
        <div class="content">
            <p>
                Las tasas a aplicar por el <span class="quotes">"EMISOR"</span> en carácter de intereses compensatorio o financiero se indican en el Anexo I de <span class="quotes">"CONDICIONES PARTICULARES"</span>, las que no podrán exceder la tasa máxima permitida por las disposiciones legales vigentes (Ley 25.065 Art. 16).<br>
                En caso de incurrir en mora, la deuda devengará intereses punitorios a partir de esa fecha y hasta su total cancelación. Las tasas a aplicar por el <span class="quotes">"EMISOR"</span> en carácter de interés punitorio se indican en el Anexo I citado, las que en ningún caso podrán exceder en más del cincuenta por ciento (50 %) a la tasa de interés compensatorio o financiero que el <span class="quotes">"EMISOR"</span> cobre para este tipo de operaciones de compras con Tarjeta de Crédito. Los intereses punitorios no se capitalizan.<br>
                A la determinación de intereses en ambos casos, corresponderá debitar adicionalmente el IVA.
            </p>
        </div>

        <!-- Sección 7 -->
        <div class="section-title-blue">7. CARGAS TRIBUTARIAS:</div>
        <div class="content">
            <p>
                Todos los impuestos actuales y futuros que directa o indirectamente graven la Tarjeta o los gastos que se efectúen, estarán a cargo del <span class="quotes">"TITULAR"</span> y serán incluidos en los Resúmenes de Cuenta.
            </p>
        </div>

        <!-- Sección 8 -->
        <div class="section-title-blue">8. DISOLUCIÓN DE ACUERDO:</div>
        <div class="content">
            <p>
                Las partes expresan su conformidad en que las cláusulas de este <span class="quotes">"CONTRATO"</span> comenzarán a regir desde la firma del mismo y la entrega conforme de la/s Tarjeta/s y no tendrá término de vencimiento aún luego de haber perdido ella/s su vigencia, hasta tanto el Titular haya abonado la última compra o gasto derivado del uso de la/s misma/s. El <span class="quotes">"TITULAR"</span> podrá dejar sin efecto, total o parcialmente la relación contractual por sí y/o sus Adicionales mediante comunicación fehaciente girada al <span class="quotes">"EMISOR"</span>.<br>
                Si la disolución se produjera por voluntad unilateral del <span class="quotes">"TITULAR"</span>, la relación contractual cesará a partir de la hora 24 de la fecha del acuse de recibo por el <span class="quotes">"EMISOR"</span> de la notificación escrita, acompañada de la/s Tarjeta/s en carácter de devolución. No obstante los efectos del <span class="quotes">"CONTRATO"</span> subsistirán en los términos arriba expresados de esta cláusula.
            </p>
        </div>

        <!-- Sección 9 -->
        <div class="section-title-blue">9. CAUSALES DE RESOLUCIÓN DEL CONTRATO:</div>
        <div class="content">
            <p>
                El <span class="quotes">"EMISOR"</span> quedará habilitado para producir la resolución del presente <span class="quotes">"CONTRATO"</span> cuando ocurra cualquiera de las siguientes causales y/o situaciones:<br>
                (a) falta de pago al vencimiento de la liquidación contenida en el Resumen de Cuentas mensual conforme lo estipulado por la Cláusula 5. <span class="bold">MORA EN EL PAGO</span> - item 5.01;<br>
                (b) si la situación económico-financiera del Titular, o de sus Adicionales y/o Codeudores, variara de tal manera las condiciones de solvencia tomadas en cuenta por el Emisor al momento presente de evaluación del riesgo crediticio, que tornara incierta o dudosa su capacidad de pago;<br>
                (c) haberse detectado con posterioridad al perfeccionamiento del presente cualquier falsedad en los datos e informaciones suministradas al Emisor, por el Titular, Adicionales y/o Codeudores;<br>
                (d) si resultare inhibido, quebrado, presentación en Concurso Preventivo, libramiento de cheques sin fondos o cualquier otra circunstancia que indique pobreza inasequible la medida, respecto del Titular o Adicionales y/o Codeudores;<br>
                (e) la inclusión del Titular o Adicionales y/o Codeudores en la Base de Datos de Cuenta Corriente inhabilitados del Banco Central de la <span class="bold">República Argentina</span>;<br>
                (f) cuando se verifique que el titular ha cambiado de domicilio sin efectuar comunicación fehaciente al Emisor.<br>
                En el caso y de la presente cláusula, sin perjuicio de las acciones judiciales que correspondan, se operará a la caducidad de los plazos concedidos y la deuda será exigible en su totalidad.
            </p>
        </div>

        <!-- Sección 10 -->
        <div class="section-title-blue">10. CODEUDORES:</div>
        <div class="content">
            <p>
                El <span class="quotes">"EMISOR"</span> podrá solicitar uno o más <span class="quotes">"CODEUDORES"</span>, quien/es se constituyen <span class="bold">en liso/s, solidario/s y principal/es pagadores</span> de todas las obligaciones que el <span class="quotes">"TITULAR"</span> y sus <span class="quotes">"ADICIONALES"</span> contrajeran con el Emisor, quedando subsistente la obligación de los codeudores hasta la extinción total de la deuda por todo concepto y mientras el Emisor no reciba la información de la renovación y devolución de las tarjetas vigentes. La obligación aquí asumida por los codeudores tiene el alcance de aval.
            </p>
        </div>

        <!-- Sección 11 -->
        <div class="section-title-blue">11. CESIÓN:</div>
        <div class="content">
            <p>
                Los créditos que se generen a favor del <span class="quotes">"EMISOR"</span> por la utilización de la Tarjeta podrán ser cedidos por éste en los términos de los Artículos 70 a 72 de la Ley 24.441. El <span class="quotes">"TITULAR"</span>, <span class="quotes">"ADICIONALES"</span> y eventuales <span class="quotes">"CODEUDORES"</span> no podrán ceder o transferir los derechos y obligaciones emergentes en el presente.
            </p>
        </div>

        <!-- Sección 12 -->
        <div class="section-title-blue">12. AUTORIZACIONES:</div>
        <div class="content">
            <p>
                El <span class="quotes">"TITULAR"</span> autoriza, de un todo conforme a los Art. 5, 6, 11 y concordantes de la ley 25.326 de Protección de los Datos Personales, a tenor de lo cual declara conocer y aceptar, que sus datos personales y todo aquellos vinculados o emergentes de la prestación del servicio, integren la Base de Datos de la Cooperativa.<br>
                La autoriza también para informar a instituciones de protección del Crédito, en el caso que la causa de rescisión de contrato sea la mora en que hayan incurrido en el pago de los resúmenes mensuales.<br>
                Asimismo presta expresa conformidad para que todos sus datos personales sean incluidos por la Cooperativa en los Registros Nacionales y Provinciales de morosos, con la pertinente clasificación durante todo el lapso de exigibilidad de la deuda, manifestando que ha sido instruido acerca del alcance de dicha inclusión, comprende y consiente la misma.
            </p>
        </div>

        <!-- Sección 13 -->
        <div class="section-title-blue">13. MODIFICACIONES EN COMISIONES, DERECHOS Y/O GASTOS:</div>
        <div class="content">
            <p>
                Las comisiones y cargos que se indican en el <span class="bold">ANEXO I CONDICIONES PARTICULARES</span>, podrán ser modificados por el <span class="quotes">"EMISOR"</span>. Tales modificaciones se harán conocer mediante las notificaciones legales específicas y plazos de antelación determinados por los órganos de aplicación.
            </p>
        </div>

        <!-- Sección 14 -->
        <div class="section-title-blue">14. CONFORMIDAD CONYUGAL:</div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-col">
                <div class="signature-line"></div>
                <p>p/Cooperativa Guía Ltda.</p>
            </div>
            <div class="footer-col">
                <div class="signature-line"></div>
                <p>Firma</p>
            </div>
        </div>
    </div>
</body>
</html>`,
  pagina5: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Página 5 de 8</title>
  <style>
    body{
      margin:0;
      padding:20px;
      font-family:Arial, sans-serif;
      font-size:8.5pt;
      line-height:1.05;
      width:210mm;
      height:297mm;
      background:#fff;
      color:#000;
    }
    .container{ width:100%; }

    /* --- numeración de página --- */
    .page-number{
      text-align:right;
      color:#999;
      font-size:8px;
      margin:0 15px 5px 0;
    }

    /* --- contenido --- */
    .content{
      padding:0 15px;
      text-align:justify;
    }
    p{ margin:0 0 10px 0; line-height:15px; }

    /* --- negritas / subrayado --- */
    .bold{ font-weight:bold; }
    .underline{ text-decoration:underline; }

    /* --- footer bipartito --- */
    .footer{
      display:flex;
      justify-content:space-between;
      margin-top:30px;
      font-size:9px;
      color:#0066cc;
    }
    .footer-col{
      flex:1;
      margin:0 10px;
      text-align:center;
    }
    .signature-line{
      border-bottom:1px dashed #000;
      height:20px;
      margin-bottom:4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="page-number">5 de 8</div>

    <div class="content">
      <p>
        El <span class="bold">CONYUGE DEL TITULAR</span> toma conocimiento de todas las <span class="underline">declaraciones presentes</span>, firmando en prueba de conformidad,
        constituyéndose en liso/a, llano/a, y principal pagador/a, solidariamente <span class="bold">responsable de todas las compras y/o gastos efectuados mediante la Tarjeta Titular y Adicionales si los hubiere</span>.
        Asimismo por el presente CONTRATO y <span class="underline">razón</span> de los dispuesto en los artículos 1276 y 1277 del Código Civil presta expreso consentimiento con los términos del mismo.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-col">
        <div class="signature-line"></div>
        <p>p/Cooperativa Guía Ltda.</p>
      </div>
      <div class="footer-col">
        <div class="signature-line"></div>
        <p>Firma</p>
      </div>
    </div>
  </div>
</body>
</html>`,
  pagina6: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Página 6 de 8</title>
  <style>
    body{
      margin:0;
      padding:20px;
      font-family:Arial,sans-serif;
      font-size:8.5pt;
      line-height:1.05;
      width:210mm;
      height:297mm;
      background:#fff;
      color:#000;
    }
    .container{width:100%;}
    .page-number{
      text-align:right;
      color:#999;
      font-size:8px;
      margin:0 15px 5px 0;
    }
    .content{padding:0 15px;text-align:justify;}
    p{margin:0 0 10px 0;line-height:15px;}
    .bold{font-weight:bold;}
    .section-title{
      font-weight:bold;
      color:#0066cc;
      font-size:9pt;
      margin:15px 0 5px 0;
    }
    .signature-grid{
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:20px;
      margin-top:25px;
    }
    .signature-grid-2{
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:40px;
      margin-top:20px;
    }
    .signature-block{
      text-align:center;
      font-size:9px;
      color:#0066cc;
    }
    .dashed-line{
      border-bottom:1px dashed #0066cc;
      height:20px;
      margin-bottom:3px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="page-number">6 de 8</div>

    <div class="content">
      <div class="section-title">15. DERECHOS DE LOS USUARIOS:</div>

      <p><span class="bold">15-01 Revocación de la aceptación:</span> Plazo y Forma: dentro del plazo de 10 (diez) días hábiles contados desde la recepción de la tarjeta por parte del Titular, el mismo podrá revocar la aceptación de la misma notificando de manera <u>fehaciente</u> al emisor.</p>

      <p><span class="bold">15-02 <u>Precancelaciones:</u></span> El usuario podrá efectuar en cualquier momento la <u>precancelación</u> total o <u>precancelaciones</u> parciales de los saldos de los <u>resúmenes</u>, las que serán imputadas a los sucesivos vencimientos.</p>

      <p><span class="bold">15-03 Operaciones por Ventanilla:</span> El usuario podrá realizar operaciones de consulta o pago por ventanilla, sin restricciones, dentro de los horarios de atención al público.</p>

      <p><span class="bold">15-04 Protección a Usuarios Servicios Financieros:</span> Usted puede consultar el “Régimen de Transparencia” elaborado por el Banco Central sobre la base de la información proporcionada por los sujetos obligados a fin de comparar los costos, características y requisitos de los productos y servicios financieros, ingresando a <a href="https://www.bcra.gov.ar/BCRAyVos/Regimen_de_transparencia.asp" target="_blank" style="color:#0066cc;text-decoration:none;">https://www.bcra.gov.ar/BCRAyVos/Regimen_de_transparencia.asp</a>.</p>

      <div class="section-title">16. JURISDICCIÓN. CONSTITUCIÓN DE DOMICILIO:</div>
      <p>
        A todos los efectos vinculados con el presente <span class="bold">"CONTRATO"</span>, el <span class="bold">"TITULAR"</span> se somete a la jurisdicción de los Tribunales Ordinarios de la ciudad de ____________ y constituye domicilio en ____________________________ de _______________________ Código Postal ______ Provincia ______, donde se considerarán válidas todas las intimaciones y notificaciones relacionadas con la presente.
      </p>
      <p>
        Cualquier nuevo <u>domicilio</u> del TITULAR, para ser oponible, deberá ser notificado a la Cooperativa por medio fehaciente.
        El <span class="bold">TITULAR y ADICIONALES</span> declaran bajo juramento que han tomado conocimiento de las cláusulas insertas en el presente y los datos consignados en la Solicitud de adhesión son completos, ciertos y exactos, sin omitir ni falsear información alguna, <u>comprometiéndose</u> a informar a la Cooperativa cualquier modificación de los mismos <u>autorizando</u> a que los mismos sean corroborados por el <span class="bold">"EMISOR"</span> en la forma que estime adecuada.
      </p>
      <p>
        A los efectos de este “CONTRATO” el <span class="bold">"EMISOR"</span> constituye domicilio en Corrientes 231, de la ciudad de Neuquén Capital.
      </p>

      <p style="margin-top:20px;">
        Se firman __________ ( ) ejemplares (uno para el <span class="bold">“EMISOR”</span> y uno por cada responsable <span class="bold">“TITULAR” y “GARANTE”</span>) de un mismo tenor y a un solo efecto.
      </p>

      <!-- Firmas titulares/adicionales -->
      <div class="signature-grid">
        <div class="signature-block">
          <div class="dashed-line"></div>Firma Titular<br><div class="dashed-line"></div>Aclaración
        </div>
        <div class="signature-block">
          <div class="dashed-line"></div>Firma Cónyuge<br><div class="dashed-line"></div>Aclaración
        </div>
        <div class="signature-block">
          <div class="dashed-line"></div>Firma Adicional 1<br><div class="dashed-line"></div>Aclaración
        </div>
        <div class="signature-block">
          <div class="dashed-line"></div>Firma Adicional 2<br><div class="dashed-line"></div>Aclaración
        </div>
        <div class="signature-block">
          <div class="dashed-line"></div>Firma Adicional 3<br><div class="dashed-line"></div>Aclaración
        </div>
        <div class="signature-block">
          <div class="dashed-line"></div>p/Cooperativa Guía Ltda.<br><div class="dashed-line"></div>Aclaración
        </div>
      </div>

      <!-- Clausula de garantía -->
      <div class="section-title" style="margin-top:30px;">CLAUSULA DE GARANTÍA</div>
      <p>
        Por la presente me/nos <u>constituyo/ímos</u> en codeudor/es liso/s llano/s y principal/es pagador/es de todas las obligaciones asumidas por el <span class="bold">TITULAR</span> y <span class="bold">ADICIONALES</span>, mediante la <u>utilización</u> de la/s tarjeta/s, firmando la presente de conformidad en prueba de ello y aceptación de todas las condiciones <u>presentes</u>, subsistiendo esta garantía hasta la cancelación total de tales obligaciones. En consecuencia y al efecto de que sean válidas todas las notificaciones que se me/nos dirija/n, fijo/amos domicilio en __________________________ de __________________________ Código Postal ______ Provincia de ___________.
      </p>

      <!-- Firmas garantes -->
      <div class="signature-grid-2">
        <div class="signature-block">
          <div class="dashed-line"></div>Firma Garante<br><div class="dashed-line"></div>Aclaración
        </div>
        <div class="signature-block">
          <div class="dashed-line"></div>Firma Garante<br><div class="dashed-line"></div>Aclaración
        </div>
      </div>
    </div>

    <div class="page-number">6 de 8</div>
  </div>
</body>
</html>`,
  pagina7: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Página 7 de 8</title>
  <style>
        body {
            margin: 0;
            padding: 20px;
            background-color: white;
            width: 210mm;       /* Ancho real de A4 */
            height: 297mm;      /* Alto real de A4 */
            box-sizing: border-box;
            font-size: 8.5pt;   /* Un punto más pequeño */
            line-height: 1.05;  /* Reduce interlineado */
        }

        .flex-cell,
        .gray-header,
        .white-header,
        .red-header,
        .section-title {
            padding-top: 3px !important;
            padding-bottom: 3px !important;
        }

    .page-number {
      text-align: right;
      font-size: 11px;
      color: rgb(93, 123, 192);
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    th, td {
      border: 1px solid #ccc;
      padding: 5px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }

    .tarifas th {
      background-color: #0067b1;
      color: white;
    }

    .negrita {
      font-weight: bold;
    }

    .firma-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
      margin-top: 20px;
    }

    .firma-block {
      text-align: center;
      margin-top: 40px;
    }

    .linea-firma {
      border-top: 1px dashed rgb(93, 123, 192);
      width: 80%;
      margin: 10px auto;
      margin-top: 40px;
      margin-bottom: 40px;
    }

    .footer-verificacion {
      margin-top: 40px;
      border-top: 4px solid #0067b1;
      padding-top: 10px;
      font-weight: bold;
      background-color: #d9eaf7;
      padding: 8px;
      color: #000;
    }

    .footer-verificacion-table {
      width: 100%;
      border: none;
      margin-top: 10px;
    }

    .footer-verificacion-table td {
      border: none;
      padding: 10px;
      border-bottom: 2px solid black;
    }

    .nota {
      font-size: 10px;
      margin-top: 10px;
      font-size: 6pt;
    }

    u {
      color: red;
    }

    .flex-table {
            width: 100%;
            display: flex;
            flex-direction: column;
            margin-top: 5px;
        }
        
        .flex-row {
            display: flex;
            width: 100%;
        }
        
        .flex-cell {
            padding: 8px;
            box-sizing: border-box;
            flex: 1 1 0;
            margin: 1px;
        }
        
        .flex-table .flex-row:first-child .flex-cell {
            border-top: none;
        }
        
        .flex-table .flex-row .flex-cell:first-child {
            border-left: none;
        }

        .white-header{
            background-color: white;
            color: white;
            font-weight: bold;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            padding: 6px;
        }

        .gray-header-small{
            background-color: #d3d3d3;
            font-weight: lighter;
            text-align: left;
            text-align: start;
            font-size: 7.5pt;
        }

        .white-header-small{
            background-color: #FBFAF8;
            font-weight: lighter;
            text-align: left;
            text-align: start;
            font-size: 7.5pt;
        }
        
        .blue-header {
            background-color: #0080c7;
            color: white;
            font-weight: bold;
            font-size: 11px;
            padding: 6px;
        }

        .blue-header-white {
            background-color: #FBFAF8;
            color: #0080c7;
            font-weight: bold;
            font-size: 11px;
            padding: 6px;
            text-align: center;
        }
        .section-title {
            background-color: #0080c7;
            color: white;
            padding: 6px;
            font-weight: bold;
            font-size: 11px;
            margin-top: 10px;
        }
        .white-header{
            background-color: white;
            color: white;
            font-weight: bold;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            padding: 6px;
        }
        .white-header-large{
            background-color: white;
            color: black;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            padding: 6px;
        }
        .gray-header {
            background-color: #d3d3d3;
            font-weight: lighter;
            font-size: 7.5pt;
        }
        .fuente-dato {
            font-family: monospace;
            font-size: 8.5pt; 
        }
  </style>
</head>
<body>

  <div class="page-number">7 de 8</div>
  <div class="flex-cell gray-header" style="flex-grow: 12; text-align: center; font-size: 12pt;">CONTRATO DE TARJETA DE CREDITO CREDI GUIA</div>
        <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell white-header-small" style="flex-grow: 6;">FECHA: <span class="fuente-dato">{{FECHA}}</span></div>
                <div class="flex-cell white-header-small" style="flex-grow: 6;">PRODUCTO: <span class="fuente-dato">PRIMERA VENTA</span></div>
            </div>
            <div class="flex-row">
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">SUCURSAL:</div>
            </div>
        </div>
      </div>
      <div class="section-title">REFERENCIAS PERSONALES</div>
  
      <div class="flex-table data-table">
        <div class="flex-row">
                <div class="flex-cell white-header" style="flex-grow: 6;">   TEXTO QUE NO SE VE </div>
            </div>
            <div class="flex-row">
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">TIPO DOC: DNI</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">NUMERO: <span class="fuente-dato">{{DNI}}</span></div>
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">Nº DE CUIT O CUIL: <span class="fuente-dato">{{CUIL_CUIT}}</span></div>
            </div>
            <div class="flex-row">
                <div class="flex-cell white-header-small" style="flex-grow: 6;">CALLE / Nº: <span class="fuente-dato">{{TITULAR_DOMICILIO}}</span></div>
            </div>
        </div>
      </div>

<div class="section-title">NOMINA DE TASA DE INTERÉS (Punto N°6) COMISIONES Y OTROS CARGOS(PUNTO N°2-05)</div>

      <div class="flex-table data-table">
            <div class="flex-row">
                <div class="flex-cell blue-header-white" style="flex-grow: 6;">CONCEPTO</div>
                <div class="flex-cell blue-header-white" style="flex-grow: 6;">NACIONAL / GOLD BALCK</div>
                <div class="flex-cell blue-header-white" style="flex-grow: 6;">SOCIO (PLATINIUM)</div>
            </div>
            <div style="height:1px; background:#0080c7; margin:5px 0;"></div>
            <div class="flex-row">
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">TASA EFECTIVA ANUAL INTERESES / C.F.T. FINANCIACIÓN*	</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">{{TEA_FINANCIACION}}%</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">{{PLATINIUM_TEA}}%</div>
            </div>
            <div class="flex-row">
                <div class="flex-cell white-header-small" style="flex-grow: 6;">TASA NOMINAL ANUAL INTERESES COMPENSATORIOS / FINANCIACIÓN</div>
                <div class="flex-cell white-header-small" style="flex-grow: 6;">{{TNA_COMPENSATORIOS}}%</div>
                <div class="flex-cell white-header-small" style="flex-grow: 6;">{{PLATINIUM_TNA_COMPENSATORIOS}}%</div>
            </div>
            <div class="flex-row">
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">TASA NOMINAL ANUAL INTERESES PUNITORIOS</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">{{TNA_PUNITORIOS}}%</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">{{PLATINIUM_TNA_PUNITORIOS}}%</div>
            </div>
            <div class="flex-row">
                <div class="flex-cell white-header-small" style="flex-grow: 6;">C.F.T. FINANCIACIÓN</div>
                <div class="flex-cell white-header-small" style="flex-grow: 6;">{{TEA_FINANCIACION}}%</div>
                <div class="flex-cell white-header-small" style="flex-grow: 6;">{{PLATINIUM_TEA}}%</div>
            </div>
            <div class="flex-row">
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">COMISIÓN POR RENOVACIÓN ANUAL **</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">$ {{COMISION_RENOVACION}}</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">$ {{PLATINIUM_COMISION_RENOVACION}}</div>
            </div>
            <div class="flex-row">
                <div class="flex-cell white-header-small" style="flex-grow: 6;">COMISIÓN POR MANTENIMIENTO DE CUENTA</div>
                <div class="flex-cell white-header-small" style="flex-grow: 6;">$ {{COMISION_MANTENIMIENTO}}</div>
                <div class="flex-cell white-header-small" style="flex-grow: 6;">$ {{PLATINIUM_COMISION_MANTENIMIENTO}}</div>
            </div>
            <div class="flex-row">
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">COMISIÓN REPOSICIÓN PLÁSTICO</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">$ {{COMISION_REPOSICION}}</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">$ {{PLATINIUM_COMISION_REPOSICION}}</div>
            </div>
            <div class="flex-row">
                <div class="flex-cell blue-header-white" style="flex-grow: 6;">CARGOS POR GESTION DE COBRANZA</div>
            </div>
            <div style="height:1px; background:#0080c7; margin:5px 0;"></div>
            <div class="flex-row">
                <div class="flex-cell white-header-small" style="flex-grow: 6;">DE 05 A 31 DIAS DE ATRASO DESDE EL VENCIMIENTO</div>
                <div class="flex-cell white-header-small" style="flex-grow: 6;">$ {{ATRASO_05_31}}</div>
                <div class="flex-cell white-header-small" style="flex-grow: 6;">$ {{PLATINIUM_ATRASO_05_31}}</div>
            </div>
            <div class="flex-row">
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">DE 32 A 60 DIAS DE ATRASO DESDE EL VENCIMIENTO</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">$ {{ATRASO_32_60}}</div>
                <div class="flex-cell gray-header-small" style="flex-grow: 6;">$ {{PLATINIUM_ATRASO_32_60}}</div>
            </div>
            <div class="flex-row">
                <div class="flex-cell white-header-small" style="flex-grow: 6;">DE 61 A 90 DIAS DE ATRASO DESDE EL VENCIMIENTO</div>
                <div class="flex-cell white-header-small" style="flex-grow: 6;">$ {{ATRASO_61_90}}</div>
                <div class="flex-cell white-header-small" style="flex-grow: 6;">$ {{PLATINIUM_ATRASO_61_90}}</div>
            </div>
            <div class="flex-row">
                <div class="flex-cell blue-header-white" style="flex-grow: 6;">CARGOS POR COBRANZA MEDIOS ELECTRONICOS</div>
            </div>
            <div style="height:1px; background:#0080c7; margin:5px 0;"></div>
            <div class="flex-row">
                <div class="flex-cell white-header-small" style="flex-grow: 6;">PAGO FACIL - RAPIPAGO.</div>
                <div class="flex-cell white-header-small" style="flex-grow: 6;">$ {{PAGO_FACIL}}</div>
                <div class="flex-cell white-header-small" style="flex-grow: 6;">$ {{PLATINIUM_PAGO_FACIL}}</div>
            </div>
        </div>
      </div>

  <div class="nota">
    * Costo financiero total (C.F.T.), incluye intereses. <br>
    ** Valor vigente a la firma de contrato. Si por evolución de los costos o valores de mercado la comisión fuera reajustada, regirá el nuevo valor previa comunicación al usuario conforme la normativa en vigencia. <br>
    Solamente los comisiones y cargos informados incluyen IVA. Las modificaciones serán informadas al usuario en las formas y plazos que determine la legislación vigente. <br>
    <strong>C.F.T.</strong>: COSTO FINANCIERO TOTAL <br>
    <strong>T.E.A.</strong>: TASA EFECTIVA ANUAL <br>
    <strong>T.N.A.</strong>: TASA NOMINAL ANUAL <br>
    <strong>T.E.M.</strong>: TASA EFECTIVA MENSUAL
  </div>

  <div class="firma-grid">
    <div class="firma-block">
      <div class="linea-firma"></div>
      Firma Titular
      <div class="linea-firma"></div>
      Aclaración
    </div>
    <div class="firma-block">
      <div class="linea-firma"></div>
      Firma Garante
      <div class="linea-firma"></div>
      <span style="color: red;">Aclaración</span>
    </div>
  </div>

  <div class="section-title">
    PARA USO EXCLUSIVO DE COOPERATIVA GUÍA LTDA.
  </div>

  <div class="flex-table data-table">
        <div class="flex-row">
                <div class="flex-cell white-header" style="flex-grow: 6;">   TEXTO QUE NO SE VE </div>
            </div>
            <div class="flex-row">
                <div class="flex-cell white-header-large" style="flex-grow: 6;">VERIFICÓ FIRMAS</div>
            </div>
            <div class="flex-row">
                <div class="flex-cell gray-header" style="flex-grow: 6;">FIRMA</div>
                <div class="flex-cell gray-header" style="flex-grow: 6;">ACLARACIÓN</div>
            </div>
        </div>
      </div>

  <div class="page-number" style="bottom: 0; top: auto;">7 de 8</div>

</body>
</html>`,
  pagina8: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Página 8 de 8</title>
  <style>
    body{
      margin:0;
      padding:20px;
      font-family:Arial,sans-serif;
      font-size:8.5pt;
      line-height:1.05;
      width:210mm;
      height:297mm;
      background:#fff;
      color:#000;
    }
    .container{ width:100%; }

    /* títulos */
    .section-title{
      font-weight:bold;
      color:#0066cc;
      font-size:9pt;
      margin:15px 0 5px 0;
    }
    .blue-header{
      background:#0066cc;
      color:#fff;
      padding:4px 8px;
      font-weight:bold;
      font-size:9pt;
      margin:10px 0 5px 0;
    }

    /* párrafos */
    .content{ padding:0 15px; text-align:justify; }
    p{ margin:0 0 10px 0; line-height:25px; font-size: 9pt; font-family: 'Times New Roman', Times, serif;}
    .bold{ font-weight:bold; }
    .underline{ text-decoration:underline; }

    /* líneas de firma */
    .signature-grid{
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:40px;
      margin:30px 0;
      text-align:center;
      font-size:9px;
      color:#0066cc;
    }
    .signature-line{
      border-bottom:1px dashed #0066cc;
      height:20px;
      margin-bottom:20px;
    }

    /* footer */
    .footer{
      display:flex;
      justify-content:space-between;
      margin-top:30px;
      font-size:9px;
      color:#0066cc;
    }
    .footer-col{
      flex:1;
      margin:0 10px;
      text-align:center;
    }

    /* observaciones */
    .observaciones{
      border:1px solid #000;
      height:60px;
      padding:5px;
    }
    .flex-table {
            width: 100%;
            display: flex;
            flex-direction: column;
            margin-top: 5px;
        }
        
        .flex-row {
            display: flex;
            width: 100%;
        }
        
        .flex-cell {
            padding: 8px;
            box-sizing: border-box;
            flex: 1 1 0;
            margin: 1px;
        }
        
        .flex-table .flex-row:first-child .flex-cell {
            border-top: none;
        }
        
        .flex-table .flex-row .flex-cell:first-child {
            border-left: none;
        }

        .white-header{
            background-color: white;
            color: white;
            font-weight: bold;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            padding: 6px;
        }

        .gray-header-small{
            background-color: #d3d3d3;
            font-weight: lighter;
            text-align: left;
            text-align: start;
            font-size: 7.5pt;
        }

        .white-header-small{
            background-color: #FBFAF8;
            font-weight: lighter;
            text-align: left;
            text-align: start;
            font-size: 7.5pt;
        }
        
        .blue-header {
            height: 80px;
            background-color: #0080c7;
            color: white;
            font-weight: bold;
            font-size: 11px;
            padding: 6px;
            margin-bottom: 10px;
        }

        .blue-header-white {
            background-color: #FBFAF8;
            color: #0080c7;
            font-weight: bold;
            font-size: 11px;
            padding: 6px;
            text-align: center;
        }
            .fuente-dato {
            font-family: monospace;
            font-size: 7.5pt; 
        }
  </style>
</head>
<body>
  <div class="container">
    <div class="page-number">8 de 8</div>
<div class="flex-table data-table">
  <div class="flex-row">
    <!-- Columna 1 centrada verticalmente -->
    <div class="flex-cell blue-header"
         style="flex-grow:1; display:flex; align-items:center; justify-content:flex-end; padding-right:6px; 
                font-size:15pt; font-weight:bold; font-family: 'Times New Roman', Times, serif;">
      Credi Guía
    </div>

    <!-- Columna 2 apilada -->
    <div class="flex-cell blue-header"
         style="flex-grow:2; display:flex; flex-direction:column; justify-content:center;">
         <div style="margin-top:2px;font-size:12pt;">CONTRATO DE TARJETA DE CRÉDITO CREDI GUÍA</div>
      <div style="margin-top:2px; font-size:7.5pt;">ANEXO I – DECLARACIÓN JURADA SOBRE LA CONDICIÓN DE PERSONA EXPUESTA POLÍTICAMENTE</div>
      
    </div>
  </div>
</div>

    <div class="content">
      <p><span class="bold">“Declaración Jurada sobre la condición de Persona Expuesta Políticamente”</span></p>

      <p>
        El/la (1) que suscribe, __{{TITULAR_NOMBRE}}__(2) declara bajo juramento que los datos consignados en la presente son correctos, completos y expresión de la verdad y que <u>SI/NO</u> (1) se encuentra incluido y/o alcanzado dentro de la “Nómina de Personas Expuestas Políticamente” aprobada por la Unidad de Información Financiera, que ha leído.
      </p>

      <p>
        En caso <u>afirmativo</u>, indicar detalladamente el motivo: _____________________________________________<br>
        Además, asume el compromiso de informar cualquier <u>modificación</u> que se produzca a este respecto, dentro de los treinta (30) días de ocurrida, mediante la presentación de una nueva declaración jurada.
      </p>

      <p>
        Documento: Tipo (3) __DNI__ N° _______{{DNI}}_________<br>
        País y Autoridad de Emisión: _____________________________________________<br>
        Carácter invocado (4): _____________________<br>
        CUIT/CUIL/CDI (1) N°: ______{{CUIL_CUIT}}_____<br>
        Lugar y fecha: ____Neuquén,__________{{FECHA}}___________ Firma: ___________________________
      </p>

      <p>
        <u>Certifico/Certificamos</u> que la <u>firma</u> que antecede concuerda con la registrada en nuestros libros / fue puesta en mi/nuestra presencia (1).<br>
        Firma y sello del Sujeto Obligado o de los funcionarios del Sujeto Obligado autorizados.
      </p>

      <p class="bold">Observaciones:</p>
      <div class="observaciones"></div>

      <div style="font-size:9pt;margin-top:10px;line-height:25px;">
        (1) Tachar lo que no corresponda.<br>
        (2) Integrar con el nombre y apellido del cliente, aun cuando en su representación <u>firme</u> un apoderado.<br>
        (3) Indicar DNI, LE o LC para argentinos nativos. Para extranjeros: DNI extranjeros, Carné internacional, Pasaporte, <u>Certificado</u> provisorio, Documento de identidad del respectivo país, según corresponda.<br>
        (4) Indicar titular, representante legal, apoderado. Cuando se trate de apoderado, el poder otorgado debe ser amplio y general y estar vigente a la fecha en que se suscriba la presente declaración.<br><br>
        Nota: Esta declaración deberá ser integrada por duplicado, el que intervenido por el sujeto obligado servirá como constancia de recepción de la presente declaración para el cliente. Esta declaración podrá ser integrada en los legajos o cualquier otro formulario que utilicen habitualmente los Sujetos Obligados para vincularse con sus clientes.
      </div>
    </div>

    <!-- Firmas -->
    <div class="signature-grid">
      <div>
        <div class="signature-line"></div>
        Firma Titular
        <div class="signature-line"></div>
        Aclaración
      </div>
      <div>
        <div class="signature-line"></div>
        Firma Garante
        <div class="signature-line"></div>
        Aclaración
      </div>
    </div>

    
  </div>
</body>
</html>`,
  pagina9: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Página 9 de 8</title>
  <style>

    body {
      margin: 0;
      padding: 20px;
      font-family: "Times New Roman", Times, serif;
      font-size: 8.5pt;
      line-height: 1.05;
      width: 210mm;
      height: 297mm;
      background: #fff;
      color: #000;
      box-sizing: border-box;
    }

    /* --- UTILITIES --- */
    .page-number {
      text-align: right;
      font-size: 11px;
      color: #0066cc;           /* same blue as previous pages */
      margin-bottom: 20px;
    }

    .section-title {
      background-color: #0080c7;
      color: #fff;
      font-weight: bold;
      font-size: 11px;
      padding: 6px;
      margin-top: 10px;
    }

    /* --- FLEX-TABLE SYSTEM (copied from pages 7/8) --- */
    .flex-table {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 5px;
    }
    .flex-row {
      display: flex;
      width: 100%;
    }
    .flex-cell {
      padding: 8px;
      box-sizing: border-box;
      flex: 1 1 0;
      margin: 1px;
    }
    .gray-header-small {
      background-color: #d3d3d3;
      font-weight: lighter;
      font-size: 7.5pt;
    }
    .white-header-small {
      background-color: #fbfaf8;
      font-weight: lighter;
      font-size: 7.5pt;
    }
    .blue-header-white {
      background-color: #fbfaf8;
      color: #0080c7;
      font-weight: bold;
      font-size: 11px;
      padding: 6px;
      text-align: center;
    }

    /* --- LINES & SIGNATURES --- */
    .signature-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
      margin-top: 30px;
      text-align: center;
      font-size: 9px;
      color: #0066cc;
    }
    .signature-line {
      border-bottom: 1px dashed #0066cc;
      height: 20px;
      margin-bottom: 20px;
    }
  </style>
</head>

<body>
  <div class="page-number">9 de 8</div>

  <!-- Grey header -->
  <div class="gray-header-small" style="text-align:center; font-size:12pt;">
    CONTRATO DE TARJETA DE CRÉDITO CREDI GUÍA
  </div>

  <div class="section-title">
    RESUMEN – CONDICIONES GENERALES
  </div>

  <!-- Content -->
  <div class="white-header-small" style="text-align:justify; padding:0 7.5pt; line-height: 15px;">
    <p>
      UD. PODRÁ EFECTUAR OPERACIONES DE COMPRAS, LOCACIÓN DE BIENES, SERVICIOS U OBRAS EN FORMA PRESENCIAL Y ONLINE EN NUESTROS COMERCIOS ADHERIDOS.
    </p>
    <p>
      LOS PLANES DE CUOTAS QUE AL VENCIMIENTO INCLUYEN INTERESES DE FINANCIACIÓN DEVENGAN A LAS SIGUIENTES TASAS: TEA: {{TEA_FINANCIACION}}% - TNA: {{TNA_COMPENSATORIOS}}% - TEM: 5,16% - CFT: {{TEA_FINANCIACION}}%.
    </p>
    <p>
      DESDE EL VENCIMIENTO DEL RESUMEN Y HASTA SU EFECTIVO PAGO SE DEVENGARÁN LOS SIGUIENTES INTERESES: INTERESES PUNITORIOS: TNA: {{TNA_PUNITORIOS}}% - TEM: 2,58%.
    </p>
    <p>
      LOS PLANES DE PAGO SE EFECTUARÁN CON LA SIGUIENTE TASA DE INTERÉS POR REFINANCIACIÓN: TEA: 70,24% - TNA: 54,50%.
    </p>
    <p>C.F.T. NACIONAL: {{TEA_FINANCIACION}}%</p>
    <p>El monto de IVA discriminado no puede computarse como crédito fiscal.</p>
    <p>
      Comisión por mantenimiento de cuenta $ {{COMISION_MANTENIMIENTO}} (mensual).<br>
      Comisión reposición plástico $ {{COMISION_REPOSICION}}.<br>
      Comisión por renovación anual $ {{COMISION_RENOVACION}} (anual: pagaderos en tres cuotas).
    </p>
    <p>
      <strong>Cargos por gestión de morosidad</strong><br>
      De 10 a 31 días de atraso desde el vencimiento: $ {{ATRASO_05_31}}<br>
      De 32 a 60 días de atraso desde el vencimiento: $ {{ATRASO_32_60}}<br>
      De 61 a 90 días de atraso desde el vencimiento: $ {{ATRASO_61_90}}<br>
      Cargo por cobranza en medios tercerizados: $ {{PAGO_FACIL}}
    </p>
    <p>
      Las modificaciones en las comisiones y cargos serán informadas con 60 días de anticipación y al correo electrónico que UD. haya informado. Solamente las comisiones y cargos informados incluyen IVA.
    </p>
    <p>
      UD. PODRÁ CONSULTAR POR TASAS DE INTERÉS VIGENTES EN NUESTRA PÁGINA WEB <a href="http://www.crediguia.com.ar" style="color:#0066cc;">www.crediguia.com.ar</a>.<br>
      El resumen de cuenta se genera mensualmente y se enviará al domicilio (físico o electrónico) del titular que fue constituido en el contrato de tarjeta de crédito o el indicado con posterioridad de forma fehaciente al emisor. El envío del resumen de cuenta se realiza con una antelación de 5 (cinco) días a la fecha de su vencimiento.<br>
      El plazo para hacer efectivo el pago del importe que resultare del resumen de cuenta, vencerá entre el día 09 y 13 de cada mes. La fecha será indicada en su resumen de cuenta.
    </p>
    <p>
      Ud. dispondrá de un plazo de 30 días corridos desde la fecha de recepción del resumen para realizar por escrito (correo electrónico o carta) a la emisor la objeción o impugnación del resumen de cuenta o de consumos específicos.<br>
      La impugnación no exime de abonar en término las operaciones de crédito no impugnadas sean estas anteriores al resumen de cuenta en cuestión.<br>
      El límite total de compras se compone por el límite para planes cortos de 1 a 4 cuotas, que surge de aplicar un porcentaje definido por la emisora sobre los ingresos netos demostrados. Y el límite para planes largos de 6 a 14 cuotas, que surge de aplicar el coeficiente de 1,3 sobre el límite de planes cortos. La suma de ambos conforma el límite total de compras.
    </p>
    <p>
      El pago mínimo es igual al monto total a pagar del último resumen de cuenta enviado.<br>
      La falta de pago a partir de la fecha de vencimiento del resumen hará incurrir en mora al usuario y/o codeudores si los hubiera, sin necesidad de interpelación previa judicial o extrajudicial alguna, generándose a partir de esa fecha el devengamiento de los respectivos intereses compensatorios, punitorios y gastos de mora previamente informados hasta la cancelación de lo adeudado o la realización de un acuerdo de pago.<br>
      La tarjeta se inhabilita por mora en el pago a los 6 (seis) días de la fecha de vencimiento para las tarjetas normales y el día 23 para las tarjetas jubilados.
    </p>
    <p>
      Ud. podrá solicitar la rescisión del contrato de tarjeta y solicitar la baja de la cuenta por medio de solicitud web, correo electrónico, llamada telefónica y en forma presencial en cualquiera de nuestras sucursales.<br>
      Ud. podrá utilizar los siguientes canales para realizar reclamos: <a href="http://www.crediguia.com.ar" style="color:#0066cc;">www.crediguia.com.ar</a>, nuestras redes sociales y el libro de quejas que se encuentra disponible en cualquiera de nuestras sucursales.
    </p>
    <p>
      <strong>USTED PODRÁ CONSULTAR EL “RÉGIMEN DE TRANSPARENCIA” ELABORADO POR EL BANCO CENTRAL SOBRE LA BASE DE LA INFORMACIÓN PROPORCIONADA POR LOS SUJETOS OBLIGADOS A FIN DE COMPARAR LOS COSTOS Y CARACTERÍSTICAS DE LOS PRODUCTOS Y SERVICIOS FINANCIEROS INGRESANDO A:</strong>
      <a href="http://www.bcra.gob.ar/Bcrayvos/Regimen_de_transparencia.asp" style="color:#0066cc;">http://www.bcra.gob.ar/Bcrayvos/Regimen_de_transparencia.asp</a>
    </p>
    <p>
      En cumplimiento a la COMUNICACIÓN “B” 12135 BCRA, se firmarán dos ejemplares uno para el EMISOR y otro para el TITULAR.
    </p>
  </div>

  <p style="margin-top:30px;"><strong>Fecha ____/____/______</strong></p>

  <!-- Firmas -->
  <div class="signature-grid">
    <div>
      <div class="signature-line"></div>
      FIRMA TITULAR
      
    </div>
    <div>
      <div class="signature-line"></div>
      ACLARACIÓN
      
    </div>
  </div>

  <div style="text-align:center; margin-top:40px; font-size:9px;">
    Cooperativa Guía Ltda.
  </div>

  <div class="page-number" style="position:absolute; bottom:20px; right:20px; top:auto;">9 de 8</div>
</body>
</html>`,
  pagina10: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Página 10 de 8</title>
  <style>

    body {
      margin: 0;
      padding: 20px;
      font-family: "Times New Roman", Times, serif;
      font-size: 8.5pt;
      line-height: 1.05;
      width: 210mm;
      height: 297mm;
      background: #fff;
      color: #000;
      box-sizing: border-box;
    }

    /* --- UTILITIES --- */
    .page-number {
      text-align: right;
      font-size: 11px;
      color: #0066cc;
      margin-bottom: 20px;
    }

    .section-title {
      background-color: #0080c7;
      color: #fff;
      font-weight: bold;
      font-size: 11px;
      padding: 6px;
      margin-top: 10px;
    }

    /* --- FLEX-TABLE SYSTEM (copied from pages 7/8) --- */
    .flex-table {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 5px;
    }
    .flex-row {
      display: flex;
      width: 100%;
    }
    .flex-cell {
      padding: 8px;
      box-sizing: border-box;
      flex: 1 1 0;
      margin: 1px;
    }
    .gray-header-small {
      background-color: #d3d3d3;
      font-weight: lighter;
      font-size: 7.5pt;
    }
    .white-header-small {
      background-color: #fbfaf8;
      font-weight: lighter;
      font-size: 7.5pt;
    }

    /* --- SIGNATURE LINES --- */
    .signature-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
      margin-top: 30px;
      text-align: center;
      font-size: 9px;
      color: #0066cc;
    }
    .signature-line {
      border-bottom: 1px dashed #0066cc;
      height: 20px;
      margin-bottom: 20px;
    }
  </style>
</head>

<body>
  <div class="page-number">10 de 8</div>

  <p style="font-size:10px;">copia para el Cliente.</p>

  <!-- Grey header -->
  <div class="gray-header-small" style="text-align:center; font-size:12pt;">
    CONTRATO DE TARJETA DE CRÉDITO CREDI GUÍA
  </div>

  <div class="section-title">
    RESUMEN – CONDICIONES GENERALES
  </div>

  <!-- Content -->
  <div class="white-header-small" style="text-align:justify; padding:0 15px; line-height: 15px;">
    <p>
      UD. PODRÁ EFECTUAR OPERACIONES DE COMPRAS, LOCACIÓN DE BIENES, SERVICIOS U OBRAS EN FORMA PRESENCIAL Y ONLINE EN NUESTROS COMERCIOS ADHERIDOS.
    </p>
    <p>
      LOS PLANES DE CUOTAS QUE AL VENCIMIENTO INCLUYEN INTERESES DE FINANCIACIÓN DEVENGAN A LAS SIGUIENTES TASAS: TEA: {{TEA_FINANCIACION}}% - TNA: {{TNA_COMPENSATORIOS}}% - TEM: 5,16% - CFT: {{TEA_FINANCIACION}}%.
    </p>
    <p>
      DESDE EL VENCIMIENTO DEL RESUMEN Y HASTA SU EFECTIVO PAGO SE DEVENGARÁN LOS SIGUIENTES INTERESES: INTERESES PUNITORIOS: TNA: {{TNA_PUNITORIOS}}% - TEM: 2,58%.
    </p>
    <p>
      LOS PLANES DE PAGO SE EFECTUARÁN CON LA SIGUIENTE TASA DE INTERÉS POR REFINANCIACIÓN: TEA: 70,24% - TNA: 54,50%.
    </p>
    <p>C.F.T. NACIONAL: {{TEA_FINANCIACION}}%</p>
    <p>El monto de IVA discriminado no puede computarse como crédito fiscal.</p>
    <p>
      Comisión por mantenimiento de cuenta $ {{COMISION_MANTENIMIENTO}} (mensual).<br>
      Comisión reposición plástico $ {{COMISION_REPOSICION}}.<br>
      Comisión por renovación anual $ {{COMISION_RENOVACION}} (anual: pagaderos en tres cuotas).
    </p>
    <p>
      <strong>Cargos por gestión de morosidad</strong><br>
      De 10 a 31 días de atraso desde el vencimiento: $ {{ATRASO_05_31}}<br>
      De 32 a 60 días de atraso desde el vencimiento: $ {{ATRASO_32_60}}<br>
      De 61 a 90 días de atraso desde el vencimiento: $ {{ATRASO_61_90}}<br>
      Cargo por cobranza en medios tercerizados: $ {{PAGO_FACIL}}
    </p>
    <p>
      Las modificaciones en las comisiones y cargos serán informadas con 60 días de anticipación y al correo electrónico que UD. haya informado. Solamente las comisiones y cargos informados incluyen IVA.
    </p>
    <p>
      UD. PODRÁ CONSULTAR POR TASAS DE INTERÉS VIGENTES EN NUESTRA PÁGINA WEB
      <a href="http://www.crediguia.com.ar" style="color:#0066cc;">www.crediguia.com.ar</a>.<br>
      El resumen de cuenta se genera mensualmente y se enviará al domicilio (físico o electrónico) del titular que fue constituido en el contrato de tarjeta de crédito o el indicado con posterioridad de forma fehaciente al emisor. El envío del resumen de cuenta se realiza con una antelación de 5 (cinco) días a la fecha de su vencimiento.<br>
      El plazo para hacer efectivo el pago del importe que resultare del resumen de cuenta, vencerá entre el día 09 y 13 de cada mes. La fecha será indicada en su resumen de cuenta.
    </p>
    <p>
      Ud. dispondrá de un plazo de 30 días corridos desde la fecha de recepción del resumen para realizar por escrito (correo electrónico o carta) a la emisora la objeción o impugnación del resumen de cuenta o de consumos específicos.<br>
      La impugnación no exime de abonar en término las operaciones de crédito no impugnadas sean estas anteriores al resumen de cuenta en cuestión.<br>
      El límite total de compras se compone por el límite para planes cortos de 1 a 4 cuotas, que surge de aplicar un porcentaje definido por la emisora sobre los ingresos netos demostrados. Y el límite para planes largos de 6 a 14 cuotas, que surge de aplicar el coeficiente de 1,3 sobre el límite de planes cortos. La suma de ambos conforma el límite total de compras.
    </p>
    <p>
      El pago mínimo es igual al monto total a pagar del último resumen de cuenta enviado.<br>
      La falta de pago a partir de la fecha de vencimiento del resumen hará incurrir en mora al usuario y/o codeudores si los hubiera, sin necesidad de interpelación previa judicial o extrajudicial alguna, generándose a partir de esa fecha el devengamiento de los respectivos intereses compensatorios, punitorios y gastos de mora previamente informados hasta la cancelación de lo adeudado o la realización de un acuerdo de pago.<br>
      La tarjeta se inhabilita por mora en el pago a los 6 (seis) días de la fecha de vencimiento para las tarjetas normales y el día 23 para las tarjetas jubilados.
    </p>
    <p>
      Ud. podrá solicitar la rescisión del contrato de tarjeta y solicitar la baja de la cuenta por medio de solicitud web, correo electrónico, llamada telefónica y en forma presencial en cualquiera de nuestras sucursales.<br>
      Ud. podrá utilizar los siguientes canales para realizar reclamos:
      <a href="http://www.crediguia.com.ar" style="color:#0066cc;">www.crediguia.com.ar</a>, nuestras redes sociales y el libro de quejas que se encuentra disponible en cualquiera de nuestras sucursales.
    </p>
    <p>
      <strong>USTED PODRÁ CONSULTAR EL “RÉGIMEN DE TRANSPARENCIA” ELABORADO POR EL BANCO CENTRAL SOBRE LA BASE DE LA INFORMACIÓN PROPORCIONADA POR LOS SUJETOS OBLIGADOS A FIN DE COMPARAR LOS COSTOS Y CARACTERÍSTICAS DE LOS PRODUCTOS Y SERVICIOS FINANCIEROS INGRESANDO A:</strong>
      <a href="http://www.bcra.gob.ar/Bcrayvos/Regimen_de_transparencia.asp" style="color:#0066cc;">http://www.bcra.gob.ar/Bcrayvos/Regimen_de_transparencia.asp</a>
    </p>
    <p>
      En cumplimiento a la COMUNICACIÓN “B” 12135 BCRA, se firmarán dos ejemplares uno para el EMISOR y otro para el TITULAR.
    </p>
  </div>

  <p style="margin-top:30px;"><strong>Fecha ____/____/______</strong></p>

 <!-- Firmas -->
  <div class="signature-grid">
    <div>
      <div class="signature-line"></div>
      FIRMA TITULAR
      
    </div>
    <div>
      <div class="signature-line"></div>
      ACLARACIÓN
      
    </div>
  </div>

  <div style="text-align:center; margin-top:40px; font-size:9px;">
    Cooperativa Guía Ltda.
  </div>

</body>
</html>`,
};
