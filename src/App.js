import React, { useState } from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/home';
import Bookmark from './pages/bookmark';
import User from './pages/user';
import Detail from './pages/detail';
import Index from './pages/index';
import Ranklist from './pages/ranklist';
import LoginSignup from './pages/LoginSignup';  
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import { LoginProvider } from './logincheck';

function ConditionalNavbar() {
  const location = useLocation();
  const showNavbar = ['/', '/index', '/ranklist'].includes(location.pathname);
  return showNavbar ? <Navbar /> : null;
}

function App() {
  return (
    <LoginProvider>
      <Router>
        <ConditionalNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/user" element={<User />} />
          <Route path="/detail/:symbol" element={<Detail />} />
          <Route path="/index" element={<Index />} />
          <Route path="/ranklist" element={<Ranklist />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </LoginProvider>
  );
}

export default App;