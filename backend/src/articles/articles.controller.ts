import { Body, Controller, Delete, Get, Headers, Ip, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CategoriesService } from '../categories/categories.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { ArticlesService } from './articles.service';
import { ArticleQueryDto, ArticleStatusDto, CreateArticleDto, FeaturedDto, UpdateArticleDto } from './dto/article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly service: ArticlesService, private readonly categories: CategoriesService) {}
  @Get() list(@Query() query: ArticleQueryDto) { return this.service.list(query); }
  @Get('featured') featured() { return this.service.featured(); }
  @Get('categories') categoriesList() { return this.categories.list(); }
  @Get(':slug') one(@Param('slug') slug: string) { return this.service.bySlug(slug); }
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post(':id/view') view(@Param('id', ParseObjectIdPipe) id: string, @Ip() ip: string, @Headers('user-agent') userAgent = '') { return this.service.view(id, `${ip}|${userAgent}`); }
}

@ApiTags('Admin Articles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/articles')
export class AdminArticlesController {
  constructor(private readonly service: ArticlesService) {}
  @Get() list(@Query() query: ArticleQueryDto) { return this.service.list(query, true); }
  @Post() create(@Body() dto: CreateArticleDto) { return this.service.create(dto); }
  @Patch(':id') update(@Param('id', ParseObjectIdPipe) id: string, @Body() dto: UpdateArticleDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseObjectIdPipe) id: string) { return this.service.remove(id); }
  @Patch(':id/status') status(@Param('id', ParseObjectIdPipe) id: string, @Body() dto: ArticleStatusDto) { return this.service.status(id, dto.status); }
  @Patch(':id/featured') featured(@Param('id', ParseObjectIdPipe) id: string, @Body() dto: FeaturedDto) { return this.service.featuredStatus(id, dto.isFeatured); }
}
