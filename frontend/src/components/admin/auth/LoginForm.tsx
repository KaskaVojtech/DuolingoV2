'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { AdminCard } from '@/components/admin/common/AdminCard';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { AdminInput } from '@/components/admin/common/AdminInput';
import { AdminErrorBanner } from '@/components/admin/common/AdminErrorBanner';
import { LoginFormField } from './LoginFormField';
import { login, ApiError } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/auth/auth.store';

const loginSchema = z.object({
  email:    z.string().email('Neplatný email'),
  password: z.string().min(1, 'Heslo je povinné'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      const { accessToken } = await login({ email: data.email, password: data.password });
      setAccessToken(accessToken);
      router.push('/admin/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) setError('Nesprávný email nebo heslo');
        else if (err.status === 403) setError('Tento účet nemá oprávnění k administraci');
        else setError('Chyba serveru, zkuste to znovu');
      } else {
        setError('Nepodařilo se spojit se serverem');
      }
    }
  };

  return (
    <AdminCard className="w-full">
      <h1 className="text-admin-xl font-semibold text-admin-text mb-admin-lg">
        Přihlášení do administrace
      </h1>

      <AdminErrorBanner message={error} />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-admin-md mt-admin-md">
        <LoginFormField label="Email" error={errors.email?.message}>
          <AdminInput
            type="email"
            placeholder="admin@example.com"
            autoComplete="email"
            hasError={!!errors.email}
            {...register('email')}
          />
        </LoginFormField>

        <LoginFormField label="Heslo" error={errors.password?.message}>
          <AdminInput
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            hasError={!!errors.password}
            {...register('password')}
          />
        </LoginFormField>

        <AdminButton
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="w-full justify-center mt-admin-sm"
        >
          Přihlásit se
        </AdminButton>
      </form>
    </AdminCard>
  );
}
