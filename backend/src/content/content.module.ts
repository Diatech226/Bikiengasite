import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { MediaItem, MediaItemSchema } from './schemas/media-item.schema';
import { SiteContent, SiteContentSchema } from './schemas/site-content.schema';
@Module({ imports: [MongooseModule.forFeature([{ name: SiteContent.name, schema: SiteContentSchema }, { name: MediaItem.name, schema: MediaItemSchema }])], controllers: [ContentController], providers: [ContentService] })
export class ContentModule {}
