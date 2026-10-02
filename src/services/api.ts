import type {
  Category,
  Product,
  Order,
  ContactMessage,
  StoreSettings,
  DashboardStats,
  AdminUser,
} from '../types/index.ts';

const BASE_URL = '/api';

export const api = {
  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${BASE_URL}/categories`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch categories');
    return data.data;
  },

  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    sort?: string;
  }): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== 'all') searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.featured) searchParams.append('featured', 'true');
    if (params?.sort) searchParams.append('sort', params.sort);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await fetch(`${BASE_URL}/products${query}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch products');
    return data.data;
  },

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch product');
    return data.data;
  },

  // Orders
  async createOrder(orderData: {
    customerName: string;
    phone: string;
    address: string;
    deliveryDate: string;
    deliveryTime: string;
    comment?: string;
    paymentMethod: 'cash' | 'click' | 'payme';
    items: { productId: string; productName: string; quantity: number; price: number; image: string }[];
    subtotal: number;
    deliveryPrice: number;
    total: number;
  }): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to create order');
    return data.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Order not found');
    return data.data;
  },

  // Contacts
  async sendContact(payload: {
    name: string;
    phone: string;
    email?: string;
    message: string;
  }): Promise<ContactMessage> {
    const res = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to send message');
    return data.data;
  },

  // Settings
  async getSettings(): Promise<StoreSettings> {
    const res = await fetch(`${BASE_URL}/settings`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch settings');
    return data.data;
  },

  // Admin Auth
  async login(credentials: { username: string; password: string }): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Kirishda xatolik');
    return { token: data.token, user: data.user };
  },

  async getMe(token: string): Promise<AdminUser> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Unauthorized');
    return data.user;
  },

  // Admin Data operations
  async getStats(token: string): Promise<DashboardStats> {
    const res = await fetch(`${BASE_URL}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async getOrders(token: string): Promise<Order[]> {
    const res = await fetch(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async updateOrderStatus(id: string, status: string, token: string): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async getContacts(token: string): Promise<ContactMessage[]> {
    const res = await fetch(`${BASE_URL}/contact`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async markContactRead(id: string, token: string): Promise<ContactMessage> {
    const res = await fetch(`${BASE_URL}/contact/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async deleteContact(id: string, token: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/contact/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.success;
  },

  async createProduct(productData: Partial<Product>, token: string): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async updateProduct(id: string, productData: Partial<Product>, token: string): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async deleteProduct(id: string, token: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.success;
  },

  async createCategory(catData: Partial<Category>, token: string): Promise<Category> {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(catData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async updateCategory(id: string, catData: Partial<Category>, token: string): Promise<Category> {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(catData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async deleteCategory(id: string, token: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.success;
  },

  async updateSettings(settings: Partial<StoreSettings>, token: string): Promise<StoreSettings> {
    const res = await fetch(`${BASE_URL}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },
};
