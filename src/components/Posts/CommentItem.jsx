import PropTypes from "prop-types";
import PostSelect from "./PostSelect";

const CommentItem = ({
  comment,
  post,
  editingComment,
  setEditingComment,
  handleCancelEdit,
  handleUpdate,
  customSelectRef,
  getTimeDifference,
  handleSelectChange,
}) => {
  return (
    <li className="flex items-center justify-between gap-3">
      <img
        src={comment.userAvatar}
        alt="user's avatar"
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="flex w-full items-center justify-between rounded-xl bg-black-200 px-4 py-2">
        <div className="w-full md:w-4/5">
          <div className="flex gap-2">
            <h3 className="line-clamp-1 text-sm font-medium leading-5">
              {comment.userName}
            </h3>
            <p className="dark:text-black-0-700 text-sm font-normal leading-5 text-black">
              {getTimeDifference(
                comment.updatedTime
                  ? comment.updatedTime.seconds
                  : comment.createdTime.seconds,
              )}
            </p>
          </div>
          {editingComment[comment.id] ? (
            <div className="grid grid-cols-1 gap-x-2 md:flex md:items-center md:gap-2">
              <input
                type="text"
                value={editingComment[comment.id]}
                onChange={(e) =>
                  setEditingComment({
                    ...editingComment,
                    [comment.id]: e.target.value,
                  })
                }
                className="my-1 w-full rounded bg-black-0 px-2 py-1 text-base font-normal leading-6 text-black caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark"
              />
              <div className="flex gap-x-2">
                <button
                  className="w-fit text-nowrap rounded bg-black-100 px-2 py-1 text-sm font-medium leading-5 hover:bg-black-300 md:py-1.5"
                  onClick={() => handleCancelEdit(comment.id)}
                >
                  取消修改
                </button>
                <button
                  className="w-fit text-nowrap rounded bg-primary px-2 py-1 text-sm font-medium leading-5 hover:bg-primary-dark md:py-1.5"
                  onClick={() => handleUpdate(post.id, null, comment.id)}
                >
                  確認修改
                </button>
              </div>
            </div>
          ) : (
            <p className="text-base font-normal leading-6">{comment.content}</p>
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
