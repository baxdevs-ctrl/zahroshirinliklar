import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  Category,
  Product,
  Order,
  ContactMessage,
  AdminUser,
  StoreSettings,
  DashboardStats,
} from '../types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

interface Schema {
  categories: Category[];
  products: Product[];
  orders: Order[];
  contacts: ContactMessage[];
  admins: (AdminUser & { passwordHash: string; salt: string })[];
  settings: StoreSettings;
}

// Password hashing utilities using Node built-in crypto
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, actualSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: actualSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const check = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return check === hash;
}

// Initial seed data
const initialCategories: Category[] = [
  {
    id: 'cat-1',
    slug: 'tortlar',
    nameUz: 'Tortlar',
    nameRu: 'Торты',
    image: '/images/cat_chocolate_cake.jpg',
    productCount: 24,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-2',
    slug: 'kekslar',
    nameUz: 'Kekslar',
    nameRu: 'Кексы',
    image: '/images/cat_pink_cupcakes.jpg',
    productCount: 18,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-3',
    slug: 'pechenyelar',
    nameUz: 'Pechenyelar',
    nameRu: 'Печенье',
    image: '/images/cat_linzer_cookies.jpg',
    productCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-4',
    slug: 'desertlar',
    nameUz: 'Desertlar',
    nameRu: 'Десерты',
    image: '/images/cat_parfait_dessert.jpg',
    productCount: 10,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-5',
    slug: 'shirinliklar',
    nameUz: 'Shirinliklar',
    nameRu: 'Сладости',
    image: '/images/cat_truffle_sweets.jpg',
    productCount: 8,
    createdAt: new Date().toISOString(),
  },
];

