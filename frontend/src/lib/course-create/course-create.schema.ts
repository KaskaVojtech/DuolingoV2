import { z } from 'zod';

export const courseCreateSchema = z.object({
  title: z.string().min(1, 'Název je povinný').max(200, 'Název může mít max. 200 znaků'),
  description: z.string().max(2000).optional(),
  thumbnailType: z.enum(['image', 'color']),
  thumbnailUrl: z.string().nullable(),
  thumbnailColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Neplatná barva'),
  accessMode: z.enum(['toggle', 'scheduled']),
  isLocked: z.boolean(),
  accessFrom: z.string().nullable(),
  accessUntil: z.string().nullable(),
}).refine(
  (data) => {
    if (data.accessMode === 'scheduled' && data.accessFrom && data.accessUntil) {
      return new Date(data.accessFrom) < new Date(data.accessUntil);
    }
    return true;
  },
  { message: '"Přístup do" musí být po "Přístup od"', path: ['accessUntil'] }
).refine(
  (data) => data.thumbnailType === 'color' || data.thumbnailUrl !== null,
  { message: 'Nahrajte obrázek nebo vyberte barvu', path: ['thumbnailUrl'] }
);

export type CourseCreateFormValues = z.infer<typeof courseCreateSchema>;
