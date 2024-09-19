import { useEffect, useState, useContext } from "react";
import { getAllPosts, getUserProfile } from "../services/api";
import { AuthContext } from "../utils/AuthContext";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const { user } = useContext(AuthContext);

  const backgroundColors = [
    "bg-red-100",
    "bg-orange-100",
    "bg-yellow-100",
    "bg-green-100",
    "bg-cyan-100",
    "bg-blue-100",
    "bg-indigo-100",
    "bg-violet-100",
    "bg-purple-100",
    "bg-stone-100",
    "bg-fuchsia-100",
    "bg-rose-100",
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      const postsList = await getAllPosts();
      const postsWithUserDetails = await Promise.all(
        postsList.map(async (post) => {
          const userProfile = await getUserProfile(post.userID);
          return { ...post, user: userProfile };
        })
      );
      setPosts(postsWithUserDetails);
    };

    fetchPosts();
  }, []);

  const filteredPosts = filter === "personal" ? posts.filter((post) => post.userID === user.uid) : posts;

  return (
    <div className="p-4 space-y-4 mb-16 md:mb-0">
      <div className="flex justify-between items-center">
        <h2>貼文總覽</h2>
        <select className="border" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">全部</option>
          <option value="personal">僅限自己</option>
        </select>
      </div>
      <ul className="space-y-4">
        {filteredPosts.map((post) => {
          const randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
          return (
            <li key={post.id} className="p-4 border space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10">{post.user && <img src={post.user.avatar} alt="avatar" className="w-full h-full object-cover" />}</div>
                  <div className="flex flex-col">
                    <div className="flex gap-2">
                      <h3>{post.user ? post.user.name : "Unknown"}</h3>
                      <p>{new Date(post.createdTime.seconds * 1000).toLocaleString([], { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    {/* <p className="text-slate-500">Lv.{post.user ? post.user.levelPoints : 0}</p> */}
                  </div>
                </div>
              </div>
              <div className={`w-full min-h-52 h-fit ${randomColor} flex justify-center items-center p-4`}>
                <p>{post.content}</p>
              </div>
              <div className="flex gap-3">
                <button className="border">Like</button>
                <button className="border">Comment</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Posts;
