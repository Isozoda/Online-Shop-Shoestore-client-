import { useTranslation } from 'react-i18next';
import { X, RotateCcw } from 'lucide-react';
import { StarRating } from '../ui/StarRating';
import { useCategories, useBrands } from '../../hooks/useProducts';
import type { ProductFilters } from '../../types';

const SIZES = ['36', '37', '38', '39', '40', '41', '42'];
const COLORS = [
  { name: 'Сиёҳ', hex: '#000000' },
  { name: 'Сафед', hex: '#FFFFFF' },
  { name: 'Қаҳваранг', hex: '#8B4513' },
  { name: 'Бежевый', hex: '#F5F0E8' },
  { name: 'Сурх', hex: '#DC143C' },
  { name: 'Кабуд', hex: '#4169E1' },
  { name: 'Розовый', hex: '#FFB6C1' },
];

interface FilterSidebarProps {
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
  onClose?: () => void;
}

export function FilterSidebar({ filters, onFilterChange, onClose }: FilterSidebarProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const reset = () => {
    onFilterChange({
      category: undefined,
      brand: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sizes: [],
      colors: [],
      rating: undefined,
    });
  };

  const toggleSize = (size: string) => {
    const current = filters.sizes || [];
    const next = current.includes(size) ? current.filter((s) => s !== size) : [...current, size];
    onFilterChange({ sizes: next });
  };

  const toggleColor = (color: string) => {
    const current = filters.colors || [];
    const next = current.includes(color) ? current.filter((c) => c !== color) : [...current, color];
    onFilterChange({ colors: next });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">{t('filter.filters')}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            {t('filter.reset')}
          </button>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {categories && categories.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">{t('filter.category')}</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value=""
                checked={!filters.category}
                onChange={() => onFilterChange({ category: undefined })}
                className="accent-rose-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">{t('common.all')}</span>
            </label>
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={cat.slug}
                  checked={filters.category === cat.slug}
                  onChange={() => onFilterChange({ category: cat.slug })}
                  className="accent-rose-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {(cat as any)[`name_${lang}`] || (cat as any).name_tj || (cat as any).name_en || cat.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {brands && brands.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">{t('filter.brand')}</p>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brand === brand.slug}
                  onChange={() =>
                    onFilterChange({ brand: filters.brand === brand.slug ? undefined : brand.slug })
                  }
                  className="accent-rose-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">{brand.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">{t('filter.price')}</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="0"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 outline-none focus:border-rose-400"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            placeholder="9999"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 outline-none focus:border-rose-400"
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">{t('filter.size')}</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1 text-sm rounded-lg border transition-all ${
                (filters.sizes || []).includes(size)
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-500'
                  : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-rose-300'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">{t('filter.color')}</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              title={color.name}
              className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                (filters.colors || []).includes(color.name)
                  ? 'border-rose-500 scale-110'
                  : 'border-transparent'
              }`}
              style={{
                backgroundColor: color.hex,
                boxShadow: color.hex === '#FFFFFF' ? 'inset 0 0 0 1px #d1d5db' : undefined,
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">{t('filter.rating')}</p>
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => onFilterChange({ rating: filters.rating === r ? undefined : r })}
              className={`flex items-center gap-2 w-full px-2 py-1 rounded-lg transition-colors ${
                filters.rating === r ? 'bg-rose-50 dark:bg-rose-950/20' : 'hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              <StarRating rating={r} size="sm" />
              <span className="text-xs text-gray-500 dark:text-gray-400">ва балотар</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
