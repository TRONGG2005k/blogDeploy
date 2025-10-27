// src/components/UserRoleModal.jsx
import React, { useState } from "react";
import { Modal, Select, message } from "antd";
import { fetchWith401Check } from "../utils/fetchWith401Check";
import { getToken } from "../service/LocalStorageService";
import { API_BASE_URL } from "../configuration/configuration";

function UserRoleModal({ open, onClose, user, roles }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!selectedRole) {
      message.warning("Vui lòng chọn role");
      return;
    }
    setLoading(true);
    try {
      const response = await fetchWith401Check(
        `${API_BASE_URL}/user/${user.id}/change-role`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ role: selectedRole }),
        }
      );

      if (response.ok) {
        message.success("Cập nhật role thành công");
        onClose();
      } else {
        const errData = await response.json();
        message.error(errData.message || "Lỗi khi cập nhật role");
      }
    } catch (e) {
      console.error(e);
      message.error("Lỗi khi cập nhật role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Cập nhật role cho ${user?.username}`}
      open={open}
      onCancel={onClose}
      onOk={handleSave}
      confirmLoading={loading}
    >
      <Select
        style={{ width: "100%" }}
        placeholder="Chọn role"
        onChange={(val) => setSelectedRole(val)}
        options={roles.map((r) => ({
          value: r.name,
          label: r.name,
        }))}
      />
    </Modal>
  );
}

export default UserRoleModal;
