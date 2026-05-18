import { ProductCard } from '../ui/ProductCard';
import { ProductGridSkeleton } from '../ui/LoadingSkeleton';
import { EmptyState } from '../ui/EmptyState';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import type { Product } from '../../types';

interface ProductGridProps {
  products: Product[] | undefined;
  isLoading: boolean;
  total?: number;
}

export function ProductGrid({ products, isLoading, total }: ProductGridProps) {
  const { t } = useTranslation();

  if (isLoading) return <ProductGridSkeleton count={12} />;

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title={t('common.error')}
        description="Маҳсулоте ёфт нашуд"
      />
    );
  }

  return (
    <div>
      {total !== undefined && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {total} {t('filter.results')}
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </div>
  );
}
