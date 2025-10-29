import React, { useState, useEffect } from "react";
import { Card, Button, Dropdown, Menu, message } from "antd";
import { getToken } from "../service/LocalStorageService";
import CreatePostModal from "../components/CreatePostModal";
import PostCommentModal from "../components/PostCommentModal";
import { fetchWith401Check } from "../utils/fetchWith401Check";
import { API_BASE_URL } from "../configuration/configuration";

function MyPost() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // --- fetch posts ---
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
      const normalized = data.content.map(p => ({
        ...p,
        reactionCount: Number(p.reactionCount ?? 0),
        myReaction: p.myReaction ?? null,
        countComment: Number(p.countComment ?? 0),
      }));
      setPosts((prev) => [...prev, ...normalized]);
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

  // --- create/update post ---
  const handlePostCreatedOrUpdated = (newPost) => {
    setPosts((prev) => {
      const index = prev.findIndex((p) => p.id === newPost.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          ...newPost,
          reactionCount: Number(newPost.reactionCount ?? updated[index].reactionCount),
          countComment: Number(newPost.countComment ?? updated[index].countComment),
          myReaction: newPost.myReaction ?? updated[index].myReaction,
        };
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

  // --- handle like ---
  const handleReaction = async (postId) => {
    try {
      const res = await fetchWith401Check(`${API_BASE_URL}/post-reactions`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ postId, type: "LIKE" })
      });
      const data = await res.json();

      setPosts(prevPosts =>
        prevPosts.map(p => {
          const currentCount = Number(p.reactionCount ?? 0);
          if (p.id === postId) {
            const newCount = data.type === null
              ? Math.max(currentCount - 1, 0)
              : currentCount + (p.myReaction === null ? 1 : 0);
            return { ...p, reactionCount: newCount, myReaction: data.type ?? null };
          }
          return { ...p };
        })
      );
    } catch (error) {
      console.error("Reaction error", error);
    }
  };

  // --- handle comment ---
  const handleComment = (postId) => {
    setSelectedPostId(postId);
    setIsCommentModalOpen(true);
  };
  const handleCloseCommentModal = () => {
    setIsCommentModalOpen(false);
    setSelectedPostId(null);
  };
  const updateCommentCount = (postId, delta = 1) => {
    setPosts(prevPosts =>
      prevPosts.map(p => ({ ...p, countComment: p.id === postId ? (Number(p.countComment) || 0) + delta : p.countComment }))
    );
  };

  return (
    <div style={{ paddingTop: "80px", paddingBottom: "20px", background: "#242424", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "610px", maxWidth: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ color: "white" }}>My Posts</h2>
        <Button type="primary" onClick={() => { setEditingPost(null); setModalVisible(true); }}>Thêm post</Button>
      </div>

      {posts.map(post => (
        <Card
          key={`${post.id}-${post.reactionCount}-${post.countComment}`}
          style={{ marginBottom: 16, background: "#2f2f2f", color: "white", width: "610px", maxWidth: "100%" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ color: "white", margin: 0 }}>{post.username}</h3>
            <Dropdown overlay={
              <Menu>
                <Menu.Item key="edit" onClick={() => openEditModal(post)}>Sửa</Menu.Item>
                <Menu.Item key="delete" onClick={() => handleDeletePost(post.id)}>Xóa</Menu.Item>
              </Menu>
            } placement="bottomRight" trigger={["click"]}>
              <Button type="text" style={{ color: "white" }}>...</Button>
            </Dropdown>
          </div>
          <p style={{ color: "#dcdcdc" }}>{post.caption}</p>

          {post.mediaUrls?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
              {post.mediaUrls.map((media, idx) => (
                <img key={idx} src={media} alt="post" style={{ width: "180px", height: "180px", objectFit: "cover", borderRadius: "8px" }} />
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
            <button
              style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}
              onClick={() => handleReaction(post.id)}
            >
              👍 {post.reactionCount}
            </button>

            <button
              style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}
              onClick={() => handleComment(post.id)}
            >
              💬 {post.countComment}
            </button>

            <button
              style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}
              onClick={async () => {
                const url = `${window.location.origin}/post/${post.id}`;
                await navigator.clipboard.writeText(url);
                message.success("Đã copy link bài viết");
              }}
            >
              🔗 Chia sẻ
            </button>
          </div>

        </Card>
      ))}

      {loading && <p style={{ color: "white", textAlign: "center" }}>Đang tải...</p>}
      {!hasMore && <p style={{ color: "white", textAlign: "center" }}>Hết bài viết</p>}

      {/* Create post modal */}
      <CreatePostModal visible={modalVisible} editingPost={editingPost} onClose={closeModal} onPostCreated={handlePostCreatedOrUpdated} />

      {/* Comment modal */}
      {isCommentModalOpen && (
        <PostCommentModal open={isCommentModalOpen} onClose={handleCloseCommentModal} postId={selectedPostId} onNewComment={updateCommentCount} />
      )}
    </div>
  );
}

export default MyPost;
