// App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ItemLists from './pages/ItemLists';
import ItemDetail from './pages/ItemDetail';
import ItemRegistration from './pages/ItemRegistration';
import MySalePage from './pages/MySalePage';
import MyPurchasePage from './pages/MyPurchasePage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import EditProfilePage from './pages/EditProfilePage';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Chat from "./pages/Chat";

import './styles/common.css';

// 보호된 라우트 컴포넌트 (예시)
const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
      <div className="app-container">
        <Router>
          <ThemeProvider>
            <AuthProvider>
              <Header />

              {/* 메인 컨텐츠 영역 */}
              <div className="content-wrap">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/items" element={<ItemLists />} />
                  <Route path="/items/write" element={<ItemRegistration />} />
                  <Route path="/items/edit/:id" element={<ItemRegistration />} />
                  <Route path="/items/:id" element={<ItemDetail />} />
                  <Route path="/mysale" element={<MySalePage />} />
                  <Route path="/mypurchase" element={<MyPurchasePage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />

                  {/* "/" 경로 중복 제거: 이미 Home에 할당되어 있으므로 두 번째 "/"는 삭제 */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/profile/edit" element={<EditProfilePage />} />

                  <Route path="/chat" element={<Chat />} />

                </Routes>
              </div>

              <Footer />
            </AuthProvider>
          </ThemeProvider>
        </Router>
      </div>
  );
}

export default App;
