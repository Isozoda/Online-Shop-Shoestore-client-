import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showCount = false,
  count,
  interactive = false,
  onRate,
}: StarRatingProps) {
  const sizeMap = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const iconSize = sizeMap[size];

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const partial = !filled && i < rating;
          return (
            <button
              key={i}
              type={interactive ? 'button' : undefined}
              onClick={interactive && onRate ? () => onRate(i + 1) : undefined}
              className={cn(
                'relative',
                interactive && 'cursor-pointer hover:scale-110 transition-transform'
              )}
            >
              <Star
                className={cn(
                  iconSize,
                  filled || partial ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'
                )}
              />
              {partial && (
                <Star
                  className={cn(iconSize, 'text-amber-400 fill-amber-400 absolute inset-0')}
                  style={{ clipPath: `inset(0 ${(1 - (rating % 1)) * 100}% 0 0)` }}
                />
              )}
            </button>
          );
        })}
      </div>
      {showCount && count !== undefined && (
        <span className="text-sm text-gray-500 dark:text-gray-400">({count})</span>
      )}
      {showCount && count === undefined && (
        <span className="text-sm text-gray-500 dark:text-gray-400">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
