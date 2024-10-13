import CommentItem from "./CommentItem";
import { postIcons } from "../assets/icons";
import PropTypes from "prop-types";

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
          />
        ))}
      <li className="flex justify-between items-center gap-2">
        <input
          type="text"
          placeholder="請輸入留言"
          className="bg-black-100 text-black py-2 px-4 w-full rounded-2xl placeholder:text-black dark:text-black-0-500  caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark focus:bg-black-0"
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        />
        <div className="w-10 h-10 bg-primary flex justify-center items-center rounded-full aspect-square cursor-pointer hover:bg-primary-dark" onClick={() => handleAddComment(post.id)}>
          <postIcons.TbSend2 className="w-6 h-6 text-black" />
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
};
