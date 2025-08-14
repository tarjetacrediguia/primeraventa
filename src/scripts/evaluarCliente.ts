import { GetDataNosisUseCase } from "../application/use-cases/Nosis/GetDataNosisUseCase";
import { VerifyDataNosisUseCase } from "../application/use-cases/Nosis/VerifyDataNosisUseCase";
import { MockNosisAdapter } from "../infrastructure/adapters/nosis/mockNosisAdapter";
import { NosisAdapter } from "../infrastructure/adapters/nosis/nosisAdapter";

// Configuración
const MODO_TEST = true;
const API_KEY = '603e18d9-ac7e-404d-9677-ddaed8641ed0';

// Seleccionar adaptador
const nosisAdapter = MODO_TEST
  ? new MockNosisAdapter()
  : new NosisAdapter('https://ws01.nosis.com/rest/variables', API_KEY);

// Casos de uso
const getDataUseCase = new GetDataNosisUseCase(nosisAdapter);
const verifyUseCase = new VerifyDataNosisUseCase();

// Ejemplo de uso
async function evaluarCliente(cuil: string) {
  try {
    const nosisData = await getDataUseCase.execute(cuil);
    const resultado = await verifyUseCase.execute(nosisData);
    
    console.log('Resultado evaluación:');
    console.log(`- Estado: ${resultado.status}`);
    console.log(`- Score: ${resultado.score}`);
    console.log(`- Motivo: ${resultado.motivo}`);
    if (resultado.personalData) {
      console.log('- Datos personales:', resultado.personalData);
    }
    
    if (resultado.reglasFallidas) {
      console.log('- Reglas fallidas:', resultado.reglasFallidas);
    }
    
    return resultado;
  } catch (error) {
    console.error('Error en evaluación:', error);
    throw error;
  }
}

// Ejecutar con CUIL de prueba
evaluarCliente('27224717437');