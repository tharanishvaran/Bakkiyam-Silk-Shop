const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'bakkiyam.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      sort_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sarees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      short_description TEXT,
      description TEXT,
      fabric TEXT,
      color TEXT,
      design_style TEXT,
      occasion TEXT,
      weave_details TEXT,
      border_details TEXT,
      pallu_details TEXT,
      featured INTEGER DEFAULT 0,
      new_arrival INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS saree_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      saree_id INTEGER NOT NULL REFERENCES sarees(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      title TEXT,
      description TEXT,
      sort_order INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    db.prepare("ALTER TABLE admin_users ADD COLUMN role TEXT DEFAULT 'Administrator'").run();
  } catch (e) {}
  try {
    db.prepare("ALTER TABLE admin_users ADD COLUMN display_name TEXT").run();
  } catch (e) {}

  // Seed default admin only if no administrators exist in the database
  const adminCount = db.prepare('SELECT COUNT(*) as c FROM admin_users').get().c;
  if (adminCount === 0) {
    const newAdminHash = bcrypt.hashSync('Bakkiyam@2026', 10);
    db.prepare("INSERT INTO admin_users (username, password_hash, display_name, role) VALUES ('admin', ?, 'Super Administrator', 'Administrator')").run(newAdminHash);
  }

  // Seed default site settings only if missing (DO NOT overwrite user changes on restart)
  const settingsDefaults = [
    ['logo', '/logo.jpg'],
    ['hero_title', 'Timeless Elegance, Woven in Silk'],
    ['hero_subtitle', 'Discover beautiful traditional sarees and timeless designs at Bakkiyam Pattu Center, Siruvanthadu.'],
    ['about_text', 'Bakkiyam Pattu Center is a traditional saree showroom located in Siruvanthadu, Tamil Nadu. Our collections are focused on elegant sarees for weddings, festivals, celebrations and special occasions.'],
    ['contact_phone_1', '9159808720'],
    ['contact_phone_1_name', 'V. Kannan'],
    ['contact_phone_2', '7871620812'],
    ['contact_phone_2_name', 'V. Kannan'],
    ['contact_phone_3', '9865975616'],
    ['contact_phone_3_name', 'S.K. Veerappan'],
    ['whatsapp_number', '919159808720'],
    ['instagram_url', 'https://www.instagram.com/bhakkiyam_pattu_center?stkn=aW40cHE0MHpmdG13'],
    ['maps_url', 'https://maps.app.goo.gl/b5TtEwr47nMyN39G8?g_st=aw'],
    ['address', 'Meenavar Street, Mottuchulam, Siruvanthadu, Tamil Nadu, India'],
  ];

  const insertSettingIfMissing = db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO NOTHING');
  for (const [key, value] of settingsDefaults) {
    insertSettingIfMissing.run(key, value);
  }

  // Seed categories
  const catCount = db.prepare('SELECT COUNT(*) as c FROM categories').get();
  if (catCount.c === 0) {
    const cats = [
      ['Kanchipuram Silk Sarees', 'Exquisite handwoven Kanchipuram silk sarees with rich zari work', 0],
      ['Pure Silk Sarees', 'Finest pure silk sarees with traditional craftsmanship', 1],
      ['Wedding Sarees', 'Magnificent sarees crafted for wedding celebrations', 2],
      ['Bridal Sarees', 'Stunning bridal collections for the most special day', 3],
      ['Traditional Silk Sarees', 'Classic traditional silk sarees with heritage designs', 4],
      ['Designer Sarees', 'Contemporary designer sarees blending tradition and modernity', 5],
      ['Festive Sarees', 'Vibrant festive sarees for celebrations and occasions', 6],
      ['Soft Silk Sarees', 'Lightweight soft silk sarees for everyday elegance', 7],
      ['Zari Sarees', 'Rich zari-woven sarees with golden thread craftsmanship', 8],
      ['Fancy Sarees', 'Modern fancy sarees for parties and special events', 9],
      ['Cotton Silk Sarees', 'Comfortable cotton silk blend sarees', 10],
      ['Party Wear Sarees', 'Glamorous party wear collections for evening events', 11],
      ['New Arrivals', 'Latest additions to our exclusive collection', 12],
    ];
    const insertCat = db.prepare('INSERT INTO categories (name, description, sort_order) VALUES (?, ?, ?)');
    for (const [name, desc, sort] of cats) {
      insertCat.run(name, desc, sort);
    }
  }

  // Seed sample sarees
  const sareeCount = db.prepare('SELECT COUNT(*) as c FROM sarees').get();
  if (sareeCount.c === 0) {
    const sampleSarees = [
      {
        name: 'Royal Kanchipuram Bridal',
        category: 'Kanchipuram Silk Sarees',
        short_desc: 'A magnificent Kanchipuram silk saree with traditional temple border and rich pallu.',
        desc: 'This exquisite Kanchipuram silk saree features intricate handwoven temple motifs and rich zari work. Perfect for bridal occasions and grand celebrations.',
        fabric: 'Pure Mulberry Silk',
        color: 'Deep Maroon with Gold',
        design: 'Temple Border with Peacock Motifs',
        occasion: 'Bridal & Wedding',
        weave: 'Traditional Kanchipuram Handloom',
        border: 'Wide temple zari border',
        pallu: 'Intricate peacock and floral pallu',
        featured: 1,
        new_arrival: 0,
      },
      {
        name: 'Emerald Zari Elegance',
        category: 'Zari Sarees',
        short_desc: 'Rich emerald silk saree with golden zari weave and traditional South Indian motifs.',
        desc: 'An opulent emerald green silk saree adorned with golden zari threads woven into classic South Indian patterns. A timeless piece for festive occasions.',
        fabric: 'Pure Silk with Zari',
        color: 'Emerald Green with Gold',
        design: 'Traditional Zari Pattern',
        occasion: 'Festivals & Celebrations',
        weave: 'Zari Interwoven Handloom',
        border: 'Golden zari contrast border',
        pallu: 'Elaborate zari pallu with floral motifs',
        featured: 1,
        new_arrival: 1,
      },
      {
        name: 'Ivory Wedding Collection',
        category: 'Wedding Sarees',
        short_desc: 'Pristine ivory silk saree with delicate gold embroidery for wedding ceremonies.',
        desc: 'This beautiful ivory silk saree with subtle gold embroidery brings timeless grace to every wedding celebration. Its soft drape and elegant design make it a cherished choice.',
        fabric: 'Premium Silk',
        color: 'Ivory / Cream with Gold',
        design: 'Floral Gold Embroidery',
        occasion: 'Wedding Ceremonies',
        weave: 'Fine Silk Weave',
        border: 'Delicate gold border with floral pattern',
        pallu: 'Flowing pallu with gold thread details',
        featured: 1,
        new_arrival: 0,
      },
      {
        name: 'Royal Purple Pattu',
        category: 'Pure Silk Sarees',
        short_desc: 'Majestic royal purple pattu saree with classic geometric border design.',
        desc: 'Draped in the hue of royalty, this pure silk saree in rich purple features classic geometric border patterns and a graceful pallu. Ideal for grand occasions.',
        fabric: 'Pure Pattu (Silk)',
        color: 'Royal Purple',
        design: 'Geometric Traditional Pattern',
        occasion: 'Festivals & Grand Events',
        weave: 'Traditional Silk Handloom',
        border: 'Geometric gold-purple border',
        pallu: 'Traditional geometric pallu design',
        featured: 0,
        new_arrival: 1,
      },
      {
        name: 'Peacock Blue Festive',
        category: 'Festive Sarees',
        short_desc: 'Vibrant peacock blue saree with traditional motifs for festive celebrations.',
        desc: 'Inspired by the majestic peacock, this festive saree in stunning peacock blue features intricate traditional motifs. A vibrant choice for Pongal, Diwali, and festive occasions.',
        fabric: 'Art Silk / Blended Silk',
        color: 'Peacock Blue',
        design: 'Peacock Feather Motifs',
        occasion: 'Festivals',
        weave: 'Traditional Motif Weave',
        border: 'Contrast golden peacock border',
        pallu: 'Peacock-inspired motif pallu',
        featured: 0,
        new_arrival: 0,
      },
      {
        name: 'Soft Silk Daily Wear',
        category: 'Soft Silk Sarees',
        short_desc: 'Lightweight soft silk saree combining everyday comfort with elegant charm.',
        desc: 'A beautifully crafted soft silk saree that offers comfort without compromising elegance. Perfect for daily wear, casual events and family gatherings.',
        fabric: 'Soft Silk',
        color: 'Rose Pink',
        design: 'Simple Floral Checks',
        occasion: 'Daily Wear & Casual Events',
        weave: 'Soft Silk Weave',
        border: 'Thin contrast border',
        pallu: 'Plain soft pallu with border extension',
        featured: 0,
        new_arrival: 0,
      },
      {
        name: 'Crimson Bridal Silk',
        category: 'Bridal Sarees',
        short_desc: 'Deeply rich crimson bridal silk with heavy gold zari work for the perfect bride.',
        desc: 'This crimson bridal silk saree is every bride\'s dream. Woven with heavy gold zari, intricate patterns and a stunning pallu, it radiates magnificence on the most special day.',
        fabric: 'Heavy Pure Silk',
        color: 'Deep Crimson with Heavy Gold',
        design: 'Bridal Zari with Floral Motifs',
        occasion: 'Bridal & Wedding',
        weave: 'Heavy Zari Bridal Weave',
        border: 'Broad bridal gold border',
        pallu: 'Ornate bridal pallu with full motifs',
        featured: 1,
        new_arrival: 0,
      },
      {
        name: 'Designer Contemporary Silk',
        category: 'Designer Sarees',
        short_desc: 'Modern designer silk saree blending traditional weave with contemporary fashion.',
        desc: 'This unique designer saree brings together the best of tradition and modernity. With a fusion of classic weaving and contemporary design elements, it is perfect for the modern Indian woman.',
        fabric: 'Blended Silk',
        color: 'Teal with Copper',
        design: 'Contemporary Fusion Design',
        occasion: 'Parties & Special Events',
        weave: 'Modern Fusion Weave',
        border: 'Copper metallic border',
        pallu: 'Abstract contemporary pallu',
        featured: 0,
        new_arrival: 1,
      },
    ];

    const catMap = {};
    const allCats = db.prepare('SELECT id, name FROM categories').all();
    for (const c of allCats) catMap[c.name] = c.id;

    const insertSaree = db.prepare(`
      INSERT INTO sarees (name, category_id, short_description, description, fabric, color, design_style, occasion, weave_details, border_details, pallu_details, featured, new_arrival, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    const insertImg = db.prepare('INSERT INTO saree_images (saree_id, image_url, is_primary, sort_order) VALUES (?, ?, 1, 0)');
    const imageMap = {
      'Royal Kanchipuram Bridal': '/saree-kanchipuram.jpg',
      'Emerald Zari Elegance': '/saree-emerald.jpg',
      'Ivory Wedding Collection': '/saree-ivory.jpg',
      'Royal Purple Pattu': '/saree-purple.jpg',
      'Peacock Blue Festive': '/saree-peacock.jpg',
      'Soft Silk Daily Wear': '/saree-pink.jpg',
      'Crimson Bridal Silk': '/saree-bridal.jpg',
      'Designer Contemporary Silk': '/saree-designer.jpg',
    };

    for (const s of sampleSarees) {
      const catId = catMap[s.category] || null;
      const res = insertSaree.run(s.name, catId, s.short_desc, s.desc, s.fabric, s.color, s.design, s.occasion, s.weave, s.border, s.pallu, s.featured, s.new_arrival);
      const img = imageMap[s.name];
      if (img && res.lastInsertRowid) {
        insertImg.run(res.lastInsertRowid, img);
      }
    }
  }

  // Ensure saree_images populated if missing
  const imgCount = db.prepare('SELECT COUNT(*) as c FROM saree_images').get();
  if (imgCount.c === 0) {
    const insertImg = db.prepare('INSERT INTO saree_images (saree_id, image_url, is_primary, sort_order) VALUES (?, ?, 1, 0)');
    const imageMap = [
      [1, '/saree-kanchipuram.jpg'],
      [2, '/saree-emerald.jpg'],
      [3, '/saree-ivory.jpg'],
      [4, '/saree-purple.jpg'],
      [5, '/saree-peacock.jpg'],
      [6, '/saree-pink.jpg'],
      [7, '/saree-bridal.jpg'],
      [8, '/saree-designer.jpg'],
    ];
    for (const [id, url] of imageMap) {
      const exists = db.prepare('SELECT id FROM sarees WHERE id = ?').get(id);
      if (exists) insertImg.run(id, url);
    }
  }

  // Seed gallery if empty
  const galCount = db.prepare('SELECT COUNT(*) as c FROM gallery').get();
  if (galCount.c === 0) {
    const galleryItems = [
      ['/saree-box-collection-1.jpg', 'Showroom Box Collection - Pink, Emerald & Violet Pattu', 'Handcrafted traditional silk sarees in premium gift boxes featuring rich contrast borders, peacock butta, and grand zari pallu.', 1],
      ['/saree-box-collection-2.jpg', 'Festive Trousseau Box - Mint Green, Indigo & Dual-Tone Sarees', 'Auspicious wedding and festive pattu sarees showcasing exquisite temple borders, delicate gold thread motifs, and vibrant contrast drapes.', 2],
      ['/saree-box-collection-3.jpg', 'Bridal Grandeur Box - Pistachio, Olive Gold & Mustard Blue', 'Authentic pure silk sarees with heavy bridal zari weaving, twin peacock motifs, and ornate borders direct from our Siruvanthadu showroom.', 3],
      ['/saree-kanchipuram.jpg', 'Royal Kanchipuram Silk Saree', 'Classic red and gold handwoven Kanchipuram silk saree with traditional temple zari border.', 4],
      ['/saree-emerald.jpg', 'Emerald Green Pattu Saree', 'Rich emerald green pure silk saree with intricate golden floral motifs and grand pallu.', 5],
      ['/saree-bridal.jpg', 'Crimson Bridal Muhurtham Saree', 'Magnificent crimson bridal silk with heavy gold zari for wedding ceremonies.', 6],
      ['/saree-ivory.jpg', 'Ivory Wedding Silk Saree', 'Pristine ivory and cream silk saree with delicate gold floral embroidery.', 7],
      ['/saree-purple.jpg', 'Royal Purple Silk Saree', 'Majestic royal purple pattu with intricate geometric borders and contrast pallu.', 8],
      ['/saree-peacock.jpg', 'Peacock Blue Festive Saree', 'Vibrant peacock blue silk saree featuring traditional peacock motifs.', 9],
      ['/saree-pink.jpg', 'Rose Pink Soft Silk Saree', 'Lightweight and graceful soft silk saree in delicate rose pink for celebrations.', 10],
      ['/showroom.jpg', 'Bakkiyam Showroom Collection', 'Warm and welcoming traditional saree showroom at Meenavar Street, Siruvanthadu.', 11],
    ];
    const insertGal = db.prepare('INSERT INTO gallery (image_url, title, description, sort_order, published) VALUES (?, ?, ?, ?, 1)');
    for (const [img, title, desc, sort] of galleryItems) {
      insertGal.run(img, title, desc, sort);
    }
  }
}

module.exports = { getDb };
