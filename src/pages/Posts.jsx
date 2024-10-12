import { useEffect, useState, useContext, useRef } from "react";
import { addPost, getAllPosts, getUserProfile, addComment, getComments, updateComment, deleteComment, updatePost, deletePost, addLike, removeLike, getPostBackgrounds } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { postIcons } from "../assets/icons";
import CustomSelect from "../components/CustomSelect";
import PostSelect from "../components/PostSelect";
import Modal from "../components/Modal";
import PostModal from "../components/PostModal";
import toast from "react-hot-toast";
import habitPiggyLogo from "../assets/images/habit-piggy-logo.svg";

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

  const renderUserDetails = () => {
    if (!userData) {
      return (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black-500 rounded-full"></div>
          <p className="font-bold text-lg leading-6 text-black dark:text-black-0">Unknown</p>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <img src={userData.avatar} alt="avatar" className="w-12 h-12 object-cover rounded-full outline outline-primary-dark dark:outline-primary" />
        <p className="font-bold text-lg leading-6 text-black dark:text-black-0">{userData.name}</p>
      </div>
    );
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
        <div className="relative">
          <div ref={postRef} className="relative bg-black-50 dark:bg-black-800 p-4 rounded-xl space-y-2 md:space-y-3 z-0" onClick={handleClick}>
            <div className={`absolute inset-0 rounded-xl -z-10 ${isHighlighted ? "block" : "hidden"}`} style={{ boxShadow: "0 0 8px 1px rgba(250, 173, 20, 1)" }}></div>
            {renderUserDetails()}
            <div className="flex items-center gap-4">
              <p className="font-normal text-base leading-6 text-black dark:text-black-0 text-nowrap">選擇背景顏色</p>
              <div className="flex gap-4 overflow-scroll">
                {backgrounds.map((url, index) => (
                  <button
                    key={index}
                    className="rounded w-6 h-6 flex-shrink-0 flex-grow-0 border border-black-500"
                    style={{ backgroundImage: `url(${url})`, backgroundSize: "cover", backgroundPosition: "center" }}
                    onClick={() => setPostBackground(url)}
                  ></button>
                ))}
              </div>
            </div>
            <div
              className="w-full min-h-40 h-fit border rounded-xl bg-black-100 p-2 overflow-auto flex justify-center items-center"
              style={{
                backgroundImage: `url(${postBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <textarea
                className="w-full h-fit bg-transparent border-none overflow-hidden resize-none outline-none text-center placeholder-black font-normal text-base leading-6 md:text-xl md:leading-7 xl:text-2xl xl:leading-8 break-words whitespace-pre-wrap"
                placeholder="輸入貼文內容..."
                value={postContent}
                onChange={(e) => {
                  setPostContent(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                style={{ color: calculateTextColor(postBackground) }}
                rows="1"
              />
            </div>
            <div className="text-end">
              <button className="py-1 px-3 w-fit bg-primary rounded-lg font-medium text-sm leading-5 md:text-base md:leading-6 hover:bg-primary-dark" onClick={handleAddPost}>
                發佈貼文
              </button>
            </div>
          </div>
        </div>
        <ul className="space-y-4">
          {filteredPosts.map((post) => {
            return (
              <li key={post.id} className="p-4 bg-black-50 dark:bg-black-800 rounded-2xl space-y-3 w-full">
                <div className="flex justify-between items-center w-full">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12">
                      {post.user && <img src={post.user.avatar} alt="avatar" className="w-full h-full object-cover rounded-full outline outline-primary-dark dark:outline-primary" />}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-lg leading-6 text-black dark:text-black-0">{post.user ? post.user.name : "Unknown"}</h3>
                      <p className="font-normal text-sm leading-5 text-black dark:text-black-0">{getTimeDifference(post.createdTime.seconds)}</p>
                    </div>
                  </div>
                  <PostSelect
                    ref={customSelectRef}
                    options={[
                      { value: "edit", label: "編輯貼文" },
                      { value: "delete", label: "刪除貼文" },
                    ]}
                    onChange={(value) => handleSelectChange(post, null, value)}
                    theme="dark"
                  />
                </div>
                <div
                  className={`w-full min-h-52 h-fit flex justify-center items-center p-4 rounded-xl font-normal text-base leading-6 md:text-xl md:leading-7 xl:text-2xl xl:leading-8 ${
                    !post.background ? "bg-slate-100" : ""
                  }`}
                  style={
                    post.background
                      ? {
                          backgroundImage: `url(${post.background})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          color: calculateTextColor(post.background),
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                        }
                      : { color: calculateTextColor(post.background), wordBreak: "break-word", whiteSpace: "pre-wrap" }
                  }
                >
                  <p className="text-center">{post.content}</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex gap-1">
                    {post.likes && post.likes.includes(user.uid) ? (
                      <postIcons.TbHeartFilled className="w-6 h-6 cursor-pointer text-alert" onClick={() => handleUnlike(post.id)} />
                    ) : (
                      <postIcons.TbHeart className="w-6 h-6 cursor-pointer text-black dark:text-black-0 hover:text-alert" onClick={() => handleLike(post.id)} />
                    )}
                    <p className="text-black dark:text-black-0 font-normal text-base leading-6">{post.likes ? post.likes.length : 0}</p>
                  </div>
                  <div className="flex gap-1">
                    <postIcons.TbMessageChatbot
                      className="w-6 h-6 cursor-pointer text-black dark:text-black-0 hover:text-black dark:hover:text-black-200"
                      onClick={() => handleCommentSection(post.id)}
                    />
                    <p className="text-black dark:text-black-0 font-normal text-base leading-6">{post.comments ? post.comments.length : 0}</p>
                  </div>
                </div>
                <ul className={`space-y-3 ${commentSection[post.id] ? "block" : "hidden"}`}>
                  {post.comments &&
                    post.comments.map((comment) => (
                      <li key={comment.id} className="flex justify-between items-center gap-3">
                        <img src={comment.userAvatar} alt="user's avatar" className="w-12 h-12 rounded-full object-cover" />
                        <div className="bg-black-200 rounded-xl px-4 py-2 w-full flex justify-between items-center">
                          <div className="w-full md:w-4/5">
                            <div className="flex gap-2">
                              <h3 className="font-medium text-sm leading-5 line-clamp-1">{comment.userName}</h3>
                              <p className="font-normal text-sm leading-5 text-black dark:text-black-0-700">
                                {getTimeDifference(comment.updatedTime ? comment.updatedTime.seconds : comment.createdTime.seconds)}
                              </p>
                            </div>
                            {editingComment[comment.id] ? (
                              <div className="grid grid-cols-1 gap-x-2 md:flex md:items-center md:gap-2">
                                <input
                                  type="text"
                                  value={editingComment[comment.id]}
                                  onChange={(e) => setEditingComment({ ...editingComment, [comment.id]: e.target.value })}
                                  className="font-normal text-base leading-6 rounded px-2 py-1 w-full bg-black-0 text-black caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark my-1"
                                />
                                <div className="flex gap-x-2">
                                  <button
                                    className="w-fit text-nowrap font-medium text-sm leading-5 bg-black-100 py-1 md:py-1.5 px-2 rounded hover:bg-black-300"
                                    onClick={() => handleCancelEdit(comment.id)}
                                  >
                                    取消修改
                                  </button>
                                  <button
                                    className="w-fit text-nowrap font-medium text-sm leading-5 bg-primary py-1 md:py-1.5 px-2 rounded hover:bg-primary-dark"
                                    onClick={() => handleUpdate(post.id, null, comment.id)}
                                  >
                                    確認修改
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="font-normal text-base leading-6">{comment.content}</p>
                            )}
                          </div>
                          {editingComment[comment.id] ? null : (
                            <div className="flex flex-col">
                              <PostSelect
                                ref={customSelectRef}
                                options={[
                                  { value: "edit", label: "編輯留言" },
                                  { value: "delete", label: "刪除留言" },
                                ]}
                                onChange={(value) => handleSelectChange(post, comment.id, value)}
                                theme="light"
                              />
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  <li className="flex justify-between items-center gap-2">
                    <input
                      type="text"
                      placeholder="請輸入留言"
                      className="bg-black-100 text-black py-2 px-4 w-full rounded-2xl placeholder:text-black dark:text-black-0-500  caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark focus:bg-black-0"
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                    />
                    <div className="w-10 h-10 bg-primary flex justify-center items-center rounded-full aspect-square cursor-pointer hover:bg-primary-dark" onClick={() => handleAddComment(post.id)}>
                      <postIcons.TbSend2 className="w-6 h-6 text-black" />
                    </div>
                  </li>
                </ul>
              </li>
            );
          })}
        </ul>
        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-black-800 p-4 rounded-xl shadow-lg">
              <p className="text-black dark:text-white mb-4">你確定要執行這個操作嗎？</p>
              <div className="flex justify-end gap-2">
                <button className="py-1 px-3 bg-gray-300 rounded-lg" onClick={() => setShowConfirmModal(false)}>
                  取消
                </button>
                <button
                  className="py-1 px-3 bg-primary rounded-lg text-black"
                  onClick={() => {
                    confirmAction();
                    setShowConfirmModal(false);
                  }}
                >
                  確認
                </button>
              </div>
            </div>
          </div>
        )}
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
