import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear un producto
  async createProduct(data: { nombre: string; descripcion: string; precio: number; cantidad: number }) {
    return this.prisma.product.create({
      data,
    });
  }

  // Obtener todos los productos
  async getAllProducts() {
    return this.prisma.product.findMany();
  }

  // Obtener un producto por ID
  async getProductById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  // Actualizar un producto
  async updateProduct(id: number, data: { nombre?: string; descripcion?: string; precio?: number; cantidad?: number }) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  // Eliminar un producto
  async deleteProduct(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
