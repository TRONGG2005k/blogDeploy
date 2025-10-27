import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ConfigProvider, theme } from 'antd';
createRoot(document.getElementById('root')).render(
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        colorBgBase: "#242424",  // nền dark toàn bộ
        colorTextBase: "#ffffff" // chữ sáng
      }
    }}
  >
    <App />
  </ConfigProvider>
)
