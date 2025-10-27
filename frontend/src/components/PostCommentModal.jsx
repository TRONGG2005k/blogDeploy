import React, { useState, useEffect, useRef } from "react";
import { Modal, Card, Input, Button, Spin, message, Dropdown, Menu } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { fetchWith401Check } from "../utils/fetchWith401Check";
import { getToken } from "../service/LocalStorageService";
import dayjs from "dayjs";
import { API_BASE_URL } from "../configuration/configuration";

function PostCommentModal({ open, onClose, postId, onNewComment }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const commentContainerRef = useRef(null);

  const fetchPostDetail = async () => {
    setLoadingPost(true);
    try {
      const res = await fetchWith401Check(`${API_BASE_URL}/post/${postId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setPost(data);
    } catch (err) {
      console.error(err);
      message.error("Không lấy được thông tin bài viết");
    } finally {
      setLoadingPost(false);
    }
  };

  const fetchComments = async (pageParam) => {
    if (loadingComments || !hasMore) return;
    setLoadingComments(true);
    try {
      const res = await fetchWith401Check(
        `${API_BASE_URL}/comments/${postId}/comments?page=${pageParam}`,
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
      setComments((prev) => [...prev, ...data.content]);
    } catch (err) {
      console.error(err);
      message.error("Không lấy được bình luận");
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (open && postId) {
      setComments([]);
      setPage(0);
      setHasMore(true);
      fetchPostDetail();
      fetchComments(0);
    }
  }, [open, postId]);

  useEffect(() => {
    if (page === 0) return;
    fetchComments(page);
  }, [page]);

  const handleScroll = () => {
    if (!commentContainerRef.current || loadingComments || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = commentContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetchWith401Check(`${API_BASE_URL}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          postId: postId,
          content: newComment,
        }),
      });
      if (!res.ok) throw new Error("Gửi bình luận thất bại");
      const data = await res.json();

      const newCommentWithPermission = {
        ...data,
        canEdit: true,
        canDelete: true,
      };

      setComments((prev) => [newCommentWithPermission, ...prev]);
      setNewComment("");
      message.success("Bình luận đã được gửi");

      if (onNewComment) onNewComment(postId, 1);
      commentContainerRef.current.scrollTop = 0;
    } catch (err) {
      console.error(err);
      message.error("Gửi bình luận thất bại");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await fetchWith401Check(`${API_BASE_URL}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
        },
      });
      setComments((prev) => prev.filter(c => c.id !== commentId));
      message.success("Xoá bình luận thành công");
      if (onNewComment) onNewComment(postId, -1);
    } catch (err) {
      console.error(err);
      message.error("Xoá bình luận thất bại");
    }
  };

  const handleEditComment = async (comment) => {
    const updatedContent = prompt("Chỉnh sửa bình luận:", comment.content);
    if (!updatedContent || updatedContent === comment.content) return;

    try {
      const res = await fetchWith401Check(`${API_BASE_URL}/comments/${comment.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          content: updatedContent,
          postId: postId,
          parentCommentId: comment.parentCommentId || null,
        }),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");

      const updatedComment = await res.json();
      setComments((prev) =>
        prev.map(c => c.id === updatedComment.id ? updatedComment : c)
      );
      message.success("Cập nhật bình luận thành công");
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại");
    }
  };
  
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Chi tiết bài viết & bình luận"
      width={700}
      footer={null}
      bodyStyle={{ height: "80vh", display: "flex", flexDirection: "column", padding: 0 }}
    >
      {loadingPost ? (
        <div style={{ textAlign: "center", padding: 24 }}>
          <Spin />
        </div>
      ) : post ? (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Post Card */}
          <Card
            style={{
              margin: 12,
              background: "#2f2f2f",
              color: "white",
              maxHeight: "40%",
              overflowY: "auto",
            }}
          >
            <h3 style={{ color: "white" }}>{post.user.username}</h3>
            <p style={{ color: "#dcdcdc" }}>{post.caption}</p>

            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {post.mediaUrls.map((media, idx) => (
                  <img
                    key={idx}
                    src={media}
                    alt="post"
                    style={{
                      width: "180px",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ))}
              </div>
            )}
            <p>❤️ {post.reactions} | 🕒 {dayjs(post.createdAt).format("HH:mm DD/MM/YYYY")}</p>
          </Card>

          {/* Comment list */}
          <div
            ref={commentContainerRef}
            onScroll={handleScroll}
            style={{ flex: 1, overflowY: "auto", padding: "0 12px" }}
          >
            {comments.map((comment) => {
              const menuItems = [];
              if (comment.canEdit) menuItems.push({ key: "edit", label: "Chỉnh sửa", onClick: () => handleEditComment(comment) });
              if (comment.canDelete) menuItems.push({ key: "delete", label: "Xoá", onClick: () => handleDeleteComment(comment.id) });

              return (
                <Card
                  key={comment.id}
                  size="small"
                  style={{ marginBottom: 8, background: "#3a3a3a", color: "white" }}
                  extra={
                    menuItems.length > 0 ? (
                      <Dropdown
                        overlay={<Menu items={menuItems} />}
                        trigger={["click"]}
                        placement="bottomRight"
                      >
                        <Button size="small" type="text" icon={<EllipsisOutlined />} />
                      </Dropdown>
                    ) : null
                  }
                >
                  <b>{comment.username}</b>{" "}
                  <span style={{ fontSize: 12, color: "#dcdcdc" }}>
                    {dayjs(comment.createdAt).format("HH:mm DD/MM/YYYY")}
                  </span>
                  <p style={{ marginTop: 4 }}>{comment.content}</p>
                  <p style={{ fontSize: 12, color: "#dcdcdc" }}>❤️ {comment.reactionCount}</p>
                </Card>
              );
            })}
            {loadingComments && (
              <div style={{ textAlign: "center", marginTop: 8 }}>
                <Spin size="small" />
              </div>
            )}
            {!hasMore && <p style={{ textAlign: "center", color: "#dcdcdc" }}>Hết bình luận</p>}
          </div>

          {/* Input cố định */}
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "8px 12px",
              borderTop: "1px solid #444",
              background: "#242424",
            }}
          >
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận..."
              style={{ flex: 1 }}
              onPressEnter={handleSendComment}
            />
            <Button type="primary" onClick={handleSendComment}>
              Gửi
            </Button>
          </div>
        </div>
      ) : (
        <p style={{ color: "white", textAlign: "center" }}>Không có dữ liệu bài viết</p>
      )}
    </Modal>
  );
}

export default PostCommentModal;
