import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products.api';
import { categoriesApi } from '../api/categories.api';
import { brandsApi } from '../api/brands.api';
import type { ProductFilters } from '../types';

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: productsApi.getFeatured,
    staleTime: 5 * 60 * 1000,
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ['products', 'new'],
    queryFn: productsApi.getNewArrivals,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRelatedProducts(productId: string, categoryId: string) {
  return useQuery({
    queryKey: ['products', 'related', productId],
    queryFn: () => productsApi.getRelated(productId, categoryId),
    enabled: !!productId && !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    staleTime: 10 * 60 * 1000,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: brandsApi.getAll,
    staleTime: 10 * 60 * 1000,
  });
}
