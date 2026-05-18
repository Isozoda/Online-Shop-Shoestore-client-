import { formatPrice } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface PriceDisplayProps {
  price: number;
  discountPrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function PriceDisplay({ price, discountPrice, size = 'md', className }: PriceDisplayProps) {
  const sizeMap = {
    sm: { current: 'text-sm font-semibold', original: 'text-xs' },
    md: { current: 'text-base font-bold', original: 'text-sm' },
    lg: { current: 'text-xl font-bold', original: 'text-base' },
    xl: { current: 'text-2xl font-bold', original: 'text-lg' },
  };

  const sizes = sizeMap[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn(sizes.current, discountPrice ? 'text-rose-500' : 'text-gray-900 dark:text-white')}>
        {formatPrice(discountPrice ?? price)}
      </span>
      {discountPrice && discountPrice < price && (
        <span className={cn(sizes.original, 'text-gray-400 line-through')}>
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
}
