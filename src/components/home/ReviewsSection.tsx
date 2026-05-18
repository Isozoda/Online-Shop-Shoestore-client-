import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { StarRating } from '../ui/StarRating';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reviewsApi } from '../../api/reviews.api';
import { getImageUrl } from '../../lib/utils';
import { UserAvatar } from '../ui/UserAvatar';

const staticReviews = [
  { id: '1', name: 'Мадина Т.', rating: 5, comment: 'Пойафзол хеле зебо ва сифатнок аст. Хеле зуд расонданд. Ташаккур!', date: '2025-01-15' },
  { id: '2', name: 'Зарина Р.', rating: 5, comment: 'Маҳсулоти аъло! Аз ин мағоза хеле розиям. Боз мехарам.', date: '2025-01-20' },
  { id: '3', name: 'Камила А.', rating: 4, comment: 'Хеле зебо ва ба мод аст. Тавсия медиҳам!', date: '2025-02-01' },
  { id: '4', name: 'Нилуфар С.', rating: 5, comment: 'Сервиси хуб, маҳсулоти аъло. Ҳамон вақт расонданд.', date: '2025-02-10' },
  { id: '5', name: 'Дилноза М.', rating: 5, comment: 'Пойафзоли аъло! Дақиқан ба размер, сифат баланд.', date: '2025-02-15' },
];

export function ReviewsSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data: latestReviews } = useQuery({
    queryKey: ['reviews', 'latest'],
    queryFn: reviewsApi.getLatest,
    staleTime: 30 * 1000,
  });

  const safeRealReviews = Array.isArray(latestReviews) ? latestReviews : [];
  
  const displayReviews = safeRealReviews.length > 0 
    ? safeRealReviews.map(r => {
        const pName = r.product ? (r.product[`name_${lang}`] || r.product.name_tj || r.product.name_ru || r.product.name) : undefined;
        return {
          id: r.id,
          name: r.user?.name || 'Мизоҷ',
          rating: r.rating,
          comment: r.comment,
          date: new Date(r.createdAt || Date.now()).toLocaleDateString(),
          productName: typeof pName === 'string' ? pName : undefined,
          productSlug: r.product?.slug,
          avatar: r.user?.avatar
        };
      })
    : staticReviews;

  return (
    <section className="py-16 bg-white dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-rose-500 text-sm font-medium tracking-wider uppercase mb-2"
          >
            {t('home.reviews')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
          >
            {t('home.reviews')}
          </motion.h2>
        </div>

        <div className="relative overflow-hidden py-4 -mx-4 sm:mx-0">
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 w-[max-content] animate-marquee">
            {[...displayReviews, ...displayReviews].map((review, index) => (
              <div 
                key={`${review.id}-${index}`}
                className="w-[280px] sm:w-[360px] flex-shrink-0 bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-700/50"
              >
                <div>
                  <StarRating rating={review.rating} size="sm" />
                  <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-4">
                    "{review.comment}"
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200/60 dark:border-slate-700/60 flex items-center gap-3">
                  <UserAvatar user={review} className="w-9 h-9" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{review.name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 truncate mt-0.5">
                      <span>{review.date}</span>
                      {(review as any).productName && (
                        <>
                          <span>•</span>
                          {(review as any).productSlug ? (
                            <Link to={`/products/${(review as any).productSlug}`} className="text-rose-500 hover:underline truncate">
                              {(review as any).productName}
                            </Link>
                          ) : (
                            <span className="text-rose-500/80 truncate">{(review as any).productName}</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
