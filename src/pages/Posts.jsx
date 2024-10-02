import { useEffect, useState, useContext } from "react";
import { getAllPosts, getUserProfile, addComment, getComments, updateComment, deleteComment, updatePost, deletePost, addLike, removeLike } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { postIcons } from "../assets/icons";
import CustomSelect from "../components/CustomSelect";
import PostSelect from "../components/PostSelect";
import Modal from "../components/Modal";
import PostModal from "../components/PostModal";

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
  const { user } = useContext(AuthContext);

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

  const filteredPosts = filter === "personal" ? posts.filter((post) => post.userID === user.uid) : posts;

  const handleCommentSection = (postID) => {
    setCommentSection((prev) => ({ ...prev, [postID]: !prev[postID] }));
  };

  const handleAddComment = async (postID) => {
    if (!commentContent.trim()) {
      alert("請輸入留言內容");
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
  };

  const handleCancelEdit = (commentID) => {
    setEditingComment((prev) => ({ ...prev, [commentID]: "" }));
  };

  const handleDeleteComment = async (postID, commentID) => {
    await deleteComment(postID, commentID);
    const renderComments = await getComments(postID);
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === postID ? { ...post, comments: renderComments } : post)));
  };

  const handleDeletePost = async (postID) => {
    await deletePost(postID);
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postID));
  };

  const handleEdit = (post, commentID = null) => {
    if (commentID) {
      setEditingComment((prev) => ({ ...prev, [commentID]: post.comments.find((comment) => comment.id === commentID).content }));
    } else {
      setCurrentPost(post);
      setIsPostModalOpen(true);
    }
  };

  const handleUpdate = async (postID, postData, commentID = null) => {
    if (commentID) {
      const updatedContent = editingComment[commentID];
      if (!updatedContent.trim()) {
        alert("請輸入留言內容");
        return;
      }
      await updateComment(postID, commentID, { content: updatedContent });
      const renderComments = await getComments(postID);
      setPosts((prevPosts) => prevPosts.map((post) => (post.id === postID ? { ...post, comments: renderComments } : post)));
      setEditingComment((prev) => ({ ...prev, [commentID]: "" }));
    } else {
      await updatePost(postID, postData);
      const updatedPosts = await getAllPosts();
      setPosts(updatedPosts);
      setIsPostModalOpen(false);
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

  return (
    <>
      <div className="p-4 md:py-10 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xl leading-7">貼文總覽</h2>
          <div className="relative">
            <CustomSelect options={options} value={filter} onChange={setFilter} />
          </div>
        </div>
        <ul className="space-y-4">
          {filteredPosts.map((post) => {
            return (
              <li key={post.id} className="p-4 bg-black-50 rounded-2xl space-y-3 w-full">
                <div className="flex justify-between items-center w-full">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12">{post.user && <img src={post.user.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />}</div>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-lg leading-6">{post.user ? post.user.name : "Unknown"}</h3>
                      <p className="font-normal text-sm leading-5">{getTimeDifference(post.createdTime.seconds)}</p>
                    </div>
                  </div>
                  <PostSelect
                    options={[
                      { value: "edit", label: "編輯貼文" },
                      { value: "delete", label: "刪除貼文" },
                    ]}
                    onChange={(value) => handleSelectChange(post, null, value)}
                  />
                </div>
                <div
                  className={`w-full min-h-52 h-fit flex justify-center items-center p-4 rounded-xl ${!post.background ? "bg-slate-100" : ""}`}
                  style={post.background ? { backgroundImage: `url(${post.background})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                >
                  <p>{post.content}</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex gap-1">
                    {post.likes && post.likes.includes(user.uid) ? (
                      <postIcons.TbHeartFilled className="w-6 h-6 cursor-pointer text-alert" onClick={() => handleUnlike(post.id)} />
                    ) : (
                      <postIcons.TbHeart className="w-6 h-6 cursor-pointer text-black-500 hover:text-alert" onClick={() => handleLike(post.id)} />
                    )}
                    <p className="text-black-500 font-normal text-base leading-6">{post.likes ? post.likes.length : 0}</p>
                  </div>
                  <div className="flex gap-1">
                    <postIcons.TbMessageChatbot className="w-6 h-6 cursor-pointer text-black-500 hover:text-black-900" onClick={() => handleCommentSection(post.id)} />
                    <p className="text-black-500 font-normal text-base leading-6">{post.comments ? post.comments.length : 0}</p>
                  </div>
                </div>
                <ul className={`space-y-3 ${commentSection[post.id] ? "block" : "hidden"}`}>
                  {post.comments &&
                    post.comments.map((comment) => (
                      <li key={comment.id} className="flex justify-between items-center gap-3">
                        <img src={comment.userAvatar} alt="user's avatar" className="w-12 h-12 rounded-full" />
                        <div className="bg-black-200 rounded-xl px-4 py-1 w-full flex justify-between items-center">
                          <div className="w-4/5">
                            <div className="flex gap-2">
                              <h3 className="font-medium text-sm leading-5 line-clamp-1">{comment.userName}</h3>
                              <p className="font-normal text-sm leading-5 text-black-700">{getTimeDifference(comment.updatedTime ? comment.updatedTime.seconds : comment.createdTime.seconds)}</p>
                            </div>
                            {editingComment[comment.id] ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editingComment[comment.id]}
                                  onChange={(e) => setEditingComment({ ...editingComment, [comment.id]: e.target.value })}
                                  className="font-normal text-base leading-6 rounded px-2 py-1 w-full bg-black-0 text-black caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark my-1"
                                />
                                <button
                                  className="text-nowrap font-medium text-sm leading-5 bg-primary py-1.5 px-2 rounded hover:bg-primary-dark"
                                  onClick={() => handleUpdate(post.id, null, comment.id)}
                                >
                                  確認修改
                                </button>
                                <button className="text-nowrap font-medium text-sm leading-5 bg-black-100 py-1.5 px-2 rounded hover:bg-black-300" onClick={() => handleCancelEdit(comment.id)}>
                                  取消修改
                                </button>
                              </div>
                            ) : (
                              <p className="font-normal text-base leading-6">{comment.content}</p>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <PostSelect
                              options={[
                                { value: "edit", label: "編輯留言" },
                                { value: "delete", label: "刪除留言" },
                              ]}
                              onChange={(value) => handleSelectChange(post, comment.id, value)}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  <li className="flex justify-between items-center gap-2">
                    <input
                      type="text"
                      placeholder="請輸入留言"
                      className="bg-black-100 text-black py-2 px-4 w-full rounded-2xl placeholder:text-black-500  caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark focus:bg-black-0"
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
        />
      </Modal>
    </>
  );
}

export default Posts;
