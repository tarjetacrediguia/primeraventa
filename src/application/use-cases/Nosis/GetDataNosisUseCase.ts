import { NosisResponse } from "../../../domain/entities/NosisData";
import { NosisPort } from "../../ports/NosisPort";

export class GetDataNosisUseCase {
  constructor(private readonly nosisPort: NosisPort) {}

  async execute(cuil: string): Promise<NosisResponse> {
    if (!cuil || cuil.length < 10) {
      throw new Error('CUIL inválido');
    }
    return this.nosisPort.getData(cuil);
  }
}