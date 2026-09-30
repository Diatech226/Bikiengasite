import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ContentService } from './content.service';
import { MediaItemDto, UpdateContentDto } from './dto/content.dto';

@Controller()
export class ContentController {
  constructor(private readonly service: ContentService) {}
  @Get('content') publicContent() { return this.service.publicContent(); }
  @Get('content/:section') publicSection(@Param('section') section: string) { return this.service.publicContent(section); }
  @UseGuards(JwtAuthGuard) @Get('admin/content') adminContent() { return this.service.adminContent(); }
  @UseGuards(JwtAuthGuard) @Patch('admin/content/:key') update(@Param('key') key: string, @Body() dto: UpdateContentDto, @CurrentUser() user: AuthUser) { return this.service.update(key, dto.data, user?.sub); }
  @UseGuards(JwtAuthGuard) @Post('admin/media-items') createMedia(@Body() dto: MediaItemDto, @CurrentUser() user: AuthUser) { return this.service.createMedia(dto, user?.sub); }
  @UseGuards(JwtAuthGuard) @Patch('admin/media-items/:id') updateMedia(@Param('id') id: string, @Body() dto: MediaItemDto, @CurrentUser() user: AuthUser) { return this.service.updateMedia(id, dto, user?.sub); }
  @UseGuards(JwtAuthGuard) @Delete('admin/media-items/:id') deleteMedia(@Param('id') id: string) { return this.service.deleteMedia(id); }
}
