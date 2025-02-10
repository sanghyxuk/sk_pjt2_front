// Bootstrap CSS import
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';  // Navbar가 아닌 Navigation
import Home from './pages/Home';
//import TopMovies from './pages/TopMovies';
//import MovieList from './pages/MovieList';
import ItemLists from './pages/ItemLists';
//import MovieDetail from './pages/MovDetail';
import ItemDetail from './pages/ItemDetail';
import ItemRegistration from './pages/ItemRegistration';
import ItemEdit from './pages/ItemEdit';
//import NowPlaying from './pages/NowPlaying';
//import Booking from './pages/Booking';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/common.css';  // 전역 스타일
//import Login from './pages/Login';
//import Signup from './pages/Signup';
//import UserProfile from './pages/UserProfile';
//import AdminUserManage from './pages/AdminUserManage';
//import MyPage from './pages/MyPage';

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
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/items" element={<ItemLists />} />
              <Route path="/items/write" element={<ItemRegistration />} />
              <Route path="/items/edit/:id" element={<ItemRegistration />} />
              <Route path="/community/:id" element={<ItemDetail />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </Router>
  );
}

export default App;