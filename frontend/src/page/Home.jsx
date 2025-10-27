import React, { useState, useEffect } from 'react';
import { Card, message } from "antd";
import { getToken } from '../service/LocalStorageService';
import { fetchWith401Check } from '../utils/fetchWith401Check';
import PostCommentModal from "../components/PostCommentModal";
import { API_BASE_URL } from "../configuration/configuration";

function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const fetchPosts = async (pageParam) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetchWith401Check(`${API_BASE_URL}/post?page=${pageParam}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`,
        }
      });

      const data = await res.json();
      if (!data.content || data.content.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts(prev => [...prev, ...data.content]);
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
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  const handleComment = (postId) => { setSelectedPostId(postId); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setSelectedPostId(null); };

  const handleReaction = async (postId) => {
    try {
      const res = await fetchWith401Check(`${API_BASE_URL}/post-reactions`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ postId, type: "LIKE" })
      });

      const data = await res.json();

      setPosts(prevPosts =>
        prevPosts.map(p => {
          if (p.id === postId) {
            const newCount = data.type === null
              ? p.reactionCount - 1
              : (p.myReaction ? p.reactionCount : p.reactionCount + 1);
            return { ...p, reactionCount: newCount, myReaction: data.type };
          }
          return p;
        })
      );
    } catch (error) {
      console.error("Reaction error", error);
    }
  };

  const handleShare = async (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    await navigator.clipboard.writeText(url);
    message.success("Đã copy link bài viết");
  };

  const updateCommentCount = (postId, delta = 1) => {
    setPosts(prevPosts =>
      prevPosts.map(p => p.id === postId
        ? { ...p, countComment: (p.countComment || 0) + delta }
        : p
      )
    );
  };

  return (
    <div style={{
      paddingTop: "80px",
      paddingBottom: "20px",
      background: "#242424",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>

      {posts.map(post => (
        <Card
          key={post.id}
          style={{
            marginBottom: 16,
            background: "#2f2f2f",
            color: "white",
            width: "610px",
            maxWidth: "100%",
          }}
        >
          <h3 style={{ color: "white" }}>{post.username}</h3>
          <p style={{ color: "#dcdcdc" }}>{post.caption}</p>

          {post.mediaUrls?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
              {post.mediaUrls.map((media, idx) => (
                <img
                  key={idx}
                  src={media}
                  alt="post"
                  style={{ width: "180px", height: "180px", objectFit: "cover", borderRadius: "8px" }}
                />
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
            <button style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}
              onClick={() => handleReaction(post.id)}>👍 {post.reactionCount}</button>

            <button style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}
              onClick={() => handleComment(post.id)}>💬 {post.countComment || 0}</button>

            <button style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}
              onClick={() => handleShare(post.id)}>🔗 Chia sẻ</button>
          </div>
        </Card>
      ))}

      {loading && <p style={{ color: "white", textAlign: "center" }}>Đang tải...</p>}
      {!hasMore && <p style={{ color: "white", textAlign: "center" }}>Hết bài viết</p>}

      {isModalOpen && (
        <PostCommentModal
          open={isModalOpen}
          onClose={handleCloseModal}
          postId={selectedPostId}
          onNewComment={updateCommentCount}
        />
      )}
    </div>
  );
}

export default Home;
