import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { bannersApi } from '../../api/banners.api';
import { getImageUrl } from '../../lib/utils';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const fallbackBanners = [
  {
    id: '1',
    title: 'Пойафзоли занона',
    subtitle: 'Коллексияи нав 2025',
    image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1920&q=80',
    buttonText: 'Ҳоло харед',
    link: '/products',
  },
  {
    id: '2',
    title: 'Стиль ва Сифат',
    subtitle: 'Тахфифот то -50%',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1920&q=80',
    buttonText: 'Маҳсулотҳо',
    link: '/products',
  },
  {
    id: '3',
    title: 'Коллексияи Баҳор',
    subtitle: 'Нав ва ба мӯд',
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1920&q=80',
    buttonText: 'Дидан',
    link: '/products',
  },
];

export function HeroBanner() {
  const { t } = useTranslation();
  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: bannersApi.getAll,
    staleTime: 10 * 60 * 1000,
  });

  const slides = (banners && banners.length > 0 ? banners : fallbackBanners) as typeof fallbackBanners;

  return (
    <div className="relative h-screen min-h-[600px] overflow-hidden bg-black">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ 
          clickable: true,
          renderBullet: (_, className) => {
            return `<span class="${className} custom-swiper-bullet"></span>`;
          }
        }}
        navigation={{
          prevEl: '.hero-prev',
          nextEl: '.hero-next',
        }}
        loop
        className="h-full group"
      >
        {slides.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative h-full w-full overflow-hidden">
              {/* Image with subtle ambient zoom effect */}
              <div className="absolute inset-0 w-full h-full transition-transform duration-[10000ms] ease-out scale-100 group-hover:scale-105">
                <img
                  src={getImageUrl(banner.image)}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Cinematic dark gradients for perfect premium text contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent dark:from-black/90 dark:via-black/60 dark:to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center z-10">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="max-w-xl"
                  >
                    {banner.subtitle && (
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-[2px] bg-rose-500 rounded-full" />
                        <p className="text-rose-400 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase">
                          {banner.subtitle}
                        </p>
                      </div>
                    )}
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-8 font-sans drop-shadow-sm">
                      {banner.title}
                    </h1>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-block"
                    >
                      <Link
                        to={banner.link || '/products'}
                        className="group/btn inline-flex items-center gap-4 bg-white hover:bg-rose-500 text-gray-900 hover:text-white font-bold pl-8 pr-2 py-2 rounded-full transition-all duration-300 shadow-xl hover:shadow-rose-500/25 text-xs sm:text-sm tracking-widest uppercase"
                      >
                        <span>{banner.buttonText || t('home.heroButton')}</span>
                        <span className="w-10 h-10 rounded-full bg-gray-100 group-hover/btn:bg-rose-600 flex items-center justify-center transition-colors">
                          <ArrowRight className="w-4 h-4 text-gray-900 group-hover/btn:text-white transition-colors" />
                        </span>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Minimalist Glassmorphic Navigation Buttons */}
        <button
          type="button"
          aria-label="Previous slide"
          className="hero-prev absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 hover:bg-white/20 dark:hover:bg-white/10 text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          className="hero-next absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 hover:bg-white/20 dark:hover:bg-white/10 text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
        </button>

        {/* Injected inline CSS overrides for absolute perfection */}
        <style>{`
          /* Completely hide Swiper default arrow indicators */
          .swiper-button-next, .swiper-button-prev {
            display: none !important;
          }
          /* Premium horizontal expandable dash indicators */
          .custom-swiper-bullet {
            width: 32px !important;
            height: 3px !important;
            border-radius: 2px !important;
            background: rgba(255, 255, 255, 0.3) !important;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
            cursor: pointer;
            display: block;
          }
          .custom-swiper-bullet.swiper-pagination-bullet-active {
            background: #f43f5e !important;
            width: 64px !important;
            background-image: linear-gradient(to right, #f43f5e, #fb7185) !important;
            box-shadow: 0 0 12px rgba(244, 63, 94, 0.4);
          }
          .swiper-pagination-bullets {
            bottom: 40px !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 8px !important;
            z-index: 30 !important;
          }
        `}</style>
      </Swiper>
    </div>
  );
}
