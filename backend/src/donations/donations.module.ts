import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminDonationsController, DonationsController } from './donations.controller';
import { DonationsService } from './donations.service';
import { Donation, DonationSchema } from './schemas/donation.schema';

@Module({ imports: [MongooseModule.forFeature([{ name: Donation.name, schema: DonationSchema }])], controllers: [DonationsController, AdminDonationsController], providers: [DonationsService], exports: [MongooseModule] })
export class DonationsModule {}
