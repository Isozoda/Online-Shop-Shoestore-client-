import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

export function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      <Header />

      {/* Extra bottom padding on mobile so content clears the fixed bottom nav */}
      <main className="flex-1 pb-16 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer — hidden on mobile (bottom nav replaces it visually) */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  );
}
