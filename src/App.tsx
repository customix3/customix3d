import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import CustomPage from './pages/CustomPage';
import PersonalizePage from './pages/PersonalizePage';
import PersonalizeShopPage from './pages/PersonalizeShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AccountPage from './pages/AccountPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MaintenancePage from './pages/MaintenancePage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import RefundPage from './pages/RefundPage';
import ReturnPage from './pages/ReturnPage';
import ShippingPage from './pages/ShippingPage';
import AdminLoginPage from './admin/AdminLoginPage';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminNameItProducts from './admin/AdminNameItProducts';
import AdminOrders from './admin/AdminOrders';
import AdminCustomOrders from './admin/AdminCustomOrders';
import AdminCustomers from './admin/AdminCustomers';
import AdminOffers from './admin/AdminOffers';
import AdminReviews from './admin/AdminReviews';
import AdminSettings from './admin/AdminSettings';
import AdminHomepage from './admin/AdminHomepage';
import AdminCategories from './admin/AdminCategories';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { useSite } from './context/SiteContext';

function StoreGate({ children }: { children: React.ReactNode }) {
  const { maintenanceMode } = useSite();
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return <>{children}</>;
  if (maintenanceMode) return <MaintenancePage />;
  return <>{children}</>;
}

export default function App() {
  return (
    <StoreGate>
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/name-it" element={<PersonalizeShopPage />} />
          <Route path="/personalize/:id" element={<PersonalizePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/custom" element={<CustomPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/return" element={<ReturnPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="homepage" element={<AdminHomepage />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="name-it-products" element={<AdminNameItProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="custom-orders" element={<AdminCustomOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </StoreGate>
  );
}
