import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Zap, RotateCcw, Headphones } from 'lucide-react';

const features = [
  { icon: ShieldCheck, titleKey: 'home.quality', descKey: 'home.qualityDesc', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/20' },
  { icon: Zap, titleKey: 'home.delivery', descKey: 'home.deliveryDesc', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
  { icon: RotateCcw, titleKey: 'home.returns', descKey: 'home.returnsDesc', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
  { icon: Headphones, titleKey: 'home.support', descKey: 'home.supportDesc', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20' },
];

export function WhyChooseUs() {
  const { t } = useTranslation();

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-rose-500 text-sm font-medium tracking-wider uppercase mb-2"
          >
            {t('home.whyUs')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
          >
            {t('home.whyUs')}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, titleKey, descKey, color, bg }, i) => (
            <motion.div
              key={titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className={`inline-flex p-4 rounded-2xl ${bg} mb-4`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t(titleKey)}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t(descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
