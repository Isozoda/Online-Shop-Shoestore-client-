import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Package, ChevronRight } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ImageGallery } from '../components/ui/ImageGallery';
import { StarRating } from '../components/ui/StarRating';
import { PriceDisplay } from '../components/ui/PriceDisplay';
import { ProductCard } from '../components/ui/ProductCard';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import { useProduct, useRelatedProducts } from '../hooks/useProducts';
import { useLikes } from '../hooks/useLikes';
import { useCart } from '../hooks/useCart';
import { reviewsApi } from '../api/reviews.api';
import { useAuthStore } from '../store/auth.store';
import type { ProductVariant } from '../types';
import { UserAvatar } from '../components/ui/UserAvatar';
import { getImageUrl } from '../lib/utils';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const { data: rawProduct, isLoading } = useProduct(slug!);
  const product = (rawProduct as any)?.data || rawProduct;
  
  const { data: related } = useRelatedProducts(
    product?.id || '',
    product?.category?.id || ''
  );

  const { isLiked, toggleLike } = useLikes();
  const { addItem } = useCart();

  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const { data: reviews } = useQuery({
    queryKey: ['reviews', product?.id],
    queryFn: () => reviewsApi.getByProduct(product!.id),
    enabled: !!product?.id,
  });

  const reviewMutation = useMutation({
    mutationFn: () => reviewsApi.create(product!.id, reviewRating, reviewComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'latest'] });
      setReviewComment('');
      toast.success('Шарҳ илова шуд');
    },
  });

  if (isLoading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const rawName = ((product as any)[`name_${lang}`] || product.name_tj || product.name_ru || product.name_en || product.name || '');
  const displayName = typeof rawName === 'string' ? rawName : String(rawName || '');

  const rawDesc = ((product as any)[`description_${lang}`] || product.description_tj || product.description_ru || product.description_en || product.description || '');
  const displayDescription = typeof rawDesc === 'string' ? rawDesc : String(rawDesc || '');

  const activeColor = selectedColor || product.colors?.[0];
  const activeSize = selectedSize || product.sizes?.[0];
  const currentStock = activeSize?.stock ?? product.stock ?? 0;
  const isOutOfStock = currentStock === 0;

  const handleAddToCart = () => {
    if (!product) return;
    const colorName = activeColor ? (activeColor[`name_${lang}`] || activeColor.name_tj || 'Standard') : 'Standard';
    const colorHex = activeColor?.hexCode || '#000000';
    const sizeName = activeSize?.size || 'Standard';

    const syntheticVariant: ProductVariant = {
      id: `${activeSize?.id || 'size'}-${activeColor?.id || 'color'}`,
      size: sizeName,
      color: colorName,
      colorHex,
      stock: currentStock,
      sku: product.sku
    };

    addItem(product, syntheticVariant);
    toast.success(t('product.addedToCart', 'Ба сабад илова шуд'));
  };

  const safeReviews = Array.isArray(reviews) ? reviews : [];

  return (
    <>
      <Helmet>
        <title>{displayName} — ShoeStore</title>
        <meta name="description" content={displayDescription.slice(0, 160)} />
      </Helmet>

      <div className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Link to="/" className="hover:text-rose-500">{t('nav.home')}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:text-rose-500">{t('nav.products')}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 dark:text-white truncate">{displayName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            <ImageGallery images={product.images || []} productName={displayName} />

            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  {product.brand && (
                    <p className="text-rose-500 text-sm font-medium mb-1">{product.brand.name}</p>
                  )}
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {displayName}
                  </h1>
                </div>
                <motion.button
                  onClick={() => toggleLike(product)}
                  whileTap={{ scale: 0.85 }}
                  className="p-3 rounded-full border border-gray-200 dark:border-slate-700 hover:border-rose-400 transition-colors flex-shrink-0"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isLiked(product.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400'
                    }`}
                  />
                </motion.button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <StarRating 
                  rating={(product as any).avgRating ?? product.rating ?? 0} 
                  showCount 
                  count={(product as any)._count?.reviews ?? product.reviewCount ?? 0} 
                />
                {product.category && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {product.category.name}
                  </span>
                )}
              </div>

              <PriceDisplay
                price={product.price}
                discountPrice={product.discountPrice}
                size="xl"
                className="mb-6"
              />

              {!isOutOfStock && (
                <div className="flex items-center gap-2 mb-6 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                  <Package className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {t('product.inStock')}: {currentStock} {t('common.pieces')}
                  </span>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                    {t('product.colors')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c: any) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c)}
                        title={c[`name_${lang}`] || c.name_tj}
                        className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                          activeColor?.id === c.id ? 'border-rose-500 scale-110' : 'border-transparent'
                        }`}
                        style={{
                          backgroundColor: c.hexCode,
                          boxShadow: c.hexCode === '#FFFFFF' ? 'inset 0 0 0 1px #d1d5db' : undefined,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                    {t('product.sizes')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s: any) => {
                      const outOfStock = s.stock === 0;
                      return (
                        <button
                          key={s.id}
                          onClick={() => !outOfStock && setSelectedSize(s)}
                          disabled={outOfStock}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                            activeSize?.id === s.id
                              ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-500'
                              : outOfStock
                              ? 'border-gray-100 dark:border-slate-800 text-gray-300 dark:text-slate-600 cursor-not-allowed line-through'
                              : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:border-rose-300'
                          }`}
                        >
                          {s.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-200 dark:disabled:bg-slate-700 text-white disabled:text-gray-400 font-semibold py-4 px-8 rounded-full transition-all hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                <ShoppingBag className="w-5 h-5" />
                {isOutOfStock ? t('product.outOfStock') : t('product.addToCart')}
              </button>

              {displayDescription && (
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {t('product.description')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {displayDescription}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {t('product.reviews')} ({safeReviews.length})
            </h2>

            {isAuthenticated && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                  {t('product.writeReview')}
                </h3>
                <StarRating
                  rating={reviewRating}
                  size="lg"
                  interactive
                  onRate={setReviewRating}
                />
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  className="w-full mt-4 px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white outline-none focus:border-rose-400 resize-none"
                  placeholder="Шарҳи худро бинависед..."
                />
                <button
                  onClick={() => reviewMutation.mutate()}
                  disabled={!reviewComment.trim() || reviewMutation.isPending}
                  className="mt-3 px-6 py-2 bg-rose-500 text-white text-sm font-medium rounded-full hover:bg-rose-600 transition-colors disabled:opacity-50"
                >
                  {reviewMutation.isPending ? t('common.loading') : t('common.save')}
                </button>
              </div>
            )}

            <div className="space-y-4">
              {safeReviews.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('product.noReviews')}</p>
              )}
              {safeReviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={review.user} className="w-9 h-9" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {review.user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {related && related.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t('product.related')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {related.slice(0, 6).map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
