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
  const filteredPosts =
    filter === "personal"
      ? posts.filter((post) => post.userID === user.uid)
      : posts;

  return (
    <ul className="space-y-4">
      {isLoading &&
        Array.from({ length: filteredPosts.length }).map((_, index) => (
          <li
            key={index}
            className="w-full space-y-3 rounded-2xl bg-black-50 p-4 dark:bg-black-800"
          >
            <div className="animate-pulse space-y-4">
              <div className="flex items-center gap-4">
                <div className="aspect-square h-12 w-12 rounded-full bg-black-200" />
                <div className="flex w-full flex-col gap-1">
                  <div className="h-6 w-1/4 rounded-lg bg-black-200" />
                  <div className="h-5 w-1/6 rounded-lg bg-black-200" />
                </div>
              </div>
              <div className="h-fit min-h-40 w-full rounded-xl bg-black-200" />
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
