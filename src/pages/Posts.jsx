import { useEffect, useState, useContext, useRef } from "react";
import { addPost, getAllPosts, getUserProfile, addComment, getComments, updateComment, deleteComment, updatePost, deletePost, addLike, removeLike, getPostBackgrounds } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import CustomSelect from "../components/CustomSelect";
import Modal from "../components/Modal";
import PostModal from "../components/Posts/PostModal";
import toast from "react-hot-toast";
import habitPiggyLogo from "../assets/images/habit-piggy-logo.svg";
import PostForm from "../components/Posts/PostForm";
import PostList from "../components/Posts/PostList";
import ConfirmModal from "../components/Posts/ConfirmModal";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [options] = useState([
    { label: "全部貼文", value: "all" },
    { label: "僅限自己", value: "personal" },
  ]);
  const [commentSection, setCommentSection] = useState({});
  const [commentContent, setCommentContent] = useState("");
  const [editingComment, setEditingComment] = useState({});
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [postBackground, setPostBackground] = useState("");
  const [backgrounds, setBackgrounds] = useState([]);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const postRef = useRef(null);
  const customSelectRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsList = await getAllPosts();
      const postsWithUserDetails = await Promise.all(
        postsList.map(async (post) => {
          const userProfile = await getUserProfile(post.userID);
          const comments = await getComments(post.id);
          return { ...post, user: userProfile, comments: comments };
        })
      );
      setPosts(postsWithUserDetails);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchBackgrounds = async () => {
      const urls = await getPostBackgrounds();
      setBackgrounds(urls);
    };

    fetchBackgrounds();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const data = await getUserProfile(user.uid);
        setUserData(data);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (customSelectRef.current && !customSelectRef.current.contains(e.target)) {
        customSelectRef.current.closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredPosts = filter === "personal" ? posts.filter((post) => post.userID === user.uid) : posts;

  const handleCommentSection = (postID) => {
    setCommentSection((prev) => ({ ...prev, [postID]: !prev[postID] }));
  };

  const handleAddComment = async (postID) => {
    if (!commentContent.trim()) {
      alertNotify();
      return;
    }
    const userProfile = await getUserProfile(user.uid);
    const commentData = {
      content: commentContent,
      userID: user.uid,
      userName: userProfile.name,
      userAvatar: userProfile.avatar,
    };
    await addComment(postID, commentData);
    setCommentContent("");
    const renderComments = await getComments(postID);
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === postID ? { ...post, comments: renderComments } : post)));
    addCommentNotify();
  };

  const handleCancelEdit = (commentID) => {
    setEditingComment((prev) => ({ ...prev, [commentID]: "" }));
  };

  const handleDeleteComment = (postID, commentID) => {
    const post = posts.find((post) => post.id === postID);
    const comment = post.comments.find((comment) => comment.id === commentID);
    if (comment.userID !== user.uid) {
      authorAlertNotify();
      return;
    }
    setConfirmAction(() => async () => {
      await deleteComment(postID, commentID);
      const renderComments = await getComments(postID);
      setPosts((prevPosts) => prevPosts.map((post) => (post.id === postID ? { ...post, comments: renderComments } : post)));
      deleteCommentNotify();
    });
    setShowConfirmModal(true);
  };

  const handleDeletePost = async (postID) => {
    const post = posts.find((post) => post.id === postID);
    if (post.userID !== user.uid) {
      authorAlertNotify();
      return;
    }
    setConfirmAction(() => async () => {
      await deletePost(postID);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postID));
      deletePostNotify();
    });
    setShowConfirmModal(true);
  };

  const handleEdit = (post, commentID = null) => {
    if (commentID) {
      const comment = post.comments.find((comment) => comment.id === commentID);
      if (comment.userID !== user.uid) {
        authorAlertNotify();
        return;
      }
      setEditingComment((prev) => ({ ...prev, [commentID]: comment.content }));
    } else {
      if (post.userID !== user.uid) {
        authorAlertNotify();
        return;
      }
      setCurrentPost(post);
      setIsPostModalOpen(true);
    }
  };

  const handleUpdate = async (postID, postData, commentID = null) => {
    if (commentID) {
      const updatedContent = editingComment[commentID];
      if (!updatedContent.trim()) {
        alertNotify();
        return;
      }
      await updateComment(postID, commentID, { content: updatedContent });
      const renderComments = await getComments(postID);
      setPosts((prevPosts) => prevPosts.map((post) => (post.id === postID ? { ...post, comments: renderComments } : post)));
      setEditingComment((prev) => ({ ...prev, [commentID]: "" }));
      updateCommentNotify();
    } else {
      await updatePost(postID, postData);
      const updatedPosts = await getAllPosts();
      setPosts(updatedPosts);
      setIsPostModalOpen(false);
      updatePostNotify();
    }
  };

  const handleSelectChange = (post, commentID, value) => {
    if (value === "edit") {
      handleEdit(post, commentID);
    } else if (value === "delete") {
      if (commentID) {
        handleDeleteComment(post.id, commentID);
      } else {
        handleDeletePost(post.id);
      }
    }
  };

  const handleLike = async (postID) => {
    try {
      await addLike(postID, user.uid);
      const updatedPosts = await getAllPosts();
      const postsWithUserDetails = await Promise.all(
        updatedPosts.map(async (post) => {
          const userProfile = await getUserProfile(post.userID);
          const comments = await getComments(post.id);
          return { ...post, user: userProfile, comments: comments };
        })
      );
      setPosts(postsWithUserDetails);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnlike = async (postID) => {
    try {
      await removeLike(postID, user.uid);
      const updatedPosts = await getAllPosts();
      const postsWithUserDetails = await Promise.all(
        updatedPosts.map(async (post) => {
          const userProfile = await getUserProfile(post.userID);
          const comments = await getComments(post.id);
          return { ...post, user: userProfile, comments: comments };
        })
      );
      setPosts(postsWithUserDetails);
    } catch (error) {
      console.error(error);
    }
  };

  const getTimeDifference = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp * 1000);
    const diffInSeconds = Math.floor((now - commentTime) / 1000);

    if (diffInSeconds < 3600) {
      return "剛剛";
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} 小時前`;
    } else if (diffInSeconds < 259200) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} 天前`;
    } else {
      return commentTime.toLocaleString([], { year: "numeric", month: "2-digit", day: "2-digit" });
    }
  };

  const handleAddPost = async () => {
    if (!postContent.trim()) {
      alertNotify();
      return;
    }

    if (user) {
      const userProfile = await getUserProfile(user.uid);
      const postData = {
        content: postContent,
        background: postBackground,
        userID: user.uid,
        user: userProfile,
        createdTime: { seconds: Math.floor(Date.now() / 1000) },
        likes: [],
        comments: [],
      };
      await addPost(user.uid, postData);
      setPosts((prevPosts) => [postData, ...prevPosts]);
      setPostContent("");
      setPostBackground("");
      addPostNotify();

      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.style.height = "auto";
      }
    }
  };

  const calculateTextColor = (background) => {
    if (!background) return "black";

    const rgb = background.match(/\d+/g);
    const r = parseInt(rgb[0], 10);
    const g = parseInt(rgb[1], 10);
    const b = parseInt(rgb[2], 10);

    const brightness = (r * 299 + g * 587 + b * 114) / 10;

    return brightness > 186 ? "black" : "white";
  };

  const handleClick = () => {
    setIsHighlighted(true);
  };

  const handleClickOutside = (event) => {
    if (postRef.current && !postRef.current.contains(event.target)) {
      setIsHighlighted(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const CustomToast = (message) => {
    toast(message, {
      icon: <img src={habitPiggyLogo} alt="Habit Piggy Logo" style={{ width: "40px", height: "40px" }} />,
      style: {
        borderRadius: "16px",
        background: "#212121",
        color: "#fff",
      },
      duration: 3000,
    });
  };

  const AlertToast = (message) => {
    toast.error(message, {
      style: {
        borderRadius: "16px",
        background: "#212121",
        color: "#fff",
      },
      duration: 3000,
    });
  };

  const addPostNotify = () => CustomToast("今天也是快樂的貓咪日");
  const updatePostNotify = () => CustomToast("已更新貼文！");
  const deletePostNotify = () => CustomToast("已刪除貼文！");
  const addCommentNotify = () => CustomToast("已新增留言！");
  const updateCommentNotify = () => CustomToast("已更新留言！");
  const deleteCommentNotify = () => CustomToast("已刪除留言！");
  const alertNotify = () => AlertToast("沒有內容不能發布喔！");
  const authorAlertNotify = () => AlertToast("你沒有權限執行這個行為！");

  return (
    <>
      <div className="p-4 md:py-10 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xl leading-7 text-black dark:text-black-0">貼文總覽</h2>
          <div className="relative" ref={customSelectRef}>
            <CustomSelect options={options} value={filter} onChange={setFilter} />
          </div>
        </div>
        <PostForm
          postRef={postRef}
          isHighlighted={isHighlighted}
          handleClick={handleClick}
          backgrounds={backgrounds}
          setPostBackground={setPostBackground}
          postBackground={postBackground}
          postContent={postContent}
          setPostContent={setPostContent}
          handleAddPost={handleAddPost}
          calculateTextColor={calculateTextColor}
          userData={userData}
        />
        <PostList
          posts={filteredPosts}
          user={user}
          handleCommentSection={handleCommentSection}
          commentSection={commentSection}
          handleAddComment={handleAddComment}
          commentContent={commentContent}
          setCommentContent={setCommentContent}
          editingComment={editingComment}
          setEditingComment={setEditingComment}
          handleCancelEdit={handleCancelEdit}
          handleUpdate={handleUpdate}
          handleDeleteComment={handleDeleteComment}
          handleDeletePost={handleDeletePost}
          handleSelectChange={handleSelectChange}
          handleLike={handleLike}
          handleUnlike={handleUnlike}
          getTimeDifference={getTimeDifference}
          customSelectRef={customSelectRef}
          calculateTextColor={calculateTextColor}
        />
        {showConfirmModal && <ConfirmModal setShowConfirmModal={setShowConfirmModal} confirmAction={confirmAction} />}
      </div>
      <Modal isOpen={isPostModalOpen} onRequestClose={() => setIsPostModalOpen(false)}>
        <PostModal
          postContent={currentPost ? currentPost.content : ""}
          setPostContent={(content) => setCurrentPost((prev) => ({ ...prev, content }))}
          postBackground={currentPost ? currentPost.background : ""}
          setPostBackground={(background) => setCurrentPost((prev) => ({ ...prev, background }))}
          handlePostModal={() => setIsPostModalOpen(false)}
          user={user}
          isEditMode={true}
          handleUpdatePost={() => handleUpdate(currentPost.id, currentPost)}
          calculateTextColor={calculateTextColor}
        />
      </Modal>
    </>
  );
}

export default Posts;
