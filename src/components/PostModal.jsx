import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getPostBackgrounds, getUserProfile } from "../services/api";
import BackgroundSelect from "./BackgroundSelect";
import { modalIcons } from "../assets/icons";

const PostModal = ({ postContent, setPostContent, postBackground, setPostBackground, handleAddPost, handlePostModal, user }) => {
  const [backgrounds, setBackgrounds] = useState([]);
  const [isBackgroundSelectOpen, setIsBackgroundSelectOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchBackgrounds = async () => {
      const urls = await getPostBackgrounds();
      setBackgrounds(urls);
    };

    fetchBackgrounds();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const data = await getUserProfile(user.uid);
        setUserData(data);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="space-y-4 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            {userData && userData.avatar ? (
              <img src={userData.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>
            )}
          </div>
          <h3 className="font-bold text-base leading-6">{userData && userData.name ? userData.name : "Unknown"}</h3>
        </div>
        <modalIcons.TbX className="w-6 h-6 hover:text-alert cursor-pointer" onClick={handlePostModal} />
      </div>
      <div className="flex justify-between items-center gap-4">
        <p className="font-normal text-base leading-6">選擇背景顏色</p>
        <div className="flex gap-4 overflow-scroll">
          {backgrounds.slice(0, 6).map((url, index) => (
            <button
              key={index}
              className="rounded w-6 h-6 flex-shrink-0 flex-grow-0"
              style={{ backgroundImage: `url(${url})`, backgroundSize: "cover", backgroundPosition: "center" }}
              onClick={() => setPostBackground(url)}
            ></button>
          ))}
        </div>
        <modalIcons.TbLayoutGrid className="w-6 h-6 hover:text-alert cursor-pointer" onClick={() => setIsBackgroundSelectOpen(!isBackgroundSelectOpen)} />
      </div>
      <BackgroundSelect backgrounds={backgrounds} setPostBackground={setPostBackground} isOpen={isBackgroundSelectOpen} setIsOpen={setIsBackgroundSelectOpen} />
      <div
        className="w-full min-h-40 h-fit border rounded-xl bg-black-100 p-2 overflow-auto flex justify-center items-center"
        style={{
          backgroundImage: `url(${postBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <textarea
          className="w-full h-full bg-transparent border-none resize-none outline-none text-center placeholder-black"
          placeholder="輸入貼文內容..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
      </div>
      <button className="py-1 w-full bg-primary rounded-lg font-medium text-sm leading-5 hover:bg-primary-dark" onClick={handleAddPost}>
        發佈貼文
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
  user: PropTypes.object,
};

export default PostModal;
