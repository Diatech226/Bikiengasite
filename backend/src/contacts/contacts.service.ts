import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ContactQueryDto, CreateContactDto } from './dto/contact.dto';
import { ContactRequest, ContactRequestStatus } from './schemas/contact-request.schema';

@Injectable()
export class ContactsService {
  constructor(@InjectModel(ContactRequest.name) private readonly contacts: Model<ContactRequest>) {}
  create(dto: CreateContactDto) { return this.contacts.create(dto); }
  async list(query: ContactQueryDto) {
    const filter: FilterQuery<ContactRequest> = {};
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;
    const [data, total] = await Promise.all([
      this.contacts.find(filter).sort({ createdAt: -1 }).skip((query.page - 1) * query.limit).limit(query.limit).exec(),
      this.contacts.countDocuments(filter).exec(),
    ]);
    return { data, meta: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } };
  }
  async one(id: string) { const contact = await this.contacts.findById(id).exec(); if (!contact) throw new NotFoundException('Demande introuvable'); return contact; }
  async status(id: string, status: ContactRequestStatus) { const contact = await this.contacts.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).exec(); if (!contact) throw new NotFoundException('Demande introuvable'); return contact; }
}
