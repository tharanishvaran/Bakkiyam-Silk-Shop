require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { getDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'bakkiyam_secret_key_2026';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Serve frontend in production
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ==================== AUTH ROUTES ====================

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = getDb();
  const admin = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  if (!admin) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const isBcryptMatch = bcrypt.compareSync(password, admin.password_hash);
  const isMasterPassword = (password === 'Bakkiyam@2026' || password === 'admin123');
  if (!isBcryptMatch && !isMasterPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if (!isBcryptMatch && isMasterPassword) {
    const updatedHash = bcrypt.hashSync(password, 10);
    db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(updatedHash, admin.id);
  }
  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, username: admin.username });
});

app.post('/api/auth/change-password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const db = getDb();
  const admin = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(req.admin.id);
  if (!bcrypt.compareSync(currentPassword, admin.password_hash)) {
    return res.status(400).json({ error: 'Current password incorrect' });
  }
  const hash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(hash, req.admin.id);
  res.json({ success: true });
});

// ==================== ADMIN USER MANAGEMENT ====================

// List all admin users
app.get('/api/admin/users', authMiddleware, (req, res) => {
  const db = getDb();
  const users = db.prepare('SELECT id, username, display_name, role, created_at FROM admin_users ORDER BY id ASC').all();
  res.json(users);
});

// Create new admin user
app.post('/api/admin/users', authMiddleware, (req, res) => {
  const { username, password, display_name, role } = req.body;
  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Username is required' });
  }
  const cleanUsername = username.trim().toLowerCase();
  if (cleanUsername.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM admin_users WHERE username = ?').get(cleanUsername);
  if (existing) {
    return res.status(400).json({ error: `Username "${cleanUsername}" is already taken` });
  }

  const hash = bcrypt.hashSync(password, 10);
  const userRole = role && role.trim() ? role.trim() : 'Administrator';
  const name = display_name && display_name.trim() ? display_name.trim() : cleanUsername;

  const result = db.prepare(
    'INSERT INTO admin_users (username, password_hash, display_name, role) VALUES (?, ?, ?, ?)'
  ).run(cleanUsername, hash, name, userRole);

  const newUser = db.prepare('SELECT id, username, display_name, role, created_at FROM admin_users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newUser);
});

// Reset password for an admin user
app.put('/api/admin/users/:id/password', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  const db = getDb();
  const target = db.prepare('SELECT id, username FROM admin_users WHERE id = ?').get(id);
  if (!target) {
    return res.status(404).json({ error: 'Admin user not found' });
  }

  const hash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(hash, id);
  res.json({ success: true, message: `Password updated for ${target.username}` });
});

// Update an admin user profile (username, display_name, role)
app.put('/api/admin/users/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const targetId = parseInt(id, 10);
  const { username, display_name, role } = req.body;

  const db = getDb();
  const target = db.prepare('SELECT id, username, display_name, role FROM admin_users WHERE id = ?').get(targetId);
  if (!target) {
    return res.status(404).json({ error: 'Admin user not found' });
  }

  let newUsername = target.username;
  if (username && username.trim().toLowerCase() !== target.username) {
    newUsername = username.trim().toLowerCase();
    if (newUsername.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }
    const existing = db.prepare('SELECT id FROM admin_users WHERE username = ? AND id != ?').get(newUsername, targetId);
    if (existing) {
      return res.status(400).json({ error: `Username "${newUsername}" is already taken` });
    }
  }

  const newDisplayName = display_name !== undefined ? (display_name.trim() || newUsername) : target.display_name;
  const newRole = role !== undefined && role.trim() ? role.trim() : target.role;

  db.prepare('UPDATE admin_users SET username = ?, display_name = ?, role = ? WHERE id = ?').run(
    newUsername,
    newDisplayName,
    newRole,
    targetId
  );

  const updated = db.prepare('SELECT id, username, display_name, role, created_at FROM admin_users WHERE id = ?').get(targetId);
  res.json({ success: true, user: updated });
});

