// src/domain/entities/ItemCompra.ts

/**
 * MÓDULO: Entidad ItemCompra
 * Representa un item individual dentro de una compra.
 */

export class ItemCompra {
    private id: number;
    private compraId: number;
    private nombre: string;
    private precio: number;
    private cantidad: number;

    /**
     * Constructor de ItemCompra
     * @param id Identificador único
     * @param compraId ID de la compra asociada
     * @param nombre Nombre del item
     * @param precio Precio unitario
     * @param cantidad Cantidad (default: 1)
     */
    constructor(
        id: number,
        compraId: number,
        nombre: string,
        precio: number,
        cantidad: number = 1
    ) {
        this.id = id;
        this.compraId = compraId;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
    }

    // Getters
    public getId(): number { 
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getCompraId(): number {
        return this.compraId;
    }

    public getNombre(): string {
        return this.nombre;
    }

    public getPrecio(): number {
        return this.precio;
    }

    public getCantidad(): number {
        return this.cantidad;
    }

    public getSubtotal(): number {
        return this.precio * this.cantidad;
    }

    // Setters
    public setNombre(nombre: string): void {
        this.nombre = nombre;
    }

    public setPrecio(precio: number): void {
        this.precio = precio;
    }

    public setCantidad(cantidad: number): void {
        this.cantidad = cantidad;
    }

    // Serialización
    public toPlainObject(): any {
        return {
            id: this.id,
            compraId: this.compraId,
            nombre: this.nombre,
            precio: this.precio,
            cantidad: this.cantidad,
            subtotal: this.getSubtotal()
        };
    }

    public static fromMap(map: any): ItemCompra {
        return new ItemCompra(
            map.id,
            map.compraId,
            map.nombre,
            map.precio,
            map.cantidad
        );
    }
}