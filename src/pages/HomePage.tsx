import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategorySection } from '../components/home/CategorySection';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { CountdownTimer } from '../components/home/CountdownTimer';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { NewArrivals } from '../components/home/NewArrivals';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>ShoeStore — {t('home.hero')}</title>
        <meta name="description" content={t('home.heroSubtitle')} />
      </Helmet>

      <HeroBanner />
      <CategorySection />
      <FeaturedProducts />
      <CountdownTimer />
      <NewArrivals />
      <WhyChooseUs />
      <ReviewsSection />
    </>
  );
}
