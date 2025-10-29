import { useEffect, useState } from "react";
import { fetchWith401Check } from "../utils/fetchWith401Check";
import { Card, Button } from "antd"; 
import { useNavigate } from "react-router-dom";
import { getToken } from "../service/LocalStorageService";
import { API_BASE_URL } from "../configuration/configuration";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetchWith401Check(`${API_BASE_URL}/user/info`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!res.ok) {
          navigate("/"); 
          return;
        }

        const data = await res.json();
        if (!data?.roles?.map(r => r.name).includes("ROLE_ADMIN")) {
          navigate("/home"); 
          return;
        }

      } catch (e) {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (loading) return <p style={{color:"white"}}>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1 style={{ marginBottom: "20px" }}>Trang quản trị</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
        <Card style={{ background: "#2f2f2f" }}>
          <h3 style={{ color: "white" }}>📝 Quản lý bài viết</h3>
          <p style={{ color: "#bfbfbf" }}>Xóa bài viết, duyệt bài, xem chi tiết</p>
          <Button type="primary" onClick={() => navigate("/admin/posts")}>
            Đi tới quản lý bài viết
          </Button>
        </Card>

        <Card style={{ background: "#2f2f2f" }}>
          <h3 style={{ color: "white" }}>👤 Quản lý người dùng</h3>
          <p style={{ color: "#bfbfbf" }}>Vô hiệu hóa / bật lại user</p>
          <Button type="primary" onClick={() => navigate("/admin/users")}>
            Đi tới quản lý user
          </Button>
        </Card>

        <Card style={{ background: "#2f2f2f" }}>
          <h3 style={{ color: "white" }}>🏷️ CRUD Tag</h3>
          <p style={{ color: "#bfbfbf" }}>Thêm / Sửa / Xóa tag bài viết</p>
          <Button type="primary" onClick={() => navigate("/admin/tags")}>
            Đi tới quản lý tag
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
