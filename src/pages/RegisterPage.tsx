import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const schema = z
  .object({
    name: z.string().min(2, 'Ном ҳадди ақал 2 ҳарф'),
    phone: z.string().min(9, 'Рақами нодуруст'),
    password: z.string().min(6, 'Парол ҳадди ақал 6 ҳарф'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Паролҳо мувофиқ нестанд',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const { t } = useTranslation();
  const [showPass, setShowPass] = useState(false);
  const { register: registerUser, isRegistering } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = ({ name, phone, password }: FormData) => {
    registerUser({ name, phone, password });
  };

  return (
    <>
      <Helmet>
        <title>ShoeStore — {t('auth.register')}</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/60 dark:border-slate-700/60">
            <div className="text-center mb-8">
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
                ShoeStore
              </span>
              <h2 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">
                {t('auth.register')}
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {[
                { field: 'name', label: t('auth.name'), type: 'text', placeholder: 'Ном ва насаб' },
                { field: 'phone', label: t('auth.phone'), type: 'tel', placeholder: '+992 XX XXX XXXX' },
              ].map(({ field, label, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    {...register(field as keyof FormData)}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm outline-none focus:border-rose-400"
                  />
                  {errors[field as keyof FormData] && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors[field as keyof FormData]?.message}
                    </p>
                  )}
                </div>
              ))}

              {(['password', 'confirmPassword'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    {field === 'password' ? t('auth.password') : t('auth.confirmPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••"
                      {...register(field)}
                      className="w-full px-4 py-2.5 pr-10 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm outline-none focus:border-rose-400"
                    />
                    {field === 'password' && (
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  {errors[field] && <p className="text-xs text-rose-500 mt-1">{errors[field]?.message}</p>}
                </div>
              ))}

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold py-3 rounded-full transition-all hover:shadow-lg hover:shadow-rose-500/30"
              >
                <UserPlus className="w-4 h-4" />
                {isRegistering ? t('common.loading') : t('auth.register')}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
              {t('auth.hasAccount')}{' '}
              <Link to="/login" className="text-rose-500 hover:text-rose-600 font-medium">
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
