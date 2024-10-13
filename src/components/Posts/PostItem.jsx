import PostSelect from "../PostSelect";
import CommentSection from "./CommentSection";
import { postIcons } from "../../assets/icons";
import PropTypes from "prop-types";

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
    <li className="p-4 bg-black-50 dark:bg-black-800 rounded-2xl space-y-3 w-full">
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
          <postIcons.TbMessageChatbot className="w-6 h-6 cursor-pointer text-black dark:text-black-0 hover:text-black dark:hover:text-black-200" onClick={() => handleCommentSection(post.id)} />
          <p className="text-black dark:text-black-0 font-normal text-base leading-6">{post.comments ? post.comments.length : 0}</p>
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
