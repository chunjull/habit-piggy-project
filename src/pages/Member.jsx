import { useState, useContext, useEffect } from "react";
import { updateUserProfile, getUserProfile, uploadAvatar, getHabits } from "../services/api";
import { AuthContext } from "../utils/AuthContext";

function Member() {
  const { user } = useContext(AuthContext);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isActiveTab, setIsActiveTab] = useState(true);
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
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          setProfileData(userProfile);
        }
        fetchHabits();
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSettingModal = () => {
    setIsSettingModalOpen(!isSettingModalOpen);
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
    handleSettingModal();
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files[0]) {
      const file = event.target.files[0];
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!file) return;
      if (!allowedTypes.includes(file.type)) {
        return;
      }
      try {
        const downloadURL = await uploadAvatar(user.uid, files[0]);
        setProfileData((prev) => ({
          ...prev,
          avatar: downloadURL,
        }));
      } catch (error) {
        console.error("Error uploading avatar: ", error);
      }
    } else {
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const fetchHabits = async () => {
    const habitsList = await getHabits(user.uid);
    setHabits(habitsList);
  };

  return (
    <>
      <div className="p-4 space-y-4 mb-16 md:mb-0">
        <ul className="grid grid-cols-2 w-full">
          <li className={`border p-2 text-center ${isActiveTab ? "bg-gray-200" : ""}`} onClick={() => setIsActiveTab(true)}>
            會員管理
          </li>
          <li className={`border p-2 text-center ${!isActiveTab ? "bg-gray-200" : ""}`} onClick={() => setIsActiveTab(false)}>
            歷史習慣
          </li>
        </ul>
        {isActiveTab ? (
          <div className="flex justify-between items-center">
            <h2>會員管理</h2>
            <button className="border" onClick={handleSettingModal}>
              設定
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <h2>歷史習慣</h2>
            <select className="border">
              <option value="all">全部</option>
              <option value="in-progress">進行中</option>
              <option value="finished">已結束</option>
            </select>
          </div>
        )}
        {isActiveTab ? (
          <div>
            <div className="p-4 border space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <img src={profileData.avatar} alt="user's avatar" className="w-10 h-10" />
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
        ) : (
          <ul className="space-y-4">
            {Array.isArray(habits) &&
              habits.map((habit) => {
                return (
                  <li key={habit.id} className="px-2 py-4 bg-slate-100">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <div className="w-10 h-10 bg-yellow-400"></div>
                        <div className="flex flex-col">
                          <h3>{habit.title}</h3>
                          <div className="flex">
                            <p>
                              {habit.frequency}｜罰款 ${habit.amount}｜已達成 {habit.status.filter((status) => status.completed).length}
                            </p>
                            <p className="text-gray-500">/{habit.status.length}</p>
                          </div>
                        </div>
                      </div>
                      <button className="bg-white">Detail</button>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
      {isSettingModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 bg-white w-2/3 h-fit space-y-4 md:w-1/2 md:ml-40">
            <div className="flex justify-between">
              <h3>設定</h3>
              <button onClick={handleSettingModal}>Close</button>
            </div>
            <p className="mb-1">會員頭像</p>
            <div className="flex items-center gap-3">
              <img src={profileData.avatar} alt="user's avatar" className="w-10 h-10" />
              <div>
                <input type="file" name="avatar" id="profile" onChange={handleChange} accept="image/jpg,image/jpeg,image/png,image/gif" />
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
              <select className="border">
                <option value="light">淺色</option>
                <option value="dark">深色</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <p>接收 Email 提醒</p>
              <select className="border">
                <option value="false">{profileData.isAcceptReminder ? "是" : "否"}</option>
                <option value="true">是</option>
              </select>
            </div>
            <button className="border w-full" onClick={handleSaveAndClose}>
              儲存
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Member;
