import React from "react";
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes } from 'react-router-dom';
import { routes } from './router/index';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './AuthContext';




createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)



// createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>{routes}</Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );
