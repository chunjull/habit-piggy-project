import PropTypes from "prop-types";
import UserDetails from "./UserDetails";

const PostForm = ({ userData, backgrounds, postBackground, setPostBackground, postContent, setPostContent, handleAddPost, calculateTextColor, isHighlighted, handleClick, postRef, isLoading }) => {
  return (
    <div className="relative">
      <div ref={postRef} className="relative bg-black-50 dark:bg-black-800 p-4 rounded-xl space-y-2 md:space-y-3 z-0" onClick={handleClick}>
        <div className={`absolute inset-0 rounded-xl -z-10 ${isHighlighted ? "block" : "hidden"}`} style={{ boxShadow: "0 0 8px 1px rgba(250, 173, 20, 1)" }}></div>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black-200 rounded-full"></div>
              <div className="w-1/4 h-6 bg-black-200 rounded-lg"></div>
            </div>
            <div className="w-2/3 h-6 bg-black-200 rounded-lg"></div>
            <div className="w-full min-h-40 h-fit rounded-xl bg-black-200"></div>
          </div>
        ) : (
          <>
            <UserDetails userData={userData} />
            <div className="flex items-center gap-4">
              <p className="font-normal text-base leading-6 text-black dark:text-black-0 text-nowrap">選擇背景顏色</p>
              <div className="flex gap-4 overflow-scroll">
                {backgrounds.map((url, index) => (
                  <button
                    key={index}
                    className="rounded w-6 h-6 flex-shrink-0 flex-grow-0 border border-black-500"
                    style={{ backgroundImage: `url(${url})`, backgroundSize: "cover", backgroundPosition: "center" }}
                    onClick={() => setPostBackground(url)}
                  ></button>
                ))}
              </div>
            </div>
            <div
              className="w-full min-h-40 h-fit border rounded-xl bg-black-100 p-2 overflow-auto flex justify-center items-center"
              style={{
                backgroundImage: `url(${postBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <textarea
                className="w-full h-fit bg-transparent border-none overflow-hidden resize-none outline-none text-center placeholder-black font-normal text-base leading-6 md:text-xl md:leading-7 xl:text-2xl xl:leading-8 break-words whitespace-pre-wrap"
                placeholder="輸入貼文內容..."
                value={postContent}
                onChange={(e) => {
                  setPostContent(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                style={{ color: calculateTextColor(postBackground) }}
                rows="1"
              />
            </div>
            <div className="text-end">
              <button className="py-1 px-3 w-fit bg-primary rounded-lg font-medium text-sm leading-5 md:text-base md:leading-6 hover:bg-primary-dark" onClick={handleAddPost}>
                發佈貼文
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostForm;

PostForm.propTypes = {
  userData: PropTypes.object,
  backgrounds: PropTypes.array,
  postBackground: PropTypes.string,
  setPostBackground: PropTypes.func,
  postContent: PropTypes.string,
  setPostContent: PropTypes.func,
  handleAddPost: PropTypes.func,
  calculateTextColor: PropTypes.func,
  isHighlighted: PropTypes.bool,
  handleClick: PropTypes.func,
  postRef: PropTypes.object,
  isLoading: PropTypes.bool,
};
