import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getPostBackgrounds } from "../services/api";

const PostModal = ({ postContent, setPostContent, setPostBackground, handleAddPost, handlePostModal }) => {
  const [backgrounds, setBackgrounds] = useState([]);

  useEffect(() => {
    const fetchBackgrounds = async () => {
      const urls = await getPostBackgrounds();
      setBackgrounds(urls);
    };

    fetchBackgrounds();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3>發佈貼文</h3>
        <button onClick={handlePostModal}>close</button>
      </div>
      <div className="flex justify-between gap-4">
        <p>選擇背景顏色</p>
        <div className="flex gap-4 overflow-scroll">
          {backgrounds.map((url, index) => (
            <button key={index} className="rounded w-6 h-6" style={{ backgroundImage: `url(${url})` }} onClick={() => setPostBackground(url)}></button>
          ))}
        </div>
      </div>
      <textarea className="w-full h-40 border p-2" placeholder="輸入貼文內容..." required value={postContent} onChange={(e) => setPostContent(e.target.value)}></textarea>
      <button className="py-1 w-full bg-slate-300" onClick={handleAddPost}>
        發佈
      </button>
    </div>
  );
};

PostModal.propTypes = {
  postContent: PropTypes.string.isRequired,
  setPostContent: PropTypes.func.isRequired,
  postBackground: PropTypes.string.isRequired,
  setPostBackground: PropTypes.func.isRequired,
  handleAddPost: PropTypes.func.isRequired,
  handlePostModal: PropTypes.func.isRequired,
};

export default PostModal;
