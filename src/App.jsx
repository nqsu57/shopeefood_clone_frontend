import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navbar from './component/Navbar/Navbar';
import LoginPage from './pages/Login/LoginPage'; // Default import
import Signup from './pages/register/RegisterPage';
function App() {
  return (
    <>
      <Navbar />
      <main className="p-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/signup" element={<Signup />} />
                   {/* <Route path="/" element={<Home />} /> */}
          {/* Các route khác như About, Contact có thể thêm ở đây */}
        </Routes>
      </main>
    </>


  );
}

export default App;