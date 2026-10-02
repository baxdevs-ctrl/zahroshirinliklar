export type Language = 'uz' | 'ru';

export interface Category {
  id: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  image: string;
  productCount: number;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  descriptionUz: string;
  descriptionRu: string;
  price: number;
  oldPrice?: number;
  categoryId: string;
  categorySlug: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  weight: string;
  ingredientsUz: string;
  ingredientsRu: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'Yangi'
  | 'Tasdiqlangan'
  | 'Tayyorlanmoqda'
  | 'Yetkazilmoqda'
  | 'Yetkazildi'
  | 'Bekor qilindi';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  comment?: string;
  paymentMethod: 'cash' | 'click' | 'payme';
  items: OrderItem[];
  subtotal: number;
  deliveryPrice: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'admin';
}

export interface StoreSettings {
  storeName: string;
  phone: string;
  email: string;
  address: string;
  deliveryPrice: number;
  freeDeliveryThreshold: number;
  telegram: string;
  instagram: string;
  tiktok: string;
  youtube: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  unreadMessages: number;
}
