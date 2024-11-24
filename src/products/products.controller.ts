import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products') // Categoriza las rutas de este controlador bajo el tag "products" en Swagger
@ApiBearerAuth() // Indica que estas rutas requieren autenticación con Bearer Token
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard) // Aplica autenticación y roles a todas las rutas
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles('Admin', 'Superadmin')
  @ApiOperation({ summary: 'Crear un producto' }) // Describe la operación
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente.' }) // Respuesta esperada en caso de éxito
  @ApiResponse({ status: 400, description: 'Datos inválidos.' }) // Error común
  @Post()
  async create(@Body() body: CreateProductDto) {
    return this.productsService.createProduct(body);
  }

  @Roles('Admin', 'Superadmin', 'Regular')
  @ApiOperation({ summary: 'Obtener todos los productos' }) // Describe la operación
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida correctamente.' }) // Respuesta esperada
  @ApiResponse({ status: 403, description: 'Acceso denegado.' }) // Error de permisos
  @Get()
  async findAll() {
    return this.productsService.getAllProducts();
  }

  @Roles('Admin', 'Superadmin')
  @ApiOperation({ summary: 'Actualizar un producto' }) // Describe la operación
  @ApiResponse({ status: 200, description: 'Producto actualizado correctamente.' }) // Respuesta esperada
  @ApiResponse({ status: 400, description: 'Datos inválidos.' }) // Error común
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' }) // Error si no existe
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.updateProduct(Number(id), body);
  }

  @Roles('Admin', 'Superadmin')
  @ApiOperation({ summary: 'Eliminar un producto' }) // Describe la operación
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente.' }) // Respuesta esperada
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' }) // Error si no existe
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.deleteProduct(Number(id));
  }
}
