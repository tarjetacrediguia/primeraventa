// src/infrastructure/adapters/nosis/nosisAdapter.ts
import axios from 'axios';
import { parseString } from 'xml2js';
import { NosisPort } from '../../../application/ports/NosisPort';
import { NosisResponse } from '../../../domain/entities/NosisData';

export class NosisAdapter implements NosisPort {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async getData(cuil: string): Promise<NosisResponse> {
    try {
      const params = {
        usuario: this.apiKey,
        documento: cuil,
        VR: 1,
        CDA: 10001
      };

      const response = await axios.get(this.apiUrl, {
        params,
        headers: {
          'Accept': 'application/xml',
          'X-API-KEY': this.apiKey
        },
        timeout: 5000,
        responseType: 'text'
      });

      return this.parseXml(response.data);
    } catch (error: any) {
      throw new Error(`Error al obtener datos de Nosis: ${error.message || 'Error desconocido'}`);
    }
  }

  private async parseXml(xmlData: string): Promise<NosisResponse> {
    return new Promise((resolve, reject) => {
      parseString(xmlData, { explicitArray: false, trim: true }, (err, result) => {
        if (err) {
          reject(new Error(`Error parsing XML: ${err.message}`));
          return;
        }

        const contenido = result.VariablesResponse.Contenido;
        this.normalizeVariables(contenido);
        
        resolve({ Contenido: contenido });
      });
    });
  }

  private normalizeVariables(contenido: any): void {
    if (contenido?.Datos?.Variables?.Variable) {
      if (!Array.isArray(contenido.Datos.Variables.Variable)) {
        contenido.Datos.Variables.Variable = [contenido.Datos.Variables.Variable];
      }
    } else {
      contenido.Datos.Variables = { Variable: [] };
    }
  }
}