import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '../ui/ProductCard';
import { ProductCardSkeleton } from '../ui/LoadingSkeleton';
import { useFeaturedProducts } from '../../hooks/useProducts';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function FeaturedProducts() {
  const { t } = useTranslation();
  const { data: products, isLoading } = useFeaturedProducts();

  return (
    <section className="py-16 bg-white dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-rose-500 text-sm font-medium tracking-wider uppercase mb-2"
            >
              {t('home.featured')}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
            >
              {t('home.featuredDesc')}
            </motion.h2>
          </div>
          <Link
            to="/products?featured=true"
            className="hidden sm:flex items-center gap-1 text-sm text-rose-500 hover:text-rose-600 font-medium"
          >
            {t('home.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-10"
          >
            {(products || []).map((product, i) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} index={i} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
