import { useEffect, useState, useContext } from "react";
import { getAllPosts, getUserProfile, addComment, getComments, updateComment, deleteComment } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { dropdownIcon, postIcons } from "../assets/icons";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [commentSection, setCommentSection] = useState({});
  const [commentContent, setCommentContent] = useState("");
  const [showSelect, setShowSelect] = useState({});
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

  const handleShowSelect = (commentID) => {
    setShowSelect((prev) => ({ ...prev, [commentID]: !prev[commentID] }));
  };

  const handleUpdateComment = async (postID, commentID) => {
    const updatedContent = prompt("請輸入新的留言內容");
    if (!updatedContent.trim()) {
      alert("請輸入留言內容");
      return;
    }
    await updateComment(postID, commentID, { content: updatedContent });
    const renderComments = await getComments(postID);
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === postID ? { ...post, comments: renderComments } : post)));
  };

  const handleDeleteComment = async (postID, commentID) => {
    await deleteComment(postID, commentID);
    const renderComments = await getComments(postID);
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === postID ? { ...post, comments: renderComments } : post)));
  };

  const handleSelectChange = (postID, commentID, value) => {
    if (value === "edit") {
      handleUpdateComment(postID, commentID);
    } else if (value === "delete") {
      handleDeleteComment(postID, commentID);
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
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl leading-7">貼文總覽</h2>
        <div className="relative">
          <select className="text-center border border-black-500 rounded-2xl appearance-none px-12 focus:outline-primary-dark" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">全部貼文</option>
            <option value="personal">僅限自己</option>
          </select>
          <dropdownIcon.TbChevronDown className="w-6 h-6 text-black-500 pointer-events-none absolute inset-y-0 right-2" />
        </div>
      </div>
      <ul className="space-y-4">
        {filteredPosts.map((post) => {
          return (
            <li key={post.id} className="p-4 bg-black-50 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12">{post.user && <img src={post.user.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />}</div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-lg leading-6">{post.user ? post.user.name : "Unknown"}</h3>
                    <p className="font-normal text-sm leading-5">{getTimeDifference(post.createdTime.seconds)}</p>
                    {/* <p className="text-slate-500">Lv.{post.user ? post.user.levelPoints : 0}</p> */}
                  </div>
                </div>
                <postIcons.TbDots className="w-6 h-6 text-black cursor-pointer hover:text-alert" />
              </div>
              <div
                className={`w-full min-h-52 h-fit flex justify-center items-center p-4 rounded-xl ${!post.background ? "bg-slate-100" : ""}`}
                style={post.background ? { backgroundImage: `url(${post.background})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
              >
                <p>{post.content}</p>
              </div>
              <div className="flex gap-3">
                <div className="flex gap-1">
                  <postIcons.TbHeart className="w-6 h-6 cursor-pointer text-black-500 hover:text-alert" />
                  <p className="text-black-500 font-normal text-base leading-6">0</p>
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
                        <div>
                          <div className="flex gap-2">
                            <h3 className="font-medium text-sm leading-5 line-clamp-1">{comment.userName}</h3>
                            <p className="font-normal text-sm leading-5 text-black-700">{getTimeDifference(comment.createdTime.seconds)}</p>
                          </div>
                          <p className="font-normal text-base leading-6">{comment.content}</p>
                        </div>
                        <div className="flex flex-col">
                          <postIcons.TbDots className="w-6 h-6 text-black cursor-pointer hover:text-alert" onClick={() => handleShowSelect(comment.id)} />
                          {showSelect[comment.id] && (
                            <select className="border" onChange={(e) => handleSelectChange(post.id, comment.id, e.target.value)}>
                              <option value="">選擇操作</option>
                              <option value="edit">Edit</option>
                              <option value="delete">Delete</option>
                            </select>
                          )}
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
  );
}

export default Posts;
