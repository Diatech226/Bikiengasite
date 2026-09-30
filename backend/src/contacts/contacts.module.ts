import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminContactsController, ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { ContactRequest, ContactRequestSchema } from './schemas/contact-request.schema';

@Module({ imports: [MongooseModule.forFeature([{ name: ContactRequest.name, schema: ContactRequestSchema }])], controllers: [ContactsController, AdminContactsController], providers: [ContactsService], exports: [MongooseModule] })
export class ContactsModule {}
