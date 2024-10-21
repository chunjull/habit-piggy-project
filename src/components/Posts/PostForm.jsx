import PropTypes from "prop-types";
import UserDetails from "./UserDetails";

const PostForm = ({
  userData,
  backgrounds,
  postBackground,
  setPostBackground,
  postContent,
  setPostContent,
  handleAddPost,
  calculateTextColor,
  isHighlighted,
  handleClick,
  postRef,
  isLoading,
}) => {
  return (
    <div className="relative">
      <div
        ref={postRef}
        className="relative z-0 space-y-2 rounded-xl bg-black-50 p-4 dark:bg-black-800 md:space-y-3"
        onClick={handleClick}
      >
        <div
          className={`absolute inset-0 -z-10 rounded-xl ${isHighlighted ? "block" : "hidden"}`}
          style={{ boxShadow: "0 0 8px 1px rgba(250, 173, 20, 1)" }}
        ></div>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-black-200"></div>
              <div className="h-6 w-1/4 rounded-lg bg-black-200"></div>
            </div>
            <div className="h-6 w-2/3 rounded-lg bg-black-200"></div>
            <div className="h-fit min-h-40 w-full rounded-xl bg-black-200"></div>
          </div>
        ) : (
          <>
            <UserDetails userData={userData} />
            <div className="flex items-center gap-4">
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
            <div
              className="flex h-fit min-h-40 w-full items-center justify-center overflow-auto rounded-xl border bg-black-100 p-2"
              style={{
                backgroundImage: `url(${postBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <textarea
                className="h-fit w-full resize-none overflow-hidden whitespace-pre-wrap break-words border-none bg-transparent text-center text-base font-normal leading-6 placeholder-black outline-none md:text-xl md:leading-7 xl:text-2xl xl:leading-8"
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
              <button
                className="w-fit rounded-lg bg-primary px-3 py-1 text-sm font-medium leading-5 hover:bg-primary-dark md:text-base md:leading-6"
                onClick={handleAddPost}
              >
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
