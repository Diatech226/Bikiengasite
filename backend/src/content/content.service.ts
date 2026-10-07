import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaItemDto } from './dto/content.dto';
import { CONTENT_KEYS, ContentKey, SiteContent } from './schemas/site-content.schema';
import { MediaItem } from './schemas/media-item.schema';
import slugify from 'slugify';

export function validateData(value: unknown, depth = 0, field = 'data'): void {
  if (depth > 8) throw new BadRequestException('Structure de contenu trop profonde');
  if (typeof value === 'string') {
    if (value.length > 12000) throw new BadRequestException('Un texte dépasse 12 000 caractères');
    if (/url$/i.test(field) && value && !/^https:\/\//i.test(value)) throw new BadRequestException(`Le champ ${field} doit être une URL HTTPS`);
    return;
  }
  if (typeof value === 'number') { if (!Number.isFinite(value)) throw new BadRequestException(`Le champ ${field} doit être un nombre fini`); return; }
  if (value === null || typeof value === 'boolean') return;
  if (Array.isArray(value)) { if (value.length > 100) throw new BadRequestException('Une liste dépasse 100 éléments'); value.forEach((entry) => validateData(entry, depth + 1, field)); return; }
  if (typeof value === 'object') { Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => { if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(key)) throw new BadRequestException(`Champ invalide : ${key}`); validateData(entry, depth + 1, key); }); return; }
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
  'home.page': { title: 'string', metrics: 'array', storiesTitle: 'string' },
  'agriculture.page': { header: 'object', stats: 'array', storiesTitle: 'string', guideCard: 'object' },
  'elevage.page': { header: 'object', stats: 'array', storiesTitle: 'string', adviceTitle: 'string', rules: 'array' },
  'humanitaire.page': { header: 'object', stats: 'array', chroniclesTitle: 'string', actionTitle: 'string' },
};

const allowedFields: Record<ContentKey, readonly string[]> = {
  'site.brand': ['name', 'subtitle', 'logoUrl', 'logoAlt'],
  'site.navigation': ['items', 'searchLabel', 'supportLabel', 'profileLabel'],
  'site.footer': ['description', 'navigationTitle', 'supportTitle', 'supportDescription', 'donationButton', 'profileButton', 'copyright', 'signature'],
  'site.contact': ['location', 'email', 'phone', 'whatsapp'],
  'site.profile': ['name', 'title', 'biography', 'quote', 'imageUrl', 'imageAlt', 'buttonLabel'],
  'site.guide': ['badge', 'title', 'introduction', 'buttonLabel'],
  'site.donation': ['badge', 'eyebrow', 'title', 'introduction', 'projectLabel', 'nameLabel', 'namePlaceholder', 'contactLabel', 'contactPlaceholder', 'emailLabel', 'emailPlaceholder', 'amountLabel', 'messageLabel', 'messagePlaceholder', 'submitLabel', 'successBadge', 'successTitle', 'successMessage', 'categories', 'suggestedAmounts'],
  'site.search': ['placeholder', 'suggestionsTitle', 'mediaTitle', 'articlesTitle', 'emptyMessage', 'suggestions'],
  'home.page': ['badge', 'title', 'description', 'primaryButton', 'quote', 'quoteAuthor', 'quoteCaption', 'impactTitle', 'impactPeriod', 'metrics', 'storiesTitle', 'articlesEyebrow', 'articlesHeading', 'upcomingTitle', 'upcomingEyebrow', 'upcomingDescription', 'upcomingPrimaryButton', 'emptyArticlesTitle', 'emptyArticlesDescription', 'articlesLoadingLabel', 'articlesErrorLabel', 'retryLabel'],
  'agriculture.page': ['header', 'stats', 'storiesTitle', 'guideCard'],
  'elevage.page': ['header', 'stats', 'storiesTitle', 'adviceTitle', 'rules', 'ctaTitle', 'ctaDescription', 'donationButton'],
  'humanitaire.page': ['header', 'stats', 'chroniclesTitle', 'chroniclesSubtitle', 'actionTitle', 'actionSubtitle', 'actionDescription', 'donationButton', 'contactButton'],
};

