import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getToken } from "../service/LocalStorageService";
import { fetchWith401Check } from "../utils/fetchWith401Check";
import { API_BASE_URL } from "../configuration/configuration"; // <-- import API_BASE_URL
const { TextArea } = Input;

function CreatePostModal({ visible, onClose, onPostCreated, editingPost = null }) {
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [existingMediaUrls, setExistingMediaUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPost) {
      setCaption(editingPost.caption || "");
      setTags((editingPost.tags || []).join(", "));
      setExistingMediaUrls(editingPost.mediaUrls || []);
      setMediaFiles([]);
    } else {
      setCaption("");
      setTags("");
      setMediaFiles([]);
      setExistingMediaUrls([]);
    }
  }, [editingPost, visible]);

  const handleUploadFiles = async () => {
    if (mediaFiles.length === 0) return [];
    const formData = new FormData();
    mediaFiles.forEach(file => formData.append("files", file));
    try {
      const res = await fetchWith401Check(`${API_BASE_URL}/uploads/multi-file`, {
        method: "POST",
        credentials: "include",
        body: formData
      });
      if (!res.ok) throw new Error("Upload thất bại");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      message.error("Upload file thất bại");
      return [];
    }
  };

  const handleSubmit = async () => {
    if (!caption.trim()) {
      message.error("Caption không được để trống!");
      return;
    }
    setLoading(true);
    try {
      const uploadedUrls = await handleUploadFiles();
      const allMediaUrls = [...existingMediaUrls, ...uploadedUrls];

      let res;
      if (editingPost) {
        res = await fetchWith401Check(`${API_BASE_URL}/post/${editingPost.id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            caption,
            tagName: tags.split(",").map(t => t.trim()).filter(Boolean),
            mediaUrl: allMediaUrls,
          }),
        });
      } else {
        res = await fetchWith401Check(`${API_BASE_URL}/post`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            caption,
            tagName: tags.split(",").map(t => t.trim()).filter(Boolean),
            mediaUrl: allMediaUrls,
          }),
        });
      }

      if (!res.ok) throw new Error(editingPost ? "Sửa post thất bại" : "Tạo post thất bại");
      const newPost = await res.json();
      onPostCreated(newPost);
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={editingPost ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {editingPost ? "Lưu" : "Đăng"}
        </Button>,
      ]}
    >
      <TextArea
        rows={4}
        placeholder="Viết gì đó..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="Nhập tag, cách nhau bằng dấu ,"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <Upload
        multiple
        beforeUpload={(file) => {
          setMediaFiles(prev => [...prev, file]);
          return false;
        }}
        onRemove={(file) => {
          setMediaFiles(prev => prev.filter(f => f.uid !== file.uid));
        }}
        fileList={mediaFiles.map(f => ({ uid: f.uid, name: f.name }))}
      >
        <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
      </Upload>

      {existingMediaUrls.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {existingMediaUrls.map((url, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <img
                src={url}
                alt="media"
                style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 4 }}
              />
              <Button
                size="small"
                danger
                style={{ position: "absolute", top: 2, right: 2 }}
                onClick={() =>
                  setExistingMediaUrls(prev => prev.filter((_, i) => i !== idx))
                }
              >
                X
              </Button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

export default CreatePostModal;
