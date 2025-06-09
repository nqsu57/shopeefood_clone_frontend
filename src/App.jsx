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
function App() {
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
        <Navbar />
        <main className="p-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="/" element={<Home />} /> */}
            {/* Các route khác như About, Contact có thể thêm ở đây */}
          </Routes>
        </main>
      </AuthProvider>
    </>
  );
}

export default App;