const initialProducts: Product[] = [
  {
    id: 'prod-1',
    slug: 'shokoladli-tort',
    nameUz: 'Shokoladli tort',
    nameRu: 'Шоколадный торт',
    descriptionUz: 'Boy shokoladli biskvit, nozik shokolad kremi va mevali bezak bilan tayyorlangan shohona tort.',
    descriptionRu: 'Насыщенный шоколадный бисквит, нежнейший шоколадный крем ганаш и декор из свежих ягод.',
    price: 250000,
    oldPrice: 280000,
    categoryId: 'cat-1',
    categorySlug: 'tortlar',
    image: '/images/cat_chocolate_cake.jpg',
    images: ['/images/cat_chocolate_cake.jpg', '/images/hero_pink_cake.jpg'],
    rating: 5.0,
    reviewCount: 38,
    stock: 15,
    weight: '1.4 kg',
    ingredientsUz: 'Belgiya shokoladi, tabiiy sariyog‘, tuxum, un, qaymoq 33%, kakao, yangi rezavorlar',
    ingredientsRu: 'Бельгийский шоколад, натуральное сливочное масло, фермерские яйца, мука высшего сорта, сливки 33%, ягоды',
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    slug: 'malinali-keks',
    nameUz: 'Malinali keks',
    nameRu: 'Малиновый кекс',
    descriptionUz: 'Yumshoq vanilli keks ustida pushti malina kremi va yangi terilgan malina donachalari.',
    descriptionRu: 'Нежный капкейк с воздушным ванильным бисквитом, шапочкой из малинового крем-чиза и свежей ягодой.',
    price: 35000,
    categoryId: 'cat-2',
    categorySlug: 'kekslar',
    image: '/images/cat_pink_cupcakes.jpg',
    images: ['/images/cat_pink_cupcakes.jpg'],
    rating: 4.9,
    reviewCount: 24,
    stock: 45,
    weight: '120 g',
    ingredientsUz: 'Yangi malina, krem-chiz, vanil ekstrakti, sariyog‘, un, shakar',
    ingredientsRu: 'Свежая малина, крем-чиз, натуральная ваниль, сливочное масло, мука, сахарная пудра',
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    slug: 'pishiriq-pechenye',
    nameUz: 'Pishiriq pechenye',
    nameRu: 'Домашнее печенье',
    descriptionUz: 'Qo‘lda tayyorlangan yurakcha shaklidagi Linzer pechenyesi, tabiiy meva murabbosi bilan.',
    descriptionRu: 'Хрустящее домашнее печенье Линдсер с начинкой из натурального ягодного джема в форме сердечек.',
    price: 20000,
    categoryId: 'cat-3',
    categorySlug: 'pechenyelar',
    image: '/images/cat_linzer_cookies.jpg',
    images: ['/images/cat_linzer_cookies.jpg'],
    rating: 4.8,
    reviewCount: 19,
    stock: 60,
    weight: '150 g',
    ingredientsUz: 'Bodom uni, sariyog‘, rezavor jemi, vanil, shakar kukuni',
    ingredientsRu: 'Миндальная мука, сливочное масло, ягодный джем, ваниль, сахарная пудра',
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    slug: 'vanilli-desert',
    nameUz: 'Vanilli desert',
    nameRu: 'Ванильный десерт',
    descriptionUz: 'Qatlamli vanilli puding, mayin biskvit va barra qulupnaylar bilan shisha idishdagi parfe.',
    descriptionRu: 'Изысканный порционный трайфл с прослойками сливочно-ванильного крема, бисквита и свежей клубники.',
    price: 40000,
    categoryId: 'cat-4',
    categorySlug: 'desertlar',
    image: '/images/cat_parfait_dessert.jpg',
    images: ['/images/cat_parfait_dessert.jpg'],
    rating: 4.9,
    reviewCount: 31,
    stock: 30,
    weight: '180 g',
    ingredientsUz: 'Madagaskar vanili, maskarpone, yangi qulupnay, kofe essensiyasi, yalpiz',
    ingredientsRu: 'Мадагаскарская ваниль, сыр маскарпоне, свежая клубника, бисквит, мята',
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    slug: 'qulupnayli-tort',
    nameUz: 'Qulupnayli tort',
    nameRu: 'Клубничный торт',
    descriptionUz: 'Pushti sirlangan, yangi qulupnay va ko‘katlar bilan bezatilgan bayramona muloyim tort.',
    descriptionRu: 'Праздничный торт с розовой зеркальной глазурью, украшенный спелой клубникой, черникой и цветами.',
    price: 280000,
    oldPrice: 320000,
    categoryId: 'cat-1',
    categorySlug: 'tortlar',
    image: '/images/hero_pink_cake.jpg',
    images: ['/images/hero_pink_cake.jpg'],
    rating: 5.0,
    reviewCount: 52,
    stock: 12,
    weight: '1.6 kg',
    ingredientsUz: 'Yangi qulupnay, qaymoqli krem-chiz, vanilli shifon biskvit, tabiiy meva pyuresi',
    ingredientsRu: 'Свежая клубника, крем-чиз на сливках, ванильный бисквит, натуральное ягодное пюре',
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    slug: 'red-velvet',
    nameUz: 'Red Velvet',
    nameRu: 'Красный бархат',
    descriptionUz: 'Klassik Amerika retsepti asosidagi baxmal biskvit va nozik nordon-shirin pishloqli krem.',
    descriptionRu: 'Легендарный торт с влажными рубиновыми коржами и нежнейшим сливочным сырным кремом.',
    price: 220000,
    categoryId: 'cat-1',
    categorySlug: 'tortlar',
    image: '/images/hero_pink_cake.jpg',
    images: ['/images/hero_pink_cake.jpg'],
    rating: 4.9,
    reviewCount: 47,
    stock: 18,
    weight: '1.3 kg',
    ingredientsUz: 'Kakao, kefir, krem-chiz, tabiiy rang beruvchi lavlagi ekstrakti, sariyog‘',
    ingredientsRu: 'Какао, крем-чиз, натуральный экстракт свеклы, сливочное масло, ваниль',
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-7',
    slug: 'pista-tort',
    nameUz: 'Pista tort',
    nameRu: 'Фисташковый торт',
    descriptionUz: 'Haqiqiy Eron pistasi pastasi, yengil qatlamlar va morina rezavorlari uyg‘unligi.',
    descriptionRu: 'Авторский торт с натуральной фисташковой пастой, малиновым конфи и бархатным муссом.',
    price: 260000,
    categoryId: 'cat-1',
    categorySlug: 'tortlar',
    image: '/images/cat_chocolate_cake.jpg',
    images: ['/images/cat_chocolate_cake.jpg'],
    rating: 5.0,
    reviewCount: 29,
    stock: 10,
    weight: '1.5 kg',
    ingredientsUz: 'Pista pastasi, butun maydalangan pista, oq shokolad, malina jeli',
    ingredientsRu: 'Фисташковая паста, дробленые фисташки, белый бельгийский шоколад, малина',
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-8',
    slug: 'cheesecake',
    nameUz: 'Cheesecake',
    nameRu: 'Чизкейк Нью-Йорк',
    descriptionUz: 'Pechda pishirilgan mayin pishloqli qatlam, qarsildoq qum xamiri va rezavor sous.',
    descriptionRu: 'Классический запеченный чизкейк из нежнейшего сыра Филадельфия с хрустящей песочной основой.',
    price: 190000,
    categoryId: 'cat-4',
    categorySlug: 'desertlar',
    image: '/images/cat_parfait_dessert.jpg',
    images: ['/images/cat_parfait_dessert.jpg'],
    rating: 4.9,
    reviewCount: 36,
    stock: 14,
    weight: '1.1 kg',
    ingredientsUz: 'Philadelphia pishlog‘i, qaymoq, limon sharbati, qum pechenyesi asosi',
    ingredientsRu: 'Сливочный сыр Филадельфия, сливки, сок сицилийского лимона, песочная основа',
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-9',
    slug: 'shokoladli-trufellar',
    nameUz: 'Shokoladli trufellar',
    nameRu: 'Шоколадные трюфели',
    descriptionUz: 'Qo‘lda yumaloqlangan, oltin changi va yong‘oq sepilgan nozik shokoladli konfetlar to‘plami.',
    descriptionRu: 'Набор изысканных трюфелей ручной работы с темным шоколадом, фундуком и пищевым золотом.',
    price: 85000,
    categoryId: 'cat-5',
    categorySlug: 'shirinliklar',
    image: '/images/cat_truffle_sweets.jpg',
    images: ['/images/cat_truffle_sweets.jpg'],
    rating: 4.9,
    reviewCount: 22,
    stock: 25,
    weight: '250 g',
    ingredientsUz: 'To‘q qora shokolad 70%, o‘rmon yong‘og‘i, tabiiy qaymoq, kakao upasi',
    ingredientsRu: 'Темный шоколад 70%, фундук, натуральные сливки, какао-порошок премиум',
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-10',
    slug: 'qulupnayli-kapkeyk',
    nameUz: 'Qulupnayli kapkeyk',
    nameRu: 'Клубничный капкейк',
    descriptionUz: 'Pushti kremli, shirin xushbo‘y kapkeyklar to‘plami.',
    descriptionRu: 'Воздушный капкейк с клубничным кремом и ароматной посыпкой.',
    price: 32000,
    categoryId: 'cat-2',
    categorySlug: 'kekslar',
    image: '/images/cat_pink_cupcakes.jpg',
    images: ['/images/cat_pink_cupcakes.jpg'],
    rating: 4.8,
    reviewCount: 15,
    stock: 40,
    weight: '110 g',
    ingredientsUz: 'Un, tuxum, sariyog‘, qulupnayli muzqaymoq kremi',
    ingredientsRu: 'Мука, яйца, сливочное масло, клубничный крем',
    isFeatured: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-11',
    slug: 'bodomli-pechenye',
    nameUz: 'Bodomli pechenye',
    nameRu: 'Миндальное печенье',
    descriptionUz: 'Bodom parchalari sepilgan xushbo‘y, og‘izda eriydigan sariyog‘li pishiriq.',
    descriptionRu: 'Рассыпчатое сливочное печенье с обжаренными миндальными лепестками.',
    price: 25000,
    categoryId: 'cat-3',
    categorySlug: 'pechenyelar',
    image: '/images/cat_linzer_cookies.jpg',
    images: ['/images/cat_linzer_cookies.jpg'],
    rating: 4.8,
    reviewCount: 18,
    stock: 50,
    weight: '200 g',
    ingredientsUz: 'Bodom un va barglari, sariyog‘, shakar, tuxum oqi',
    ingredientsRu: 'Миндальные лепестки, сливочное масло, сахар, белок',
    isFeatured: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-12',
    slug: 'tiramisu-desert',
    nameUz: 'Tiramisu desert',
    nameRu: 'Десерт Тирамису',
    descriptionUz: 'Italyancha klassik Savoyardi pechenyelari, espresso va xushbo‘y maskarpone kremi.',
    descriptionRu: 'Настоящее итальянское лакомство на основе печенья Савоярди, эспрессо и крема маскарпоне.',
    price: 45000,
    categoryId: 'cat-4',
    categorySlug: 'desertlar',
    image: '/images/cat_parfait_dessert.jpg',
    images: ['/images/cat_parfait_dessert.jpg'],
    rating: 5.0,
    reviewCount: 41,
    stock: 22,
    weight: '190 g',
    ingredientsUz: 'Savoyardi, espresso, maskarpone, kakao, vanil',
    ingredientsRu: 'Савоярди, свежесваренный эспрессо, маскарпоне, какао',
    isFeatured: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-13',
    slug: 'panna-cotta',
    nameUz: 'Panna Cotta',
    nameRu: 'Панна-котта с ягодами',
    descriptionUz: 'Yumshoq italyancha qaymoqli desert, yangi mevali jem bilan birgalikda.',
    descriptionRu: 'Нежнейший сливочный десерт родом из Пьемонта с топпингом из лесных ягод.',
    price: 42000,
    categoryId: 'cat-4',
    categorySlug: 'desertlar',
    image: '/images/cat_parfait_dessert.jpg',
    images: ['/images/cat_parfait_dessert.jpg'],
    rating: 4.9,
    reviewCount: 27,
    stock: 28,
    weight: '170 g',
    ingredientsUz: 'Qaymoq 33%, tabiiy vanil, o‘rmon mevalari jele qatlami',
    ingredientsRu: 'Сливки 33%, натуральная ваниль, желе из лесных ягод',
    isFeatured: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-14',
    slug: 'sharqona-lokum',
    nameUz: 'Sharqona lokum & shirinliklar',
    nameRu: 'Восточные сладости ассорти',
    descriptionUz: 'Anor, pista va atirgul suvi bilan tayyorlangan mayin sharqona lokum to‘plami.',
    descriptionRu: 'Набор восточных лакомств ручной работы с гранатом, фисташками и ароматом дамасской розы.',
    price: 95000,
    categoryId: 'cat-5',
    categorySlug: 'shirinliklar',
    image: '/images/cat_truffle_sweets.jpg',
    images: ['/images/cat_truffle_sweets.jpg'],
    rating: 4.8,
    reviewCount: 16,
    stock: 35,
    weight: '350 g',
    ingredientsUz: 'Anor sharbati, pista, makkajo‘xori kraxmali, atirgul suvi',
    ingredientsRu: 'Гранатовый сок, фисташки, кукурузный крахмал, розовая вода',
    isFeatured: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-15',
    slug: 'shokoladli-kruassan',
    nameUz: 'Shokoladli kruassan',
    nameRu: 'Шоколадный круассан',
    descriptionUz: 'Fransuzcha qat-qat xamirdan tayyorlangan qarsildoq va shokoladga to‘la kruassan.',
    descriptionRu: 'Хрустящий круассан из многослойного французского теста с начинкой из темного шоколада.',
    price: 28000,
    categoryId: 'cat-3',
    categorySlug: 'pechenyelar',
    image: '/images/cat_chocolate_cake.jpg',
    images: ['/images/cat_chocolate_cake.jpg'],
    rating: 4.9,
    reviewCount: 33,
    stock: 20,
    weight: '130 g',
    ingredientsUz: 'Fransuz sariyog‘i, qora shokolad, un, sut',
    ingredientsRu: 'Сливочное масло, темный шоколад, мука высшего сорта, фермерское молоко',
    isFeatured: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialOrders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'ZH-000101',
    customerName: 'Nilufar Usmonova',
    phone: '+998 90 123 45 67',
    address: 'Toshkent sh., Yunusobod t., 4-mavze, 15-uy',
    deliveryDate: '2026-10-02',
    deliveryTime: '14:00 - 16:00',
    comment: 'Iltimos, lentasi pushti rangda bo‘lsin.',
    paymentMethod: 'click',
    items: [
      {
        productId: 'prod-5',
        productName: 'Qulupnayli tort',
        quantity: 1,
        price: 280000,
        image: '/images/hero_pink_cake.jpg',
      },
      {
        productId: 'prod-2',
        productName: 'Malinali keks',
        quantity: 2,
        price: 35000,
        image: '/images/cat_pink_cupcakes.jpg',
      },
    ],
    subtotal: 350000,
    deliveryPrice: 0,
    total: 350000,
    status: 'Tayyorlanmoqda',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'ord-2',
    orderNumber: 'ZH-000102',
    customerName: 'Dilnoza Rahimova',
    phone: '+998 93 987 65 43',
    address: 'Toshkent sh., Mirzo Ulug‘bek t., Buyuk Ipak Yo‘li, 88',
    deliveryDate: '2026-10-02',
    deliveryTime: '16:00 - 18:00',
    comment: 'Tort ustiga "Tug‘ilgan kuning bilan!" yozilsin',
    paymentMethod: 'payme',
    items: [
      {
        productId: 'prod-1',
        productName: 'Shokoladli tort',
        quantity: 1,
        price: 250000,
        image: '/images/cat_chocolate_cake.jpg',
      },
    ],
    subtotal: 250000,
    deliveryPrice: 35000,
    total: 285000,
    status: 'Yangi',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'ord-3',
    orderNumber: 'ZH-000099',
    customerName: 'Shahlo Karimova',
    phone: '+998 97 555 44 33',
    address: 'Toshkent sh., Chilonzor t., 9-mavze, 21-uy',
    deliveryDate: '2026-10-01',
    deliveryTime: '12:00 - 14:00',
    comment: '',
    paymentMethod: 'cash',
    items: [
      {
        productId: 'prod-8',
        productName: 'Cheesecake',
        quantity: 1,
        price: 190000,
        image: '/images/cat_parfait_dessert.jpg',
      },
      {
        productId: 'prod-4',
        productName: 'Vanilli desert',
        quantity: 2,
        price: 40000,
        image: '/images/cat_parfait_dessert.jpg',
      },
    ],
    subtotal: 270000,
    deliveryPrice: 35000,
    total: 305000,
    status: 'Yetkazildi',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

const initialContacts: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Madina Alimova',
    phone: '+998 90 777 88 99',
    email: 'madina@gmail.com',
    message: 'To‘y uchun 3 qavatli maxsus buyurtma tort buyurtma qilsak bo‘ladimi?',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'msg-2',
    name: 'Jasur Saidov',
    phone: '+998 94 111 22 33',
    email: 'jasur@inbox.uz',
    message: 'Korporativ bayram uchun 50 ta desert to‘plami kerak edi.',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

const initialSettings: StoreSettings = {
  storeName: 'Zahro SHIRINLIK dunyosi',
  phone: '+998 90 123 45 67',
  email: 'zahro@shirinlik.uz',
  address: 'Toshkent shahri, Chilonzor tumani, Bunyodkor shoh ko‘chasi, 12-uy',
  deliveryPrice: 35000,
  freeDeliveryThreshold: 300000,
  telegram: 'https://t.me/zahro_shirinlik',
  instagram: 'https://instagram.com/zahro_shirinlik',
  tiktok: 'https://tiktok.com/@zahro_shirinlik',
  youtube: 'https://youtube.com/@zahro_shirinlik',
};

// Initial admin (admin / zahro2026)
const defaultAdminPass = hashPassword('zahro2026');
const initialAdmins = [
  {
    id: 'admin-1',
    username: 'admin',
    name: 'Zahro Admin',
    role: 'admin' as const,
    passwordHash: defaultAdminPass.hash,
    salt: defaultAdminPass.salt,
  },
];

class Database {
  private data: Schema;

  constructor() {
    this.data = this.load();
  }

  private load(): Schema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all keys exist
        return {
          categories: parsed.categories || initialCategories,
          products: parsed.products || initialProducts,
          orders: parsed.orders || initialOrders,
          contacts: parsed.contacts || initialContacts,
          admins: parsed.admins || initialAdmins,
          settings: parsed.settings || initialSettings,
        };
      }
    } catch (err) {
      console.error('Error loading db.json, recreating defaults', err);
    }

    const defaultData: Schema = {
      categories: initialCategories,
      products: initialProducts,
      orders: initialOrders,
      contacts: initialContacts,
      admins: initialAdmins,
      settings: initialSettings,
    };
    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(data: Schema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  private persist() {
    this.saveData(this.data);
  }

  // Categories
  getCategories(): Category[] {
    // Dynamically update product counts
    return this.data.categories.map((c) => {
      const count = this.data.products.filter((p) => p.categoryId === c.id && p.isActive).length;
      return { ...c, productCount: count || c.productCount };
    });
  }

  getCategoryById(id: string): Category | undefined {
    return this.data.categories.find((c) => c.id === id || c.slug === id);
  }

  createCategory(payload: Omit<Category, 'id' | 'createdAt'>): Category {
    const newCat: Category = {
      ...payload,
      id: 'cat-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    this.data.categories.push(newCat);
    this.persist();
    return newCat;
  }

  updateCategory(id: string, payload: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...payload };
    this.persist();
    return this.data.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const lenBefore = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    if (this.data.categories.length !== lenBefore) {
      this.persist();
      return true;
    }
    return false;
  }

  // Products
  getProducts(filters?: {
    categoryId?: string;
    search?: string;
    featured?: boolean;
    sort?: string;
  }): Product[] {
    let list = [...this.data.products];

    if (filters?.categoryId && filters.categoryId !== 'all') {
      const cat = this.getCategoryById(filters.categoryId);
      list = list.filter(
        (p) => p.categoryId === filters.categoryId || p.categorySlug === filters.categoryId || (cat && p.categoryId === cat.id)
      );
    }

    if (filters?.featured) {
      list = list.filter((p) => p.isFeatured);
    }

    if (filters?.search) {
      const s = filters.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.nameUz.toLowerCase().includes(s) ||
          p.nameRu.toLowerCase().includes(s) ||
          p.descriptionUz.toLowerCase().includes(s) ||
          p.descriptionRu.toLowerCase().includes(s)
      );
    }

    if (filters?.sort) {
      if (filters.sort === 'cheap') {
        list.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'expensive') {
        list.sort((a, b) => b.price - a.price);
      } else if (filters.sort === 'popular') {
        list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      } else if (filters.sort === 'new') {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return list;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id || p.slug === id);
  }

  createProduct(payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const slug =
      payload.slug ||
      payload.nameUz
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
        '-' +
        Date.now().toString().slice(-4);

    const newProd: Product = {
      ...payload,
      id: 'prod-' + Date.now(),
      slug,
      images: payload.images && payload.images.length > 0 ? payload.images : [payload.image],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.products.unshift(newProd);
    this.persist();
    return newProd;
  }

  updateProduct(id: string, payload: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = {
      ...this.data.products[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.products[idx];
  }

  deleteProduct(id: string): boolean {
    const lenBefore = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== lenBefore) {
      this.persist();
      return true;
    }
    return false;
  }

  // Orders
  getOrders(): Order[] {
    return [...this.data.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  createOrder(payload: Omit<Order, 'id' | 'orderNumber' | 'status' | 'createdAt'>): Order {
    const count = this.data.orders.length + 1;
    const orderNumber = `ZH-${(100 + count).toString().padStart(6, '0')}`;
    const newOrder: Order = {
      ...payload,
      id: 'ord-' + Date.now(),
      orderNumber,
      status: 'Yangi',
      createdAt: new Date().toISOString(),
    };
    this.data.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  updateOrderStatus(id: string, status: Order['status']): Order | null {
    const order = this.data.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return null;
    order.status = status;
    this.persist();
    return order;
  }

  // Contacts
  getContacts(): ContactMessage[] {
    return [...this.data.contacts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  createContact(payload: Omit<ContactMessage, 'id' | 'isRead' | 'createdAt'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...payload,
      id: 'msg-' + Date.now(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.data.contacts.unshift(newMsg);
    this.persist();
    return newMsg;
  }

  markContactRead(id: string): ContactMessage | null {
    const msg = this.data.contacts.find((m) => m.id === id);
    if (!msg) return null;
    msg.isRead = true;
    this.persist();
    return msg;
  }

  deleteContact(id: string): boolean {
    const len = this.data.contacts.length;
    this.data.contacts = this.data.contacts.filter((m) => m.id !== id);
    if (this.data.contacts.length !== len) {
      this.persist();
      return true;
    }
    return false;
  }

  // Settings
  getSettings(): StoreSettings {
    return { ...this.data.settings };
  }

  updateSettings(payload: Partial<StoreSettings>): StoreSettings {
    this.data.settings = { ...this.data.settings, ...payload };
    this.persist();
    return this.data.settings;
  }

  // Admin authentication
  getAdminByUsername(username: string) {
    return this.data.admins.find((a) => a.username.toLowerCase() === username.toLowerCase());
  }

  // Stats
  getStats(): DashboardStats {
    const totalProducts = this.data.products.filter((p) => p.isActive).length;
    const totalOrders = this.data.orders.length;
    const pendingOrders = this.data.orders.filter(
      (o) => o.status === 'Yangi' || o.status === 'Tasdiqlangan' || o.status === 'Tayyorlanmoqda'
    ).length;
    const completedOrders = this.data.orders.filter((o) => o.status === 'Yetkazildi').length;
    const totalRevenue = this.data.orders
      .filter((o) => o.status !== 'Bekor qilindi')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const unreadMessages = this.data.contacts.filter((m) => !m.isRead).length;

    return {
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      unreadMessages,
    };
  }
}

export const db = new Database();
