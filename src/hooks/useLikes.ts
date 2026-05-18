import { useLikesStore } from '../store/likes.store';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import type { Product } from '../types';

export function useLikes() {
  const { t } = useTranslation();
  const { likedIds, likedProducts, toggleLike, isLiked, getLikeCount, clearLikes } = useLikesStore();

  const handleToggleLike = (product: Product) => {
    const wasLiked = isLiked(product.id);
    toggleLike(product.id, product);
    if (!wasLiked) {
      toast.success(t('product.like'));
    }
  };

  return {
    likedIds,
    likedProducts,
    toggleLike: handleToggleLike,
    isLiked,
    likeCount: getLikeCount(),
    clearLikes,
  };
}
