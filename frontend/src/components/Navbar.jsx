import { Input, Menu } from "antd";
import { HomeOutlined, UserOutlined, FileTextOutlined, SettingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);


  const [current, setCurrent] = useState('home');

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/admin') && role === 'ROLE_ADMIN') {
      setCurrent('admin');
    } else if (path.startsWith('/my-posts')) {
      setCurrent('mypost');
    } else if (path.startsWith('/info')) {
      setCurrent('profile');
    } else {
      setCurrent('home');
    }

    setRole(() => localStorage.getItem('role') || null)
  }, [location.pathname, role]);

  const onClick = (e) => {
    setCurrent(e.key);
    switch (e.key) {
      case 'home': navigate('/home'); break;
      case 'profile': navigate('/info'); break;
      case 'mypost': navigate('/my-posts'); break;
      case 'admin': navigate('/admin'); break;
      default: break;
    }
  };

  const items = [
    { label: 'Home', key: 'home', icon: <HomeOutlined style={{ color: 'white' }} /> },
    { label: 'Bài viết của tôi', key: 'mypost', icon: <FileTextOutlined style={{ color: 'white' }} /> },
    { label: 'Cá nhân', key: 'profile', icon: <UserOutlined style={{ color: 'white' }} /> },
  ];

  if (role === 'ROLE_ADMIN') {
    items.push({ label: 'Admin', key: 'admin', icon: <SettingOutlined style={{ color: 'white' }} /> });
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // chia 3 vùng
        background: '#1e1e1e',
        zIndex: 1000,
        padding: '0 20px',
      }}
    >
      {/* Search box bên trái */}
      <div style={{ flex: 1 }}>
        <Input.Search placeholder="Tìm kiếm..." style={{ width: 200 }} />
      </div>

      {/* Menu nằm giữa */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Menu
          mode="horizontal"
          onClick={onClick}
          selectedKeys={[current]}
          style={{ background: 'transparent', color: 'white' }}
          items={items}
        />
      </div>

      {/* Khoảng trống bên phải để cân bằng */}
      <div style={{ flex: 1 }}></div>
    </div>

  );
};

export default Navbar;
