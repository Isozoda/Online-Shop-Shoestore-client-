import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

export function ContactPage() {
  const { t } = useTranslation();

  const contacts = [
    {
      icon: Phone,
      label: t('contact.phone'),
      value: import.meta.env.VITE_WHATSAPP_NUMBER || '+992 XX XXX XXXX',
      href: `tel:${import.meta.env.VITE_WHATSAPP_NUMBER}`,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-950/20',
    },
    {
      icon: Send,
      label: t('contact.telegram'),
      value: import.meta.env.VITE_TELEGRAM_USERNAME || '@shoestoretj',
      href: `https://t.me/${(import.meta.env.VITE_TELEGRAM_USERNAME || '@shoestoretj').replace('@', '')}`,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      icon: MessageCircle,
      label: t('contact.whatsapp'),
      value: import.meta.env.VITE_WHATSAPP_NUMBER || '+992 XX XXX XXXX',
      href: `https://wa.me/${(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')}`,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      icon: MapPin,
      label: t('contact.address'),
      value: t('about.address'),
      href: 'https://www.google.com/maps/search/?api=1&query=38.541090,68.755090',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/20',
    },
    {
      icon: Clock,
      label: t('contact.workingHours'),
      value: '09:00 – 22:00',
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-950/20',
    },
  ];

  return (
    <>
      <Helmet>
        <title>ShoeStore — {t('contact.title')}</title>
      </Helmet>

      <div className="pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent mb-3">
              {t('contact.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{t('about.address')}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {contacts.map(({ icon: Icon, label, value, href, color, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 flex items-center gap-4 shadow-sm"
              >
                <div className={`p-3 rounded-xl ${bg} flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className={`font-medium text-sm ${color} hover:underline`}
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800"
          >
            <iframe
              src="https://maps.google.com/maps?q=38.541090,68.755090&t=h&z=18&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="350"
              style={{ border: 0 }}
              title={t('contact.map')}
              loading="lazy"
              className="w-full h-[350px] border-0 dark:brightness-[0.8] dark:contrast-[1.1] transition-all duration-300"
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}
