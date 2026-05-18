import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, HeartHandshake } from 'lucide-react';

const values = [
  { icon: ShieldCheck, key: 'quality', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/20' },
  { icon: Sparkles, key: 'style', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20' },
  { icon: HeartHandshake, key: 'service', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
];

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>ShoeStore — {t('about.title')}</title>
      </Helmet>

      <div className="pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent mb-4">
              {t('about.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              {t('about.address')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 mb-12 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('about.story')}</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
              {t('about.storyText')}
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base mt-4">
              Мо зиёда аз 500 намуди пойафзоли занонаи сифатнок дорем. Ҳамаи маҳсулот аз
              беҳтарин брендҳои ҷаҳон интихоб шудаанд. Мо барои ҳар мизоҷ хидматрасонии
              беназир таъмин мекунем.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, key, color, bg }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center shadow-sm"
              >
                <div className={`inline-flex p-4 rounded-2xl ${bg} mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t(`home.${key === 'style' ? 'quality' : key === 'service' ? 'support' : 'quality'}`)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {key === 'quality' && 'Тамоми маҳсулоти мо сифати баланд ва аз брендҳои маъруф'}
                  {key === 'style' && 'Охирин мӯд ва трендҳои пойафзоли занона'}
                  {key === 'service' && 'Хидматрасонии 24/7 барои ҳар мизоҷ'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
