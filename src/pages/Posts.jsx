import { useContext, useEffect, useReducer, useRef, useState } from "react";
import CustomSelect from "../components/CustomSelect";
import Modal from "../components/Modal";
import ConfirmModal from "../components/Posts/ConfirmModal";
import PostForm from "../components/Posts/PostForm";
import PostList from "../components/Posts/PostList";
import PostModal from "../components/Posts/PostModal";
import { AlertNotify, SuccessNotify } from "../components/Posts/ToastNotify";
import {
  addComment,
  addLike,
  addPost,
  deleteComment,
  deletePost,
  getAllPosts,
  getComments,
  getPostBackgrounds,
  getUserProfile,
  removeLike,
  updateComment,
  updatePost,
} from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { actionTypes, initialState, reducer } from "../utils/PostReducer";

function Posts() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const postRef = useRef(null);
  const customSelectRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch({ type: actionTypes.SET_IS_LOADING, payload: true });
      const postsList = await getAllPosts();
      const postsWithUserDetails = await Promise.all(
        postsList.map(async (post) => {
          const userProfile = await getUserProfile(post.userID);
          const comments = await getComments(post.id);
          return { ...post, user: userProfile, comments: comments };
        }),
      );
      dispatch({ type: actionTypes.SET_POST, payload: postsWithUserDetails });
      dispatch({ type: actionTypes.SET_IS_LOADING, payload: false });
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchBackgrounds = async () => {
      const urls = await getPostBackgrounds();
      dispatch({ type: actionTypes.SET_BACKGROUNDS, payload: urls });
    };

    fetchBackgrounds();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const data = await getUserProfile(user.uid);
        dispatch({ type: actionTypes.SET_USER_DATA, payload: data });
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        customSelectRef.current &&
        !customSelectRef.current.contains(e.target)
      ) {
        customSelectRef.current.closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredPosts =
    state.filter === "personal"
      ? state.posts.filter((post) => post.userID === user.uid)
      : state.posts;

  const handleCommentSection = (postID) => {
    dispatch({
      type: actionTypes.SET_COMMENT_SECTION,
      payload: {
        ...state.commentSection,
        [postID]: !state.commentSection[postID],
      },
    });
  };

  const handleAddComment = async (postID) => {
    if (!state.commentContent.trim()) {
      AlertNotify.contentAlertNotify();
      return;
    }
    const userProfile = await getUserProfile(user.uid);
    const commentData = {
      content: state.commentContent,
      userID: user.uid,
      userName: userProfile.name,
      userAvatar: userProfile.avatar,
    };
    await addComment(postID, commentData);
    dispatch({ type: actionTypes.SET_COMMENT_CONTENT, payload: "" });
    const renderComments = await getComments(postID);
    dispatch({
      type: actionTypes.SET_POST,
      payload: state.posts.map((post) =>
        post.id === postID ? { ...post, comments: renderComments } : post,
      ),
    });
    SuccessNotify.addCommentNotify();
  };

  const handleCancelEdit = (commentID) => {
    dispatch({
      type: actionTypes.SET_EDITING_COMMENT,
      payload: { ...state.editingComment, [commentID]: "" },
    });
  };

  const handleDeleteComment = (postID, commentID) => {
    const post = state.posts.find((post) => post.id === postID);
    const comment = post.comments.find((comment) => comment.id === commentID);
    if (comment.userID !== user.uid) {
      AlertNotify.authorAlertNotify();
      return;
    }
    dispatch({
      type: actionTypes.SET_CONFIRM_ACTION,
      payload: async () => {
        await deleteComment(postID, commentID);
        const renderComments = await getComments(postID);
        dispatch({
          type: actionTypes.SET_POST,
          payload: state.posts.map((post) =>
            post.id === postID ? { ...post, comments: renderComments } : post,
          ),
        });
        SuccessNotify.deleteCommentNotify();
      },
    });
    dispatch({ type: actionTypes.SET_SHOW_CONFIRM_MODAL, payload: true });
  };

  const handleDeletePost = async (postID) => {
    const post = state.posts.find((post) => post.id === postID);
    if (post.userID !== user.uid) {
      AlertNotify.authorAlertNotify();
      return;
    }
    dispatch({
      type: actionTypes.SET_CONFIRM_ACTION,
      payload: async () => {
        await deletePost(postID);
        dispatch({
          type: actionTypes.SET_POST,
          payload: state.posts.filter((post) => post.id !== postID),
        });
        SuccessNotify.deletePostNotify();
      },
    });
    dispatch({ type: actionTypes.SET_SHOW_CONFIRM_MODAL, payload: true });
  };

  const handleEdit = (post, commentID = null) => {
    if (commentID) {
      const comment = post.comments.find((comment) => comment.id === commentID);
      if (comment.userID !== user.uid) {
        AlertNotify.authorAlertNotify();
        return;
      }
      dispatch({
        type: actionTypes.SET_EDITING_COMMENT,
        payload: { ...state.editingComment, [commentID]: comment.content },
      });
    } else {
      if (post.userID !== user.uid) {
        AlertNotify.authorAlertNotify();
        return;
      }
      dispatch({ type: actionTypes.SET_CURRENT_POST, payload: post });
      setIsPostModalOpen(true);
    }
  };

  const handleUpdate = async (postID, postData, commentID = null) => {
    if (commentID) {
      const updatedContent = state.editingComment[commentID];
      if (!updatedContent.trim()) {
        AlertNotify.contentAlertNotify();
        return;
      }
      await updateComment(postID, commentID, { content: updatedContent });
      const renderComments = await getComments(postID);
      dispatch({
        type: actionTypes.SET_POST,
        payload: state.posts.map((post) =>
          post.id === postID ? { ...post, comments: renderComments } : post,
        ),
      });
      dispatch({
        type: actionTypes.SET_EDITING_COMMENT,
        payload: { ...state.editingComment, [commentID]: "" },
      });
      SuccessNotify.updateCommentNotify();
    } else {
      await updatePost(postID, postData);
      const updatedPosts = await getAllPosts();
      dispatch({ type: actionTypes.SET_POST, payload: updatedPosts });
      setIsPostModalOpen(false);
      SuccessNotify.updatePostNotify();
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
        }),
      );
      dispatch({ type: actionTypes.SET_POST, payload: postsWithUserDetails });
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
        }),
      );
      dispatch({ type: actionTypes.SET_POST, payload: postsWithUserDetails });
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
      return commentTime.toLocaleString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
  };

  const handleAddPost = async () => {
    if (!state.postContent.trim()) {
      AlertNotify.contentAlertNotify();
      return;
    }

    if (user) {
      const userProfile = await getUserProfile(user.uid);
      const postData = {
        content: state.postContent,
        background: state.postBackground,
        userID: user.uid,
        user: userProfile,
        createdTime: { seconds: Math.floor(Date.now() / 1000) },
        likes: [],
        comments: [],
      };
      await addPost(user.uid, postData);
      const updatedPosts = await getAllPosts();
      dispatch({ type: actionTypes.SET_POST, payload: updatedPosts });
      dispatch({ type: actionTypes.SET_POST_CONTENT, payload: "" });
      dispatch({ type: actionTypes.SET_POST_BACKGROUND, payload: "" });
      SuccessNotify.addPostNotify();

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
    dispatch({ type: actionTypes.SET_IS_HIGHLIGHTED, payload: true });
  };

  const handleClickOutside = (event) => {
    if (postRef.current && !postRef.current.contains(event.target)) {
      dispatch({ type: actionTypes.SET_IS_HIGHLIGHTED, payload: false });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="space-y-4 p-4 md:py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold leading-7 text-black dark:text-black-0">
            貼文總覽
          </h2>
          <div className="relative" ref={customSelectRef}>
            <CustomSelect
              options={state.options}
              value={state.filter || "all"}
              onChange={(value) =>
                dispatch({ type: actionTypes.SET_FILTER, payload: value })
              }
            />
          </div>
        </div>
        <PostForm
          postRef={postRef}
          isHighlighted={state.isHighlighted}
          handleClick={handleClick}
          backgrounds={state.backgrounds}
          setPostBackground={(value) =>
            dispatch({ type: actionTypes.SET_POST_BACKGROUND, payload: value })
          }
          postBackground={state.postBackground}
          postContent={state.postContent}
          setPostContent={(value) =>
            dispatch({ type: actionTypes.SET_POST_CONTENT, payload: value })
          }
          handleAddPost={handleAddPost}
          calculateTextColor={calculateTextColor}
          userData={state.userData}
          isLoading={state.isLoading}
        />
        <PostList
          posts={filteredPosts}
          user={user}
          handleCommentSection={handleCommentSection}
          commentSection={state.commentSection}
          handleAddComment={handleAddComment}
          commentContent={state.commentContent}
          setCommentContent={(value) =>
            dispatch({ type: actionTypes.SET_COMMENT_CONTENT, payload: value })
          }
          editingComment={state.editingComment}
          setEditingComment={(value) =>
            dispatch({ type: actionTypes.SET_EDITING_COMMENT, payload: value })
          }
          handleCancelEdit={handleCancelEdit}
          handleUpdate={handleUpdate}
          handleSelectChange={handleSelectChange}
          handleLike={handleLike}
          handleUnlike={handleUnlike}
          getTimeDifference={getTimeDifference}
          customSelectRef={customSelectRef}
          calculateTextColor={calculateTextColor}
          isLoading={state.isLoading}
        />
        {state.showConfirmModal && (
          <ConfirmModal
            showConfirmModal={state.showConfirmModal}
            setShowConfirmModal={(value) =>
              dispatch({
                type: actionTypes.SET_SHOW_CONFIRM_MODAL,
                payload: value,
              })
            }
            confirmAction={state.confirmAction}
          />
        )}
      </div>
      <Modal
        isOpen={isPostModalOpen}
        onRequestClose={() => setIsPostModalOpen(false)}
      >
        <PostModal
          postContent={state.currentPost ? state.currentPost.content : ""}
          setPostContent={(content) =>
            dispatch({
              type: actionTypes.SET_CURRENT_POST,
              payload: { ...state.currentPost, content },
            })
          }
          postBackground={state.currentPost ? state.currentPost.background : ""}
          setPostBackground={(background) =>
            dispatch({
              type: actionTypes.SET_CURRENT_POST,
              payload: { ...state.currentPost, background },
            })
          }
          handlePostModal={() => setIsPostModalOpen(false)}
          user={user}
          isEditMode={true}
          handleUpdatePost={() =>
            handleUpdate(state.currentPost.id, state.currentPost)
          }
          calculateTextColor={calculateTextColor}
        />
      </Modal>
    </>
  );
}

export default Posts;
