// Bootstrap CSS import
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import Navigation from './components/Navigation';  // Navbar가 아닌 Navigation
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ItemLists from './pages/ItemLists';
import ItemDetail from './pages/ItemDetail';
import ItemRegistration from './pages/ItemRegistration';
import ItemEdit from './pages/ItemEdit';
import MySalePage from "./pages/MySalePage";
import MyPurchasePage from "./pages/MyPurchasePage";
import WishlistPage from "./pages/WishlistPage";

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import EditProfilePage from './pages/EditProfilePage';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/common.css';  // 전역 스타일


// 보호된 라우트 컴포넌트
const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <Header />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/items" element={<ItemLists />} />
              <Route path="/items/write" element={<ItemRegistration />} />
              <Route path="/items/edit/:id" element={<ItemRegistration />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              <Route path="/mysale" element={<MySalePage />} />
              <Route path="/mypurchase" element={<MyPurchasePage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
            </Routes>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </Router>
  );
}

export default App;