import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

interface LikesState {
  likedIds: string[];
  likedProducts: Product[];
  toggleLike: (productId: string, product?: Product) => void;
  isLiked: (productId: string) => boolean;
  setLikedProducts: (products: Product[]) => void;
  getLikeCount: () => number;
  clearLikes: () => void;
}

export const useLikesStore = create<LikesState>()(
  persist(
    (set, get) => ({
      likedIds: [],
      likedProducts: [],

      toggleLike: (productId, product) => {
        set((state) => {
          const isLiked = state.likedIds.includes(productId);
          if (isLiked) {
            return {
              likedIds: state.likedIds.filter((id) => id !== productId),
              likedProducts: state.likedProducts.filter((p) => p.id !== productId),
            };
          }
          return {
            likedIds: [...state.likedIds, productId],
            likedProducts: product
              ? [...state.likedProducts, product]
              : state.likedProducts,
          };
        });
      },

      isLiked: (productId) => get().likedIds.includes(productId),

      setLikedProducts: (products) => {
        set({
          likedProducts: products,
          likedIds: products.map((p) => p.id),
        });
      },

      getLikeCount: () => get().likedIds.length,

      clearLikes: () => set({ likedIds: [], likedProducts: [] }),
    }),
    {
      name: 'likes-storage',
    }
  )
);
