// src/application/use-cases/Cliente/ObtenerDatosClienteComercianteUseCase.ts
import { ClienteRepositoryPort } from '../../ports/ClienteRepositoryPort';
import { Cliente } from '../../../domain/entities/Cliente';

export class ObtenerDatosClienteComercianteUseCase {
    constructor(private readonly clienteRepository: ClienteRepositoryPort) {}

    async execute(clienteId: number, comercianteId: number): Promise<Cliente> {
        return this.clienteRepository.findByIdWithComercianteCheck(clienteId, comercianteId);
    }
}