const addedFieldDefaults: Partial<Record<ContentKey, Record<string, unknown>>> = {
  'agriculture.page': { storiesTitle: 'Réalisations et reportages' },
  'elevage.page': { storiesTitle: 'Pratiques et réalisations', adviceTitle: 'Conseils essentiels' },
  'humanitaire.page': { contactButton: 'Contacter le secrétariat' },
};

function pick(value: unknown, fields: readonly string[]) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  return Object.fromEntries(fields.filter((field) => field in source).map((field) => [field, source[field]]));
}

function normalizeNestedFields(key: ContentKey, data: Record<string, unknown>) {
  const normalized = { ...data };
  if (key !== 'home.page' && key.endsWith('.page') && 'header' in data) {
    normalized.header = pick(data.header, ['badge', 'title', 'description']);
  }
  if (key.endsWith('.page') && Array.isArray(data.stats)) {
    normalized.stats = data.stats.slice(0, key === 'home.page' ? 4 : 3).map((stat) =>
      pick(stat, key === 'home.page' ? ['value', 'label', 'sublabel'] : key === 'agriculture.page' ? ['value', 'label', 'sub'] : ['value', 'label']),
    );
  }
  if (key === 'elevage.page' && Array.isArray(data.rules)) {
    normalized.rules = data.rules.map((rule) => {
      const source = rule && typeof rule === 'object' ? rule as Record<string, unknown> : {};
      return { title: source.title, description: source.description ?? source.desc };
    });
  }
  return normalized;
}

export function sanitizeForKey(key: ContentKey, data: Record<string, unknown>) {
  const withDefaults = { ...addedFieldDefaults[key], ...data };
  const allowed = Object.fromEntries(allowedFields[key].filter((field) => field in withDefaults).map((field) => [field, withDefaults[field]]));
  return normalizeNestedFields(key, allowed);
}
export function validateForKey(key: ContentKey, data: Record<string, unknown>) {
  for (const [field, expected] of Object.entries(requiredFields[key])) {
    const value = data[field];
    const valid = expected === 'array' ? Array.isArray(value) : expected === 'object' ? !!value && typeof value === 'object' && !Array.isArray(value) : typeof value === expected;
    if (!valid) throw new BadRequestException(`Le champ ${field} de ${key} doit être de type ${expected}`);
  }
  const allowedValues: Partial<Record<ContentKey, Record<string, readonly string[]>>> = {
    'site.navigation': { items: ['accueil', 'agriculture', 'elevage', 'humanitaire'] },
    'site.donation': { categories: ['forage', 'cereales', 'orphelins', 'arbres', 'materiel'] },
  };
  for (const [field, allowed] of Object.entries(allowedValues[key] || {})) {
    const values = data[field] as Array<Record<string, unknown>>;
    const identifier = key === 'site.navigation' || field === 'filters' ? 'id' : 'value';
    const identifiers = values.map((entry) => String(entry[identifier]));
    if (identifiers.length !== allowed.length || new Set(identifiers).size !== allowed.length || !allowed.every((id) => identifiers.includes(id)) || !values.every((entry) => typeof entry.label === 'string')) {
      throw new BadRequestException(`Les identifiants techniques de ${key}.${field} ne peuvent pas être modifiés`);
    }
  }
  if (key === 'site.donation') {
    const amounts = data.suggestedAmounts as Array<Record<string, unknown>>;
    if (!amounts.every((amount) => typeof amount.value === 'number' && amount.value > 0 && typeof amount.label === 'string')) throw new BadRequestException('Chaque montant doit avoir une valeur positive et un libellé');
  }
}
function clean<T extends Record<string, unknown>>(document: T) { const { _id, __v, ...value } = document; return { ...value, id: String(_id) }; }
function cleanBlock<T extends { key: ContentKey; data: Record<string, unknown> } & Record<string, unknown>>(document: T) {
  return { ...clean(document), data: sanitizeForKey(document.key, document.data) };
}

