import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductVariant } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  appliedCoupon: string | null;
  couponDiscountPercent: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotal: () => number;
  getDiscount: () => number;
  getCouponDiscount: () => number;
  getFinalTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,
      couponDiscountPercent: 0,

      applyCoupon: (code: string) => {
        const cleanCode = code.trim().toUpperCase();
        if (!cleanCode) return false;
        
        let percent = 10; // default 10% for any valid coupon code
        if (cleanCode === 'SALE20') percent = 20;
        if (cleanCode === 'SALE30') percent = 30;
        if (cleanCode === 'BMW') percent = 25;

        set({ appliedCoupon: cleanCode, couponDiscountPercent: percent });
        return true;
      },

      removeCoupon: () => {
        set({ appliedCoupon: null, couponDiscountPercent: 0 });
      },

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.variant.id === variant.id
          );
          if (existingIndex >= 0) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
            return { items: updated };
          }
          return {
            items: [
              ...state.items,
              {
                id: `${product.id}-${variant.id}-${Date.now()}`,
                product,
                variant,
                quantity,
              },
            ],
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== itemId) }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [], appliedCoupon: null, couponDiscountPercent: 0 }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getDiscount: () => {
        return get().items.reduce((sum, item) => {
          const dp = item.product.finalPrice ?? item.product.discountPrice;
          const discount = dp
            ? (item.product.price - dp) * item.quantity
            : 0;
          return sum + discount;
        }, 0);
      },

      getCouponDiscount: () => {
        const baseTotalAfterProductDiscounts = get().items.reduce(
          (sum, item) =>
            sum + (item.product.finalPrice ?? item.product.discountPrice ?? item.product.price) * item.quantity,
          0
        );
        const percent = get().couponDiscountPercent;
        if (!percent) return 0;
        return Math.round((baseTotalAfterProductDiscounts * percent) / 100);
      },

      getFinalTotal: () => {
        const baseTotalAfterProductDiscounts = get().items.reduce(
          (sum, item) =>
            sum + (item.product.finalPrice ?? item.product.discountPrice ?? item.product.price) * item.quantity,
          0
        );
        const couponDisc = get().getCouponDiscount();
        return Math.max(0, baseTotalAfterProductDiscounts - couponDisc);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
