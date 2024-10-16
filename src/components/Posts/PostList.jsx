import PropTypes from "prop-types";
import PostItem from "./PostItem";

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
  isLoading,
}) => {
  const filteredPosts = filter === "personal" ? posts.filter((post) => post.userID === user.uid) : posts;

  return (
    <ul className="space-y-4">
      {isLoading &&
        Array.from({ length: filteredPosts.length }).map((_, index) => (
          <li key={index} className="p-4 bg-black-50 dark:bg-black-800 rounded-2xl space-y-3 w-full">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black-200 rounded-full aspect-square"></div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="w-1/4 h-6 bg-black-200 rounded-lg"></div>
                  <div className="w-1/6 h-5 bg-black-200 rounded-lg"></div>
                </div>
              </div>
              <div className="w-full min-h-40 h-fit rounded-xl bg-black-200"></div>
            </div>
          </li>
        ))}
      {!isLoading &&
        filteredPosts.map((post) => (
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
            isLoading={isLoading}
          />
        ))}
    </ul>
  );
};

export default PostList;

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  filter: PropTypes.string,
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
  isLoading: PropTypes.bool,
};
