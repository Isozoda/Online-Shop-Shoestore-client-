import { useCartStore } from '../store/cart.store';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import type { Product, ProductVariant } from '../types';

export function useCart() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotal, getDiscount, getFinalTotal, getItemCount } =
    useCartStore();

  const handleAddItem = (product: Product, variant: ProductVariant, quantity = 1) => {
    addItem(product, variant, quantity);
    toast.success(t('product.addToCart'));
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity);
  };

  return {
    items,
    isAuthenticated,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    clearCart,
    total: getTotal(),
    discount: getDiscount(),
    finalTotal: getFinalTotal(),
    itemCount: getItemCount(),
  };
}
