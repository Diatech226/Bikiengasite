import { SchemaOptions } from 'mongoose';

export const jsonSchemaOptions: Pick<SchemaOptions, 'toJSON' | 'toObject'> = {
  toJSON: {
    virtuals: true,
    transform: (_document, result: Record<string, unknown>) => {
      result.id = String(result._id);
      delete result._id;
      delete result.__v;
      delete result.passwordHash;
      delete result.refreshTokenHash;
      delete result.refreshTokenJti;
      return result;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_document, result: Record<string, unknown>) => {
      result.id = String(result._id);
      delete result._id;
      delete result.__v;
      delete result.passwordHash;
      delete result.refreshTokenHash;
      delete result.refreshTokenJti;
      return result;
    },
  },
};
