import React, { useEffect, useState } from "react";
import { Table, Spin, Button, Space, Card, Tooltip, Popconfirm, message } from "antd";
import { EyeOutlined, UserSwitchOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchWith401Check } from "../utils/fetchWith401Check";
import UserDetailModal from "../components/UserDetailModal";
import UserRoleModal from "../components/UserRoleModal";
import { getToken } from "../service/LocalStorageService";
import { API_BASE_URL } from "../configuration/configuration";

function UserList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [roles, setRoles] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);

  const loadUsers = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await fetchWith401Check(`${API_BASE_URL}/user?page=${pageNumber}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const result = await response.json();
      setData((prev) => [...prev, ...result.content]);
      setHasMore(!result.last);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải danh sách user");
    } finally {
      setLoading(false);
    }
  };

  const getRoles = async () => {
    try {
      const response = await fetchWith401Check(`${API_BASE_URL}/role`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const result = await response.json();
      setRoles(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetchWith401Check(`${API_BASE_URL}/user/${userId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (response.ok) {
        message.success("Xoá user thành công!");
        setData((prev) => prev.filter((user) => user.id !== userId));
      } else {
        message.error("Xoá thất bại!");
      }
    } catch (err) {
      message.error("Đã xảy ra lỗi khi xoá user");
    }
  };

  const handleViewDetail = async (userId) => {
    try {
      const response = await fetchWith401Check(`${API_BASE_URL}/user/${userId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const userData = await response.json();
      setSelectedUser(userData);
      setDetailOpen(true);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải chi tiết user");
    }
  };

  useEffect(() => {
    getRoles();
    loadUsers(0);
  }, []);

  const handleTableScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (isAtBottom && !loading && hasMore) {
      loadUsers(page + 1);
      setPage((prev) => prev + 1);
    }
  };

  const columns = [
    { title: "STT", key: "index", render: (_, __, index) => index + 1, width: 70 },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      ellipsis: true,
      render: (id) => (
        <Tooltip title={id}>
          <span style={{ maxWidth: 200, display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {id}
          </span>
        </Tooltip>
      ),
    },
    { title: "Username", dataIndex: "username", key: "username", ellipsis: true },
    { title: "Email", dataIndex: "email", key: "email", ellipsis: true },
    { title: "Active", dataIndex: "active", key: "active", width: 80, render: (active) => (active ? "✔️" : "❌") },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record.id)}>View</Button>
          <Button type="link" icon={<UserSwitchOutlined />} onClick={() => { setSelectedUserForRole(record); setRoleOpen(true); }}>Role</Button>
          <Popconfirm title="Xác nhận xoá user?" description="Bạn có chắc muốn xoá user này?" okText="Có" cancelText="Không" okButtonProps={{ danger: true }} onConfirm={() => handleDeleteUser(record.id)}>
            <Button type="link" icon={<DeleteOutlined />} danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", marginTop: "50px" }}>
      <Card style={{ height: "calc(100vh - 100px)", overflow: "auto", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} bodyStyle={{ padding: "12px" }} onScroll={handleTableScroll}>
        <Table columns={columns} dataSource={data} rowKey="id" pagination={false} tableLayout="auto" style={{ background: "white" }} />
        {loading && <div style={{ textAlign: "center", marginTop: 10 }}><Spin /></div>}
      </Card>

      <UserDetailModal open={detailOpen} onClose={() => setDetailOpen(false)} user={selectedUser} />
      <UserRoleModal open={roleOpen} onClose={() => setRoleOpen(false)} user={selectedUserForRole} roles={roles} />
    </div>
  );
}

export default UserList;
