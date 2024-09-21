import { useState, useContext, useEffect, useRef } from "react";
import { updateUserProfile, getUserProfile, uploadAvatar, getHabits, addPost, updateHabit, deleteHabit } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import Modal from "../components/Modal";
import SettingModal from "../components/SettingModal";
import DetailModal from "../components/DetailModal";
import PostModal from "../components/PostModal";
import EditModal from "../components/EditModal";
import { Navigate } from "react-router-dom";

function Member() {
  const { user } = useContext(AuthContext);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [habitData, setHabitData] = useState({
    category: 0,
    title: "",
    frequency: "daily",
    amount: 0,
    startDate: "",
    endDate: "",
    status: [],
  });
  const [uncompletedFine, setUncompletedFine] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState("");
  const calendarRef = useRef(null);
  const [isPost, setIsPost] = useState(false);
  const [filter, setFilter] = useState("all");

  const habitCategories = {
    0: "生產力",
    1: "個人成長",
    2: "運動健身",
    3: "飲食健康",
    4: "心靈成長",
    5: "手作興趣",
    6: "財務管理",
    7: "環境生活",
  };

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

  const handleDetailModal = () => {
    setIsDetailModalOpen(!isDetailModalOpen);
  };

  const handlePostModal = () => {
    setIsPostModalOpen(!isPostModalOpen);
  };

  const handleEditModal = (habit) => {
    setHabitData({
      category: habit.category,
      title: habit.title,
      frequency: habit.frequency,
      amount: habit.amount,
      startDate: habit.startDate,
      endDate: habit.endDate,
      status: habit.status,
    });
    setIsEditModalOpen(!isEditModalOpen);
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

  const handleAddPost = async () => {
    if (!postContent.trim()) {
      alert("請輸入貼文內容");
      return;
    }

    if (user && selectedHabit) {
      const postData = {
        content: postContent,
        habitId: selectedHabit.id,
      };
      await addPost(user.uid, postData);
      setIsPost(true);
      handlePostModal();
      setPostContent("");
    }
  };

  const handleSelectDate = async (date) => {
    setSelectedDate(date);
    if (calendarTarget) {
      setHabitData((prev) => ({
        ...prev,
        [calendarTarget]: `${date.year}-${String(date.month + 1).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`,
      }));
      setShowMonthCalendar(false);
      setCalendarTarget("");
    }
  };

  const handleFocus = (target) => {
    setCalendarTarget(target);
    setShowMonthCalendar(true);
  };

  const handleUpdateHabit = async () => {
    if (user && selectedHabit) {
      const updatedHabitData = { ...habitData, id: selectedHabit.id };
      await updateHabit(user.uid, selectedHabit.id, updatedHabitData);
      fetchHabits();
      setIsEditModalOpen(false);
      setIsDetailModalOpen(false);
    } else {
      console.error("User not authenticated or habit not selected");
    }
  };

  const handleDeleteHabit = async () => {
    if (user && selectedHabit) {
      await deleteHabit(user.uid, selectedHabit.id);
      fetchHabits();
      setIsEditModalOpen(false);
      setIsDetailModalOpen(false);
    } else {
      console.error("User not authenticated or habit not selected");
    }
  };

  const calculateUncompletedFine = (habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const uncompletedCount = habit.status.filter((status) => {
      const statusDate = new Date(status.date);
      statusDate.setHours(0, 0, 0, 0);
      return statusDate < today && !status.completed;
    }).length;
    return uncompletedCount * habit.amount;
  };

  const handleDetailClick = (habit) => {
    setSelectedHabit(habit);
    setUncompletedFine(calculateUncompletedFine(habit));
    setIsDetailModalOpen(true);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredHabits = habits.filter((habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(habit.endDate);
    endDate.setHours(0, 0, 0, 0);

    if (filter === "in-progress") {
      return endDate >= today;
    } else if (filter === "finished") {
      return endDate < today;
    } else {
      return true;
    }
  });

  if (isPost) {
    return <Navigate to="/posts" />;
  }

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
            <select className="border" value={filter} onChange={handleFilterChange}>
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
            {Array.isArray(filteredHabits) &&
              filteredHabits.map((habit) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const endDate = new Date(habit.endDate);
                endDate.setHours(0, 0, 0, 0);
                const isFinished = endDate < today;

                return (
                  <li key={habit.id} className={`px-2 py-4 ${isFinished ? "bg-slate-500" : "bg-slate-100"}`}>
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
                      <button className="bg-white" onClick={() => handleDetailClick(habit)}>
                        Detail
                      </button>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
      <Modal isOpen={isSettingModalOpen} onClose={handleSettingModal}>
        <SettingModal profileData={profileData} handleChange={handleChange} handleSaveAndClose={handleSaveAndClose} handleSettingModal={handleSettingModal} />
      </Modal>
      <Modal isOpen={isDetailModalOpen} onClose={handleDetailModal}>
        <DetailModal selectedHabit={selectedHabit} handleDetailModal={handleDetailModal} handlePostModal={handlePostModal} uncompletedFine={uncompletedFine} handleEditModal={handleEditModal} />
      </Modal>
      <Modal isOpen={isPostModalOpen} onClose={handlePostModal}>
        <PostModal postContent={postContent} setPostContent={setPostContent} handleAddPost={handleAddPost} handlePostModal={handlePostModal} />
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={handleEditModal}>
        <EditModal
          habitData={habitData}
          handleChange={handleChange}
          handleUpdateHabit={handleUpdateHabit}
          handleFocus={handleFocus}
          showMonthCalendar={showMonthCalendar}
          calendarTarget={calendarTarget}
          selectedDate={selectedDate}
          handleSelectDate={handleSelectDate}
          calendarRef={calendarRef}
          handleEditModal={handleEditModal}
          handleDeleteHabit={handleDeleteHabit}
          habitCategories={habitCategories}
        />
      </Modal>
    </>
  );
}

export default Member;
