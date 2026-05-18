import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Heart, Trash2 } from 'lucide-react';
import { ProductCard } from '../components/ui/ProductCard';
import { EmptyState } from '../components/ui/EmptyState';
import { useLikesStore } from '../store/likes.store';
import { Link } from 'react-router-dom';

export function WishlistPage() {
  const { t } = useTranslation();
  const likedProducts = useLikesStore((s) => s.likedProducts);
  const clearLikes = useLikesStore((s) => s.clearLikes);

  return (
    <>
      <Helmet>
        <title>ShoeStore — {t('wishlist.title')}</title>
      </Helmet>

      <div className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('wishlist.title')}
            </h1>
            {likedProducts.length > 0 && (
              <button
                onClick={clearLikes}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-500 hover:text-white bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-500 dark:hover:bg-rose-600 rounded-xl transition-all duration-200 border border-rose-100 dark:border-rose-500/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t('wishlist.clearAll') || 'Тоза кардани ҳама'}</span>
              </button>
            )}
          </div>

          {likedProducts.length === 0 ? (
            <EmptyState
              icon={Heart}
              title={t('wishlist.empty')}
              description={t('wishlist.emptyDesc')}
              action={
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-rose-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-rose-600 transition-colors"
                >
                  {t('cart.continueShopping')}
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {likedProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
