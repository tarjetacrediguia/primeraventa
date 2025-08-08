// src/domain/entities/ConjuntoTasas.ts

export class ConjuntoTasas {
    constructor(
        public readonly id: number,
        public nombre: string,
        public descripcion: string,
        public fechaCreacion: Date,
        public fechaActualizacion: Date,
        public activo: boolean,
        public tasas: Map<string, { valor: number; descripcion: string }> = new Map()
    ) {}

    public agregarTasa(
        codigo: string, 
        valor: number,
        descripcion: string = ""
    ): void {
        this.tasas.set(codigo, { valor, descripcion });
    }

    public obtenerTasa(codigo: string): number {
        const tasa = this.tasas.get(codigo);
        if (tasa === undefined) {
            throw new Error(`Tasa con código ${codigo} no encontrada`);
        }
        return tasa.valor;
    }

    public activar(): void {
        this.activo = true;
    }

    public desactivar(): void {
        this.activo = false;
    }

    public static fromMap(map: any): ConjuntoTasas {
        const conjunto = new ConjuntoTasas(
            map.id,
            map.nombre,
            map.descripcion,
            new Date(map.fechaCreacion),
            new Date(map.fechaActualizacion),
            map.activo
        );

        if (map.tasas && typeof map.tasas === 'object') {
            for (const [codigo, data] of Object.entries(map.tasas)) {
                const tasaData = data as any;
                let valor: number;
                let descripcion: string = "";

                // Manejar diferentes estructuras de datos
                if (tasaData.valor && typeof tasaData.valor === 'object') {
                    // Estructura anidada
                    valor = tasaData.valor.valor;
                    descripcion = tasaData.valor.descripcion || tasaData.descripcion || "";
                } else {
                    // Estructura plana
                    valor = typeof tasaData.valor === 'number' 
                        ? tasaData.valor 
                        : tasaData.valor?.valor || 0;
                    descripcion = tasaData.descripcion || "";
                }

                conjunto.agregarTasa(codigo, valor, descripcion);
            }
        }

        return conjunto;
    }

    public toPlainObject(): any {
        const tasasObj: Record<string, { valor: number; descripcion: string }> = {};
        this.tasas.forEach((value, key) => {
            tasasObj[key] = {
                valor: value.valor,
                descripcion: value.descripcion
            };
        });

        return {
            id: this.id,
            nombre: this.nombre,
            descripcion: this.descripcion,
            fechaCreacion: this.fechaCreacion,
            fechaActualizacion: this.fechaActualizacion,
            activo: this.activo,
            tasas: tasasObj
        };
    }
}