import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const schema = z.object({
  phone: z.string().min(9, 'Рақами нодуруст'),
  password: z.string().min(6, 'Парол ҳадди ақал 6 ҳарф'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const { t } = useTranslation();
  const [showPass, setShowPass] = useState(false);
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <>
      <Helmet>
        <title>ShoeStore — {t('auth.login')}</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/60 dark:border-slate-700/60">
            <div className="text-center mb-8">
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
                ShoeStore
              </span>
              <h2 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">
                {t('auth.login')}
              </h2>
            </div>

            <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                  {t('auth.phone')}
                </label>
                <input
                  type="tel"
                  placeholder="+992 XX XXX XXXX"
                  {...register('phone')}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm outline-none focus:border-rose-400"
                />
                {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••"
                    {...register('password')}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm outline-none focus:border-rose-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold py-3 rounded-full transition-all hover:shadow-lg hover:shadow-rose-500/30"
              >
                <LogIn className="w-4 h-4" />
                {isLoggingIn ? t('common.loading') : t('auth.login')}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="text-rose-500 hover:text-rose-600 font-medium">
                {t('auth.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