@Injectable()
export class ContentService {
  constructor(@InjectModel(SiteContent.name) private readonly contents: Model<SiteContent>, @InjectModel(MediaItem.name) private readonly media: Model<MediaItem>) {}
  async publicContent(section?: string) {
    const filter = section ? { section } : {};
    const [blocks, mediaItems] = await Promise.all([this.contents.find(filter).sort({ key: 1 }).lean(), this.media.find({ ...(section ? { section } : {}), isActive: true }).sort({ section: 1, order: 1 }).lean()]);
    return { blocks: blocks.map((block) => cleanBlock(block as never)), mediaItems: mediaItems.map(clean) };
  }
  adminContent() { return Promise.all([this.contents.find().sort({ key: 1 }).lean(), this.media.find().sort({ section: 1, order: 1 }).lean()]).then(([blocks, mediaItems]) => ({ blocks: blocks.map((block) => cleanBlock(block as never)), mediaItems: mediaItems.map(clean) })); }
  async update(key: string, data: Record<string, unknown>, userId?: string) {
    if (!CONTENT_KEYS.includes(key as ContentKey)) throw new BadRequestException('Bloc de contenu inconnu');
    const contentKey = key as ContentKey;
    const sanitized = sanitizeForKey(contentKey, data);
    validateData(sanitized); validateForKey(contentKey, sanitized);
    const result = await this.contents.findOneAndUpdate({ key }, { $set: { data: sanitized, updatedBy: userId } }, { new: true, runValidators: true }).lean();
    if (!result) throw new NotFoundException('Bloc introuvable. Exécutez le seed initial.');
    return clean(result);
  }
  private duplicateSlug(error: unknown) {
    return !!error && typeof error === 'object' && 'code' in error && (error as { code?: number }).code === 11000;
  }
  private async availableSlug(title: string) {
    const base = slugify(title, { lower: true, strict: true, locale: 'fr', trim: true }) || 'media';
    let candidate = base;
    let suffix = 2;
    while (await this.media.exists({ slug: candidate })) candidate = `${base}-${suffix++}`;
    return candidate;
  }
  async createMedia(dto: MediaItemDto, userId?: string) {
    const requestedSlug = dto.slug?.trim().toLowerCase();
    const slug = requestedSlug || await this.availableSlug(dto.title);
    try {
      return await this.media.create({ ...dto, slug, updatedBy: userId });
    } catch (error) {
      if (this.duplicateSlug(error)) {
        if (requestedSlug) throw new ConflictException('Un média avec cet identifiant existe déjà.');
        // A concurrent creation may have claimed the candidate after the lookup.
        const retrySlug = await this.availableSlug(dto.title);
        try { return await this.media.create({ ...dto, slug: retrySlug, updatedBy: userId }); }
        catch (retryError) { if (this.duplicateSlug(retryError)) throw new ConflictException('Un média avec cet identifiant existe déjà.'); throw retryError; }
      }
      throw error;
    }
  }
  async updateMedia(id: string, dto: MediaItemDto, userId?: string) {
    const { slug: _ignoredSlug, ...changes } = dto;
    try {
      const item = await this.media.findByIdAndUpdate(id, { $set: { ...changes, updatedBy: userId } }, { new: true, runValidators: true });
      if (!item) throw new NotFoundException('Média introuvable');
      return item;
    } catch (error) { if (this.duplicateSlug(error)) throw new ConflictException('Un média avec cet identifiant existe déjà.'); throw error; }
  }
  async deleteMedia(id: string) { const item = await this.media.findByIdAndDelete(id); if (!item) throw new NotFoundException('Média introuvable'); return { success: true }; }
}
