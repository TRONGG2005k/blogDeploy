// src/components/UserDetailModal.jsx
import React from "react";
import { Modal, List, Tag, Divider } from "antd";
import dayjs from "dayjs"; // thêm để format thời gian

function UserDetailModal({ open, onClose, user }) {
  if (!user) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={`Thông tin chi tiết - ${user.username}`}
      footer={null}
      width={700}
    >
      <p><b>ID:</b> {user.id}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Active:</b> {user.active ? "✔️" : "❌"}</p>
      <p>
        <b>Roles:</b>{" "}
        {user.roles?.map((role, index) => (
          <Tag key={index}>{role}</Tag>
        ))}
      </p>

      <Divider orientation="left">Danh sách bài viết</Divider>

      <List
        dataSource={user.posts || []}
        bordered
        locale={{ emptyText: "Người dùng này chưa có bài viết nào" }}
        renderItem={(post) => (
          <List.Item>
            <div style={{ width: "100%" }}>
              <b>{post.caption}</b>{" "}
              {post.delete && (
                <Tag color="red" style={{ marginLeft: 8 }}>
                  Đã xoá
                </Tag>
              )}
              <br />
              <small>
                Tạo lúc: {dayjs(post.createdAt).format("HH:mm DD/MM/YYYY")}
              </small>
            </div>
          </List.Item>
        )}
      />
    </Modal>
  );
}

export default UserDetailModal;
