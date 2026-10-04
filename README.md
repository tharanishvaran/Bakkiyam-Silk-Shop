# Bakkiyam Pattu Center | பாக்கியம் பட்டு சென்டர்

A luxury full-stack web application and digital showroom for **Bakkiyam Pattu Center**, Siruvanthadu, Tamil Nadu — authentic manufacturers and weavers of traditional pure silk, wedding, and festive pattu sarees.

---

## 🌟 Key Features

- **Luxury Showroom Experience:**
  - Responsive showcase for mobile, tablet, and desktop viewports.
  - Silk shimmer and subtle breathing aura animations on entrance.
  - AI-enhanced authentic banner showcasing traditional Tamil calligraphy and saree designs.
- **Direct Showroom Navigation & Contact:**
  - Integrated direct Google Maps link for the Siruvanthadu showroom.
  - Direct WhatsApp order & inquiry links pre-filled with saree details.
  - Dynamic contact person names and phone numbers.
- **Full-Featured Admin Management Portal:**
  - Secure JWT authentication with role-based permissions.
  - Saree catalog management (add, edit, delete, and upload saree photos).
  - Admin users control (add new admins, edit credentials, and delete admins).
  - Live showroom settings control (address, Google Maps link, WhatsApp & contact numbers).
- **Curated Saree Collections:**
  - Filter by category: Pure Silk, Bridal/Muhurtham, Soft Silk, Cotton Silk, and Designer/Party Wear.
  - High-resolution zoom lightbox for close-up zari and border inspection.

---

## 🛠️ Technology Stack

- **Frontend:**
  - React 18 + TypeScript + Vite
  - Framer Motion (micro-animations & smooth transitions)
  - Lucide React Icons
  - Custom Vanilla CSS Design System (Tailored luxury gold & silk dark aesthetic)
- **Backend:**
  - Node.js + Express.js
  - SQLite (better-sqlite3) with WAL mode & automated schema migration
  - Multer for secure image uploads
  - JWT (JSON Web Tokens) & bcryptjs for authentication
  - CORS and dotenv

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tharanishvaran/Bakkiyam-Silk-Shop.git
   cd Bakkiyam-Silk-Shop
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Start the backend server
   node server.js
   ```
   *Backend runs on `http://localhost:5000`.*

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   # Start development server
   npm run dev
   ```
   *Frontend runs on `http://localhost:5173`.*

4. **One-Click Run (Windows):**
   Double-click `run.bat` in the project root to start both backend and frontend servers simultaneously.

---

## 🏛️ Showroom Location

- **Bakkiyam Pattu Center**
- Meenavar Street, Mottuchulam, Siruvanthadu, Villupuram District, Tamil Nadu, India
- [Showroom on Google Maps](https://maps.app.goo.gl/b5TtEwr47nMyN39G8?g_st=aw)
