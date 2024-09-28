import { useState, useContext, useEffect, useRef } from "react";
import { updateUserProfile, getUserProfile, uploadAvatar, getHabits, addPost, updateHabit, deleteHabit } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import Modal from "../components/Modal";
import SettingModal from "../components/SettingModal";
import DetailModal from "../components/DetailModal";
import PostModal from "../components/PostModal";
import EditModal from "../components/EditModal";
import { Navigate } from "react-router-dom";
import { habitIcons, settingIcons, dropdownIcon } from "../assets/icons";
import HabitList from "../components/HabitList";

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

  const habitCategories = [
    { id: 0, name: "生產力", icon: habitIcons.TbRocket },
    { id: 1, name: "個人成長", icon: habitIcons.TbBook },
    { id: 2, name: "運動健身", icon: habitIcons.TbWalk },
    { id: 3, name: "飲食健康", icon: habitIcons.TbBowlChopsticks },
    { id: 4, name: "心靈成長", icon: habitIcons.TbMoodHeart },
    { id: 5, name: "手作興趣", icon: habitIcons.TbHandGrab },
    { id: 6, name: "財務管理", icon: habitIcons.TbCash },
    { id: 7, name: "環境生活", icon: habitIcons.TbPlant },
  ];

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
    setIsDetailModalOpen(false);
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

  const handleHabitChange = (e) => {
    const { name, value } = e.target;
    setHabitData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchHabits = async () => {
    if (user) {
      try {
        const habitsList = await getHabits(user.uid);
        setHabits(habitsList);
      } catch (error) {
        console.error("Error fetching habits: ", error);
      }
    }
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
      try {
        await updateHabit(user.uid, selectedHabit.id, habitData);
        await fetchHabits();
        setIsEditModalOpen(false);
        console.log("Habit updated successfully");
      } catch (error) {
        console.error("Error updating habit: ", error);
      }
    } else {
      console.error("No user or selected habit");
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

  const filteredHabits = habits
    .filter((habit) => {
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
    })
    .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

  if (isPost) {
    return <Navigate to="/posts" />;
  }

  return (
    <>
      <div className="p-4 space-y-4">
        <ul className="grid grid-cols-2 w-full">
          <li className={`border border-black-500 rounded-s-full py-1 font-normal text-sm leading-5 text-center ${isActiveTab ? "bg-primary" : "bg-black-50"}`} onClick={() => setIsActiveTab(true)}>
            會員管理
          </li>
          <li
            className={`border-e border-y border-black-500 rounded-e-full py-1 font-normal text-sm leading-5 text-center ${!isActiveTab ? "bg-primary" : "bg-black-50"}`}
            onClick={() => setIsActiveTab(false)}
          >
            歷史習慣
          </li>
        </ul>
        {isActiveTab ? (
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-xl leading-7">會員管理</h2>
            <settingIcons.TbSettings className="w-8 h-8 cursor-pointer hover:text-alert" onClick={handleSettingModal} />
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-xl leading-7">歷史習慣</h2>
            <div className="relative">
              <select className="text-center border border-black-500 rounded-2xl appearance-none px-12 focus:outline-primary-dark" value={filter} onChange={handleFilterChange}>
                <option value="all">全部</option>
                <option value="in-progress">進行中</option>
                <option value="finished">已結束</option>
              </select>
              <dropdownIcon.TbChevronDown className="w-6 h-6 text-black-500 pointer-events-none absolute inset-y-0 right-2" />
            </div>
          </div>
        )}
        {isActiveTab ? (
          <div className="space-y-14">
            <div className="p-4 bg-black-50 rounded-2xl space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <img src={profileData.avatar} alt="user's avatar" className="w-12 h-12 rounded-full" />
                  <div className="flex flex-col">
                    <h3 className="font-bold text-base leading-6">{profileData.name}</h3>
                    <p className="font-normal text-sm leading-5 text-black-500">Lv.{profileData.levelPoints}</p>
                  </div>
                </div>
              </div>
              <p className="font-normal text-base leading-6 text-black-500">{profileData.introduction}</p>
              <div className="w-full bg-light text-center rounded-2xl">{profileData.levelPoints}%</div>
            </div>
            <div className="pt-9 pb-4 px-4 bg-black-50 space-y-4 rounded-2xl relative">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="bg-black-100 h-8 w-full"></div>
                <div className="bg-black-100 h-8 w-full"></div>
                <div className="bg-black-100 h-8 w-full"></div>
                <div className="bg-black-100 h-8 w-full"></div>
                {profileData.achievements.map((achievement, index) => (
                  <button key={index} className="border">
                    {achievement}
                  </button>
                ))}
              </div>
              <button className="text-center w-full bg-primary rounded-xl font-medium text-sm leading-5 py-1 hover:bg-primary-dark">更多成就</button>
              <div className="bg-primary py-1 px-4 w-fit absolute -top-12 left-1/2 transform -translate-x-1/2">
                <p className="font-lobster font-bold text-2xl leading-8 text-alert">Achievement</p>
                <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[-16px] before:w-0 before:h-0 before:border-l-[20px] before:border-r-0 before:border-t-[12px] before:border-l-primary before:border-r-transparent before:border-t-primary-dark before:z-20"></div>
                <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[114px] before:w-0 before:h-0 before:border-r-[20px] before:border-l-0 before:border-t-[12px] before:border-r-primary before:border-l-transparent before:border-t-primary-dark before:z-20"></div>
                <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[-46px] before:w-8 before:h-10 before:bg-primary"></div>
                <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[134px] before:w-8 before:h-10 before:bg-primary"></div>
                <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[166px] before:w-0 before:h-0 before:border-l-0 before:border-r-[20px] before:border-b-[20px] before:border-l-transparent before:border-r-transparent before:border-b-primary before:z-20"></div>
                <div className="absolute before:content-[''] before:absolute before:bottom-1 before:left-[166px] before:w-0 before:h-0 before:border-l-0 before:border-r-[20px] before:border-t-[20px] before:border-l-transparent before:border-r-transparent before:border-t-primary before:z-20"></div>
                <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[-66px] before:w-0 before:h-0 before:border-l-[20px] before:border-r-0 before:border-b-[20px] before:border-l-transparent before:border-r-transparent before:border-b-primary before:z-20"></div>
                <div className="absolute before:content-[''] before:absolute before:bottom-1 before:left-[-66px] before:w-0 before:h-0 before:border-l-[20px] before:border-r-0 before:border-t-[20px] before:border-l-transparent before:border-r-transparent before:border-t-primary before:z-20"></div>
              </div>
            </div>
            <div className="pt-9 pb-4 px-4 bg-black-50 space-y-4 rounded-2xl relative">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black-100 h-8 w-full"></div>
                <div className="bg-black-100 h-8 w-full"></div>
                <div className="bg-black-100 h-8 w-full"></div>
                <div className="bg-black-100 h-8 w-full"></div>
                {profileData.badges.map((badge, index) => (
                  <div key={index} className="w-20 h-20 bg-slate-100">
                    {badge}
                  </div>
                ))}
              </div>
              <button className="text-center w-full bg-primary rounded-xl font-medium text-sm leading-5 py-1 hover:bg-primary-dark">更多獎勵徽章</button>
              <div className="bg-primary py-1 px-4 w-[150px] absolute -top-12 left-1/2 transform -translate-x-1/2">
                <p className="font-lobster font-bold text-2xl leading-8 text-alert text-center">Badge</p>
                <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[-16px] before:w-0 before:h-0 before:border-l-[20px] before:border-r-0 before:border-t-[12px] before:border-l-primary before:border-r-transparent before:border-t-primary-dark before:z-20"></div>
                <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[114px] before:w-0 before:h-0 before:border-r-[20px] before:border-l-0 before:border-t-[12px] before:border-r-primary before:border-l-transparent before:border-t-primary-dark before:z-20"></div>
                <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[-46px] before:w-8 before:h-10 before:bg-primary"></div>
                <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[134px] before:w-8 before:h-10 before:bg-primary"></div>
                <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[166px] before:w-0 before:h-0 before:border-l-0 before:border-r-[20px] before:border-b-[20px] before:border-l-transparent before:border-r-transparent before:border-b-primary before:z-20"></div>
                <div className="absolute before:content-[''] before:absolute before:bottom-1 before:left-[166px] before:w-0 before:h-0 before:border-l-0 before:border-r-[20px] before:border-t-[20px] before:border-l-transparent before:border-r-transparent before:border-t-primary before:z-20"></div>
                <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[-66px] before:w-0 before:h-0 before:border-l-[20px] before:border-r-0 before:border-b-[20px] before:border-l-transparent before:border-r-transparent before:border-b-primary before:z-20"></div>
                <div className="absolute before:content-[''] before:absolute before:bottom-1 before:left-[-66px] before:w-0 before:h-0 before:border-l-[20px] before:border-r-0 before:border-t-[20px] before:border-l-transparent before:border-r-transparent before:border-t-primary before:z-20"></div>
              </div>
            </div>
          </div>
        ) : (
          <HabitList habits={filteredHabits} habitCategories={habitCategories} handleDetailClick={handleDetailClick} />
        )}
      </div>
      <Modal isOpen={isSettingModalOpen} onClose={handleSettingModal}>
        <SettingModal profileData={profileData} handleChange={handleChange} handleSaveAndClose={handleSaveAndClose} handleSettingModal={handleSettingModal} />
      </Modal>
      <Modal isOpen={isDetailModalOpen} onClose={handleDetailModal}>
        <DetailModal
          selectedHabit={selectedHabit}
          handleDetailModal={handleDetailModal}
          handlePostModal={handlePostModal}
          uncompletedFine={uncompletedFine}
          handleEditModal={handleEditModal}
          habitCategories={habitCategories}
        />
      </Modal>
      <Modal isOpen={isPostModalOpen} onClose={handlePostModal}>
        <PostModal postContent={postContent} setPostContent={setPostContent} handleAddPost={handleAddPost} handlePostModal={handlePostModal} />
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={handleEditModal}>
        <EditModal
          habitData={habitData}
          handleHabitChange={handleHabitChange}
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
          setCalendarTarget={setCalendarTarget}
          setShowMonthCalendar={setShowMonthCalendar}
        />
      </Modal>
    </>
  );
}

export default Member;
