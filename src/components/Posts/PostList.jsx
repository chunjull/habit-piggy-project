import PostItem from "./PostItem";
import PropTypes from "prop-types";

const PostList = ({
  posts,
  filter,
  user,
  handleSelectChange,
  handleCommentSection,
  handleLike,
  handleUnlike,
  commentSection,
  commentContent,
  setCommentContent,
  handleAddComment,
  editingComment,
  setEditingComment,
  handleCancelEdit,
  handleUpdate,
  customSelectRef,
  calculateTextColor,
  getTimeDifference,
}) => {
  const filteredPosts = filter === "personal" ? posts.filter((post) => post.userID === user.uid) : posts;

  return (
    <ul className="space-y-4">
      {filteredPosts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          user={user}
          handleSelectChange={handleSelectChange}
          handleCommentSection={handleCommentSection}
          handleLike={handleLike}
          handleUnlike={handleUnlike}
          commentSection={commentSection}
          commentContent={commentContent}
          setCommentContent={setCommentContent}
          handleAddComment={handleAddComment}
          editingComment={editingComment}
          setEditingComment={setEditingComment}
          handleCancelEdit={handleCancelEdit}
          handleUpdate={handleUpdate}
          customSelectRef={customSelectRef}
          calculateTextColor={calculateTextColor}
          getTimeDifference={getTimeDifference}
        />
      ))}
    </ul>
  );
};

export default PostList;

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  filter: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  handleCommentSection: PropTypes.func.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleUnlike: PropTypes.func.isRequired,
  commentSection: PropTypes.object.isRequired,
  commentContent: PropTypes.string.isRequired,
  setCommentContent: PropTypes.func.isRequired,
  handleAddComment: PropTypes.func.isRequired,
  editingComment: PropTypes.object.isRequired,
  setEditingComment: PropTypes.func.isRequired,
  handleCancelEdit: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  customSelectRef: PropTypes.object.isRequired,
  calculateTextColor: PropTypes.func.isRequired,
  getTimeDifference: PropTypes.func.isRequired,
};
