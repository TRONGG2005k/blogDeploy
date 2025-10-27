import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './page/LoginPage'
import Home from './page/Home'
import Info from './page/Info'
import AdminDashboard from './page/AdminDashboard'
import Authenticate from './components/Authenticate'

import { BrowserRouter as Router, Route, Routes as Routers, useLocation } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './components/AuthContext'
import Navbar from './components/Navbar';
import PostManager from './page/PostManager'
import MyPost from './page/MyPost'
import UserList from './page/UserManager'


function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routers>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path='/info' element={<Info />}></Route>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/my-posts" element={<MyPost />} />
        <Route path="/admin/posts" element={<PostManager />} />
        <Route path="/my-posts" element={<MyPost />} />
        <Route path="/admin/users" element={<UserList />} />
      </Routers>
    </>
  );
}

function App() {

  return (
    <>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
