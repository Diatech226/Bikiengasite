import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminDonationsController, DonationsController } from './donations.controller';
import { DonationsService } from './donations.service';
import { Donation, DonationSchema } from './schemas/donation.schema';
import { MediaItem, MediaItemSchema } from '../content/schemas/media-item.schema';

@Module({ imports: [MongooseModule.forFeature([{ name: Donation.name, schema: DonationSchema }, { name: MediaItem.name, schema: MediaItemSchema }])], controllers: [DonationsController, AdminDonationsController], providers: [DonationsService], exports: [MongooseModule] })
export class DonationsModule {}
