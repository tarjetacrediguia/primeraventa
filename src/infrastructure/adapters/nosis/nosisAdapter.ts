import axios from 'axios';
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

      const response = await axios.get<NosisResponse>(this.apiUrl, {
        params,
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': this.apiKey
        },
        timeout: 5000
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener datos de Nosis: ${error.message || 'Error desconocido'}`);
    }
  }
}