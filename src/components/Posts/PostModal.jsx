import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { modalIcons } from "../../assets/icons";
import { getPostBackgrounds, getUserProfile } from "../../services/api";
import BackgroundSelect from "./BackgroundSelect";

const PostModal = ({
  postContent,
  setPostContent,
  postBackground,
  setPostBackground,
  handleAddPost,
  handlePostModal,
  user,
  isEditMode,
  handleUpdatePost,
  calculateTextColor,
}) => {
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
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10">
            {userData && userData.avatar ? (
              <img
                src={userData.avatar}
                alt="avatar"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                No Image
              </div>
            )}
          </div>
          <h3 className="text-base font-bold leading-6 text-black dark:text-black-0">
            {userData && userData.name ? userData.name : "Unknown"}
          </h3>
        </div>
        <modalIcons.TbX
          className="h-6 w-6 cursor-pointer text-black hover:text-alert dark:text-black-0"
          onClick={handlePostModal}
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-nowrap text-base font-normal leading-6 text-black dark:text-black-0">
          選擇背景顏色
        </p>
        <div className="flex gap-4 overflow-scroll">
          {backgrounds.map((url, index) => (
            <button
              key={index}
              className="h-6 w-6 flex-shrink-0 flex-grow-0 rounded border border-black-500"
              style={{
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => setPostBackground(url)}
            ></button>
          ))}
        </div>
      </div>
      <BackgroundSelect
        backgrounds={backgrounds}
        setPostBackground={setPostBackground}
        isOpen={isBackgroundSelectOpen}
        setIsOpen={setIsBackgroundSelectOpen}
      />
      <div
        className="flex h-fit min-h-40 w-full items-center justify-center overflow-auto rounded-xl border bg-black-100 p-2"
        style={{
          backgroundImage: `url(${postBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <textarea
          className="h-full w-full resize-none border-none bg-transparent text-center text-base font-normal leading-6 placeholder-black outline-none md:text-xl md:leading-7 xl:text-2xl xl:leading-8"
          placeholder="輸入貼文內容..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          style={{ color: calculateTextColor(postBackground) }}
        />
      </div>
      <div className="flex gap-4">
        {isEditMode && (
          <button
            className="w-full rounded-lg bg-black-100 py-1 text-sm font-medium leading-5 hover:bg-black-300"
            onClick={handlePostModal}
          >
            取消修改
          </button>
        )}
        <button
          className="w-full rounded-lg bg-primary py-1 text-sm font-medium leading-5 hover:bg-primary-dark"
          onClick={isEditMode ? handleUpdatePost : handleAddPost}
        >
          {isEditMode ? "確認修改" : "發佈貼文"}
        </button>
      </div>
    </div>
  );
};

PostModal.propTypes = {
  postContent: PropTypes.string.isRequired,
  setPostContent: PropTypes.func.isRequired,
  postBackground: PropTypes.string.isRequired,
  setPostBackground: PropTypes.func.isRequired,
  handleAddPost: PropTypes.func,
  handlePostModal: PropTypes.func.isRequired,
  user: PropTypes.object,
  isEditMode: PropTypes.bool,
  handleUpdatePost: PropTypes.func,
  calculateTextColor: PropTypes.func.isRequired,
};

export default PostModal;
