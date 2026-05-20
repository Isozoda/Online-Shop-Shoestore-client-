import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { PriceDisplay } from './PriceDisplay';
import { StarRating } from './StarRating';
import { useLikes } from '../../hooks/useLikes';
import { useCart } from '../../hooks/useCart';
import { getImageUrl, PLACEHOLDER_IMAGE } from '../../lib/utils';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isLiked, toggleLike } = useLikes();
  const { items, addItem } = useCart();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const liked = isLiked(product.id);
  const isInCart = items.some((item) => item.product.id === product.id);
  const mainImage = product.images?.[0]?.url || PLACEHOLDER_IMAGE;
  const firstVariant = product.variants?.[0] || product.sizes?.[0] || product.colors?.[0] || { id: 'default' };
  const displayName = product.name_tj || product.name_ru || product.name_en || product.name || 'Маҳсулоти беном';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) {
      window.location.href = '/cart';
    } else {
      if (firstVariant) {
        addItem(product, firstVariant as any);
      }
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(product);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/products/${product.slug}`} className="block group">
        <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800">
          <img
            src={getImageUrl(mainImage)}
            alt={displayName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
          />

          {product.discountPercent && product.discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discountPercent}%
            </div>
          )}

          {product.isNew && !product.discountPercent && (
            <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              NEW
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          <button
            onClick={handleLike}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md transition-all duration-200 hover:scale-110"
          >
            <motion.div whileTap={{ scale: 0.8 }}>
              <Heart
                className={`w-4 h-4 transition-colors ${
                  liked ? 'fill-rose-500 text-rose-500' : 'text-gray-600 dark:text-gray-300'
                }`}
              />
            </motion.div>
          </button>

          <button
            onClick={handleAddToCart}
            className={`absolute bottom-2 left-2 right-2 py-2 px-2.5 sm:py-2.5 sm:px-3 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 shadow-lg select-none ${
              isInCart
                ? 'bg-[#00c853] hover:bg-[#00b048] opacity-100 translate-y-0'
                : 'bg-rose-500 hover:bg-rose-600 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0'
            }`}
          >
            {isInCart ? (
              <>
                <span className="font-extrabold text-base">✓</span>
                <span>Дар сабад</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Ба сабад</span>
              </>
            )}
          </button>
        </div>

        <div className="p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.brand?.name || 'Без бренда'}</p>
          <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-2" title={displayName}>
            {displayName}
          </h3>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
            <PriceDisplay price={product.price} discountPrice={product.finalPrice ?? product.discountPrice} size="sm" />
            <StarRating 
              rating={(product as any).avgRating ?? product.rating ?? 0} 
              size="sm" 
              showCount 
              count={(product as any)._count?.reviews ?? product.reviewCount ?? 0} 
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
