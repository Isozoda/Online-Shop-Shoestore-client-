import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart.store';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import type { Product, ProductVariant } from '../types';

export function useCart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotal, getDiscount, getFinalTotal, getItemCount } =
    useCartStore();

  const handleAddItem = (product: Product, variant: ProductVariant, quantity = 1) => {
    if (!isAuthenticated) {
      toast((toastId) => 
        React.createElement('div', { className: 'flex flex-col gap-2 p-1' },
          React.createElement('p', { className: 'text-sm font-medium text-gray-900 dark:text-white' },
            t('auth.cartLoginRequired', 'Барои илова кардани маҳсулот ба сабад, аввал ворид шавед ё сабт шавед.')
          ),
          React.createElement('div', { className: 'flex gap-2 mt-1' },
            React.createElement('button', {
              onClick: () => {
                toast.dismiss(toastId.id);
                navigate('/login');
              },
              className: 'px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm'
            }, t('auth.login', 'Вуруд')),
            React.createElement('button', {
              onClick: () => {
                toast.dismiss(toastId.id);
                navigate('/register');
              },
              className: 'px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-lg transition-colors border border-gray-200 dark:border-slate-700'
            }, t('auth.register', 'Сабт шудан')),
            React.createElement('button', {
              onClick: () => toast.dismiss(toastId.id),
              className: 'px-3 py-1.5 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800/50 text-gray-400 text-xs font-medium rounded-lg transition-colors'
            }, t('common.cancel', 'Бекор'))
          )
        ),
        {
          duration: 5000,
          position: 'top-center',
        }
      );
      return;
    }

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
