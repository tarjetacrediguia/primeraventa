import { Router } from 'express';
import { generarReporteClientesAprobadosSinCompra } from './controllers/Reportes.controller';
import { esAdministrador, esAnalista } from './middlewares/rolesMiddleware';

const router = Router();

router.get('/clientes-aprobados-sin-compra',esAdministrador, generarReporteClientesAprobadosSinCompra);

export default router;