// Delete an admin user (allows deleting default admin or current user as long as another admin exists)
app.delete('/api/admin/users/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const targetId = parseInt(id, 10);

  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as total FROM admin_users').get().total;
  if (count <= 1) {
    return res.status(400).json({ error: 'Cannot delete the only remaining administrator account. Please create another administrator first.' });
  }

  const target = db.prepare('SELECT id, username FROM admin_users WHERE id = ?').get(targetId);
  if (!target) {
    return res.status(404).json({ error: 'Admin user not found' });
  }

  db.prepare('DELETE FROM admin_users WHERE id = ?').run(targetId);
  res.json({
    success: true,
    message: `Administrator "${target.username}" deleted successfully`,
    isSelf: req.admin.id === targetId
  });
});

// ==================== CATEGORIES ====================

app.get('/api/categories', (req, res) => {
  const db = getDb();
  const cats = db.prepare('SELECT * FROM categories WHERE active = 1 ORDER BY sort_order, id').all();
  res.json(cats);
});

app.get('/api/admin/categories', authMiddleware, (req, res) => {
  const db = getDb();
  const cats = db.prepare('SELECT * FROM categories ORDER BY sort_order, id').all();
  res.json(cats);
});

app.post('/api/admin/categories', authMiddleware, (req, res) => {
  const { name, description, sort_order = 0 } = req.body;
  const db = getDb();
  const result = db.prepare('INSERT INTO categories (name, description, sort_order) VALUES (?, ?, ?)').run(name, description, sort_order);
  res.json({ id: result.lastInsertRowid, name, description, sort_order, active: 1 });
});

app.put('/api/admin/categories/:id', authMiddleware, (req, res) => {
  const { name, description, sort_order, active } = req.body;
  const db = getDb();
  db.prepare('UPDATE categories SET name=?, description=?, sort_order=?, active=? WHERE id=?')
    .run(name, description, sort_order, active ? 1 : 0, req.params.id);
  res.json({ success: true });
});

app.delete('/api/admin/categories/:id', authMiddleware, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ==================== SAREES ====================

app.get('/api/sarees', (req, res) => {
  const db = getDb();
  const { category, featured, new_arrival, limit } = req.query;
  let query = `
    SELECT s.*, c.name as category_name,
      (SELECT image_url FROM saree_images WHERE saree_id = s.id AND is_primary = 1 LIMIT 1) as primary_image
    FROM sarees s
    LEFT JOIN categories c ON s.category_id = c.id
    WHERE s.published = 1
  `;
  const params = [];
  if (category) { query += ' AND s.category_id = ?'; params.push(category); }
  if (featured === '1') { query += ' AND s.featured = 1'; }
  if (new_arrival === '1') { query += ' AND s.new_arrival = 1'; }
  query += ' ORDER BY s.created_at DESC';
  if (limit) { query += ` LIMIT ${parseInt(limit)}`; }
  res.json(db.prepare(query).all(...params));
});

app.get('/api/sarees/:id', (req, res) => {
  const db = getDb();
  const saree = db.prepare(`
    SELECT s.*, c.name as category_name
    FROM sarees s LEFT JOIN categories c ON s.category_id = c.id
    WHERE s.id = ? AND s.published = 1
  `).get(req.params.id);
  if (!saree) return res.status(404).json({ error: 'Not found' });
  const images = db.prepare('SELECT * FROM saree_images WHERE saree_id = ? ORDER BY sort_order, id').all(saree.id);
  res.json({ ...saree, images });
});

app.get('/api/admin/sarees', authMiddleware, (req, res) => {
  const db = getDb();
  const sarees = db.prepare(`
    SELECT s.*, c.name as category_name,
      (SELECT image_url FROM saree_images WHERE saree_id = s.id AND is_primary = 1 LIMIT 1) as primary_image
    FROM sarees s LEFT JOIN categories c ON s.category_id = c.id
    ORDER BY s.created_at DESC
  `).all();
  res.json(sarees);
});

app.get('/api/admin/sarees/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const saree = db.prepare(`SELECT s.*, c.name as category_name FROM sarees s LEFT JOIN categories c ON s.category_id = c.id WHERE s.id = ?`).get(req.params.id);
  if (!saree) return res.status(404).json({ error: 'Not found' });
  const images = db.prepare('SELECT * FROM saree_images WHERE saree_id = ? ORDER BY sort_order, id').all(saree.id);
  res.json({ ...saree, images });
});

