import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Connection } from 'mongoose';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}
  @Get()
  async get() {
    try {
      if (this.connection.readyState !== 1 || !this.connection.db) throw new Error('MongoDB déconnecté');
      await this.connection.db.admin().ping();
      return { status: 'ok', database: 'connected' };
    } catch {
      throw new ServiceUnavailableException({ status: 'error', database: 'disconnected' });
    }
  }
}
