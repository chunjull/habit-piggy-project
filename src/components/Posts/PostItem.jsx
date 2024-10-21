import PropTypes from "prop-types";
import { postIcons } from "../../assets/icons";
import CommentSection from "./CommentSection";
import PostSelect from "./PostSelect";

const PostItem = ({
  post,
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
  return (
    <li className="w-full space-y-3 rounded-2xl bg-black-50 p-4 dark:bg-black-800">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12">
            {post.user && (
              <img
                src={post.user.avatar}
                alt="avatar"
                className="h-full w-full rounded-full object-cover outline outline-primary-dark dark:outline-primary"
              />
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold leading-6 text-black dark:text-black-0">
              {post.user ? post.user.name : "Unknown"}
            </h3>
            <p className="text-sm font-normal leading-5 text-black dark:text-black-0">
              {getTimeDifference(post.createdTime.seconds)}
            </p>
          </div>
        </div>
        <PostSelect
          ref={customSelectRef}
          options={[
            { value: "edit", label: "編輯貼文" },
            { value: "delete", label: "刪除貼文" },
          ]}
          onChange={(value) => handleSelectChange(post, null, value)}
        />
      </div>
      <div
        className={`flex h-fit min-h-52 w-full items-center justify-center rounded-xl p-4 text-base font-normal leading-6 md:text-xl md:leading-7 xl:text-2xl xl:leading-8 ${
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
            : {
                color: calculateTextColor(post.background),
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }
        }
      >
        <p className="text-center">{post.content}</p>
      </div>
      <div className="flex gap-3">
        <div className="flex gap-1">
          {post.likes && post.likes.includes(user.uid) ? (
            <postIcons.TbHeartFilled
              className="h-6 w-6 cursor-pointer text-alert"
              onClick={() => handleUnlike(post.id)}
            />
          ) : (
            <postIcons.TbHeart
              className="h-6 w-6 cursor-pointer text-black hover:text-alert dark:text-black-0"
              onClick={() => handleLike(post.id)}
            />
          )}
          <p className="text-base font-normal leading-6 text-black dark:text-black-0">
            {post.likes ? post.likes.length : 0}
          </p>
        </div>
        <div className="flex gap-1">
          <postIcons.TbMessageChatbot
            className="h-6 w-6 cursor-pointer text-black hover:text-black dark:text-black-0 dark:hover:text-black-200"
            onClick={() => handleCommentSection(post.id)}
          />
          <p className="text-base font-normal leading-6 text-black dark:text-black-0">
            {post.comments ? post.comments.length : 0}
          </p>
        </div>
      </div>
      <CommentSection
        post={post}
        commentSection={commentSection}
        commentContent={commentContent}
        setCommentContent={setCommentContent}
        handleAddComment={handleAddComment}
        editingComment={editingComment}
        setEditingComment={setEditingComment}
        handleCancelEdit={handleCancelEdit}
        handleUpdate={handleUpdate}
        customSelectRef={customSelectRef}
        getTimeDifference={getTimeDifference}
        handleSelectChange={handleSelectChange}
      />
    </li>
  );
};

export default PostItem;

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
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
