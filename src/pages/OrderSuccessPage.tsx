import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';

export function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>ShoeStore — {t('order.success')}</title>
      </Helmet>

      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-6"
          >
            <div className="inline-flex p-6 rounded-full bg-emerald-50 dark:bg-emerald-950/20">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {t('order.success')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-2">{t('order.successDesc')}</p>
            {id && (
              <p className="text-sm font-medium text-rose-500 mb-8">
                {t('order.orderNumber')}: #{id.slice(-8).toUpperCase()}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/products"
                className="flex items-center justify-center gap-2 bg-rose-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-rose-600 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                {t('cart.continueShopping')}
              </Link>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 font-semibold px-6 py-3 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Home className="w-4 h-4" />
                {t('nav.home')}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
