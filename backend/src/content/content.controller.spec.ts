import { GUARDS_METADATA } from '@nestjs/common/constants';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ContentController } from './content.controller';

describe('ContentController security', () => {
  it.each(['adminContent', 'update', 'createMedia', 'updateMedia', 'deleteMedia'] as const)('protège la route %s par JWT', (method) => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, ContentController.prototype[method]) as unknown[];
    expect(guards).toContain(JwtAuthGuard);
  });

  it.each(['publicContent', 'publicSection'] as const)('laisse la lecture %s publique et en lecture seule', (method) => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, ContentController.prototype[method]) as unknown[] | undefined;
    expect(guards).toBeUndefined();
  });
});
