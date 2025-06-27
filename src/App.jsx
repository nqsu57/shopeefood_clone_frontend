import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navbar from './component/Navbar/Navbar';
import LoginPage from './pages/Login/LoginPage'; // Default import
import Signup from './pages/register/RegisterPage';
import Profile from './pages/User/UserPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './AuthContext';
import ForgotPassword from './pages/Password/ForgotPassword';
import ResetPassword from './pages/Password/ResetPassword';
import FoodCardDetail from './component/FoodCard/FoodCardDetail';
import CartDrawer from './pages/Cart/CartDrawer';
import Order from './pages/Order/OrderPage';

function App() {
  const [showCart, setShowCart] = useState(false);
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        className="toast_container" />
      <AuthProvider>
        <Navbar onCartClick={() => setShowCart(true)} />
        <main className="p-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/" element={<Home />} />
            <Route path="/food/:id" element={<FoodCardDetail />} />
            <Route path="/order" element={<Order />} />
          </Routes>
        </main>


        {/* Overlay mờ
        {showCart && (
          <div className="overlay" onClick={() => setShowCart(false)}></div>
        )}

        {showCart && <CartDrawer onClose={() => setShowCart(false)} />} */}
        {showCart && (
          <>
            <div className="overlay" onClick={() => setShowCart(false)} />
            <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
          </>
        )}
      </AuthProvider>
    </>
  );
}

export default App;