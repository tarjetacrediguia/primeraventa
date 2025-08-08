// src/application/ports/NosisPort.ts

import { NosisResponse } from "../../domain/entities/NosisData";


export interface NosisPort {
  getData(dni: string): Promise<NosisResponse>;
}