import { useEffect, useState, useContext } from "react";
import { getAllPosts, getUserProfile, addComment, getComments, updateComment, deleteComment } from "../services/api";
import { AuthContext } from "../utils/AuthContext";

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

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2>貼文總覽</h2>
        <select className="border" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">全部</option>
          <option value="personal">僅限自己</option>
        </select>
      </div>
      <ul className="space-y-4">
        {filteredPosts.map((post) => {
          return (
            <li key={post.id} className="p-4 border space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10">{post.user && <img src={post.user.avatar} alt="avatar" className="w-full h-full object-cover" />}</div>
                  <div className="flex flex-col">
                    <div className="flex gap-2">
                      <h3>{post.user ? post.user.name : "Unknown"}</h3>
                      <p>{new Date(post.createdTime.seconds * 1000).toLocaleString([], { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    {/* <p className="text-slate-500">Lv.{post.user ? post.user.levelPoints : 0}</p> */}
                  </div>
                </div>
              </div>
              <div
                className={`w-full min-h-52 h-fit flex justify-center items-center p-4 ${!post.background ? "bg-slate-100" : ""}`}
                style={post.background ? { backgroundImage: `url(${post.background})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
              >
                <p>{post.content}</p>
              </div>
              <div className="flex gap-3">
                <button className="border">Like</button>
                <div className="flex gap-1">
                  <button className="border" onClick={() => handleCommentSection(post.id)}>
                    Comment
                  </button>
                  <p>{post.comments ? post.comments.length : 0}</p>
                </div>
              </div>
              <ul className={`space-y-2 ${commentSection[post.id] ? "block" : "hidden"}`}>
                {post.comments &&
                  post.comments.map((comment) => (
                    <li key={comment.id} className="flex justify-between items-center gap-3">
                      <img src={comment.userAvatar} alt="user's avatar" className="w-10 h-10 bg-slate-100" />
                      <div className="bg-slate-300 px-4 py-1 w-full flex justify-between items-center">
                        <div>
                          <div className="flex gap-2">
                            <h3>{comment.userName}</h3>
                            <p>{new Date(comment.createdTime.seconds * 1000).toLocaleString([], { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                          <p>{comment.content}</p>
                        </div>
                        <div className="flex flex-col">
                          <button className="border" onClick={() => handleShowSelect(comment.id)}>
                            setting
                          </button>
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
                  <input type="text" placeholder="Add a comment" className="border p-2 w-full" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
                  <button className="border" onClick={() => handleAddComment(post.id)}>
                    Post
                  </button>
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
