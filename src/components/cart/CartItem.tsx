import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPrice, getImageUrl, PLACEHOLDER_IMAGE } from '../../lib/utils';
import { useCartStore } from '../../store/cart.store';
import type { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { updateQuantity, removeItem } = useCartStore();

  const displayName = (((item.product as any)[`name_${lang}`] || item.product.name_tj || item.product.name_ru || item.product.name_en || item.product.name || 'Product') as string);
  const dp = item.product.finalPrice ?? item.product.discountPrice;
  const itemPrice = dp ?? item.product.price;

  // Extract color name if available
  const colorName = item.variant.color || 
    item.product.colors?.find(c => c.hexCode === item.variant.colorHex)?.name_en || 
    item.product.colors?.find(c => c.hexCode === item.variant.colorHex)?.name_tj ||
    '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white dark:bg-slate-900 p-4 md:px-6 md:py-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-all hover:shadow-md"
    >
      {/* Desktop & Table View columns */}
      <div className="md:col-span-5 flex items-center gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 flex-shrink-0 border border-gray-50 dark:border-slate-700/50">
          <img
            src={getImageUrl(item.product.images?.[0]?.url || PLACEHOLDER_IMAGE)}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate" title={displayName}>
            {displayName}
          </h4>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
            {colorName ? (
              <span>Color: {colorName}</span>
            ) : item.variant.colorHex ? (
              <span className="flex items-center gap-1">
                Color:
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full border border-gray-300"
                  style={{ backgroundColor: item.variant.colorHex }}
                />
              </span>
            ) : null}
            {item.variant.size && (
              <span>{colorName || item.variant.colorHex ? ' | ' : ''}Size: {item.variant.size}</span>
            )}
          </div>
        </div>
      </div>

      {/* Price column */}
      <div className="hidden md:block md:col-span-2 text-center">
        <span className="text-rose-500 font-bold text-sm sm:text-base">
          {formatPrice(itemPrice)}
        </span>
      </div>

      {/* Quantity controls column */}
      <div className="hidden md:flex md:col-span-3 justify-center">
        <div className="inline-flex items-center border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="px-3 py-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-semibold text-sm text-gray-900 dark:text-white border-x border-gray-100 dark:border-slate-700 py-1.5">
            {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-3 py-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subtotal & Remove button column */}
      <div className="hidden md:flex md:col-span-2 items-center justify-end gap-3">
        <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">
          {formatPrice(itemPrice * item.quantity)}
        </span>
        <button
          onClick={() => removeItem(item.id)}
          className="w-9 h-9 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all flex-shrink-0"
          title={t('cart.remove', 'Remove')}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile fallback layout */}
      <div className="flex md:hidden flex-col gap-3 pt-3 mt-1 border-t border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{t('filter.price', 'Price')}:</span>
          <span className="text-rose-500 font-bold text-sm">{formatPrice(itemPrice)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{t('cart.quantity', 'Quantity')}:</span>
          <div className="inline-flex items-center border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-2.5 py-1 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center font-medium text-xs border-x border-gray-100 dark:border-slate-700 py-1 text-gray-900 dark:text-white">
              {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2.5 py-1 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1 font-semibold">
          <span className="text-xs text-gray-500">{t('cart.subtotal', 'Total')}:</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-900 dark:text-white text-sm">{formatPrice(itemPrice * item.quantity)}</span>
            <button
              onClick={() => removeItem(item.id)}
              className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
