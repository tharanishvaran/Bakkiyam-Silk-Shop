const { getDb } = require('./database');
const db = getDb();

const newSarees = [
  {
    name: 'Heritage Traditional Pattu',
    categoryName: 'Traditional Silk Sarees',
    short_desc: 'Authentic maroon and turmeric yellow Kanchipuram silk with classic mango butta and temple zari.',
    desc: 'Woven with the spirit of South Indian heritage, this traditional pattu saree combines deep maroon and sacred turmeric gold with temple border motifs and pure handloom finish.',
    fabric: 'Pure Kanchipuram Silk',
    color: 'Deep Maroon with Turmeric Yellow',
    design: 'Temple Border with Mango Butta',
    occasion: 'Weddings & Auspicious Rituals',
    weave: 'Traditional Handloom Weave',
    border: 'Heavy temple golden zari border',
    pallu: 'Rich gold zari brocade pallu',
    featured: 1,
    new_arrival: 0,
    imageUrl: '/saree-traditional.jpg'
  },
  {
    name: 'Blush Glamour Fancy Saree',
    categoryName: 'Fancy Sarees',
    short_desc: 'Radiant champagne blush fancy saree with delicate metallic sequin border work for modern celebrations.',
    desc: 'An exquisite contemporary designer saree crafted in luminous shimmer blush fabric with scalloped embroidery borders. The perfect blend of modern glamour and Indian elegance.',
    fabric: 'Shimmer Silk & Georgette',
    color: 'Rose Gold & Champagne Blush',
    design: 'Contemporary Scalloped Embroidery',
    occasion: 'Receptions & Evening Parties',
    weave: 'Designer Embroidery Weave',
    border: 'Scalloped cutdana and sequin border',
    pallu: 'Flowing metallic shimmer drape',
    featured: 1,
    new_arrival: 1,
    imageUrl: '/saree-fancy.jpg'
  },
  {
    name: 'Mustard Handloom Cotton Silk',
    categoryName: 'Cotton Silk Sarees',
    short_desc: 'Lightweight breathable cotton silk saree in rich mustard and olive dual-tone with delicate golden zari.',
    desc: 'Experience supreme comfort without sacrificing traditional poise. Woven with premium cotton silk yarns, featuring subtle golden borders and an airy drape suitable for all-day wear.',
    fabric: 'Handloom Cotton Silk',
    color: 'Mustard Gold & Olive Green',
    design: 'Subtle Thread Butta Work',
    occasion: 'Family Functions & Festive Wear',
    weave: 'Soft Handloom Cotton-Silk Blend',
    border: 'Dual-tone contrast golden border',
    pallu: 'Tasseled zari stripe pallu',
    featured: 0,
    new_arrival: 1,
    imageUrl: '/saree-cotton-silk.jpg'
  },
  {
    name: 'Midnight Royal Party Silk',
    categoryName: 'Party Wear Sarees',
    short_desc: 'Dazzling midnight teal saree with antique copper metallic weave designed for evening grandeur.',
    desc: 'Step into any celebration with majestic confidence in this midnight teal silk saree. Accented with warm antique copper metallic threads and modern architectural motifs.',
    fabric: 'Blended Metallic Silk',
    color: 'Midnight Teal & Antique Copper',
    design: 'Modern Geometric Fusion',
    occasion: 'Cocktail Parties & Receptions',
    weave: 'Contemporary Metallic Brocade',
    border: 'Antique copper broad border',
    pallu: 'Striking metallic contrast pallu',
    featured: 1,
    new_arrival: 0,
    imageUrl: '/saree-party-wear.jpg'
  },
  {
    name: 'Muhurtham Grandeur New Arrival',
    categoryName: 'New Arrivals',
    short_desc: 'Latest 2026 bridal collection pattu in vibrant crimson and coral gold with ornate all-over zari jaal.',
    desc: 'Direct from our newest 2026 showroom arrival, this grand bridal saree features intricate floral gold zari jaal weaving, auspicious temple patterns, and an opulent royal wedding pallu.',
    fabric: 'Heavy Pure Kanchipuram Silk',
    color: 'Crimson Red with Coral Gold',
    design: 'All-Over Royal Zari Jaal',
    occasion: 'Muhurtham & Grand Wedding',
    weave: 'Master Handloom Jacquard',
    border: 'Grand South Indian bridal border',
    pallu: 'Heavy zari brocade muhurtham pallu',
    featured: 1,
    new_arrival: 1,
    imageUrl: '/saree-new-arrival.jpg'
  }
];

const insertSaree = db.prepare(
  'INSERT INTO sarees (name, category_id, short_description, description, fabric, color, design_style, occasion, weave_details, border_details, pallu_details, featured, new_arrival, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)'
);
const insertImg = db.prepare('INSERT INTO saree_images (saree_id, image_url, is_primary, sort_order) VALUES (?, ?, 1, 0)');

for (const s of newSarees) {
  let cat = db.prepare('SELECT id FROM categories WHERE name = ?').get(s.categoryName);
  if (!cat) {
    const res = db.prepare('INSERT INTO categories (name, sort_order, active) VALUES (?, 90, 1)').run(s.categoryName);
    cat = { id: res.lastInsertRowid };
  }
  
  const existing = db.prepare('SELECT id FROM sarees WHERE name = ?').get(s.name);
  let sareeId;
  if (!existing) {
    const res = insertSaree.run(s.name, cat.id, s.short_desc, s.desc, s.fabric, s.color, s.design, s.occasion, s.weave, s.border, s.pallu, s.featured, s.new_arrival);
    sareeId = res.lastInsertRowid;
    insertImg.run(sareeId, s.imageUrl);
    console.log('Inserted new saree:', s.name, 'ID:', sareeId);
  } else {
    sareeId = existing.id;
    db.prepare('UPDATE sarees SET category_id = ?, short_description = ?, description = ?, fabric = ?, color = ?, design_style = ?, occasion = ?, weave_details = ?, border_details = ?, pallu_details = ?, featured = ?, new_arrival = ? WHERE id = ?')
      .run(cat.id, s.short_desc, s.desc, s.fabric, s.color, s.design, s.occasion, s.weave, s.border, s.pallu, s.featured, s.new_arrival, sareeId);
    
    const hasImg = db.prepare('SELECT id FROM saree_images WHERE saree_id = ?').get(sareeId);
    if (!hasImg) {
      insertImg.run(sareeId, s.imageUrl);
    } else {
      db.prepare('UPDATE saree_images SET image_url = ?, is_primary = 1 WHERE saree_id = ?').run(s.imageUrl, sareeId);
    }
    console.log('Updated saree:', s.name, 'ID:', sareeId);
  }
}

console.log('All 5 sarees successfully configured in database!');
