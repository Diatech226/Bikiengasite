import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaItemDto } from './dto/content.dto';
import { CONTENT_KEYS, ContentKey, SiteContent } from './schemas/site-content.schema';
import { MediaItem } from './schemas/media-item.schema';

function validateData(value: unknown, depth = 0): void {
  if (depth > 8) throw new BadRequestException('Structure de contenu trop profonde');
  if (typeof value === 'string' && value.length > 12000) throw new BadRequestException('Un texte dépasse 12 000 caractères');
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) return;
  if (Array.isArray(value)) { if (value.length > 100) throw new BadRequestException('Une liste dépasse 100 éléments'); value.forEach((entry) => validateData(entry, depth + 1)); return; }
  if (typeof value === 'object') { Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => { if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(key)) throw new BadRequestException(`Champ invalide : ${key}`); validateData(entry, depth + 1); }); return; }
  throw new BadRequestException('Type de contenu non autorisé');
}

@Injectable()
export class ContentService {
  constructor(@InjectModel(SiteContent.name) private readonly contents: Model<SiteContent>, @InjectModel(MediaItem.name) private readonly media: Model<MediaItem>) {}
  async publicContent(section?: string) {
    const filter = section ? { section } : {};
    const [blocks, mediaItems] = await Promise.all([this.contents.find(filter).sort({ key: 1 }).lean(), this.media.find({ ...(section ? { section } : {}), isActive: true }).sort({ section: 1, order: 1 }).lean()]);
    return { blocks, mediaItems };
  }
  adminContent() { return Promise.all([this.contents.find().sort({ key: 1 }).lean(), this.media.find().sort({ section: 1, order: 1 }).lean()]).then(([blocks, mediaItems]) => ({ blocks, mediaItems })); }
  async update(key: string, data: Record<string, unknown>, userId?: string) {
    if (!CONTENT_KEYS.includes(key as ContentKey)) throw new BadRequestException('Bloc de contenu inconnu');
    validateData(data);
    const result = await this.contents.findOneAndUpdate({ key }, { $set: { data, updatedBy: userId } }, { new: true, runValidators: true }).lean();
    if (!result) throw new NotFoundException('Bloc introuvable. Exécutez le seed initial.');
    return result;
  }
  createMedia(dto: MediaItemDto, userId?: string) { return this.media.create({ ...dto, updatedBy: userId }); }
  async updateMedia(id: string, dto: MediaItemDto, userId?: string) { const item = await this.media.findByIdAndUpdate(id, { $set: { ...dto, updatedBy: userId } }, { new: true, runValidators: true }); if (!item) throw new NotFoundException('Média introuvable'); return item; }
  async deleteMedia(id: string) { const item = await this.media.findByIdAndDelete(id); if (!item) throw new NotFoundException('Média introuvable'); }
}
