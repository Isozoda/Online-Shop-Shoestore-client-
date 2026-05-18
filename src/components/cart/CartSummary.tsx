import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cart.store';

export function CartSummary() {
  const { t } = useTranslation();
  
  // Calculate the raw subtotal of items (sum of highlighted prices * quantity)
  const rowsSubtotal = useCartStore((s) => 
    s.items.reduce((sum, item) => sum + (item.product.finalPrice ?? item.product.discountPrice ?? item.product.price) * item.quantity, 0)
  );
  
  const couponDiscount = useCartStore((s) => s.getCouponDiscount());
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const finalTotal = useCartStore((s) => s.getFinalTotal());

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 shadow-sm border border-gray-100 dark:border-slate-800 sticky top-24 transition-all">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
        {t('cart.summaryTitle', 'Ҷамъи сабад')}
      </h3>

      <div className="space-y-4 mb-6">
        {/* Subtotal row */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {t('cart.subtotalLabel', 'Зерҷамъ:')}
          </span>
          <span className="font-bold text-gray-900 dark:text-white">
            {formatPrice(rowsSubtotal)}
          </span>
        </div>

        {/* Shipping row */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {t('cart.shippingLabel', 'Расонидан:')}
          </span>
          <span className="font-bold text-emerald-500">
            {t('cart.freeShipping', 'Ройгон')}
          </span>
        </div>

        {/* Coupon Discount row if applied */}
        {couponDiscount > 0 && appliedCoupon && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {t('cart.couponApplied', 'Купон')} ({appliedCoupon}):
            </span>
            <span className="font-bold text-rose-500">
              -{formatPrice(couponDiscount)}
            </span>
          </div>
        )}

        {/* Dashed divider line */}
        <div className="border-b border-dashed border-gray-200 dark:border-slate-700 pt-2" />

        {/* Total row */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-base font-bold text-gray-900 dark:text-white">
            {t('cart.totalLabel', 'Ҷамъ:')}
          </span>
          <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(finalTotal)}
          </span>
        </div>
      </div>

      <Link
        to="/checkout"
        className="w-full block text-center bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm hover:shadow-md"
      >
        {t('cart.proceedToCheckout', 'Ба пардохт гузаред')}
      </Link>
    </div>
  );
}
