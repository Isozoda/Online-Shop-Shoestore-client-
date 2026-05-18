import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '../ui/ProductCard';
import { ProductGridSkeleton } from '../ui/LoadingSkeleton';
import { useNewArrivals } from '../../hooks/useProducts';

export function NewArrivals() {
  const { t } = useTranslation();
  const { data: products, isLoading } = useNewArrivals();

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
              {t('home.newArrivals')}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
            >
              {t('home.newArrivalsDesc')}
            </motion.h2>
          </div>
          <Link
            to="/products?sort=newest"
            className="hidden sm:flex items-center gap-1 text-sm text-rose-500 hover:text-rose-600 font-medium"
          >
            {t('home.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {(products || []).slice(0, 6).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
