import { useState, useContext, useEffect, useRef } from "react";
import {
  updateUserProfile,
  getUserProfile,
  uploadAvatar,
  getHabits,
  updateHabit,
  deleteHabit,
  getAchievements,
  getUserAchievements,
  calculateTaskValue,
  checkAndAwardAchievements,
  getBadges,
  getUserBadges,
  calculateBadges,
  checkAndAwardBadges,
  removeBadge,
} from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import Modal from "../components/Modal";
import SettingModal from "../components/SettingModal";
import DetailModal from "../components/DetailModal";
import EditModal from "../components/EditModal";
import { habitIcons, settingIcons } from "../assets/icons";
import HabitList from "../components/HabitList";
import AchievementList from "../components/AchievementList";
import BadgeList from "../components/BadgeList";
import CustomSelect from "../components/CustomSelect";
import AchievementModal from "../components/AchievementModal";
import BadgeModal from "../components/BadgeModal";
import habitPiggyLoading1 from "../assets/images/habit-piggy-loading-1.svg";
import habitPiggyLoading2 from "../assets/images/habit-piggy-loading-2.svg";
import toast from "react-hot-toast";
import habitPiggyLogo from "../assets/images/habit-piggy-logo.svg";

function Member() {
  const { user } = useContext(AuthContext);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
    isDarkMode: false,
    achievements: [],
    badges: [],
    habits: [],
  });
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
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
  const [filter, setFilter] = useState("all");
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [currentImage, setCurrentImage] = useState(habitPiggyLoading1);
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
        fetchUserBadges(user.uid);
        await checkAndAwardAllAchievements(user.uid);
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

  const checkAndAwardAllAchievements = async (uid) => {
    const taskTypes = ["habit", "savings", "level"];
    for (const type of taskTypes) {
      const taskValue = await calculateTaskValue(uid, type);
      await checkAndAwardAchievements(uid, type, taskValue);
    }
  };

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

  const fetchUserBadges = async (uid) => {
    const userBadgesList = await getUserBadges(uid);
    setUserBadges(userBadgesList);
  };

  const handleSettingModal = () => {
    setIsSettingModalOpen(!isSettingModalOpen);
  };

  const handleDetailModal = () => {
    setIsDetailModalOpen(!isDetailModalOpen);
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
      type: habit.type,
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

  const handleUpdateProfile = async (updatedProfileData) => {
    if (user && user.uid) {
      try {
        await updateUserProfile(user.uid, updatedProfileData);
        setProfileData(updatedProfileData);
        updateUserProfileNotify();
      } catch (error) {
        console.error("更新資料失敗", error);
      }
    }
  };

  const handleSaveAndClose = async (updatedProfileData) => {
    await handleUpdateProfile(updatedProfileData);
    handleSettingModal();
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!file) return;
      if (!allowedTypes.includes(file.type)) return;
      try {
        const avatarUrl = await uploadAvatar(user.uid, file);
        setProfileData((prevData) => ({
          ...prevData,
          avatar: avatarUrl,
        }));
      } catch (error) {
        console.error("上傳頭像失敗", error);
      }
    } else if (name === "isDarkMode" || name === "isAcceptReminder") {
      setProfileData((prevData) => ({
        ...prevData,
        [name]: value === "true",
      }));
    } else {
      setProfileData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleHabitChange = (e) => {
    const { name, value } = e.target;
    if (name === "frequency") {
      let newFrequency;
      if (value === "specificDays") {
        newFrequency = { type: value, days: habitData.frequency.days || [] };
      } else if (value === "weekly") {
        newFrequency = { type: value, day: habitData.frequency.day || 0 };
      } else {
        newFrequency = { type: value };
      }
      const newStatus = generateStatusArray(habitData.startDate, habitData.endDate, newFrequency);
      setHabitData((prevData) => ({
        ...prevData,
        frequency: newFrequency,
        status: newStatus,
      }));
    } else if (name === "startDate" || name === "endDate") {
      const newHabitData = { ...habitData, [name]: value };
      const newStatus = generateStatusArray(newHabitData.startDate, newHabitData.endDate, newHabitData.frequency);
      setHabitData((prevData) => ({
        ...prevData,
        [name]: value,
        status: newStatus,
      }));
    } else {
      setHabitData((prevData) => ({
        ...prevData,
        [name]: value,
        status: generateStatusArray(habitData.startDate, habitData.endDate, habitData.frequency),
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
      const selectedDay = frequency.day;
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (d.getDay() === selectedDay) {
          statusArray.push({ date: new Date(d).toDateString(), completed: false });
        }
      }
    } else if (frequency.type === "specificDays") {
      const days = Object.values(frequency.days);
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        if (days.includes(d.getDay())) {
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

  const handleFocus = (target) => {
    setCalendarTarget(target);
    setShowMonthCalendar(true);
  };

  const handleUpdateHabit = async () => {
    if (user && selectedHabit) {
      const start = new Date(habitData.startDate);
      const end = new Date(habitData.endDate);

      if (end <= start) {
        dateErrorNotify();
        return;
      }

      const originalHabitData = selectedHabit;

      const updatedHabitData = {
        ...originalHabitData,
        ...habitData,
        id: selectedHabit.id,
        status: generateStatusArray(habitData.startDate, habitData.endDate, habitData.frequency),
      };

      await updateHabit(user.uid, selectedHabit.id, updatedHabitData);
      await calculateBadges(user.uid);
      await checkAndAwardBadges(user.uid);
      fetchHabits();
      setIsEditModalOpen(false);
      setIsDetailModalOpen(false);
      updateHabitNotify();
    } else {
      console.error("User not authenticated or habit not selected");
    }
  };

  const handleDeleteHabit = async () => {
    if (user && selectedHabit) {
      await deleteHabit(user.uid, selectedHabit.id);
      await calculateBadges(user.uid);
      await checkAndAwardBadges(user.uid);

      const updatedHabits = await getHabits(user.uid);
      setHabits(updatedHabits);

      const categoryHabits = updatedHabits.filter((habit) => habit.category === selectedHabit.category);
      if (categoryHabits.length === 0) {
        await removeBadge(user.uid, selectedHabit.category);
      }

      fetchHabits();
      setIsEditModalOpen(false);
      setIsDetailModalOpen(false);
      deleteHabitNotify();
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

  const filteredHabits = [
    ...habits.filter((habit) => {
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
    }),
  ].sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

  const sortAchievements = (achievements, userAchievements) => {
    return [...achievements].sort((a, b) => {
      const aAchieved = userAchievements.includes(a.id);
      const bAchieved = userAchievements.includes(b.id);

      if (aAchieved && !bAchieved) return -1;
      if (!aAchieved && bAchieved) return 1;

      if (!aAchieved && !bAchieved) {
        const typeOrder = { habit: 1, savings: 2, streak: 3 };
        const aTypeOrder = typeOrder[a.condition.type] || 4;
        const bTypeOrder = typeOrder[b.condition.type] || 4;

        if (aTypeOrder !== bTypeOrder) return aTypeOrder - bTypeOrder;

        if (a.condition.count !== b.condition.count) return (a.condition.count || 0) - (b.condition.count || 0);
        if (a.condition.amount !== b.condition.amount) return (a.condition.amount || 0) - (b.condition.amount || 0);
        if (a.condition.percent !== b.condition.percent) return (a.condition.percent || 0) - (b.condition.percent || 0);
      }

      return 0;
    });
  };

  const sortedAchievements = sortAchievements(achievements, userAchievements);

  const sortBadges = (badges, userBadges) => {
    return [...badges].sort((a, b) => {
      const aAchieved = userBadges.includes(a.id);
      const bAchieved = userBadges.includes(b.id);

      if (aAchieved && !bAchieved) return -1;
      if (!aAchieved && bAchieved) return 1;

      return 0;
    });
  };

  const sortedBadges = sortBadges(badges, userBadges);

  const calculateLevelAndPoints = (levelPoints) => {
    let level = Math.floor(levelPoints / 100);
    const points = levelPoints % 100;
    if (level > 99) {
      level = 99;
    }
    return { level, points };
  };

  const { level, points } = calculateLevelAndPoints(profileData.levelPoints);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage === habitPiggyLoading1 ? habitPiggyLoading2 : habitPiggyLoading1));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const CustomToast = (message) => {
    toast(message, {
      icon: <img src={habitPiggyLogo} alt="Habit Piggy Logo" style={{ width: "40px", height: "40px" }} />,
      style: {
        borderRadius: "16px",
        background: "#212121",
        color: "#fff",
      },
      duration: 3000,
    });
  };

  const AlertToast = (message) => {
    toast.error(message, {
      style: {
        borderRadius: "16px",
        background: "#212121",
        color: "#fff",
      },
      duration: 3000,
    });
  };

  const updateUserProfileNotify = () => CustomToast("你知道嗎？每個人都有兩顆腎臟");
  const updateHabitNotify = () => CustomToast("人要時時刻刻做好準備！");
  const deleteHabitNotify = () => CustomToast("這段感情只有我在付出🥲");
  const dateErrorNotify = () => AlertToast("結束日期必須晚於開始日期喔！");

  return (
    <>
      <div className="p-4 md:py-10 space-y-4">
        <ul className="grid grid-cols-2 w-full">
          <li
            className={`border border-black-500 rounded-s-full py-1 font-normal text-sm leading-5 text-center cursor-pointer ${isActiveTab ? "bg-primary" : "bg-black-50"}`}
            onClick={() => setIsActiveTab(true)}
          >
            會員管理
          </li>
          <li
            className={`border-e border-y border-black-500 rounded-e-full py-1 font-normal text-sm leading-5 text-center cursor-pointer ${!isActiveTab ? "bg-primary" : "bg-black-50"}`}
            onClick={() => setIsActiveTab(false)}
          >
            歷史習慣
          </li>
        </ul>
        {isActiveTab ? (
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-xl leading-7 text-black dark:text-black-0">會員管理</h2>
            <settingIcons.TbSettings className="w-8 h-8 cursor-pointer hover:text-alert text-black dark:text-black-0" onClick={handleSettingModal} />
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-xl leading-7 text-black dark:text-black-0">歷史習慣</h2>
            <div className="relative">
              <CustomSelect options={options} value={filter} onChange={setFilter} />
            </div>
          </div>
        )}
        {isActiveTab ? (
          <div className="space-y-14">
            <div className="p-4 bg-black-50 dark:bg-black-800 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-3">
                  <img src={profileData.avatar} alt="user's avatar" className="w-12 h-12 rounded-full outline object-cover outline-primary-dark dark:outline-primary" />
                  <div className="flex flex-col">
                    <h3 className="font-bold text-base leading-6 text-black dark:text-black-0">{profileData.name}</h3>
                    <p className="font-normal text-sm leading-5 text-black dark:text-black-0">Lv.{level}</p>
                  </div>
                </div>
              </div>
              <p className="font-normal text-base leading-6 text-black dark:text-black-0 mb-4">{profileData.introduction}</p>
              <div className="w-full h-6 bg-light dark:bg-black-950 text-center rounded-2xl text-black dark:text-black-0 relative">
                <div className="bg-primary-dark h-full rounded-2xl relative" style={{ width: `${points}%` }}>
                  <img src={currentImage} alt="habit piggy" className="w-14 h-14 absolute top-2/3 transform -translate-y-2/3 z-20 object-cover" style={{ right: "-20px" }} />
                </div>
                <span className="absolute inset-0 flex items-center justify-center">{points}%</span>
              </div>
            </div>
            <AchievementList sortedAchievements={sortedAchievements} userAchievements={userAchievements} handleAchievementModal={handleAchievementModal} />
            <BadgeList sortedBadges={sortedBadges} userBadges={userBadges} handleBadgeModal={handleBadgeModal} />
          </div>
        ) : (
          <HabitList habits={filteredHabits} habitCategories={habitCategories} handleDetailClick={handleDetailClick} />
        )}
      </div>
      <Modal isOpen={isSettingModalOpen} onClose={handleSettingModal}>
        <SettingModal profileData={profileData} handleChange={handleChange} handleSaveAndClose={handleSaveAndClose} handleSettingModal={handleSettingModal} />
      </Modal>
      <Modal isOpen={isDetailModalOpen} onClose={handleDetailModal}>
        <DetailModal selectedHabit={selectedHabit} handleDetailModal={handleDetailModal} uncompletedFine={uncompletedFine} handleEditModal={handleEditModal} habitCategories={habitCategories} />
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
          generateStatusArray={generateStatusArray}
        />
      </Modal>
      <Modal isOpen={isAchievementModalOpen} onClose={handleAchievementModal}>
        <AchievementModal handleAchievementModal={handleAchievementModal} userAchievements={userAchievements} sortedAchievements={sortedAchievements} />
      </Modal>
      <Modal isOpen={isBadgeModalOpen} onClose={handleBadgeModal}>
        <BadgeModal handleBadgeModal={handleBadgeModal} badges={badges} userBadges={userBadges} sortedBadges={sortedBadges} />
      </Modal>
    </>
  );
}

export default Member;
