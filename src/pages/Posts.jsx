import { useEffect, useState } from "react";
import { getAllPosts, getUserProfile } from "../services/api";

function Posts() {
  const [posts, setPosts] = useState([]);

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

  return (
    <div className="p-4 space-y-4 mb-16 md:mb-0">
      <div className="flex justify-between items-center">
        <h2>存款總覽</h2>
        <button className="border">本週</button>
      </div>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="p-4 border space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-300">{post.user && <img src={post.user.avatar} alt="avatar" className="w-full h-full object-cover" />}</div>
                <div className="flex flex-col">
                  <div className="flex gap-1">
                    <h3>{post.user ? post.user.name : "Unknown"}</h3>
                    <p>{new Date(post.createdTime.seconds * 1000).toLocaleString()}</p>
                  </div>
                  <p className="text-slate-500">Lv.{post.user ? post.user.levelPoints : 0}</p>
                </div>
              </div>
            </div>
            <p className="w-full h-52 bg-slate-100 text-center">{post.content}</p>
            <div className="flex gap-3">
              <button className="border">Like</button>
              <button className="border">Comment</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
