import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ShoppingBag, Heart, User, Grid3X3, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../store/cart.store';
import { useLikesStore } from '../../store/likes.store';
import { useAuth } from '../../hooks/useAuth';

export function BottomNav() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const itemCount = useCartStore((s) => s.getItemCount());
  const likeCount = useLikesStore((s) => s.getLikeCount());
  const { isAuthenticated } = useAuth();

  const tabs = [
    {
      to: '/',
      end: true,
      icon: Home,
      label: t('nav.home'),
    },
    {
      to: '/products',
      end: false,
      icon: Grid3X3,
      label: t('nav.products'),
    },
    {
      to: '/cart',
      end: false,
      icon: ShoppingBag,
      label: t('nav.cart', 'Сабад'),
      badge: itemCount,
    },
    {
      to: '/wishlist',
      end: false,
      icon: Heart,
      label: t('nav.wishlist', 'Дӯстдошта'),
      badge: likeCount,
    },
    {
      to: isAuthenticated ? '/profile' : '/login',
      end: false,
      icon: isAuthenticated ? User : LogIn,
      label: isAuthenticated ? t('nav.profile', 'Профил') : t('nav.login', 'Вуруд'),
    },
  ];

  return (
    <>
      {/* Bottom Tab Bar — mobile only */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Glass background */}
        <div className="
          relative
          bg-white/85 dark:bg-slate-950/90
          backdrop-blur-xl
          border-t border-gray-200/60 dark:border-slate-800/60
          shadow-[0_-8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.3)]
        ">
          <div className="flex items-center h-16 px-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className="flex-1 h-full"
              >
                {({ isActive }) => (
                  <div
                    className={`
                      flex flex-col items-center justify-center h-full gap-1 relative
                      transition-colors duration-200
                      ${isActive
                        ? 'text-rose-500'
                        : 'text-gray-500 dark:text-gray-400 active:text-rose-400'
                      }
                    `}
                  >
                    {/* Active pill indicator */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="activeTabPill"
                          className="absolute top-2 w-8 h-1 bg-rose-500 rounded-full"
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          exit={{ opacity: 0, scaleX: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                    </AnimatePresence>

                    <motion.div
                      whileTap={{ scale: 0.80 }}
                      animate={isActive ? { scale: 1.08 } : { scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="relative flex items-center justify-center mt-1"
                    >
                      {isActive ? (
                        <div className="w-9 h-9 bg-rose-50 dark:bg-rose-950/40 rounded-xl flex items-center justify-center">
                          <tab.icon className="w-[20px] h-[20px] fill-rose-500/20 stroke-rose-500" strokeWidth={2} />
                        </div>
                      ) : (
                        <tab.icon className="w-[22px] h-[22px]" strokeWidth={1.75} />
                      )}

                      {/* Badge */}
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <motion.span
                          key={tab.badge}
                          initial={{ scale: 1.4 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm"
                        >
                          {tab.badge > 9 ? '9+' : tab.badge}
                        </motion.span>
                      )}
                    </motion.div>

                    <span
                      className={`text-[10px] font-medium leading-none tracking-tight transition-all duration-200 ${
                        isActive ? 'font-semibold' : ''
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
