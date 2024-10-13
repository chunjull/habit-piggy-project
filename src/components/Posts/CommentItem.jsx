import PropTypes from "prop-types";
import PostSelect from "./PostSelect";

const CommentItem = ({ comment, post, editingComment, setEditingComment, handleCancelEdit, handleUpdate, customSelectRef, getTimeDifference, handleSelectChange }) => {
  return (
    <li className="flex justify-between items-center gap-3">
      <img src={comment.userAvatar} alt="user's avatar" className="w-12 h-12 rounded-full object-cover" />
      <div className="bg-black-200 rounded-xl px-4 py-2 w-full flex justify-between items-center">
        <div className="w-full md:w-4/5">
          <div className="flex gap-2">
            <h3 className="font-medium text-sm leading-5 line-clamp-1">{comment.userName}</h3>
            <p className="font-normal text-sm leading-5 text-black dark:text-black-0-700">{getTimeDifference(comment.updatedTime ? comment.updatedTime.seconds : comment.createdTime.seconds)}</p>
          </div>
          {editingComment[comment.id] ? (
            <div className="grid grid-cols-1 gap-x-2 md:flex md:items-center md:gap-2">
              <input
                type="text"
                value={editingComment[comment.id]}
                onChange={(e) => setEditingComment({ ...editingComment, [comment.id]: e.target.value })}
                className="font-normal text-base leading-6 rounded px-2 py-1 w-full bg-black-0 text-black caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark my-1"
              />
              <div className="flex gap-x-2">
                <button className="w-fit text-nowrap font-medium text-sm leading-5 bg-black-100 py-1 md:py-1.5 px-2 rounded hover:bg-black-300" onClick={() => handleCancelEdit(comment.id)}>
                  取消修改
                </button>
                <button
                  className="w-fit text-nowrap font-medium text-sm leading-5 bg-primary py-1 md:py-1.5 px-2 rounded hover:bg-primary-dark"
                  onClick={() => handleUpdate(post.id, null, comment.id)}
                >
                  確認修改
                </button>
              </div>
            </div>
          ) : (
            <p className="font-normal text-base leading-6">{comment.content}</p>
          )}
        </div>
        {editingComment[comment.id] ? null : (
          <div className="flex flex-col">
            <PostSelect
              ref={customSelectRef}
              options={[
                { value: "edit", label: "編輯留言" },
                { value: "delete", label: "刪除留言" },
              ]}
              onChange={(value) => handleSelectChange(post, comment.id, value)}
              theme="light"
            />
          </div>
        )}
      </div>
    </li>
  );
};

export default CommentItem;

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  editingComment: PropTypes.object.isRequired,
  setEditingComment: PropTypes.func.isRequired,
  handleCancelEdit: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  customSelectRef: PropTypes.object.isRequired,
  getTimeDifference: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
};
