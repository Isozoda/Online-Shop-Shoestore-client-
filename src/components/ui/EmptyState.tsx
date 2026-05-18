import { motion } from 'framer-motion';
import { type LucideIcon, ShoppingBag } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  imageUrl?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = ShoppingBag,
  imageUrl,
  title,
  description,
  action,
}: EmptyStateProps) {
  const isCartIcon = Icon === ShoppingBag;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-12 sm:py-20 text-center px-4"
    >
      {/* Premium Visual Graphic Wrapper: Renders real top illustration image if imageUrl is provided, else circular SVG shell */}
      {imageUrl ? (
        <div className="relative mb-8 w-64 sm:w-80 mx-auto group flex flex-col items-center justify-center">
          {/* Deep immersive cosmic background glow circle matching the reference artwork precisely */}
          <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-gradient-to-br from-rose-500/20 via-purple-500/15 to-transparent border border-white/5 shadow-inner backdrop-blur-sm -z-10 transition-transform duration-700 group-hover:scale-105" />

          {/* Under-cart horizontal light beam for natural visual landing integration */}
          <div className="absolute inset-x-12 bottom-2 h-4 bg-gradient-to-r from-transparent via-rose-500/20 to-transparent blur-md rounded-full scale-x-125" />

          {/* Full-view responsive unmasked image wrapper guaranteeing perfect aspect ratio and zero edge cutoff */}
          <div className="w-full relative z-10 px-4 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-1">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-auto max-h-[220px] sm:max-h-[260px] object-contain mx-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.75)] select-none"
              loading="lazy"
            />
          </div>

          {/* Reference floating crimson accent particles */}
          <span className="absolute -top-2 right-6 w-2.5 h-2.5 rounded-full bg-rose-500/80 animate-pulse shadow-[0_0_8px_#f43f5e]" />
          <span className="absolute top-12 -left-2 w-1.5 h-1.5 rounded-full bg-rose-400/60" />
          <span className="absolute bottom-6 -right-2 w-1.5 h-1.5 rounded-full bg-purple-400/60" />
        </div>
      ) : (
        <div className="relative mb-8 group">
          {/* Ambient layered background radial gradient glows */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-rose-500/25 via-purple-500/20 to-transparent blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Soft premium glassmorphic outer shell */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-white dark:from-slate-800 to-rose-50 dark:to-slate-900/50 p-[2px] shadow-2xl shadow-rose-500/10 dark:shadow-black/50 transition-transform duration-500 group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden">
              {/* Subtle floating ambient background blobs */}
              <span className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-rose-500/10 blur-md" />
              <span className="absolute -bottom-3 -left-3 w-12 h-12 rounded-full bg-purple-500/10 blur-md" />

              {isCartIcon ? (
                /* User's exact requested modern SVG path embedded with premium multi-stop gradient stroke */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  className="w-12 h-12 sm:w-14 sm:h-14 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2"
                >
                  <defs>
                    <linearGradient id="premiumCartStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="50%" stopColor="#fb7185" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                  <path
                    stroke="url(#premiumCartStroke)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              ) : (
                /* Universal premium styling rendering wrapper for non-cart contexts (Wishlist/Orders) */
                <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                  <Icon className="w-12 h-12 sm:w-14 sm:h-14 text-rose-500 drop-shadow-sm" />
                </div>
              )}
            </div>
          </div>

          {/* Dynamic decorative visual accents */}
          <span className="absolute -top-1 right-1 w-3 h-3 rounded-full bg-rose-400 animate-pulse opacity-80 shadow-sm" />
          <span className="absolute bottom-1 -left-1 w-2.5 h-2.5 rounded-full bg-purple-400 opacity-60" />
        </div>
      )}

      {/* Modern typography structure exactly aligned with reference ecommerce layouts */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight max-w-md">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {/* Action container wrapper */}
      {action && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
