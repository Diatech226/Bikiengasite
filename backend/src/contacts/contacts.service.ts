import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ContactQueryDto, CreateContactDto } from './dto/contact.dto';
import { ContactRequest, ContactRequestStatus } from './schemas/contact-request.schema';

@Injectable()
export class ContactsService {
  constructor(@InjectModel(ContactRequest.name) private readonly contacts: Model<ContactRequest>) {}
  create(dto: CreateContactDto) { return this.contacts.create(dto); }
  list(query: ContactQueryDto) { return this.contacts.find(query as FilterQuery<ContactRequest>).sort({ createdAt: -1 }).exec(); }
  async one(id: string) { const contact = await this.contacts.findById(id).exec(); if (!contact) throw new NotFoundException('Demande introuvable'); return contact; }
  async status(id: string, status: ContactRequestStatus) { const contact = await this.contacts.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).exec(); if (!contact) throw new NotFoundException('Demande introuvable'); return contact; }
}
