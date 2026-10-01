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

const requiredFields: Record<ContentKey, Record<string, 'string'|'array'|'object'>> = {
  'site.brand': { name: 'string', subtitle: 'string', logoUrl: 'string', logoAlt: 'string' },
  'site.navigation': { items: 'array', searchLabel: 'string', supportLabel: 'string', profileLabel: 'string' },
  'site.footer': { description: 'string', navigationTitle: 'string', supportTitle: 'string', donationButton: 'string', copyright: 'string' },
  'site.contact': { location: 'string' }, 'site.profile': { name: 'string', title: 'string', biography: 'string', imageUrl: 'string', imageAlt: 'string', buttonLabel: 'string' },
  'site.guide': { title: 'string', introduction: 'string', buttonLabel: 'string' },
  'site.donation': { badge: 'string', title: 'string', introduction: 'string', categories: 'array', suggestedAmounts: 'array' },
  'site.search': { placeholder: 'string', suggestions: 'array', mediaTitle: 'string', articlesTitle: 'string' },
  'home.page': { title: 'string', metrics: 'array', filters: 'array' },
  'agriculture.page': { header: 'object', stats: 'array', filters: 'array' }, 'elevage.page': { header: 'object', stats: 'array' },
  'humanitaire.page': { header: 'object', stats: 'array', contactOptions: 'array' },
};
function validateForKey(key: ContentKey, data: Record<string, unknown>) {
  for (const [field, expected] of Object.entries(requiredFields[key])) {
    const value = data[field];
    const valid = expected === 'array' ? Array.isArray(value) : expected === 'object' ? !!value && typeof value === 'object' && !Array.isArray(value) : typeof value === expected;
    if (!valid) throw new BadRequestException(`Le champ ${field} de ${key} doit être de type ${expected}`);
  }
  const allowedValues: Partial<Record<ContentKey, Record<string, readonly string[]>>> = {
    'site.navigation': { items: ['accueil', 'agriculture', 'elevage', 'humanitaire'] },
    'site.donation': { categories: ['forage', 'cereales', 'orphelins', 'arbres', 'materiel'] },
    'humanitaire.page': { contactOptions: ['forage', 'scolaire', 'vivres', 'benevole'] },
  };
  for (const [field, allowed] of Object.entries(allowedValues[key] || {})) {
    const values = data[field] as Array<Record<string, unknown>>;
    const identifier = key === 'site.navigation' ? 'id' : 'value';
    if (!values.every((entry) => allowed.includes(String(entry[identifier])) && typeof entry.label === 'string')) {
      throw new BadRequestException(`Les identifiants techniques de ${key}.${field} ne peuvent pas être modifiés`);
    }
  }
  if (key === 'site.donation') {
    const amounts = data.suggestedAmounts as Array<Record<string, unknown>>;
    if (!amounts.every((amount) => typeof amount.value === 'number' && amount.value > 0 && typeof amount.label === 'string')) throw new BadRequestException('Chaque montant doit avoir une valeur positive et un libellé');
  }
}
function clean<T extends Record<string, unknown>>(document: T) { const { _id, __v, ...value } = document; return { ...value, id: String(_id) }; }

@Injectable()
export class ContentService {
  constructor(@InjectModel(SiteContent.name) private readonly contents: Model<SiteContent>, @InjectModel(MediaItem.name) private readonly media: Model<MediaItem>) {}
  async publicContent(section?: string) {
    const filter = section ? { section } : {};
    const [blocks, mediaItems] = await Promise.all([this.contents.find(filter).sort({ key: 1 }).lean(), this.media.find({ ...(section ? { section } : {}), isActive: true }).sort({ section: 1, order: 1 }).lean()]);
    return { blocks: blocks.map(clean), mediaItems: mediaItems.map(clean) };
  }
  adminContent() { return Promise.all([this.contents.find().sort({ key: 1 }).lean(), this.media.find().sort({ section: 1, order: 1 }).lean()]).then(([blocks, mediaItems]) => ({ blocks: blocks.map(clean), mediaItems: mediaItems.map(clean) })); }
  async update(key: string, data: Record<string, unknown>, userId?: string) {
    if (!CONTENT_KEYS.includes(key as ContentKey)) throw new BadRequestException('Bloc de contenu inconnu');
    validateData(data); validateForKey(key as ContentKey, data);
    const result = await this.contents.findOneAndUpdate({ key }, { $set: { data, updatedBy: userId } }, { new: true, runValidators: true }).lean();
    if (!result) throw new NotFoundException('Bloc introuvable. Exécutez le seed initial.');
    return clean(result);
  }
  createMedia(dto: MediaItemDto, userId?: string) { return this.media.create({ ...dto, updatedBy: userId }); }
  async updateMedia(id: string, dto: MediaItemDto, userId?: string) { const item = await this.media.findByIdAndUpdate(id, { $set: { ...dto, updatedBy: userId } }, { new: true, runValidators: true }); if (!item) throw new NotFoundException('Média introuvable'); return item; }
  async deleteMedia(id: string) { const item = await this.media.findByIdAndDelete(id); if (!item) throw new NotFoundException('Média introuvable'); return { success: true }; }
}
