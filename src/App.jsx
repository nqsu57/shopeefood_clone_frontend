import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navbar from './component/Navbar/Navbar'
import LoginPage from './pages/Login/LoginPage'; // Default import
// import Contact from "./pages/Contact";
// import Header from "./components/Header";
// // import Footer from "./components/Footer";
function App() {
  return (
    <>
      <Navbar />
      <main className="p-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />          {/* <Route path="/" element={<Home />} /> */}
          {/* Các route khác như About, Contact có thể thêm ở đây */}
        </Routes>
      </main>
    </>


  );
}

export default App;