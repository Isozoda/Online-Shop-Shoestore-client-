import api from './axios';
import type { Product, PaginatedResponse, ProductFilters } from '../types';

export const productsApi = {
  getAll: async (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    
    // Map frontend filters to backend DTO
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('categorySlug', filters.category);
    if (filters.brand) params.append('brandSlug', filters.brand);
    if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
    if (filters.featured !== undefined) params.append('isFeatured', String(filters.featured));
    
    if (filters.sizes && filters.sizes.length > 0) {
      filters.sizes.forEach(s => params.append('sizes', s));
    }
    
    if (filters.colors && filters.colors.length > 0) {
      filters.colors.forEach(c => params.append('colors', c));
    }
    
    if (filters.rating !== undefined) {
      params.append('rating', String(filters.rating));
    }
    
    if (filters.sort) {
      if (filters.sort === 'newest') {
        params.append('sortBy', 'createdAt');
        params.append('sortOrder', 'desc');
      } else if (filters.sort === 'price_asc') {
        params.append('sortBy', 'price');
        params.append('sortOrder', 'asc');
      } else if (filters.sort === 'price_desc') {
        params.append('sortBy', 'price');
        params.append('sortOrder', 'desc');
      } else if (filters.sort === 'popular') {
        params.append('sortBy', 'rating');
        params.append('sortOrder', 'desc');
      }
    }

    const { data } = await api.get(`/products?${params.toString()}`);
    return data;
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const { data } = await api.get(`/products/${slug}`);
    return data?.data || data;
  },

  getFeatured: async (): Promise<Product[]> => {
    try {
      const { data } = await api.get('/products/featured');
      return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getNewArrivals: async (): Promise<Product[]> => {
    try {
      const { data } = await api.get('/products?limit=6');
      return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getRelated: async (productId: string, categoryId: string): Promise<Product[]> => {
    try {
      const { data } = await api.get(`/products?categoryId=${categoryId}&limit=6`);
      const products = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      return products.filter((p: Product) => p?.id !== productId);
    } catch {
      return [];
    }
  },
};
