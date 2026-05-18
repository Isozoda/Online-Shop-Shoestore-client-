import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, RefreshCw, Trash2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyState } from '../components/ui/EmptyState';
import { useCartStore } from '../store/cart.store';

export function CartPage() {
  const { t } = useTranslation();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const applyCoupon = useCartStore((s) => s.applyCoupon);

  const [couponInput, setCouponInput] = useState('');

  const handleUpdateCart = () => {
    toast.success(t('cart.updated', 'Сабад бомуваффақият навсозӣ шуд'));
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      toast.error(t('cart.enterCoupon', 'Рамзи купонро ворид кунед'));
      return;
    }
    const success = applyCoupon(couponInput);
    if (success) {
      toast.success(`${t('cart.couponApplied', 'Купон татбиқ шуд')}: ${couponInput.toUpperCase()}`);
      setCouponInput('');
    }
  };

  return (
    <>
      <Helmet>
        <title>ShoeStore — {t('nav.cart', 'Сабад')}</title>
      </Helmet>

      <div className="pt-20 min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Top Breadcrumb Header exactly as reference image */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
            <Link to="/" className="hover:text-rose-500 transition-colors">
              {t('nav.home', 'Асосӣ')}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-semibold">
              {t('nav.cart', 'Сабад')}
            </span>
          </div>

          {items.length === 0 ? (
            <EmptyState
              imageUrl="/empty-cart.png"
              title={t('cart.empty', 'Сабади шумо холӣ аст')}
              description={t('cart.emptyFullDesc', 'Маҳсулотеро ба сабад илова кунед ва хариди худро оғоз намоед.')}
              action={
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#ff1453] text-white font-bold px-8 py-3.5 rounded-full hover:bg-[#e00d44] transition-all shadow-lg hover:shadow-[#ff1453]/25 tracking-wide text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <span>{t('cart.continueShopping', 'Идома додан')}</span>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Side: Table Structure & Controls */}
              <div className="lg:col-span-2">
                {/* Table Header Strip */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-center bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                  <div className="col-span-5">{t('nav.products', 'Маҳсулот')}</div>
                  <div className="col-span-2 text-center">{t('filter.price', 'Нарх')}</div>
                  <div className="col-span-3 text-center">{t('cart.quantity', 'Миқдор')}</div>
                  <div className="col-span-2 text-right">{t('cart.subtotal', 'Зерҷамъ:')}</div>
                </div>

                {/* Standalone Cart Item Rows */}
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Bottom Action Buttons Row 1 */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-2">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600 transition-all shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t('cart.returnToShop', 'Ба мағоза баргардед')}
                  </Link>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleUpdateCart}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600 transition-all shadow-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {t('cart.updateCart', 'Сабадро навсозӣ кунед')}
                    </button>

                    <button
                      onClick={clearCart}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-rose-100 dark:border-rose-950/30 bg-rose-50/20 dark:bg-rose-950/10 text-rose-500 text-sm font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t('cart.clearCart', 'Ҳамаро нест кардан')}
                    </button>
                  </div>
                </div>

                {/* Bottom Coupon Row 2 */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <div className="relative flex-1 sm:max-w-xs">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Tag className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder={t('cart.couponPlaceholder', 'Рамзи купон')}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 transition-all shadow-sm"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="px-6 py-3 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow-md flex-shrink-0"
                  >
                    {t('filter.apply', 'Татбиқ кардан')}
                  </button>
                </div>
              </div>

              {/* Right Side: Cart Summary Card */}
              <CartSummary />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
