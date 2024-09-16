import { useState, useContext, useEffect } from "react";
import { updateUserProfile, getUserProfile } from "../services/api";
import { AuthContext } from "../utils/AuthContext";

function Member() {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    uid: "",
    email: "",
    name: "",
    introduction: "",
    avatar: "",
    levelPoints: 0,
    isAcceptReminder: false,
    achievements: [],
    badges: [],
    habits: [],
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          setProfileData(userProfile);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleUpdateProfile = async () => {
    if (user && user.uid) {
      try {
        await updateUserProfile(user.uid, profileData);
        console.log("Profile updated successfully");
      } catch (error) {
        console.error("Error updating profile: ", error);
      }
    }
  };

  const handleSaveAndClose = async () => {
    await handleUpdateProfile();
    handleModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="p-4 space-y-4 mb-16 md:mb-0">
        <ul className="grid grid-cols-2 w-full">
          <li className="border p-2 text-center">會員管理</li>
          <li className="border p-2 text-center">歷史習慣</li>
        </ul>
        <div className="flex justify-between items-center">
          <h2>會員管理</h2>
          <button className="border" onClick={handleModal}>
            設定
          </button>
        </div>
        <div className="p-4 border space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-slate-300">{profileData.avatar}</div>
              <div className="flex flex-col">
                <h3>{profileData.name}</h3>
                <p className="text-slate-500">Lv.{profileData.levelPoints}</p>
              </div>
            </div>
          </div>
          <p>{profileData.introduction}</p>
          <div className="w-full bg-slate-300 text-center">{profileData.levelPoints}%</div>
        </div>
        <div className="pt-8 pb-4 px-4 border space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {profileData.achievements.map((achievement, index) => (
              <button key={index} className="border">
                {achievement}
              </button>
            ))}
          </div>
          <button className="text-center w-full bg-slate-300">更多成就</button>
        </div>
        <div className="pt-8 pb-4 px-4 border space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {profileData.badges.map((badge, index) => (
              <div key={index} className="w-20 h-20 bg-slate-100">
                {badge}
              </div>
            ))}
          </div>
          <button className="text-center w-full bg-slate-300">更多獎勵徽章</button>
        </div>
      </div>
      {isModalOpen && (
        <div className="bg-slate-100 w-2/3 h-fit absolute inset-0 p-4 space-y-4">
          <div className="flex justify-between">
            <h3>設定</h3>
            <button onClick={handleModal}>Close</button>
          </div>
          <p className="mb-1">會員頭像</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-300"></div>
            <div>
              <input type="file" name="avatar" id="profile" onChange={handleChange} />
              <p>您的頭像將會被公開。</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">會員名稱</label>
            <input type="text" name="name" id="name" placeholder="會員名稱" className="border py-1 px-4" value={profileData.name || ""} onChange={handleChange} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="introduction">自我介紹</label>
            <input type="text" name="introduction" id="introduction" placeholder="自我介紹" className="border py-1 px-4" value={profileData.introduction || ""} onChange={handleChange} />
          </div>
          <div className="border"></div>
          <div className="flex justify-between items-center">
            <p>主題</p>
            <button className="border">淺色</button>
          </div>
          <div className="flex justify-between items-center">
            <p>接收 Email 提醒</p>
            <button className="border">{profileData.isAcceptReminder ? "是" : "否"}</button>
          </div>
          <button className="border w-full" onClick={handleSaveAndClose}>
            儲存
          </button>
        </div>
      )}
    </>
  );
}

export default Member;
