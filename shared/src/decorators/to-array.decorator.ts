import { Transform } from 'class-transformer';

export const ToArray = (): PropertyDecorator =>
  Transform(({ value }) => {
    if (value === null || value === undefined) return [];
    return Array.isArray(value) ? value : [value];
  });
