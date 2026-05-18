import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../lib/utils';
import type { Category } from '../../types';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const isNewArrivals = category.slug === 'new-arrivals';

  const displayName = isNewArrivals
    ? t('nav.newArrivals', 'New Arrivals')
    : category[`name_${lang}` as keyof Category] || category.name_tj || category.name_en || category.name || 'Категория';

  // Premium, visually expensive fashion photos mapped tailored to each type as elegant defaults
  const getFallbackImage = (slug: string) => {
    switch (slug) {
      case 'botinkaho':
        return 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80';
      case 'mokasinho':
        return 'https://images.unsplash.com/photo-1614252369475-531f9141b229?auto=format&fit=crop&w=800&q=80';
      case 'sandalho':
        return 'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=800&q=80';
      case 'sportivo':
        return 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80';
      case 'tufliho':
        return 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80';
      case 'new-arrivals':
        return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80';
      default:
        return 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      className="h-full"
    >
      <Link
        to={isNewArrivals ? '/products?isNew=true' : `/products?category=${category.slug}`}
        className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-2xl"
      >
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 border border-black/5 dark:border-white/5">
          {/* Main background photo loaded dynamically from API backend if present, else fallback */}
          <img
            src={category.image ? getImageUrl(category.image) : getFallbackImage(category.slug)}
            alt={String(displayName)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />

          {/* Premium cinematic multi-stop gradient overlays for perfect text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />

          {/* Typography & Glassmorphism Overlay */}
          <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end z-10">
            <div className="flex items-end justify-between gap-2">
              <div className="text-left min-w-0 flex-1">
                <p className="font-bold text-white text-base sm:text-lg tracking-tight drop-shadow-sm group-hover:text-rose-300 transition-colors truncate">
                  {displayName}
                </p>
                {category.productCount !== undefined && (
                  <span className="inline-block mt-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wide text-white border border-white/20 shadow-sm">
                    {category.productCount} {t('common.items', 'маҳсулот')}
                  </span>
                )}
              </div>
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 shrink-0 shadow-md">
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
