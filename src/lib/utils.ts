import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: any): string {
  let amount = 0;
  if (typeof price === 'number') {
    amount = price;
  } else if (price !== null && price !== undefined) {
    const str = typeof price === 'object' && price.toString ? price.toString() : String(price);
    const cleaned = str.replace(/[^0-9.]/g, '');
    amount = parseFloat(cleaned) || 0;
  }

  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' сомонӣ';
}

export function calculateDiscount(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export const PLACEHOLDER_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><rect width='80' height='80' fill='%23F1F5F9'/><rect x='25' y='25' width='30' height='30' rx='5' stroke='%23CBD5E1' stroke-width='2' fill='none'/><circle cx='35' cy='35' r='3' fill='%23CBD5E1'/><path d='M25,48 L35,38 L45,48 L50,43 L55,48' stroke='%23CBD5E1' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>";

export function getImageUrl(path: string): string {
  if (!path) return PLACEHOLDER_IMAGE;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  const apiUrl = import.meta.env.VITE_API_URL || '';
  let baseUrl = apiUrl.replace(/\/api\/?$/, '');
  
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
