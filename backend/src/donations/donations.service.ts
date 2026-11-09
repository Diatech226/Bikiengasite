import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateDonationDto, DonationQueryDto } from './dto/donation.dto';
import { Donation, DonationStatus } from './schemas/donation.schema';
import { MediaItem } from '../content/schemas/media-item.schema';

@Injectable()
export class DonationsService {
  constructor(
    @InjectModel(Donation.name) private readonly donations: Model<Donation>,
    @InjectModel(MediaItem.name) private readonly media: Model<MediaItem>,
  ) {}
  async create(dto: CreateDonationDto) {
    if (!dto.projectSlug) return this.donations.create(dto);
    const project = await this.media.findOne({ slug: dto.projectSlug, type: 'projet', isActive: true }).lean().exec();
    if (!project) throw new BadRequestException('Ce chantier est introuvable ou n’accepte plus de soutien.');
    return this.donations.create({ ...dto, projectSlug: project.slug, projectTitle: project.title });
  }
  async list(query: DonationQueryDto) {
    const filter: FilterQuery<Donation> = {};
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;
    if (query.projectSlug) filter.projectSlug = query.projectSlug;
    if (query.from || query.to) filter.createdAt = { ...(query.from ? { $gte: new Date(query.from) } : {}), ...(query.to ? { $lte: new Date(query.to) } : {}) };
    const [data, total] = await Promise.all([
      this.donations.find(filter).sort({ createdAt: -1 }).skip((query.page - 1) * query.limit).limit(query.limit).exec(),
      this.donations.countDocuments(filter).exec(),
    ]);
    return { data, meta: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } };
  }
  async one(id: string) { const donation = await this.donations.findById(id).exec(); if (!donation) throw new NotFoundException('Don introuvable'); return donation; }
  async status(id: string, status: DonationStatus) { const donation = await this.donations.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).exec(); if (!donation) throw new NotFoundException('Don introuvable'); return donation; }
}