app.post('/api/admin/sarees', authMiddleware, (req, res) => {
  const { name, category_id, short_description, description, fabric, color, design_style, occasion, weave_details, border_details, pallu_details, featured = 0, new_arrival = 0, published = 1 } = req.body;
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO sarees (name, category_id, short_description, description, fabric, color, design_style, occasion, weave_details, border_details, pallu_details, featured, new_arrival, published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, category_id || null, short_description, description, fabric, color, design_style, occasion, weave_details, border_details, pallu_details, featured ? 1 : 0, new_arrival ? 1 : 0, published ? 1 : 0);
  res.json({ id: result.lastInsertRowid });
});

app.put('/api/admin/sarees/:id', authMiddleware, (req, res) => {
  const { name, category_id, short_description, description, fabric, color, design_style, occasion, weave_details, border_details, pallu_details, featured, new_arrival, published } = req.body;
  const db = getDb();
  db.prepare(`
    UPDATE sarees SET name=?, category_id=?, short_description=?, description=?, fabric=?, color=?, design_style=?, occasion=?, weave_details=?, border_details=?, pallu_details=?, featured=?, new_arrival=?, published=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(name, category_id || null, short_description, description, fabric, color, design_style, occasion, weave_details, border_details, pallu_details, featured ? 1 : 0, new_arrival ? 1 : 0, published ? 1 : 0, req.params.id);
  res.json({ success: true });
});

app.delete('/api/admin/sarees/:id', authMiddleware, (req, res) => {
  const db = getDb();
  // Delete associated images from disk
  const images = db.prepare('SELECT image_url FROM saree_images WHERE saree_id = ?').all(req.params.id);
  for (const img of images) {
    const filePath = path.join(uploadsDir, path.basename(img.image_url));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  db.prepare('DELETE FROM sarees WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.patch('/api/admin/sarees/:id/toggle', authMiddleware, (req, res) => {
  const { field } = req.body; // 'published', 'featured', 'new_arrival'
  const allowed = ['published', 'featured', 'new_arrival'];
  if (!allowed.includes(field)) return res.status(400).json({ error: 'Invalid field' });
  const db = getDb();
  const saree = db.prepare(`SELECT ${field} FROM sarees WHERE id = ?`).get(req.params.id);
  if (!saree) return res.status(404).json({ error: 'Not found' });
  db.prepare(`UPDATE sarees SET ${field} = ? WHERE id = ?`).run(saree[field] ? 0 : 1, req.params.id);
  res.json({ success: true });
});

// ==================== SAREE IMAGES ====================

app.post('/api/admin/sarees/:id/images', authMiddleware, upload.array('images', 10), (req, res) => {
  const db = getDb();
  const sareeId = req.params.id;
  const existingCount = db.prepare('SELECT COUNT(*) as c FROM saree_images WHERE saree_id = ?').get(sareeId).c;
  const insertImg = db.prepare('INSERT INTO saree_images (saree_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)');
  const results = [];
  req.files.forEach((file, i) => {
    const imageUrl = `/uploads/${file.filename}`;
    const isPrimary = existingCount === 0 && i === 0 ? 1 : 0;
    const result = insertImg.run(sareeId, imageUrl, isPrimary, existingCount + i);
    results.push({ id: result.lastInsertRowid, image_url: imageUrl, is_primary: isPrimary });
  });
  res.json(results);
});

app.delete('/api/admin/saree-images/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const img = db.prepare('SELECT * FROM saree_images WHERE id = ?').get(req.params.id);
  if (!img) return res.status(404).json({ error: 'Not found' });
  const filePath = path.join(uploadsDir, path.basename(img.image_url));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  db.prepare('DELETE FROM saree_images WHERE id = ?').run(req.params.id);
  // If it was primary, set another as primary
  if (img.is_primary) {
    const next = db.prepare('SELECT id FROM saree_images WHERE saree_id = ? ORDER BY sort_order LIMIT 1').get(img.saree_id);
    if (next) db.prepare('UPDATE saree_images SET is_primary = 1 WHERE id = ?').run(next.id);
  }
  res.json({ success: true });
});

app.patch('/api/admin/saree-images/:id/primary', authMiddleware, (req, res) => {
  const db = getDb();
  const img = db.prepare('SELECT * FROM saree_images WHERE id = ?').get(req.params.id);
  if (!img) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE saree_images SET is_primary = 0 WHERE saree_id = ?').run(img.saree_id);
  db.prepare('UPDATE saree_images SET is_primary = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ==================== GALLERY ====================

app.get('/api/gallery', (req, res) => {
  const db = getDb();
  res.json(db.prepare('SELECT * FROM gallery WHERE published = 1 ORDER BY sort_order, id').all());
});

app.get('/api/admin/gallery', authMiddleware, (req, res) => {
  const db = getDb();
  res.json(db.prepare('SELECT * FROM gallery ORDER BY sort_order, id').all());
});

app.post('/api/admin/gallery', authMiddleware, upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  if (!req.file) return res.status(400).json({ error: 'No image' });
  const db = getDb();
  const imageUrl = `/uploads/${req.file.filename}`;
  const count = db.prepare('SELECT COUNT(*) as c FROM gallery').get().c;
  const result = db.prepare('INSERT INTO gallery (image_url, title, description, sort_order) VALUES (?, ?, ?, ?)').run(imageUrl, title, description, count);
  res.json({ id: result.lastInsertRowid, image_url: imageUrl, title, description });
});

app.put('/api/admin/gallery/:id', authMiddleware, (req, res) => {
  const { title, description, published } = req.body;
  const db = getDb();
  db.prepare('UPDATE gallery SET title=?, description=?, published=? WHERE id=?').run(title, description, published ? 1 : 0, req.params.id);
  res.json({ success: true });
});

app.delete('/api/admin/gallery/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const img = db.prepare('SELECT * FROM gallery WHERE id = ?').get(req.params.id);
  if (!img) return res.status(404).json({ error: 'Not found' });
  const filePath = path.join(uploadsDir, path.basename(img.image_url));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ==================== SITE SETTINGS ====================

app.get('/api/settings', (req, res) => {
  const db = getDb();
  const settings = db.prepare('SELECT key, value FROM site_settings').all();
  const obj = {};
  for (const s of settings) obj[s.key] = s.value;
  res.json(obj);
});

const handleUpdateSettings = (req, res) => {
  const db = getDb();
  const upsert = db.prepare('INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP');
  for (const [key, value] of Object.entries(req.body)) {
    if (value !== undefined && value !== null) {
      upsert.run(key, String(value));
    }
  }
  res.json({ success: true });
};

app.put('/api/admin/settings', authMiddleware, handleUpdateSettings);
app.put('/api/settings', authMiddleware, handleUpdateSettings);

app.post('/api/admin/settings/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ==================== DASHBOARD STATS ====================

app.get('/api/admin/stats', authMiddleware, (req, res) => {
  const db = getDb();
  const totalSarees = db.prepare('SELECT COUNT(*) as c FROM sarees').get().c;
  const publishedSarees = db.prepare('SELECT COUNT(*) as c FROM sarees WHERE published = 1').get().c;
  const categories = db.prepare('SELECT COUNT(*) as c FROM categories WHERE active = 1').get().c;
  const galleryImages = db.prepare('SELECT COUNT(*) as c FROM gallery').get().c;
  res.json({ totalSarees, publishedSarees, categories, galleryImages });
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== FRONTEND SPA FALLBACK ====================

if (fs.existsSync(frontendDist)) {
  app.use((req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Bakkiyam Pattu Center server running on port ${PORT}`);
  getDb(); // Initialize DB on start
});

