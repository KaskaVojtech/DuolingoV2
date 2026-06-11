'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { courseCreateSchema, CourseCreateFormValues } from '@/lib/course-create/course-create.schema';
import { isAxiosError } from 'axios';
import { uploadCourseThumbnail, useCreateCourse } from '@/lib/course-create/course-create.api';
import { useUIStore } from '@/lib/stores/ui.store';
import { AdminInput } from '@/components/admin/common/AdminInput';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { CourseThumbnailPicker } from './CourseThumbnailPicker';

export function CourseCreateForm() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateCourse();
  const { showToast } = useUIStore();
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const methods = useForm<CourseCreateFormValues>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: {
      title: '',
      description: '',
      thumbnailType: 'color',
      thumbnailUrl: null,
      thumbnailColor: '#2d4a7a',
      accessMode: 'toggle',
      isLocked: false,
      accessFrom: null,
      accessUntil: null,
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = methods;
  const thumbnailType = watch('thumbnailType');
  const thumbnailUrl = watch('thumbnailUrl');
  const thumbnailColor = watch('thumbnailColor');

  const onSubmit = async (values: CourseCreateFormValues) => {
    try {
      let finalUrl = values.thumbnailUrl;
      if (values.thumbnailType === 'image' && pendingFile) {
        const { url } = await uploadCourseThumbnail(pendingFile);
        finalUrl = url;
      }
      const result = await mutateAsync({ ...values, description: values.description ?? '', thumbnailUrl: finalUrl });
      router.push(`/admin/courses/${result.id}/lessons`);
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 404) {
        showToast('Tato funkce ještě není připojena k backendu', 'error');
      } else {
        showToast('Nepodařilo se vytvořit kurz', 'error');
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-admin-xl">

        <div>
          <AdminInput
            label="Název kurzu *"
            {...register('title')}
            error={errors.title?.message}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-admin-xs text-admin-text-muted">Popisek</label>
          <textarea
            {...register('description')}
            rows={3}
            className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-admin-md py-2 text-admin-sm text-admin-text resize-none focus:outline-none focus:border-admin-primary transition-colors"
            placeholder="Krátký popis kurzu..."
          />
          {errors.description && (
            <p className="text-admin-xs text-admin-danger">{errors.description.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-admin-xs text-admin-text-muted">Náhledový obrázek</label>
          <CourseThumbnailPicker
            thumbnailType={thumbnailType}
            thumbnailUrl={thumbnailUrl}
            thumbnailColor={thumbnailColor}
            previewDataUrl={previewDataUrl}
            onTypeChange={(t) => setValue('thumbnailType', t)}
            onFileSelect={(file, dataUrl) => {
              setPendingFile(file);
              setPreviewDataUrl(dataUrl);

              setValue('thumbnailUrl', dataUrl, { shouldValidate: true });
            }}
            onImageRemove={() => {
              setPendingFile(null);
              setPreviewDataUrl(null);
              setValue('thumbnailUrl', null);
            }}
            onColorChange={(c) => setValue('thumbnailColor', c)}
            error={errors.thumbnailUrl?.message}
          />
        </div>

        <div>
          <AdminButton type="submit" variant="primary" loading={isPending} icon="ti-plus">
            Vytvořit kurz
          </AdminButton>
        </div>
      </form>
    </FormProvider>
  );
}
