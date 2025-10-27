import React, { useState, useEffect } from "react";
import { Card, Button, Dropdown, Menu, message } from "antd";
import { getToken } from "../service/LocalStorageService";
import CreatePostModal from "../components/CreatePostModal";
import { fetchWith401Check } from "../utils/fetchWith401Check";
import { API_BASE_URL } from "../configuration/configuration";

function MyPost() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = async (pageParam) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetchWith401Check(
        `${API_BASE_URL}/post/my-posts?page=${pageParam}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await res.json();
      if (!data.content || data.content.length === 0) {
        setHasMore(false);
        return;
      }
      setPosts((prev) => [...prev, ...data.content]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(page); }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  const handlePostCreatedOrUpdated = (newPost) => {
    setPosts((prev) => {
      const index = prev.findIndex((p) => p.id === newPost.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = newPost;
        return updated;
      }
      return [newPost, ...prev];
    });
  };

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetchWith401Check(`${API_BASE_URL}/post/${postId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        message.success("Xóa bài viết thành công!");
      } else message.error("Xóa bài viết thất bại!");
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi xóa bài viết!");
    }
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setModalVisible(true);
  };
  const closeModal = () => {
    setEditingPost(null);
    setModalVisible(false);
  };

  return (
    <div style={{ paddingTop: "80px", paddingBottom: "20px", background: "#242424", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "610px", maxWidth: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ color: "white" }}>My Posts</h2>
        <Button type="primary" onClick={() => { setEditingPost(null); setModalVisible(true); }}>Thêm post</Button>
      </div>

      {posts.map((post) => {
        const menu = (
          <Menu>
            <Menu.Item key="edit" onClick={() => openEditModal(post)}>Sửa</Menu.Item>
            <Menu.Item key="delete" onClick={() => handleDeletePost(post.id)}>Xóa</Menu.Item>
          </Menu>
        );

        return (
          <Card key={post.id} style={{ marginBottom: 16, background: "#2f2f2f", color: "white", width: "610px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ color: "white", margin: 0 }}>{post.username}</h3>
                  <span style={{ color: "#999", fontSize: "12px" }}>
                    {new Date(post.createdAt).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p style={{ color: "#dcdcdc" }}>{post.caption}</p>
              </div>
              <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
                <Button type="text" style={{ color: "white" }}>...</Button>
              </Dropdown>
            </div>

            {post.mediaUrls?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                {post.mediaUrls.map((media, idx) => (
                  <img key={idx} src={media} alt="post" style={{ width: "180px", height: "180px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
                ))}
              </div>
            )}
            <p>❤️ {post.reactionCount} | 💬 {post.countComment}</p>
          </Card>
        );
      })}

      {loading && <p style={{ color: "white", textAlign: "center" }}>Đang tải...</p>}
      {!hasMore && <p style={{ color: "white", textAlign: "center" }}>Hết bài viết</p>}

      <CreatePostModal visible={modalVisible} editingPost={editingPost} onClose={closeModal} onPostCreated={handlePostCreatedOrUpdated} />
    </div>
  );
}

export default MyPost;
