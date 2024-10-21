import PropTypes from "prop-types";
import { postIcons } from "../../assets/icons";
import CommentItem from "./CommentItem";

const CommentSection = ({
  post,
  commentSection,
  commentContent,
  setCommentContent,
  handleAddComment,
  editingComment,
  setEditingComment,
  handleCancelEdit,
  handleUpdate,
  customSelectRef,
  getTimeDifference,
  handleSelectChange,
}) => {
  return (
    <ul className={`space-y-3 ${commentSection[post.id] ? "block" : "hidden"}`}>
      {post.comments &&
        post.comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            post={post}
            editingComment={editingComment}
            setEditingComment={setEditingComment}
            handleCancelEdit={handleCancelEdit}
            handleUpdate={handleUpdate}
            customSelectRef={customSelectRef}
            getTimeDifference={getTimeDifference}
            handleSelectChange={handleSelectChange}
          />
        ))}
      <li className="flex items-center justify-between gap-2">
        <input
          type="text"
          placeholder="請輸入留言"
          className="dark:text-black-0-500 w-full rounded-2xl bg-black-100 px-4 py-2 text-black caret-primary-dark placeholder:text-black focus:border-primary-dark focus:bg-black-0 focus:outline focus:outline-primary-dark"
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        />
        <div
          className="flex aspect-square h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary hover:bg-primary-dark"
          onClick={() => handleAddComment(post.id)}
        >
          <postIcons.TbSend2 className="h-6 w-6 text-black" />
        </div>
      </li>
    </ul>
  );
};

export default CommentSection;

CommentSection.propTypes = {
  post: PropTypes.object.isRequired,
  commentSection: PropTypes.object.isRequired,
  commentContent: PropTypes.string.isRequired,
  setCommentContent: PropTypes.func.isRequired,
  handleAddComment: PropTypes.func.isRequired,
  editingComment: PropTypes.object.isRequired,
  setEditingComment: PropTypes.func.isRequired,
  handleCancelEdit: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  customSelectRef: PropTypes.object.isRequired,
  getTimeDifference: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
};
