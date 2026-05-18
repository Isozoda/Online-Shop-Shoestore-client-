export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Category {
  id: string;
  name?: string;
  name_tj?: string;
  name_ru?: string;
  name_en?: string;
  slug: string;
  image?: string;
  description?: string;
  productCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name?: string;
  name_tj?: string;
  name_ru?: string;
  name_en?: string;
  slug: string;
  description_tj?: string;
  description_ru?: string;
  description_en?: string;
  description?: string;
  price: number;
  finalPrice?: number;
  discountPrice?: number;
  discountPercent?: number;
  sku: string;
  stock: number;
  images: ProductImage[];
  category: Category;
  brand?: Brand;
  variants?: ProductVariant[];
  sizes?: { id: string; size: string; stock: number }[];
  colors?: { id: string; name_tj?: string; name_ru?: string; name_en?: string; hexCode: string }[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  tags: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  user: User;
  product?: any;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  discount: number;
  finalTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  user?: User;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  contactMethod: 'telegram' | 'whatsapp';
  name: string;
  phone: string;
  address: string;
  note?: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  buttonText?: string;
}

export interface StoreSettings {
  storeName: string;
  phone: string;
  telegram: string;
  whatsapp: string;
  address: string;
  workingHours: string;
  currency: string;
  logo?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  rating?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  page?: number;
  limit?: number;
  featured?: boolean;
  isNew?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
}

export interface OrderPayload {
  clientName: string;
  clientPhone: string;
  clientAddress?: string;
  note?: string;
  contactMethod: 'TELEGRAM' | 'WHATSAPP';
  items: {
    productId: string;
    quantity: number;
    size: string;
    colorName: string;
  }[];
  userId?: string;
}
