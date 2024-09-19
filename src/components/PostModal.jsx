import PropTypes from "prop-types";

const PostModal = ({ postContent, setPostContent, handleAddPost, handlePostModal }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3>發佈貼文</h3>
      <button onClick={handlePostModal}>close</button>
    </div>
    <textarea className="w-full h-40 border p-2" placeholder="輸入貼文內容..." required value={postContent} onChange={(e) => setPostContent(e.target.value)}></textarea>
    <button className="py-1 w-full bg-slate-300" onClick={handleAddPost}>
      發佈
    </button>
  </div>
);

PostModal.propTypes = {
  postContent: PropTypes.string.isRequired,
  setPostContent: PropTypes.func.isRequired,
  handleAddPost: PropTypes.func.isRequired,
  handlePostModal: PropTypes.func.isRequired,
};

export default PostModal;
