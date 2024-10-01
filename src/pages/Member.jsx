import { useState, useContext, useEffect, useRef } from "react";
import { updateUserProfile, getUserProfile, uploadAvatar, getHabits, addPost, updateHabit, deleteHabit, getAchievements, getUserAchievements, getBadges } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import Modal from "../components/Modal";
import SettingModal from "../components/SettingModal";
import DetailModal from "../components/DetailModal";
import PostModal from "../components/PostModal";
import EditModal from "../components/EditModal";
import { Navigate } from "react-router-dom";
import { habitIcons, settingIcons } from "../assets/icons";
import HabitList from "../components/HabitList";
import CustomSelect from "../components/CustomSelect";
import AchievementModal from "../components/AchievementModal";
import BadgeModal from "../components/BadgeModal";

function Member() {
  const { user } = useContext(AuthContext);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
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
  const [postBackground, setPostBackground] = useState("");
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
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState("");
  const calendarRef = useRef(null);
  const [monthCalendarDate, setMonthCalendarDate] = useState(null);
  const [isPost, setIsPost] = useState(false);
  const [filter, setFilter] = useState("all");
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [badges, setBadges] = useState([]);
  const [options] = useState([
    { label: "全部習慣", value: "all" },
    { label: "進行中", value: "in-progress" },
    { label: "已結束", value: "finished" },
  ]);

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
        fetchAchievements();
        fetchUserAchievements(user.uid);
        fetchBadges();
      }
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const today = new Date();
    setMonthCalendarDate({
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
    });
  }, []);

  const fetchAchievements = async () => {
    const achievementsList = await getAchievements();
    setAchievements(achievementsList);
  };

  const fetchUserAchievements = async (uid) => {
    const userAchievementsList = await getUserAchievements(uid);
    setUserAchievements(userAchievementsList);
  };

  const fetchBadges = async () => {
    const badgesList = await getBadges();
    setBadges(badgesList);
  };

  const handleSettingModal = () => {
    setIsSettingModalOpen(!isSettingModalOpen);
  };

  const handleDetailModal = () => {
    setIsDetailModalOpen(!isDetailModalOpen);
  };

  const handlePostModal = () => {
    setIsPostModalOpen(!isPostModalOpen);
    setIsDetailModalOpen(false);
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

  const handleAchievementModal = () => {
    setIsAchievementModalOpen(!isAchievementModalOpen);
  };

  const handleBadgeModal = () => {
    setIsBadgeModalOpen(!isBadgeModalOpen);
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
    if (name === "frequency") {
      const newFrequency = { type: value };
      const newStatus = generateStatusArray(habitData.startDate, habitData.endDate, newFrequency);
      setHabitData((prevData) => ({
        ...prevData,
        frequency: newFrequency,
        status: newStatus,
      }));
    } else {
      setHabitData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const generateStatusArray = (startDate, endDate, frequency) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const statusArray = [];

    if (frequency.type === "daily") {
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        statusArray.push({ date: new Date(d).toDateString(), completed: false });
      }
    } else if (frequency.type === "weekly") {
      for (let d = start; d <= end; d.setDate(d.getDate() + 7)) {
        statusArray.push({ date: new Date(d).toDateString(), completed: false });
      }
    } else if (frequency.type === "specificDays") {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const selectedDays = frequency.days || [];
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        if (selectedDays.includes(daysOfWeek[d.getDay()])) {
          statusArray.push({ date: new Date(d).toDateString(), completed: false });
        }
      }
    }

    return statusArray;
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
        background: postBackground,
        habitId: selectedHabit.id,
      };
      await addPost(user.uid, postData);
      setIsPost(true);
      handlePostModal();
      setPostContent("");
      setPostBackground("");
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

  const handleMonthCalendarSelectDate = (date) => {
    setMonthCalendarDate(date);
    if (calendarTarget) {
      const formattedDate = `${date.year}-${String(date.month + 1).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
      setHabitData((prev) => ({
        ...prev,
        [calendarTarget]: formattedDate,
      }));
      setShowMonthCalendar(false);
      setCalendarTarget("");
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
              <CustomSelect options={options} value={filter} onChange={setFilter} />
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
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {achievements.slice(0, 6).map((achievement) => (
                  <li
                    key={achievement.id}
                    className={`py-1 w-full flex justify-center items-center rounded-lg border-2 cursor-default ${
                      userAchievements.includes(achievement.id)
                        ? "opacity-100 border-primary-dark bg-light text-primary-dark bordered-achievement"
                        : "opacity-50 border-black-500 bg-black-100 text-black-500"
                    }`}
                  >
                    <div className="font-normal text-base leading-6">{achievement.name}</div>
                  </li>
                ))}
              </ul>
              <button className="text-center w-full bg-primary rounded-xl font-medium text-sm leading-5 py-1 hover:bg-primary-dark" onClick={handleAchievementModal}>
                更多成就
              </button>
              <div className="bg-primary py-1 px-4 w-fit absolute -top-12 left-1/2 transform -translate-x-1/2">
                <p className="font-lobster font-normal text-2xl leading-8 text-alert">Achievement</p>
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
              <ul className="grid grid-cols-3 gap-4 md:grid-cols-6">
                {badges.slice(0, 6).map((badge, index) => (
                  <li key={badge.id} className="relative w-full h-fit">
                    <img src={badge.image} alt={`Badge ${index}`} className={`w-full h-full object-cover ${userAchievements.includes(badge.id) ? "opacity-100" : "opacity-30"}`} />
                  </li>
                ))}
              </ul>
              <button className="text-center w-full bg-primary rounded-xl font-medium text-sm leading-5 py-1 hover:bg-primary-dark" onClick={handleBadgeModal}>
                更多獎勵徽章
              </button>
              <div className="bg-primary py-1 px-4 w-[150px] absolute -top-12 left-1/2 transform -translate-x-1/2">
                <p className="font-lobster font-normal text-2xl leading-8 text-alert text-center">Badge</p>
                <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[-16px] before:w-0 before:h-0 before:border-l-[20px] before:border-r-0 before:border-t-[13px] before:border-l-primary before:border-r-transparent before:border-t-primary-dark before:z-20"></div>
                <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[114px] before:w-0 before:h-0 before:border-r-[20px] before:border-l-0 before:border-t-[13px] before:border-r-primary before:border-l-transparent before:border-t-primary-dark before:z-20"></div>
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
        <PostModal
          postContent={postContent}
          setPostContent={setPostContent}
          postBackground={postBackground}
          setPostBackground={setPostBackground}
          handleAddPost={handleAddPost}
          handlePostModal={handlePostModal}
          user={user}
        />
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={handleEditModal}>
        <EditModal
          habitData={habitData}
          handleHabitChange={handleHabitChange}
          handleUpdateHabit={handleUpdateHabit}
          handleFocus={handleFocus}
          showMonthCalendar={showMonthCalendar}
          calendarTarget={calendarTarget}
          calendarRef={calendarRef}
          handleEditModal={handleEditModal}
          handleDeleteHabit={handleDeleteHabit}
          habitCategories={habitCategories}
          setHabitData={setHabitData}
          monthCalendarDate={monthCalendarDate}
          handleMonthCalendarSelectDate={handleMonthCalendarSelectDate}
          setCalendarTarget={setCalendarTarget}
          setShowMonthCalendar={setShowMonthCalendar}
        />
      </Modal>
      <Modal isOpen={isAchievementModalOpen} onClose={handleAchievementModal}>
        <AchievementModal handleAchievementModal={handleAchievementModal} achievements={achievements} userAchievements={userAchievements} />
      </Modal>
      <Modal isOpen={isBadgeModalOpen} onClose={handleBadgeModal}>
        <BadgeModal handleBadgeModal={handleBadgeModal} badges={badges} userAchievements={userAchievements} />
      </Modal>
    </>
  );
}

export default Member;
