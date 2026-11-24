/**
 * All Saints Public School - Node.js Express & MySQL Backend
 * Main Server Entry Point
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
app.set('trust proxy', 1); // running behind Nginx

// ─── JWT CONFIG ───────────────────────────────────────────────────────────
const IS_PROD = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || '';
if (IS_PROD && (!JWT_SECRET || JWT_SECRET.length < 32 || /asps_secret_key/i.test(JWT_SECRET))) {
  console.error('[FATAL] Set a strong JWT_SECRET (32+ random chars) in .env before running in production.');
  process.exit(1);
}
const SIGNING_SECRET = JWT_SECRET || crypto.randomBytes(32).toString('hex'); // dev fallback (tokens reset on restart)

// ─── School Email Configuration ─────────────────────────────────────────────
const SCHOOL_EMAIL = 'allsaintsschool501@gmail.com';
const SCHOOL_PHONE = '+91-7356804100';

// Nodemailer transporter (Gmail SMTP via app password)
// To activate: set GMAIL_APP_PASSWORD env var in .env file
// e.g. GMAIL_APP_PASSWORD=your_16_char_app_password
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SCHOOL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD || '',
  },
});

// Helper to send email notification to school
async function sendEmailToSchool({ subject, html }) {
  if (!process.env.GMAIL_APP_PASSWORD) return; // skip if not configured
  try {
    await emailTransporter.sendMail({
      from: `"All Saints Public School System" <${SCHOOL_EMAIL}>`,
      to: SCHOOL_EMAIL,
      subject,
      html,
    });
  } catch (err) {
    console.error('[Email] Failed to send notification:', err.message);
  }
}

// Middleware
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    // Same-origin / server-to-server requests have no Origin header
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    if (!IS_PROD && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return cb(null, true);
    return cb(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────
// Public visitors may only: read content, submit admission/complaint/contact forms,
// track their own application/ticket, and log in. Everything else needs a valid admin JWT.
function isPublicRequest(req) {
  const p = req.path.replace(/\/+$/, '');
  if (req.method === 'OPTIONS') return true;
  if (req.method === 'POST' && ['/auth/login', '/admissions', '/complaints', '/contact'].includes(p)) return true;
  if (req.method === 'GET') {
    // Applicant / complaint lists contain personal data: admin only, except single-record tracking lookups
    if (p === '/admissions') return !!(req.query.app_no && req.query.pin);
    if (p === '/complaints') return !!req.query.ticket;
    if (p === '/contact') return false;
    return true;
  }
  return false;
}

function requireAuth(req, res, next) {
  if (isPublicRequest(req)) return next();
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  try {
    req.admin = jwt.verify(token, SIGNING_SECRET);
    return next();
  } catch (e) {
    return res.status(401).json({ status: 'error', message: 'Authentication required. Please log in again.' });
  }
}
app.use('/api', requireAuth);

// Simple in-memory brute-force limiter for login (per IP)
const loginAttempts = new Map();
function loginRateLimit(req, res, next) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const rec = loginAttempts.get(req.ip) || { count: 0, start: now };
  if (now - rec.start > windowMs) { rec.count = 0; rec.start = now; }
  if (rec.count >= 10) {
    return res.status(429).json({ status: 'error', message: 'Too many login attempts. Try again in 15 minutes.' });
  }
  rec.count += 1;
  loginAttempts.set(req.ip, rec);
  req._loginRec = rec;
  next();
}

// Middleware to safely handle invalid/malformed JSON in requests without crashing
app.use((err, req, res, next) => {
  if (err && (err.type === 'entity.parse.failed' || err instanceof SyntaxError)) {
    return res.status(400).json({ status: 'error', message: 'Malformed JSON payload.' });
  }
  next(err);
});

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// MySQL Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'allsaints',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test Database Connection & Ensure Column Sizes
pool.getConnection()
  .then(async conn => {
    console.log(`[Database] Successfully connected to MySQL: ${process.env.DB_NAME || 'allsaints'}`);
    conn.release();
    try {
      // Ensure photo_url, quote, and bio use LONGTEXT so Base64 and long text never fail
      await pool.query(`
        ALTER TABLE management_members 
        MODIFY COLUMN photo_url LONGTEXT,
        MODIFY COLUMN quote LONGTEXT,
        MODIFY COLUMN bio LONGTEXT
      `);
      // Clean temporary test rows
      await pool.query("DELETE FROM management_members WHERE name LIKE 'Test%'");
      await pool.query("DELETE FROM committee_members WHERE name LIKE 'sasasa%' OR name LIKE 'Fr. Philipose Charivupurayidathil %' OR name LIKE 'Fr. Philipose Charivupurayidathil a%'");

      // Ensure gallery_albums has is_featured column
      try {
        await pool.query("ALTER TABLE gallery_albums ADD COLUMN is_featured TINYINT(1) DEFAULT 0");
      } catch (colErr) {
        // column already exists
      }

      // Seed official gallery albums if table has fewer than 5 albums
      const [existingAlbums] = await pool.query("SELECT COUNT(*) as count FROM gallery_albums");
      if (existingAlbums[0].count < 5) {
        const defaultAlbums = [
          { title: "Karate Sessions", subtitle: "Build up Self defence", category: "Martial Arts", cover: "/images/school_content/1774685585-96686839769c78d9152c1b_WhatsApp_Image_2026-03-03_at_11.50.59_AM.jpeg", featured: 1, order: 1 },
          { title: "Sports", subtitle: "Athletic Excellence & Champions", category: "Sports Day", cover: "/images/school_content/1774685426-47014966169c78cf275d5b_Screenshot_2026-03-28_133946.png", featured: 1, order: 2 },
          { title: "Nature club and farm visit", subtitle: "Exploring Nature", category: "Eco Club", cover: "/images/school_content/1774684577-113630572269c789a155891_farm.jpeg", featured: 1, order: 3 },
          { title: "Main Campus & Infrastructure Block", subtitle: "Eco-Friendly 10-Acre Campus", category: "Infrastructure", cover: "/images/school_content/1773902398-126526803569bb9a3e60523_infra.jpg", featured: 0, order: 4 },
          { title: "Educational Blocks & Laboratories", subtitle: "Modern Amenities & Practical Labs", category: "Facilities", cover: "/images/school_content/1773902398-212600336869bb9a3e5ae72_infra1.jpg", featured: 0, order: 5 },
          { title: "School Library & Resource Room", subtitle: "Rich Knowledge Repository", category: "Library", cover: "/images/school_content/1773902398-97681020769bb9a3e580eb_library.jpg", featured: 0, order: 6 },
          { title: "School Bus Fleet", subtitle: "Safe & Disciplined Transport", category: "Conveyance", cover: "/images/school_content/1773902602-131014106869bb9b0a29dea_bus.jpg", featured: 0, order: 7 },
          { title: "School Faculty & Mentors", subtitle: "Dedicated Teaching Staff", category: "Faculty", cover: "/images/school_content/1773902602-182554790869bb9b0a0ee16_faculty.jpg", featured: 0, order: 8 },
          { title: "CBSE Board Examination Toppers", subtitle: "Class XII & X Academic Laurels", category: "Academics", cover: "/images/school_content/1779345475-8217333446a0ea843eda53_WhatsApp_Image_2026-05-20_at_10.03.38_AM.jpeg", featured: 0, order: 9 },
          { title: "Campus Activity & Student Practice", subtitle: "All Saints Public School, Adoor", category: "Activities", cover: "/images/school_content/1773908752-173959853269bbb3108cd3c_WhatsApp_Image_2026-03-03_at_11.50.59_AM.jpeg", featured: 0, order: 10 },
          { title: "Sports & Field Day Highlights", subtitle: "All Saints Public School, Adoor", category: "Sports", cover: "/images/school_content/1773909027-4939578469bbb42338cc6_WhatsApp_Image_2026-03-03_at_11.54.31_AM_(1).jpeg", featured: 0, order: 11 }
        ];
        for (const a of defaultAlbums) {
          const [exists] = await pool.query("SELECT id FROM gallery_albums WHERE title = ?", [a.title]);
          if (exists.length === 0) {
            await pool.query(
              "INSERT INTO gallery_albums (title, subtitle, category, cover_image_url, is_featured, display_order) VALUES (?, ?, ?, ?, ?, ?)",
              [a.title, a.subtitle, a.category, a.cover, a.featured, a.order]
            );
          }
        }
      }

      // Seed official gallery videos if table is empty
      const [existingVideos] = await pool.query("SELECT COUNT(*) as count FROM gallery_videos");
      if (existingVideos[0].count === 0) {
        const defaultVideos = [
          { title: "Saintsian Olympics 2K26 @ Kodumon Stadium - Session 6", category: "Sports & Athletics", url: "https://www.youtube.com/watch?v=MTEOCQBDy4o", duration: "12:40" },
          { title: "Saintsian Olympics 2K26 @ Kodumon Stadium - Session 5", category: "Sports & Athletics", url: "https://www.youtube.com/watch?v=GEs8hbeXuuQ", duration: "14:15" },
          { title: "Saintsian Olympics 2K26 @ Kodumon Stadium - Session 4", category: "Sports & Athletics", url: "https://www.youtube.com/watch?v=vkxLmiMgDdk", duration: "18:22" },
          { title: "Saintsian Olympics 2K26 @ Kodumon Stadium - Session 3", category: "Sports & Athletics", url: "https://www.youtube.com/watch?v=wjV8p3uiw58", duration: "16:05" },
          { title: "Saintsian Olympics 2K26 @ Kodumon Stadium - Session 2", category: "Sports & Athletics", url: "https://www.youtube.com/watch?v=uFqSzaoz9g0", duration: "15:30" },
          { title: "Saintsian Olympics 2K26 @ Kodumon Stadium - Grand Opening", category: "Sports & Athletics", url: "https://www.youtube.com/watch?v=2o0SRVKmFAM", duration: "20:10" },
          { title: "Kids Sports Meet & Athletic Fun Day", category: "Sports & Athletics", url: "https://www.youtube.com/watch?v=BqvPke7STXM", duration: "08:45" },
          { title: "School Football Match & Training Drills", category: "Sports & Athletics", url: "https://www.youtube.com/watch?v=jYVSrtKqiRE", duration: "11:20" }
        ];
        for (const v of defaultVideos) {
          await pool.query(
            "INSERT INTO gallery_videos (title, category, youtube_url, duration) VALUES (?, ?, ?, ?)",
            [v.title, v.category, v.url, v.duration]
          );
        }
      }
    } catch (e) {
      // Alter completed or table already has correct types
    }
    syncAllModulesToDisk();
  })
  .catch(err => {
    console.error(`[Database Error] Could not connect to MySQL:`, err.message);
  });

// ─── VS CODE LIVE DATA SYNCHRONIZATION ────────────────────────────────────
// Mirrors all MySQL database tables directly into readable JSON files in
// C:\AllSaintswebsite\backend\data\ so you can inspect all updated and deleted
// items directly in your VS Code Explorer!
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function logActivity(action, moduleName, itemTitle, details = {}) {
  try {
    const logFile = path.join(dataDir, 'activity_log.json');
    let logs = [];
    if (fs.existsSync(logFile)) {
      try { logs = JSON.parse(fs.readFileSync(logFile, 'utf8')); } catch {}
    }
    const newEntry = {
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      action, // 'ADDED' | 'UPDATED' | 'DELETED'
      module: moduleName,
      item: itemTitle,
      details,
    };
    logs.unshift(newEntry);
    if (logs.length > 300) logs = logs.slice(0, 300);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf8');
    console.log(`[VS Code Activity Log] [${action}] ${moduleName}: "${itemTitle}"`);
  } catch (err) {
    console.error('Error logging activity to disk:', err.message);
  }
}

async function syncTableToJson(tableName, jsonFileName, orderBy = 'id ASC') {
  try {
    const [rows] = await pool.query(`SELECT * FROM ${tableName} ORDER BY ${orderBy}`);
    const filePath = path.join(dataDir, jsonFileName);
    fs.writeFileSync(filePath, JSON.stringify(rows, null, 2), 'utf8');
  } catch (err) {
    console.error(`Failed to sync table ${tableName} to JSON:`, err.message);
  }
}

async function syncAllModulesToDisk() {
  try {
    await syncTableToJson('management_members', 'management.json', 'display_order ASC, id ASC');
    await syncTableToJson('committee_members', 'committee.json', 'committee_type ASC, display_order ASC');
    await syncTableToJson('faculty_members', 'faculty.json', 'display_order ASC, id ASC');
    await syncTableToJson('annual_reports', 'annual_reports.json', 'published_at DESC');
    await syncTableToJson('achievements', 'achievements.json', 'event_date DESC');
    await syncTableToJson('enrollment_statistics', 'enrollment.json', 'id ASC');
    await syncTableToJson('fee_structures', 'fee_structure.json', 'id ASC');
    await syncTableToJson('academic_calendar_events', 'calendar.json', 'start_date ASC');
    await syncTableToJson('student_parliament', 'parliament.json', 'display_order ASC');
    await syncTableToJson('board_results', 'results.json', 'academic_year DESC');
    await syncTableToJson('admission_applications', 'admissions.json', 'created_at DESC');
    await syncTableToJson('gallery_albums', 'gallery_albums.json', 'display_order ASC, id DESC');
    await syncTableToJson('gallery_videos', 'gallery_videos.json', 'id DESC');
    await syncTableToJson('news_bulletins', 'news.json', 'publish_date DESC, id DESC');
    await syncTableToJson('statutory_documents', 'documents.json', 'display_order ASC');
    await syncTableToJson('complaints_grievances', 'complaints.json', 'created_at DESC');
    await syncTableToJson('contact_enquiries', 'contact_enquiries.json', 'created_at DESC');
    await syncTableToJson('hero_slides', 'hero_slides.json', 'display_order ASC, id ASC');
    console.log('[VS Code Live Sync] All 17 school modules mirrored to backend/data/ for VS Code view.');
  } catch (err) {
    console.error('Error syncing modules to disk on startup:', err.message);
  }
}

// Multer Storage for File / Photo / PDF Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `asps_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|pdf/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: jpg, png, webp, pdf'));
    }
  }
});

// ─── HEALTH CHECK & API DIRECTORY ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: 'All Saints Public School - Node.js Express Backend',
    status: 'ONLINE',
    version: '1.0.0',
    port: PORT,
    database: process.env.DB_NAME || 'allsaints',
    modules: 16
  });
});

// ─── FILE UPLOAD ROUTE ────────────────────────────────────────────────────
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;

  // Automatically mirror upload to frontend/public/uploads so Next.js on port 3000 serves it instantly
  try {
    const frontendUploadDir = path.join(__dirname, '..', 'Allsaints-frontend', 'public', 'uploads');
    if (!fs.existsSync(frontendUploadDir)) {
      fs.mkdirSync(frontendUploadDir, { recursive: true });
    }
    const targetPath = path.join(frontendUploadDir, req.file.filename);
    fs.copyFileSync(req.file.path, targetPath);
  } catch (copyErr) {
    console.error('Failed to mirror upload to frontend/public/uploads:', copyErr.message);
  }

  res.json({
    status: 'success',
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size
  });
});

// ─── ADMIN AUTH ROUTE ─────────────────────────────────────────────────────
app.post('/api/auth/login', loginRateLimit, async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ status: 'error', message: 'Username and password required' });
    }

    const cleanUser = String(username).trim().toLowerCase();
    const cleanPass = String(password).trim();

    const [rows] = await pool.query(
      'SELECT * FROM admin_users WHERE (LOWER(TRIM(username)) = ? OR LOWER(TRIM(email)) = ?) AND is_active = 1 LIMIT 1',
      [cleanUser, cleanUser]
    );
    const user = rows.length > 0 ? rows[0] : null;

    let isValid = false;
    if (user) {
      const stored = String(user.password_hash || '').trim();
      if (/^\$2[aby]\$/.test(stored)) {
        isValid = await bcrypt.compare(cleanPass, stored);
      } else if (stored) {
        // Legacy plaintext value from the original seed: compare safely, then upgrade to bcrypt
        const a = Buffer.from(cleanPass);
        const b = Buffer.from(stored);
        isValid = a.length === b.length && crypto.timingSafeEqual(a, b);
        if (isValid) {
          try {
            await pool.query('UPDATE admin_users SET password_hash = ? WHERE id = ?', [await bcrypt.hash(cleanPass, 10), user.id]);
          } catch (e) {}
        }
      }
    }

    if (isValid && user) {
      if (req._loginRec) req._loginRec.count = 0;
      try {
        await pool.query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);
      } catch (e) {}

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        SIGNING_SECRET,
        { expiresIn: '12h' }
      );
      return res.json({
        status: 'success',
        message: 'Login successful',
        token,
        user: { id: user.id, username: user.username, email: user.email, role: user.role }
      });
    }

    return res.status(401).json({ status: 'error', message: 'Access denied. Only authorized school administrators are permitted to log in.' });
  } catch (err) {
    console.error('[Auth]', err.message);
    res.status(500).json({ status: 'error', message: 'Login failed. Please try again.' });
  }
});

// ─── 1. OUR MANAGEMENT ────────────────────────────────────────────────────
app.get('/api/management', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM management_members ORDER BY display_order ASC, id ASC');
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/management', async (req, res) => {
  try {
    const { id, name, role, sub_role, photo_url, quote, bio, display_order, is_patron } = req.body;
    
    // Check if member already exists by numeric ID or by Name
    let existing = [];
    if (id && !isNaN(Number(id))) {
      [existing] = await pool.query('SELECT id FROM management_members WHERE id = ?', [Number(id)]);
    } else if (name) {
      [existing] = await pool.query('SELECT id FROM management_members WHERE name = ?', [name.trim()]);
    }

    if (existing.length > 0) {
      const targetId = existing[0].id;
      await pool.query(
        'UPDATE management_members SET name=?, role=?, sub_role=?, photo_url=COALESCE(NULLIF(?, ""), photo_url), quote=?, bio=?, display_order=?, is_patron=? WHERE id=?',
        [name, role, sub_role || null, photo_url || null, quote || null, bio || null, display_order || 1, is_patron ? 1 : 0, targetId]
      );
      await syncTableToJson('management_members', 'management.json', 'display_order ASC, id ASC');
      logActivity('UPDATED', 'Our Management', name, { role, sub_role, id: targetId });
      return res.json({ status: 'success', message: 'Member updated', id: targetId });
    }

    const [result] = await pool.query(
      'INSERT INTO management_members (name, role, sub_role, photo_url, quote, bio, display_order, is_patron) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, role, sub_role || null, photo_url || '/images/management/principal.jpg', quote || null, bio || null, display_order || 1, is_patron ? 1 : 0]
    );
    await syncTableToJson('management_members', 'management.json', 'display_order ASC, id ASC');
    logActivity('ADDED', 'Our Management', name, { role, sub_role, id: result.insertId });
    res.json({ status: 'success', message: 'Member added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.put('/api/management', async (req, res) => {
  try {
    const { id, name, role, sub_role, photo_url, quote, bio, display_order, is_patron } = req.body;
    let targetId = id;
    if (!id || isNaN(Number(id))) {
      const [rows] = await pool.query('SELECT id FROM management_members WHERE name = ?', [name?.trim()]);
      if (rows.length > 0) {
        targetId = rows[0].id;
      }
    }

    if (targetId && !isNaN(Number(targetId))) {
      await pool.query(
        'UPDATE management_members SET name=?, role=?, sub_role=?, photo_url=COALESCE(NULLIF(?, ""), photo_url), quote=?, bio=?, display_order=?, is_patron=? WHERE id=?',
        [name, role, sub_role || null, photo_url || null, quote || null, bio || null, display_order || 1, is_patron ? 1 : 0, Number(targetId)]
      );
    } else {
      await pool.query(
        'UPDATE management_members SET role=?, sub_role=?, photo_url=COALESCE(NULLIF(?, ""), photo_url), quote=?, bio=?, display_order=?, is_patron=? WHERE name=?',
        [role, sub_role || null, photo_url || null, quote || null, bio || null, display_order || 1, is_patron ? 1 : 0, name?.trim()]
      );
    }
    await syncTableToJson('management_members', 'management.json', 'display_order ASC, id ASC');
    logActivity('UPDATED', 'Our Management', name, { role, sub_role, id: targetId });
    res.json({ status: 'success', message: 'Member updated', id: targetId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete('/api/management', async (req, res) => {
  try {
    const id = req.query.id || req.body?.id;
    const name = req.query.name || req.body?.name;
    
    let deleted = false;
    if (id && !isNaN(Number(id))) {
      const [delRes] = await pool.query('DELETE FROM management_members WHERE id=?', [Number(id)]);
      if (delRes.affectedRows > 0) deleted = true;
    }
    if (!deleted && name) {
      const [delRes] = await pool.query('DELETE FROM management_members WHERE name=?', [name.trim()]);
      if (delRes.affectedRows > 0) deleted = true;
    }
    if (!deleted && id) {
      await pool.query('DELETE FROM management_members WHERE id=? OR name=?', [id, id]);
    }
    await syncTableToJson('management_members', 'management.json', 'display_order ASC, id ASC');
    logActivity('DELETED', 'Our Management', name || `ID: ${id}`, { id });
    res.json({ status: 'success', message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 2. PTA & SMC ─────────────────────────────────────────────────────────
app.get('/api/committee', async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? 'SELECT * FROM committee_members WHERE committee_type = ? ORDER BY display_order ASC' : 'SELECT * FROM committee_members ORDER BY committee_type ASC, display_order ASC';
    const [rows] = await pool.query(query, type ? [type] : []);
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/committee', async (req, res) => {
  try {
    const { id, committee_type, name, designation, occupation, term_period, phone_number, photo_url, display_order } = req.body;
    
    // Check if member already exists by numeric ID or by Name + Committee Type
    let existing = [];
    if (id && !isNaN(Number(id))) {
      [existing] = await pool.query('SELECT id FROM committee_members WHERE id = ?', [Number(id)]);
    } else if (name) {
      [existing] = await pool.query('SELECT id FROM committee_members WHERE name = ? AND committee_type = ?', [name.trim(), committee_type || 'PTA']);
    }

    if (existing.length > 0) {
      const targetId = existing[0].id;
      await pool.query(
        'UPDATE committee_members SET committee_type=?, name=?, designation=?, occupation=?, term_period=?, phone_number=?, photo_url=COALESCE(NULLIF(?, ""), photo_url), display_order=? WHERE id=?',
        [committee_type || 'PTA', name, designation, occupation || null, term_period || '2025-2027', phone_number || null, photo_url || null, display_order || 1, targetId]
      );
      await syncTableToJson('committee_members', 'committee.json', 'committee_type ASC, display_order ASC');
      logActivity('UPDATED', 'PTA & SMC', name, { designation, committee_type, id: targetId });
      return res.json({ status: 'success', message: 'Committee member updated', id: targetId });
    }

    const [result] = await pool.query(
      'INSERT INTO committee_members (committee_type, name, designation, occupation, term_period, phone_number, photo_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [committee_type || 'PTA', name, designation, occupation || null, term_period || '2025-2027', phone_number || null, photo_url || null, display_order || 1]
    );
    await syncTableToJson('committee_members', 'committee.json', 'committee_type ASC, display_order ASC');
    logActivity('ADDED', 'PTA & SMC', name, { designation, committee_type, id: result.insertId });
    res.json({ status: 'success', message: 'Committee member added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.put('/api/committee', async (req, res) => {
  try {
    const { id, committee_type, name, designation, occupation, term_period, phone_number, photo_url, display_order } = req.body;
    let targetId = id;
    if (!id || isNaN(Number(id))) {
      const [rows] = await pool.query('SELECT id FROM committee_members WHERE name = ?', [name?.trim()]);
      if (rows.length > 0) targetId = rows[0].id;
    }

    if (targetId && !isNaN(Number(targetId))) {
      await pool.query(
        'UPDATE committee_members SET committee_type=?, name=?, designation=?, occupation=?, term_period=?, phone_number=?, photo_url=COALESCE(NULLIF(?, ""), photo_url), display_order=? WHERE id=?',
        [committee_type || 'PTA', name, designation, occupation || null, term_period || '2025-2027', phone_number || null, photo_url || null, display_order || 1, Number(targetId)]
      );
    } else {
      await pool.query(
        'UPDATE committee_members SET designation=?, occupation=?, term_period=?, phone_number=?, photo_url=COALESCE(NULLIF(?, ""), photo_url), display_order=? WHERE name=? AND committee_type=?',
        [designation, occupation || null, term_period || '2025-2027', phone_number || null, photo_url || null, display_order || 1, name?.trim(), committee_type || 'PTA']
      );
    }
    await syncTableToJson('committee_members', 'committee.json', 'committee_type ASC, display_order ASC');
    logActivity('UPDATED', 'PTA & SMC', name, { designation, committee_type, id: targetId });
    res.json({ status: 'success', message: 'Committee member updated', id: targetId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete('/api/committee', async (req, res) => {
  try {
    const id = req.query.id || req.body?.id;
    const name = req.query.name || req.body?.name;
    let deleted = false;

    if (id && !isNaN(Number(id))) {
      const [delRes] = await pool.query('DELETE FROM committee_members WHERE id=?', [Number(id)]);
      if (delRes.affectedRows > 0) deleted = true;
    }
    if (!deleted && name) {
      const [delRes] = await pool.query('DELETE FROM committee_members WHERE name=?', [name.trim()]);
      if (delRes.affectedRows > 0) deleted = true;
    }
    if (!deleted && id) {
      await pool.query('DELETE FROM committee_members WHERE id=? OR name=?', [id, id]);
    }
    await syncTableToJson('committee_members', 'committee.json', 'committee_type ASC, display_order ASC');
    logActivity('DELETED', 'PTA & SMC', name || `ID: ${id}`, { id });
    res.json({ status: 'success', message: 'Committee member deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 3. FACULTY ───────────────────────────────────────────────────────────
app.get('/api/faculty', async (req, res) => {
  try {
    const { dept } = req.query;
    const query = dept ? 'SELECT * FROM faculty_members WHERE department = ? AND is_active = 1 ORDER BY display_order ASC' : 'SELECT * FROM faculty_members WHERE is_active = 1 ORDER BY display_order ASC';
    const [rows] = await pool.query(query, dept ? [dept] : []);
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/faculty', async (req, res) => {
  try {
    const { name, department, designation, qualification, experience_years, photo_url, email, display_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO faculty_members (name, department, designation, qualification, experience_years, photo_url, email, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, department, designation || 'TGT', qualification || 'B.Ed', experience_years || 0, photo_url || null, email || null, display_order || 1]
    );
    await syncTableToJson('faculty_members', 'faculty.json', 'display_order ASC, id ASC');
    logActivity('ADDED', 'Faculty', name, { department, designation });
    res.json({ status: 'success', message: 'Faculty member added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete('/api/faculty', async (req, res) => {
  try {
    const id = req.query.id || req.body.id;
    await pool.query('DELETE FROM faculty_members WHERE id=?', [id]);
    await syncTableToJson('faculty_members', 'faculty.json', 'display_order ASC, id ASC');
    logActivity('DELETED', 'Faculty', `ID: ${id}`);
    res.json({ status: 'success', message: 'Faculty member deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 4. ANNUAL REPORTS ────────────────────────────────────────────────────
app.get('/api/annual-reports', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM annual_reports ORDER BY published_at DESC, id DESC');
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/annual-reports', async (req, res) => {
  try {
    const { id, academic_year, title, summary, pdf_url, cover_image_url, presented_by, published_at } = req.body;
    let existing = [];
    if (id && !isNaN(Number(id))) {
      [existing] = await pool.query('SELECT id FROM annual_reports WHERE id = ?', [Number(id)]);
    } else if (academic_year) {
      [existing] = await pool.query('SELECT id FROM annual_reports WHERE academic_year = ?', [academic_year]);
    }

    if (existing.length > 0) {
      const targetId = existing[0].id;
      await pool.query(
        'UPDATE annual_reports SET academic_year=?, title=?, summary=?, pdf_url=?, cover_image_url=?, presented_by=?, published_at=? WHERE id=?',
        [academic_year || '2024-2025', title, summary || null, pdf_url, cover_image_url || null, presented_by || 'Principal', published_at || new Date(), targetId]
      );
      await syncTableToJson('annual_reports', 'annual_reports.json', 'published_at DESC, id DESC');
      logActivity('UPDATED', 'Annual Report', title, { academic_year, id: targetId });
      return res.json({ status: 'success', message: 'Annual report updated', id: targetId });
    }

    const [result] = await pool.query(
      'INSERT INTO annual_reports (academic_year, title, summary, pdf_url, cover_image_url, presented_by, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [academic_year || '2024-2025', title, summary || null, pdf_url, cover_image_url || null, presented_by || 'Principal', published_at || new Date()]
    );
    await syncTableToJson('annual_reports', 'annual_reports.json', 'published_at DESC, id DESC');
    logActivity('ADDED', 'Annual Report', title, { academic_year, id: result.insertId });
    res.json({ status: 'success', message: 'Annual report added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.put('/api/annual-reports', async (req, res) => {
  try {
    const { id, academic_year, title, summary, pdf_url, cover_image_url, presented_by, published_at } = req.body;
    let targetId = id;
    if (!id || isNaN(Number(id))) {
      const [rows] = await pool.query('SELECT id FROM annual_reports WHERE academic_year = ? OR title = ?', [academic_year, title]);
      if (rows.length > 0) targetId = rows[0].id;
    }

    if (targetId && !isNaN(Number(targetId))) {
      await pool.query(
        'UPDATE annual_reports SET academic_year=?, title=?, summary=?, pdf_url=?, cover_image_url=?, presented_by=?, published_at=? WHERE id=?',
        [academic_year || '2024-2025', title, summary || null, pdf_url, cover_image_url || null, presented_by || 'Principal', published_at || new Date(), Number(targetId)]
      );
    } else {
      await pool.query(
        'UPDATE annual_reports SET title=?, summary=?, pdf_url=?, cover_image_url=?, presented_by=?, published_at=? WHERE academic_year=?',
        [title, summary || null, pdf_url, cover_image_url || null, presented_by || 'Principal', published_at || new Date(), academic_year]
      );
    }
    await syncTableToJson('annual_reports', 'annual_reports.json', 'published_at DESC, id DESC');
    logActivity('UPDATED', 'Annual Report', title, { academic_year, id: targetId });
    res.json({ status: 'success', message: 'Annual report updated', id: targetId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete('/api/annual-reports', async (req, res) => {
  try {
    const id = req.query.id || req.body?.id;
    await pool.query('DELETE FROM annual_reports WHERE id=?', [id]);
    await syncTableToJson('annual_reports', 'annual_reports.json', 'published_at DESC, id DESC');
    logActivity('DELETED', 'Annual Report', `ID: ${id}`);
    res.json({ status: 'success', message: 'Annual report deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 5. ACHIEVEMENTS ──────────────────────────────────────────────────────
app.get('/api/achievements', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? 'SELECT * FROM achievements WHERE category = ? ORDER BY event_date DESC' : 'SELECT * FROM achievements ORDER BY event_date DESC';
    const [rows] = await pool.query(query, category ? [category] : []);
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/achievements', async (req, res) => {
  try {
    const { title, category, level, winner_name, class_grade, award_title, event_date, photo_url, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO achievements (title, category, level, winner_name, class_grade, award_title, event_date, photo_url, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, category || 'ACADEMIC', level || 'DISTRICT', winner_name, class_grade || null, award_title || 'First Prize', event_date || new Date(), photo_url || null, description || null]
    );
    res.json({ status: 'success', message: 'Achievement added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete('/api/achievements', async (req, res) => {
  try {
    const id = req.query.id || req.body.id;
    await pool.query('DELETE FROM achievements WHERE id=?', [id]);
    res.json({ status: 'success', message: 'Achievement deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 6. ENROLLMENT ────────────────────────────────────────────────────────
app.get('/api/enrollment', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM enrollment_statistics ORDER BY academic_year DESC, id ASC');
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/enrollment', async (req, res) => {
  try {
    const { academic_year, class_grade, section, stream, boys_count, girls_count } = req.body;
    const total = Number(boys_count || 0) + Number(girls_count || 0);
    const [result] = await pool.query(
      'INSERT INTO enrollment_statistics (academic_year, class_grade, section, stream, boys_count, girls_count, total_count) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [academic_year || '2025-2026', class_grade, section || 'A', stream || 'General', boys_count || 0, girls_count || 0, total]
    );
    res.json({ status: 'success', message: 'Enrollment added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete('/api/enrollment', async (req, res) => {
  try {
    const id = req.query.id || req.body.id;
    await pool.query('DELETE FROM enrollment_statistics WHERE id=?', [id]);
    res.json({ status: 'success', message: 'Enrollment deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 7. FEE STRUCTURE ─────────────────────────────────────────────────────
app.get('/api/fee-structure', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM fee_structures ORDER BY id ASC');
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/fee-structure', async (req, res) => {
  try {
    const { academic_year, grade_category, tuition_fee, annual_charges, computer_lab_fee, total_annual, payment_terms, official_pdf_url } = req.body;
    const total = total_annual || (Number(tuition_fee || 0) + Number(annual_charges || 0) + Number(computer_lab_fee || 0));
    const [result] = await pool.query(
      'INSERT INTO fee_structures (academic_year, grade_category, tuition_fee, annual_charges, computer_lab_fee, total_annual, payment_terms, official_pdf_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [academic_year || '2026-2027', grade_category, tuition_fee || 0, annual_charges || 0, computer_lab_fee || 0, total, payment_terms || '3 Term Installments', official_pdf_url || null]
    );
    res.json({ status: 'success', message: 'Fee structure added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete('/api/fee-structure', async (req, res) => {
  try {
    const id = req.query.id || req.body.id;
    await pool.query('DELETE FROM fee_structures WHERE id=?', [id]);
    res.json({ status: 'success', message: 'Fee structure deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 8. ACADEMIC CALENDAR ─────────────────────────────────────────────────
app.get('/api/calendar', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM academic_calendar_events ORDER BY start_date ASC');
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/calendar', async (req, res) => {
  try {
    const { academic_year, title, event_type, start_date, end_date, applicable_for, description, calendar_pdf_url } = req.body;
    const [result] = await pool.query(
      'INSERT INTO academic_calendar_events (academic_year, title, event_type, start_date, end_date, applicable_for, description, calendar_pdf_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [academic_year || '2026-2027', title, event_type || 'CELEBRATION', start_date, end_date || null, applicable_for || 'All Classes', description || null, calendar_pdf_url || null]
    );
    res.json({ status: 'success', message: 'Event added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete('/api/calendar', async (req, res) => {
  try {
    const id = req.query.id || req.body.id;
    await pool.query('DELETE FROM academic_calendar_events WHERE id=?', [id]);
    res.json({ status: 'success', message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 9. SCHOOL PARLIAMENT ─────────────────────────────────────────────────
app.get('/api/parliament', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM student_parliament ORDER BY academic_year DESC, display_order ASC');
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/parliament', async (req, res) => {
  try {
    const { academic_year, portfolio, student_name, class_grade, house_name, photo_url, motto_pledge, display_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO student_parliament (academic_year, portfolio, student_name, class_grade, house_name, photo_url, motto_pledge, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [academic_year || '2026-2027', portfolio, student_name, class_grade || 'Class XII', house_name || null, photo_url || null, motto_pledge || null, display_order || 1]
    );
    res.json({ status: 'success', message: 'Leader added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete('/api/parliament', async (req, res) => {
  try {
    const id = req.query.id || req.body.id;
    await pool.query('DELETE FROM student_parliament WHERE id=?', [id]);
    res.json({ status: 'success', message: 'Leader deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 10. RESULTS & TOPPERS ────────────────────────────────────────────────
app.get('/api/results', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM board_results ORDER BY academic_year DESC, standard ASC');
    for (const r of results) {
      const [toppers] = await pool.query('SELECT * FROM result_toppers WHERE result_id = ? ORDER BY percentage DESC', [r.id]);
      r.toppers = toppers;
    }
    res.json({ status: 'success', data: results });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/results', async (req, res) => {
  try {
    const { academic_year, standard, total_registered, total_passed, pass_percentage, distinction_count, remarks, toppers } = req.body;
    const [result] = await pool.query(
      'INSERT INTO board_results (academic_year, standard, total_registered, total_passed, pass_percentage, distinction_count, remarks) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [academic_year || '2025-2026', standard, total_registered, total_passed, pass_percentage || 100, distinction_count || 0, remarks || '100% Pass Record']
    );
    const resultId = result.insertId;

    if (toppers && Array.isArray(toppers)) {
      for (const t of toppers) {
        await pool.query(
          'INSERT INTO result_toppers (result_id, student_name, stream, percentage, grade, photo_url) VALUES (?, ?, ?, ?, ?, ?)',
          [resultId, t.student_name, t.stream || 'Science', t.percentage || 98.5, t.grade || 'Full A1', t.photo_url || null]
        );
      }
    }

    res.json({ status: 'success', message: 'Result added', id: resultId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete('/api/results', async (req, res) => {
  try {
    const id = req.query.id || req.body.id;
    await pool.query('DELETE FROM board_results WHERE id=?', [id]);
    res.json({ status: 'success', message: 'Result deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 11. ONLINE ADMISSION ─────────────────────────────────────────────────
app.get('/api/admissions', async (req, res) => {
  try {
    const { app_no, pin } = req.query;
    if (app_no && pin) {
      const [rows] = await pool.query('SELECT * FROM admission_applications WHERE application_no=? AND tracking_pin=? LIMIT 1', [app_no, pin]);
      if (rows.length === 0) return res.status(404).json({ status: 'error', message: 'Application not found' });
      return res.json({ status: 'success', data: rows[0] });
    }
    const [rows] = await pool.query('SELECT * FROM admission_applications ORDER BY created_at DESC');
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/admissions', async (req, res) => {
  try {
    const d = req.body;
    const year = new Date().getFullYear();
    const appNo = `ASPS-${year}-${Math.round(Math.random() * 1e4)}`;
    const pin = String(Math.floor(1000 + Math.random() * 9000));

    await pool.query(
      'INSERT INTO admission_applications (application_no, student_name, gender, dob, blood_group, class_applied, academic_year, father_name, father_phone, mother_name, mother_phone, email, residential_address, student_photo_url, birth_cert_url, status, tracking_pin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [appNo, d.student_name, d.gender || 'Male', d.dob || '2018-01-01', d.blood_group || null, d.class_applied, d.academic_year || `${year}-${year+1}`, d.father_name || 'Father', d.father_phone, d.mother_name || 'Mother', d.mother_phone || null, d.email || 'parent@mail.com', d.residential_address || 'Adoor', d.student_photo_url || null, d.birth_cert_url || null, 'PENDING', pin]
    );
    await syncTableToJson('admission_applications', 'admissions.json', 'created_at DESC');
    logActivity('SUBMITTED', 'Admission Application', `${d.student_name} (${d.class_applied})`, { application_no: appNo, email: d.email, phone: d.father_phone });

    // Send email notification to school
    sendEmailToSchool({
      subject: `[ASPS Admission] New Online Admission Application - ${d.student_name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #EED3DC;border-radius:12px;overflow:hidden;">
          <div style="background:#6B0B2E;color:#fff;padding:20px 24px;">
            <h2 style="margin:0;font-size:18px;">🎓 New Online Admission Application</h2>
            <p style="margin:4px 0 0;font-size:13px;color:#fde68a;">All Saints Public School – Admissions Office</p>
          </div>
          <div style="padding:24px;background:#fff;">
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <tr><td style="padding:8px 0;color:#666;width:140px;font-weight:bold;">Application No</td><td style="padding:8px 0;color:#6B0B2E;font-weight:bold;font-family:monospace;">${appNo}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Student Name</td><td style="padding:8px 0;font-weight:600;">${d.student_name}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Class Applied</td><td style="padding:8px 0;">${d.class_applied}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Parent / Father</td><td style="padding:8px 0;">${d.father_name || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Phone</td><td style="padding:8px 0;">${d.father_phone || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Email</td><td style="padding:8px 0;">${d.email || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Date of Birth</td><td style="padding:8px 0;">${d.dob || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Tracking PIN</td><td style="padding:8px 0;font-family:monospace;font-weight:bold;">${pin}</td></tr>
            </table>
          </div>
          <div style="padding:12px 24px;background:#FAF2F5;text-align:center;font-size:11px;color:#9B6880;">
            All Saints Public School | Pannivizha P.O, Adoor, Pathanamthitta | ${SCHOOL_PHONE} | ${SCHOOL_EMAIL}
          </div>
        </div>
      `,
    });

    res.json({ status: 'success', message: 'Application submitted', application_no: appNo, tracking_pin: pin });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.put('/api/admissions', async (req, res) => {
  try {
    const { id, status } = req.body;
    await pool.query('UPDATE admission_applications SET status=? WHERE id=?', [status, id]);
    await syncTableToJson('admission_applications', 'admissions.json', 'created_at DESC');
    logActivity('UPDATED', 'Admission Application Status', `ID: ${id}`, { status });
    res.json({ status: 'success', message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 12. GALLERY ──────────────────────────────────────────────────────────
app.get('/api/gallery', async (req, res) => {
  try {
    const { type } = req.query;
    if (type === 'videos') {
      const [videos] = await pool.query('SELECT * FROM gallery_videos ORDER BY id DESC');
      return res.json({ status: 'success', data: videos });
    }
    const [albums] = await pool.query('SELECT * FROM gallery_albums ORDER BY display_order ASC, id DESC');
    for (const alb of albums) {
      const [photos] = await pool.query('SELECT * FROM gallery_photos WHERE album_id = ?', [alb.id]);
      alb.photos = photos;
      alb.photoCount = photos.length;
    }
    res.json({ status: 'success', data: albums });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/gallery', async (req, res) => {
  try {
    const d = req.body;
    if (d.type === 'video') {
      const [result] = await pool.query(
        'INSERT INTO gallery_videos (title, category, youtube_url, thumbnail_url, duration) VALUES (?, ?, ?, ?, ?)',
        [d.title, d.category || 'Campus Life', d.youtube_url, d.thumbnail_url || null, d.duration || '3:00']
      );
      await syncTableToJson('gallery_videos', 'gallery_videos.json', 'id DESC');
      logActivity('ADDED', 'Gallery Video', d.title, { category: d.category });
      return res.json({ status: 'success', message: 'Video added', id: result.insertId });
    }

    const [result] = await pool.query(
      'INSERT INTO gallery_albums (title, subtitle, category, cover_image_url, is_featured, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [d.title, d.subtitle || '', d.category || 'General', d.cover_image_url || '/images/infrastructure/infra-campus.jpg', d.is_featured ? 1 : 0, d.display_order || 1]
    );
    const albumId = result.insertId;

    if (d.photos && Array.isArray(d.photos)) {
      for (const p of d.photos) {
        await pool.query('INSERT INTO gallery_photos (album_id, image_url, caption) VALUES (?, ?, ?)', [albumId, p.image_url, p.caption || '']);
      }
    }
    await syncTableToJson('gallery_albums', 'gallery_albums.json', 'display_order ASC, id DESC');
    logActivity('ADDED', 'Gallery Album', d.title, { category: d.category, id: albumId });

    res.json({ status: 'success', message: 'Album created', id: albumId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.put('/api/gallery', async (req, res) => {
  try {
    const d = req.body;
    if (d.type === 'video') {
      await pool.query(
        'UPDATE gallery_videos SET title=?, category=?, youtube_url=?, thumbnail_url=COALESCE(?, thumbnail_url), duration=? WHERE id=?',
        [d.title, d.category || 'Campus Life', d.youtube_url, d.thumbnail_url || null, d.duration || '3:00', d.id]
      );
      await syncTableToJson('gallery_videos', 'gallery_videos.json', 'id DESC');
      logActivity('UPDATED', 'Gallery Video', d.title, { id: d.id });
      return res.json({ status: 'success', message: 'Video updated' });
    }

    await pool.query(
      'UPDATE gallery_albums SET title=?, subtitle=?, category=?, cover_image_url=COALESCE(NULLIF(?, ""), cover_image_url), is_featured=?, display_order=? WHERE id=?',
      [d.title, d.subtitle || '', d.category || 'General', d.cover_image_url || null, d.is_featured ? 1 : 0, d.display_order || 1, d.id]
    );
    await syncTableToJson('gallery_albums', 'gallery_albums.json', 'display_order ASC, id DESC');
    logActivity('UPDATED', 'Gallery Album', d.title, { id: d.id });
    res.json({ status: 'success', message: 'Album updated' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete('/api/gallery', async (req, res) => {
  try {
    const id = req.query.id || req.body?.id;
    const type = req.query.type || req.body?.type;
    const table = type === 'video' ? 'gallery_videos' : 'gallery_albums';
    const jsonFile = type === 'video' ? 'gallery_videos.json' : 'gallery_albums.json';

    if (type !== 'video') {
      try {
        await pool.query('DELETE FROM gallery_photos WHERE album_id=?', [id]);
      } catch (err) {
        // ignore if table doesn't exist
      }
    }

    await pool.query(`DELETE FROM ${table} WHERE id=?`, [id]);
    await syncTableToJson(table, jsonFile, 'display_order ASC, id DESC');
    logActivity('DELETED', 'Gallery', `${type || 'album'} (ID: ${id})`);
    res.json({ status: 'success', message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 13. NEWS & BULLETINS ─────────────────────────────────────────────────
app.get('/api/news', async (req, res) => {
  try {
    const { featured } = req.query;
    const query = featured === '1' ? 'SELECT * FROM news_bulletins WHERE is_featured = 1 AND is_published = 1 ORDER BY publish_date DESC LIMIT 5' : 'SELECT * FROM news_bulletins WHERE is_published = 1 ORDER BY is_featured DESC, publish_date DESC';
    const [rows] = await pool.query(query);
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/news', async (req, res) => {
  try {
    const { title, category, publish_date, excerpt, content, image_url, video_url, circular_pdf_url, is_featured, is_published } = req.body;
    const [result] = await pool.query(
      'INSERT INTO news_bulletins (title, category, publish_date, excerpt, content, image_url, video_url, circular_pdf_url, is_featured, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, category || 'Official Notice', publish_date || new Date(), excerpt || '', content || null, image_url || null, video_url || null, circular_pdf_url || null, is_featured ? 1 : 0, is_published !== false ? 1 : 0]
    );
    await syncTableToJson('news_bulletins', 'news.json', 'publish_date DESC, id DESC');
    logActivity('ADDED', 'News', title, { category, id: result.insertId });
    res.json({ status: 'success', message: 'News added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.put('/api/news', async (req, res) => {
  try {
    const { id, title, category, publish_date, excerpt, content, image_url, video_url, circular_pdf_url, is_featured, is_published } = req.body;
    await pool.query(
      'UPDATE news_bulletins SET title=?, category=?, publish_date=?, excerpt=?, content=?, image_url=?, video_url=?, circular_pdf_url=?, is_featured=?, is_published=? WHERE id=?',
      [title, category, publish_date, excerpt, content, image_url, video_url, circular_pdf_url, is_featured ? 1 : 0, is_published ? 1 : 0, id]
    );
    await syncTableToJson('news_bulletins', 'news.json', 'publish_date DESC, id DESC');
    logActivity('UPDATED', 'News', title, { id });
    res.json({ status: 'success', message: 'News updated' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete('/api/news', async (req, res) => {
  try {
    const id = req.query.id || req.body.id;
    await pool.query('DELETE FROM news_bulletins WHERE id=?', [id]);
    await syncTableToJson('news_bulletins', 'news.json', 'publish_date DESC, id DESC');
    logActivity('DELETED', 'News', `ID: ${id}`);
    res.json({ status: 'success', message: 'News deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 14. STATUTORY CBSE DOCUMENTS ─────────────────────────────────────────
app.get('/api/documents', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM statutory_documents ORDER BY display_order ASC, id ASC');
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/documents', async (req, res) => {
  try {
    const { title, category, doc_number, issuing_authority, valid_until, compliance_status, file_url, file_type, description, display_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO statutory_documents (title, category, doc_number, issuing_authority, valid_until, compliance_status, file_url, file_type, description, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, category || 'Mandatory Disclosure', doc_number || null, issuing_authority || 'Competent Authority', valid_until || null, compliance_status || 'Valid & Verified', file_url, file_type || 'PDF', description || null, display_order || 1]
    );
    await syncTableToJson('statutory_documents', 'documents.json', 'display_order ASC');
    logActivity('ADDED', 'Documents', title, { category, id: result.insertId });
    res.json({ status: 'success', message: 'Document added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.put('/api/documents', async (req, res) => {
  try {
    const { id, title, category, doc_number, issuing_authority, valid_until, compliance_status, file_url, file_type, description, display_order } = req.body;
    await pool.query(
      'UPDATE statutory_documents SET title=?, category=?, doc_number=?, issuing_authority=?, valid_until=?, compliance_status=?, file_url=?, file_type=?, description=?, display_order=? WHERE id=?',
      [title, category, doc_number, issuing_authority, valid_until, compliance_status, file_url, file_type, description, display_order, id]
    );
    await syncTableToJson('statutory_documents', 'documents.json', 'display_order ASC');
    logActivity('UPDATED', 'Documents', title, { id });
    res.json({ status: 'success', message: 'Document updated' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete('/api/documents', async (req, res) => {
  try {
    const id = req.query.id || req.body.id;
    await pool.query('DELETE FROM statutory_documents WHERE id=?', [id]);
    await syncTableToJson('statutory_documents', 'documents.json', 'display_order ASC');
    logActivity('DELETED', 'Documents', `ID: ${id}`);
    res.json({ status: 'success', message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 15. COMPLAINTS & GRIEVANCE REDRESSAL CELL ────────────────────────────
app.get('/api/complaints', async (req, res) => {
  try {
    const { ticket } = req.query;
    if (ticket) {
      const [rows] = await pool.query('SELECT * FROM complaints_grievances WHERE ticket_no=? LIMIT 1', [ticket]);
      if (rows.length === 0) return res.status(404).json({ status: 'error', message: 'Ticket not found' });
      return res.json({ status: 'success', data: rows[0] });
    }
    const [rows] = await pool.query('SELECT * FROM complaints_grievances ORDER BY created_at DESC');
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/complaints', async (req, res) => {
  try {
    const { complainant_name, user_type, phone, email, category, subject, description } = req.body;
    const year = new Date().getFullYear();
    const ticketNo = `GRV-${year}-${Math.round(Math.random() * 1e4)}`;

    await pool.query(
      'INSERT INTO complaints_grievances (ticket_no, complainant_name, user_type, phone, email, category, subject, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [ticketNo, complainant_name, user_type || 'Parent', phone, email || '', category || 'Academics', subject || 'Grievance', description, 'SUBMITTED']
    );
    await syncTableToJson('complaints_grievances', 'complaints.json', 'created_at DESC');
    logActivity('SUBMITTED', 'Grievance', subject || 'Complaint', { ticket_no: ticketNo, complainant_name });

    // Send email notification to school
    sendEmailToSchool({
      subject: `[ASPS Grievance] New Complaint Received – Ticket ${ticketNo}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #EED3DC;border-radius:12px;overflow:hidden;">
          <div style="background:#6B0B2E;color:#fff;padding:20px 24px;">
            <h2 style="margin:0;font-size:18px;">📋 New Grievance / Complaint Received</h2>
            <p style="margin:4px 0 0;font-size:13px;color:#fde68a;">All Saints Public School – Grievance Cell</p>
          </div>
          <div style="padding:24px;background:#fff;">
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <tr><td style="padding:8px 0;color:#666;width:140px;font-weight:bold;">Ticket No</td><td style="padding:8px 0;color:#6B0B2E;font-weight:bold;font-family:monospace;">${ticketNo}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Name</td><td style="padding:8px 0;">${complainant_name}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Phone</td><td style="padding:8px 0;">${phone || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Email</td><td style="padding:8px 0;">${email || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Category</td><td style="padding:8px 0;">${category || 'General'}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Subject</td><td style="padding:8px 0;font-weight:600;">${subject || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;vertical-align:top;">Description</td><td style="padding:8px 0;color:#333;">${description}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Date</td><td style="padding:8px 0;">${new Date().toLocaleString('en-IN')}</td></tr>
            </table>
            <div style="margin-top:20px;padding:12px;background:#fef9f0;border-left:4px solid #D97706;border-radius:4px;font-size:12px;color:#6b5500;">
              Please log in to the admin panel to review and update the status of this complaint.
            </div>
          </div>
          <div style="padding:12px 24px;background:#FAF2F5;text-align:center;font-size:11px;color:#9B6880;">
            All Saints Public School | Pannivizha P.O, Adoor, Pathanamthitta | ${SCHOOL_PHONE} | ${SCHOOL_EMAIL}
          </div>
        </div>
      `,
    });

    res.json({ status: 'success', message: 'Grievance registered', ticket_no: ticketNo });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.put('/api/complaints', async (req, res) => {
  try {
    const { id, status, resolution_notes } = req.body;
    await pool.query('UPDATE complaints_grievances SET status=?, resolution_notes=? WHERE id=?', [status, resolution_notes || null, id]);
    await syncTableToJson('complaints_grievances', 'complaints.json', 'created_at DESC');
    logActivity('UPDATED', 'Grievance Status', `ID: ${id}`, { status, resolution_notes });
    res.json({ status: 'success', message: 'Grievance updated' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 16. CONTACT US & ENQUIRIES ───────────────────────────────────────────
app.get('/api/contact', async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? 'SELECT * FROM contact_enquiries WHERE inquiry_type=? ORDER BY created_at DESC' : 'SELECT * FROM contact_enquiries ORDER BY created_at DESC';
    const [rows] = await pool.query(query, type ? [type] : []);
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { inquiry_type, name, email, phone, grade_interested, subject, message } = req.body;
    const [result] = await pool.query(
      'INSERT INTO contact_enquiries (inquiry_type, name, email, phone, grade_interested, subject, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [inquiry_type || 'General Contact', name, email || '', phone, grade_interested || null, subject || null, message, 'NEW']
    );
    await syncTableToJson('contact_enquiries', 'contact_enquiries.json', 'created_at DESC');
    logActivity('SUBMITTED', 'Contact Inquiry', subject || name, { email, phone });

    // Send email notification to school
    sendEmailToSchool({
      subject: `[ASPS Contact] New Parent Inquiry – ${subject || name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #EED3DC;border-radius:12px;overflow:hidden;">
          <div style="background:#6B0B2E;color:#fff;padding:20px 24px;">
            <h2 style="margin:0;font-size:18px;">📬 New Parent / Contact Inquiry</h2>
            <p style="margin:4px 0 0;font-size:13px;color:#fde68a;">All Saints Public School – Contact Us Page</p>
          </div>
          <div style="padding:24px;background:#fff;">
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <tr><td style="padding:8px 0;color:#666;width:140px;font-weight:bold;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Email</td><td style="padding:8px 0;">${email || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Phone</td><td style="padding:8px 0;">${phone || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Subject</td><td style="padding:8px 0;font-weight:600;">${subject || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Inquiry Type</td><td style="padding:8px 0;">${inquiry_type || 'General Contact'}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px 0;color:#333;">${message || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-weight:bold;">Date</td><td style="padding:8px 0;">${new Date().toLocaleString('en-IN')}</td></tr>
            </table>
            <div style="margin-top:20px;padding:12px;background:#fef9f0;border-left:4px solid #D97706;border-radius:4px;font-size:12px;color:#6b5500;">
              Please follow up with the parent at the contact details above.
            </div>
          </div>
          <div style="padding:12px 24px;background:#FAF2F5;text-align:center;font-size:11px;color:#9B6880;">
            All Saints Public School | Pannivizha P.O, Adoor, Pathanamthitta | ${SCHOOL_PHONE} | ${SCHOOL_EMAIL}
          </div>
        </div>
      `,
    });

    res.json({ status: 'success', message: 'Contact inquiry received', id: result.insertId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.put('/api/contact', async (req, res) => {
  try {
    const { id, status } = req.body;
    await pool.query('UPDATE contact_enquiries SET status=? WHERE id=?', [status, id]);
    await syncTableToJson('contact_enquiries', 'contact_enquiries.json', 'created_at DESC');
    logActivity('UPDATED', 'Contact Status', `ID: ${id}`, { status });
    res.json({ status: 'success', message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete('/api/contact', async (req, res) => {
  try {
    const id = req.query.id || req.body.id;
    await pool.query('DELETE FROM contact_enquiries WHERE id=?', [id]);
    await syncTableToJson('contact_enquiries', 'contact_enquiries.json', 'created_at DESC');
    logActivity('DELETED', 'Contact Inquiry', `ID: ${id}`);
    res.json({ status: 'success', message: 'Contact inquiry deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 17. HERO CAMPUS SLIDES ───────────────────────────────────────────────
app.get('/api/hero-slides', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM hero_slides WHERE is_active=1 ORDER BY display_order ASC, id ASC'
    );
    res.json({ status: 'success', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/hero-slides', async (req, res) => {
  try {
    const { image_url, title, caption, display_order, is_active } = req.body;
    if (!image_url) {
      return res.status(400).json({ status: 'error', message: 'Image URL is required' });
    }
    const [result] = await pool.query(
      'INSERT INTO hero_slides (image_url, title, caption, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [
        image_url,
        title || 'All Saints Public School Campus',
        caption || '',
        display_order !== undefined ? Number(display_order) : 1,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
      ]
    );
    await syncTableToJson('hero_slides', 'hero_slides.json', 'display_order ASC, id ASC');
    logActivity('CREATED', 'Hero Slide', title || 'Campus Slide', { id: result.insertId });
    res.json({ status: 'success', message: 'Hero slide created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.put('/api/hero-slides', async (req, res) => {
  try {
    const { id, image_url, title, caption, display_order, is_active } = req.body;
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Slide ID is required' });
    }
    await pool.query(
      'UPDATE hero_slides SET image_url=?, title=?, caption=?, display_order=?, is_active=? WHERE id=?',
      [
        image_url,
        title || 'All Saints Public School Campus',
        caption || '',
        display_order !== undefined ? Number(display_order) : 1,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
        id,
      ]
    );
    await syncTableToJson('hero_slides', 'hero_slides.json', 'display_order ASC, id ASC');
    logActivity('UPDATED', 'Hero Slide', `ID: ${id}`, { title });
    res.json({ status: 'success', message: 'Hero slide updated' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete('/api/hero-slides', async (req, res) => {
  try {
    const id = req.query.id || req.body.id;
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Slide ID is required' });
    }
    await pool.query('DELETE FROM hero_slides WHERE id=?', [id]);
    await syncTableToJson('hero_slides', 'hero_slides.json', 'display_order ASC, id ASC');
    logActivity('DELETED', 'Hero Slide', `ID: ${id}`);
    res.json({ status: 'success', message: 'Hero slide deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── 18. VS CODE LIVE ACTIVITY LOG ────────────────────────────────────────
app.get('/api/activity-log', (req, res) => {
  const logFile = path.join(dataDir, 'activity_log.json');
  if (fs.existsSync(logFile)) {
    try {
      const logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
      return res.json({ status: 'success', data: logs });
    } catch {}
  }
  res.json({ status: 'success', data: [] });
});

// Global Express Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.message);
  if (!res.headersSent) {
    res.status(500).json({ status: 'error', message: err.message || 'Internal server error occurred.' });
  }
});

// Process-level uncaught exception safety
process.on('uncaughtException', (err) => {
  console.error('[Backend Uncaught Exception]:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Backend Unhandled Rejection]:', reason);
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏫 All Saints Public School API Server`);
  console.log(`🚀 Running at: http://localhost:${PORT}`);
  console.log(`📁 Uploads at: http://localhost:${PORT}/uploads`);
  console.log(`🗄️  Database:   MySQL (${process.env.DB_NAME || 'allsaints'})`);
  console.log(`=======================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n=======================================================`);
    console.log(`ℹ️  Backend Server is ALREADY RUNNING on port ${PORT}!`);
    console.log(`✅ Status: Actively connected to MySQL and serving requests.`);
    console.log(`🌐 API Endpoint: http://localhost:${PORT}/api`);
    console.log(`💡 You do NOT need to run 'node server.js' again.`);
    console.log(`   (To restart fresh, run: npx kill-port ${PORT} then node server.js)`);
    console.log(`=======================================================\n`);
    process.exit(0);
  } else {
    console.error(`[Server Error]`, err);
  }
});
