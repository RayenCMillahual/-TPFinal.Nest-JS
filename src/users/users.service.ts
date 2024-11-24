import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear un usuario
  async createUser(data: { email: string; password: string; role: string }) {
    // Verifica si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashea la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crea el usuario
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword, // Guarda la contraseña hasheada
      },
    });
  }

  // Obtener todos los usuarios
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true, // Devuelve solo la información pública (sin contraseñas)
      },
    });
  }

  // Obtener un usuario por ID
  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true, // Devuelve solo la información pública
      },
    });
    if (!user) {
      throw new NotFoundException(`No se encontró un usuario con el ID ${id}`);
    }
    return user;
  }

  // Actualizar un usuario
  async updateUser(id: number, data: { email?: string; password?: string; role?: string }) {
    // Si se va a actualizar la contraseña, hashearla
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    // Actualiza el usuario
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true, // Devuelve solo información pública
      },
    });

    return updatedUser;
  }

  // Eliminar un usuario
  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`No se encontró un usuario con el ID ${id}`);
    }

    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true, // Muestra información pública del usuario eliminado
      },
    });
  }
}
