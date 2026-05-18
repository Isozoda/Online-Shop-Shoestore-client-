import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, MapPin, Send } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
              ShoeStore
            </span>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {t('about.storyText')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('nav.products')}
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: t('nav.home') },
                { to: '/products', label: t('nav.products') },
                { to: '/about', label: t('nav.about') },
                { to: '/contact', label: t('nav.contact') },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('contact.title')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Phone className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <a href={`tel:${import.meta.env.VITE_WHATSAPP_NUMBER}`} className="hover:text-rose-500 transition-colors">
                  {import.meta.env.VITE_WHATSAPP_NUMBER}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Send className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <a
                  href={`https://t.me/${import.meta.env.VITE_TELEGRAM_USERNAME?.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rose-500 transition-colors"
                >
                  {import.meta.env.VITE_TELEGRAM_USERNAME}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{t('about.address')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-slate-800 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} ShoeStore. {t('about.address')}
          </p>
        </div>
      </div>
    </footer>
  );
}
