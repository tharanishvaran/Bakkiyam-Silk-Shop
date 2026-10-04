import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/HomePage';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSarees from './pages/admin/AdminSarees';
import AdminSareeForm from './pages/admin/AdminSareeForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminGallery from './pages/admin/AdminGallery';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';
import ProtectedRoute from './components/ProtectedRoute';
import { SettingsProvider } from './context/SettingsContext';

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1E1528',
              color: '#F5ECD7',
              border: '1px solid rgba(201,168,76,0.3)',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#C9A84C', secondary: '#0D0A0E' } },
            error: { iconTheme: { primary: '#E57373', secondary: '#0D0A0E' } },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="sarees" element={<AdminSarees />} />
            <Route path="sarees/new" element={<AdminSareeForm />} />
            <Route path="sarees/:id/edit" element={<AdminSareeForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </SettingsProvider>
    </BrowserRouter>
  );
}
