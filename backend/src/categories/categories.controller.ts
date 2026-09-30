import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@ApiTags('Categories') @Controller('categories')
export class CategoriesController { constructor(private readonly service: CategoriesService) {} @Get() list() { return this.service.list(); } }

@ApiTags('Admin Categories') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private readonly service: CategoriesService) {}
  @Post() create(@Body() dto: CreateCategoryDto) { return this.service.create(dto); }
  @Patch(':id') update(@Param('id', ParseObjectIdPipe) id: string, @Body() dto: UpdateCategoryDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseObjectIdPipe) id: string) { return this.service.remove(id); }
}
