import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users') // Categoriza las rutas de este controlador en Swagger
@ApiBearerAuth() // Indica que este controlador requiere autenticación con Bearer Token
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Aplica autenticación y roles a todas las rutas de este controlador
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('Superadmin')
  @ApiOperation({ summary: 'Crear un nuevo usuario' }) // Describe qué hace esta operación
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' }) // Respuesta esperada en caso de éxito
  @ApiResponse({ status: 400, description: 'Datos inválidos.' }) // Posibles errores
  @ApiResponse({ status: 409, description: 'El email ya está registrado.' }) // Error por conflicto
  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Roles('Superadmin', 'Admin')
  @ApiOperation({ summary: 'Obtener todos los usuarios' }) // Describe la operación
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida correctamente.' }) // Respuesta esperada
  @ApiResponse({ status: 403, description: 'Acceso denegado.' }) // Error de permisos
  @Get()
  async findAll() {
    return this.usersService.getAllUsers();
  }

  @Roles('Superadmin', 'Admin')
  @ApiOperation({ summary: 'Obtener un usuario por ID' }) // Describe la operación
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' }) // Respuesta esperada
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' }) // Error si no existe
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.getUserById(Number(id));
  }

  @Roles('Superadmin')
  @ApiOperation({ summary: 'Actualizar un usuario' }) // Describe la operación
  @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente.' }) // Respuesta esperada
  @ApiResponse({ status: 400, description: 'Datos inválidos.' }) // Posibles errores
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' }) // Error si no existe
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(Number(id), body);
  }

  @Roles('Superadmin')
  @ApiOperation({ summary: 'Eliminar un usuario' }) // Describe la operación
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' }) // Respuesta esperada
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' }) // Error si no existe
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }
}

