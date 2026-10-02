import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db, verifyPassword } from './db.ts';

export const apiRouter = Router();

// Simple in-memory token store for admin sessions
const sessions = new Map<string, { userId: string; username: string; expiresAt: number }>();

function generateToken(userId: string, username: string): string {
  const token = 'zh_' + crypto.randomBytes(32).toString('hex');
  // Valid for 7 days
  sessions.set(token, {
    userId,
    username,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  return token;
}

// Authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  const session = sessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) sessions.delete(token);
    return res.status(401).json({ success: false, error: 'Unauthorized: Session expired or invalid' });
  }

  (req as any).user = session;
  next();
}

/* ========================================================
   AUTH ROUTES
   ======================================================== */
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }

    const admin = db.getAdminByUsername(username);
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Noto‘g‘ri login yoki parol' });
    }

    const isValid = verifyPassword(password, admin.passwordHash, admin.salt);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Noto‘g‘ri login yoki parol' });
    }

    const token = generateToken(admin.id, admin.username);
    return res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/auth/me', requireAdmin, (req: Request, res: Response) => {
  const user = (req as any).user;
  const admin = db.getAdminByUsername(user.username);
  if (!admin) {
    return res.status(404).json({ success: false, error: 'Admin not found' });
  }
  return res.json({
    success: true,
    user: {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
    },
  });
});

/* ========================================================
   CATEGORY ROUTES
   ======================================================== */
apiRouter.get('/categories', (req: Request, res: Response) => {
  try {
    const categories = db.getCategories();
    return res.json({ success: true, data: categories });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/categories', requireAdmin, (req: Request, res: Response) => {
  try {
    const { nameUz, nameRu, image, slug } = req.body;
    if (!nameUz || !nameRu) {
      return res.status(400).json({ success: false, error: 'Kategoriya nomlari talab qilinadi' });
    }
    const catSlug = slug || nameUz.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat = db.createCategory({
      nameUz,
      nameRu,
      slug: catSlug,
      image: image || '/src/assets/images/cat_chocolate_cake_1790917450877.jpg',
      productCount: 0,
    });
    return res.status(201).json({ success: true, data: newCat });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/categories/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Kategoriya topilmadi' });
    }
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/categories/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = db.deleteCategory(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Kategoriya topilmadi' });
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* ========================================================
   PRODUCT ROUTES
   ======================================================== */
apiRouter.get('/products', (req: Request, res: Response) => {
  try {
    const { category, search, featured, sort } = req.query;
    const products = db.getProducts({
      categoryId: typeof category === 'string' ? category : undefined,
      search: typeof search === 'string' ? search : undefined,
      featured: featured === 'true',
      sort: typeof sort === 'string' ? sort : undefined,
    });
    return res.json({ success: true, data: products, count: products.length });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/products/:id', (req: Request, res: Response) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Mahsulot topilmadi' });
    }
    return res.json({ success: true, data: product });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/products', requireAdmin, (req: Request, res: Response) => {
  try {
    const { nameUz, nameRu, descriptionUz, descriptionRu, price, categoryId, image } = req.body;
    if (!nameUz || !nameRu || !price || !categoryId) {
      return res.status(400).json({ success: false, error: 'Majburiy maydonlar to‘ldirilmadi' });
    }
    const cat = db.getCategoryById(categoryId);
    const newProd = db.createProduct({
      nameUz,
      nameRu,
      descriptionUz: descriptionUz || '',
      descriptionRu: descriptionRu || '',
      price: Number(price),
      oldPrice: req.body.oldPrice ? Number(req.body.oldPrice) : undefined,
      categoryId,
      categorySlug: cat?.slug || 'boshqa',
      image: image || '/src/assets/images/hero_pink_cake_1790917416304.jpg',
      images: req.body.images || [image || '/src/assets/images/hero_pink_cake_1790917416304.jpg'],
      rating: req.body.rating ? Number(req.body.rating) : 5.0,
      reviewCount: 1,
      stock: req.body.stock ? Number(req.body.stock) : 20,
      weight: req.body.weight || '1 kg',
      ingredientsUz: req.body.ingredientsUz || 'Tabiiy mahsulotlar',
      ingredientsRu: req.body.ingredientsRu || 'Натуральные ингредиенты',
      isFeatured: req.body.isFeatured === true,
      isActive: req.body.isActive !== false,
      slug: req.body.slug,
    });
    return res.status(201).json({ success: true, data: newProd });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Mahsulot topilmadi' });
    }
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Mahsulot topilmadi' });
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* ========================================================
   ORDER ROUTES
   ======================================================== */
apiRouter.post('/orders', (req: Request, res: Response) => {
  try {
    const {
      customerName,
      phone,
      address,
      deliveryDate,
      deliveryTime,
      comment,
      paymentMethod,
      items,
      subtotal,
      deliveryPrice,
      total,
    } = req.body;

    if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Iltimos, ismingiz, telefoningiz, manzilingiz va xarid savatini tekshiring',
      });
    }

    const order = db.createOrder({
      customerName,
      phone,
      address,
      deliveryDate: deliveryDate || new Date().toISOString().split('T')[0],
      deliveryTime: deliveryTime || '14:00 - 16:00',
      comment: comment || '',
      paymentMethod: paymentMethod || 'cash',
      items,
      subtotal: Number(subtotal),
      deliveryPrice: Number(deliveryPrice || 0),
      total: Number(total),
    });

    return res.status(201).json({ success: true, data: order });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/orders', requireAdmin, (req: Request, res: Response) => {
  try {
    const orders = db.getOrders();
    return res.json({ success: true, data: orders });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/orders/:id', (req: Request, res: Response) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Buyurtma topilmadi' });
    }
    return res.json({ success: true, data: order });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = db.updateOrderStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Buyurtma topilmadi' });
    }
    return res.json({ success: true, data: order });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* ========================================================
   CONTACT ROUTES
   ======================================================== */
apiRouter.post('/contact', (req: Request, res: Response) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        error: 'Ism, telefon raqam va xabar matni talab qilinadi',
      });
    }

    const saved = db.createContact({
      name,
      phone,
      email: email || '',
      message,
    });
    return res.status(201).json({ success: true, data: saved });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/contact', requireAdmin, (req: Request, res: Response) => {
  try {
    const messages = db.getContacts();
    return res.json({ success: true, data: messages });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/contact/:id/read', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.markContactRead(req.params.id);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Xabar topilmadi' });
    }
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/contact/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = db.deleteContact(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Xabar topilmadi' });
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* ========================================================
   SETTINGS & STATS
   ======================================================== */
apiRouter.get('/settings', (req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    return res.json({ success: true, data: settings });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/stats', requireAdmin, (req: Request, res: Response) => {
  try {
    const stats = db.getStats();
    return res.json({ success: true, data: stats });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
