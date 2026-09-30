import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateDonationDto, DonationQueryDto } from './dto/donation.dto';
import { Donation, DonationStatus } from './schemas/donation.schema';

@Injectable()
export class DonationsService {
  constructor(@InjectModel(Donation.name) private readonly donations: Model<Donation>) {}
  create(dto: CreateDonationDto) { return this.donations.create(dto); }
  async list(query: DonationQueryDto) {
    const filter: FilterQuery<Donation> = {};
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;
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
