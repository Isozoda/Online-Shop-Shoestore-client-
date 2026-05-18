import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { CategoryCard } from '../ui/CategoryCard';
import { CategoryCardSkeleton } from '../ui/LoadingSkeleton';
import { useCategories } from '../../hooks/useProducts';

export function CategorySection() {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-rose-500 text-sm font-medium tracking-wider uppercase mb-2"
            >
              {t('home.categories')}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
            >
              {t('home.categoriesDesc')}
            </motion.h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-1 text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors"
          >
            {t('home.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
            {[...(categories || []).slice(0, 5), {
              id: 'new-arrivals',
              name: 'Навгониҳо',
              name_tj: 'Навгониҳо',
              name_ru: 'Новинки',
              name_en: 'New Arrivals',
              slug: 'new-arrivals',
            }].map((cat: any, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
