import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { ProductGrid } from '../components/products/ProductGrid';
import { FilterSidebar } from '../components/products/FilterSidebar';
import { SortSelect } from '../components/products/SortSelect';
import { useProducts } from '../hooks/useProducts';
import { debounce } from '../lib/utils';
import type { ProductFilters } from '../types';

export function ProductsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const getFilters = (): ProductFilters => ({
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sizes: searchParams.getAll('sizes'),
    colors: searchParams.getAll('colors'),
    rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
    sort: (searchParams.get('sort') as ProductFilters['sort']) || 'newest',
    featured: searchParams.get('featured') === 'true',
    page: Number(searchParams.get('page')) || 1,
    limit: 20,
  });

  const filters = getFilters();
  const { data, isLoading } = useProducts(filters);

  const updateFilter = (updates: Partial<ProductFilters>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) {
          next.delete(k);
        } else if (Array.isArray(v)) {
          next.delete(k);
          v.forEach((item) => next.append(k, item));
        } else {
          next.set(k, String(v));
        }
      });
      next.delete('page');
      return next;
    });
  };

  const debouncedSearch = useCallback(
    debounce((q: string) => updateFilter({ search: q || undefined }), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <>
      <Helmet>
        <title>ShoeStore — {t('nav.products')}</title>
      </Helmet>

      <div className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder={t('filter.search')}
                className="w-full pl-4 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm outline-none focus:border-rose-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-gray-700 dark:text-gray-200"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {t('filter.filters')}
              </button>
              <SortSelect
                value={filters.sort || 'newest'}
                onChange={(sort) => updateFilter({ sort: sort as ProductFilters['sort'] })}
              />
            </div>
          </div>

          <div className="flex gap-6">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <FilterSidebar filters={filters} onFilterChange={updateFilter} />
            </aside>

            <div className="flex-1 min-w-0">
              <ProductGrid
                products={data?.data}
                isLoading={isLoading}
                total={data?.total}
              />

              {data && data.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => updateFilter({ page })}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        page === (filters.page || 1)
                          ? 'bg-rose-500 text-white'
                          : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 hover:border-rose-300 border border-gray-200 dark:border-slate-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setMobileFilterOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gray-50 dark:bg-slate-950 overflow-y-auto p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{t('filter.filters')}</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                onFilterChange={(f) => {
                  updateFilter(f);
                  setMobileFilterOpen(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
