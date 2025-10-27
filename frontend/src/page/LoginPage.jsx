import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, message } from "antd";
import { GoogleOutlined, LoginOutlined } from '@ant-design/icons';
import { setToken, getToken } from '../service/LocalStorageService';
import { fetchWith401Check } from '../utils/fetchWith401Check';
import { OAuthConfig, API_BASE_URL } from '../configuration/configuration';
import { useAuth } from "../components/AuthContext";

const { Title } = Typography;

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();
  
  useEffect(() => {
    const token = getToken();
    if (token) navigate('/home');
  }, [navigate]);

  const handleLogin = async (values) => {
    const { username, password } = values;
    setLoading(true);

    try {
      const response = await fetchWith401Check(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Login failed');
      }

      const data = await response.json();
      setToken(data.token);
      loginContext({ role: data.role });
      message.success("Đăng nhập thành công!");
      
      if (data.role.includes("ROLE_ADMIN")) {
        navigate("/admin")
      } else {
        navigate("/home")
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const authUrl = `${OAuthConfig.authUri}?response_type=code&client_id=${OAuthConfig.clientId}` +
      `&redirect_uri=${encodeURIComponent(OAuthConfig.redirectUri)}&scope=openid%20email%20profile&state=random_state_xyz`;
    window.location.href = authUrl;
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#242424"
    }}>
      <Card
        style={{
          width: 380,
          padding: 20,
          borderRadius: 12,
          background: "#1f1f1f",
          border: "1px solid #333"
        }}
      >
        <Title level={3} style={{ textAlign: "center", color: "white" }}>Đăng nhập</Title>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label={<span style={{ color: 'white' }}>Username</span>}
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập username' }]}
          >
            <Input placeholder="Nhập username..." />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: 'white' }}>Mật khẩu</span>}
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu..." />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<LoginOutlined />}
              block
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Button
            icon={<GoogleOutlined />}
            block
            onClick={handleGoogleLogin}
          >
            Đăng nhập với Google
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
