import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
}

function TimerBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <span className="text-2xl sm:text-3xl font-bold text-rose-500">
          {String(value).padStart(2, '0')}
        </span>
      </motion.div>
      <span className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer() {
  const { t } = useTranslation();
  const [target] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 12);
    return d;
  });
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <section className="py-12 bg-gradient-to-r from-rose-500 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-rose-100 text-sm font-medium tracking-widest uppercase mb-2">
          {t('home.limitedOffer')}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
          {t('home.countdownTitle')}
        </h2>
        <div className="flex items-center justify-center gap-4">
          <TimerBlock value={timeLeft.hours} label="соат" />
          <span className="text-3xl font-bold text-white/60 mb-6">:</span>
          <TimerBlock value={timeLeft.minutes} label="дақиқа" />
          <span className="text-3xl font-bold text-white/60 mb-6">:</span>
          <TimerBlock value={timeLeft.seconds} label="сония" />
        </div>
      </div>
    </section>
  );
}
