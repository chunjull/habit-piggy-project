import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getPostBackgrounds } from "../services/api";
import BackgroundSelect from "./BackgroundSelect";

const PostModal = ({ postContent, setPostContent, postBackground, setPostBackground, handleAddPost, handlePostModal }) => {
  const [backgrounds, setBackgrounds] = useState([]);
  const [isBackgroundSelectOpen, setIsBackgroundSelectOpen] = useState(false);

  useEffect(() => {
    const fetchBackgrounds = async () => {
      const urls = await getPostBackgrounds();
      setBackgrounds(urls);
    };

    fetchBackgrounds();
  }, []);

  return (
    <div className="space-y-4 relative">
      <div className="flex justify-between items-center">
        <h3>發佈貼文</h3>
        <button onClick={handlePostModal}>close</button>
      </div>
      <div className="flex justify-between gap-4">
        <p>選擇背景顏色</p>
        <div className="flex gap-4 overflow-scroll">
          {backgrounds.slice(0, 6).map((url, index) => (
            <button key={index} className="rounded w-6 h-6 flex-shrink-0 flex-grow-0" style={{ backgroundImage: `url(${url})` }} onClick={() => setPostBackground(url)}></button>
          ))}
        </div>
        <button className="border" onClick={() => setIsBackgroundSelectOpen(!isBackgroundSelectOpen)}>
          menu
        </button>
      </div>
      <BackgroundSelect backgrounds={backgrounds} setPostBackground={setPostBackground} isOpen={isBackgroundSelectOpen} setIsOpen={setIsBackgroundSelectOpen} />
      <div
        className="w-full min-h-40 h-fit border p-2 overflow-auto flex justify-center items-center"
        style={{
          backgroundImage: `url(${postBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <textarea
          className="w-full h-full bg-transparent border-none resize-none outline-none text-center"
          placeholder="輸入貼文內容..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
      </div>
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
