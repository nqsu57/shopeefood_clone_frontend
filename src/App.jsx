import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navbar from './component/Navbar/Navbar';
import Footer from './component/Footer/Footer';
import LoginPage from './pages/Login/LoginPage'; // Default import
import Signup from './pages/register/RegisterPage';
import Profile from './pages/User/UserPage';
import ForgotPassword from './pages/Password/ForgotPassword';
import ResetPassword from './pages/Password/ResetPassword';
import FoodCardDetail from './component/FoodCard/FoodCardDetail';
import CartDrawer from './pages/Cart/CartDrawer';
import MyOrders from './pages/Order/MyOrder';
import Order from './pages/Order/OrderPage';
import Address from './pages/User/UserAddressPage';
import OrderDetail from './pages/Order/OrderDetailPage';
import SearchPage from './component/Search/SearchPage';
import PhoneLogin from './pages/Login/PhoneLogin';
import OTP from './pages/OTPPage/OTPPage';
import ResetPasswordPage from './pages/Password/ResetPassword';

function App() {
  const [showCart, setShowCart] = useState(false);
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Đang tải thông tin người dùng...</div>;
  }


  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        className="toast_container" />
      {/* <AuthProvider> */}
      <Navbar onCartClick={() => setShowCart(true)} />
      <main className="p-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account/profile" element={<Profile />} />
          <Route path="/account/myorder" element={<MyOrders />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/food/:id" element={<FoodCardDetail />} />
          <Route path="/order" element={<Order />} />
          <Route path="/account/address" element={<Address />} />
          <Route path="/order/:id" element={<OrderDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/phonelogin" element={<PhoneLogin />} />
          <Route path="/otp-page" element={<OTP />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </main>

      {showCart && (
        <>
          <div className="overlay" onClick={() => setShowCart(false)} />
          <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
        </>
      )}
      <Footer onCartClick={() => setShowCart(true)} />

      {/* </AuthProvider> */}
    </>
  );
}

export default App;