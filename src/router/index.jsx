{/* <Route path="/" element={<App />}>
  <Route index element={<Home />} />
  <Route path="about" element={<About />} />
</Route> */}
import React from 'react';
import { Route } from 'react-router-dom';
import App from '../App.jsx';
import Home from '../pages/Home/Home';
// import About from '../pages/About/About';

export const routes = (
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    {/* <Route path="about" element={<About />} /> */}
  </Route>
);
