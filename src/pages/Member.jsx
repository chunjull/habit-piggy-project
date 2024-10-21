import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { settingIcons } from "../assets/icons";
import habitPiggyLoading1 from "../assets/images/habit-piggy-loading-1.svg";
import habitPiggyLoading2 from "../assets/images/habit-piggy-loading-2.svg";
import CustomSelect from "../components/CustomSelect";
import DetailModal from "../components/home/DetailModal";
import EditModal from "../components/home/EditModal";
import HabitList from "../components/home/HabitList";
import { AlertNotify, SuccessNotify } from "../components/home/ToastNotify";
import AchievementList from "../components/Member/AchievementList";
import AchievementModal from "../components/Member/AchievementModal";
import BadgeList from "../components/Member/BadgeList";
import BadgeModal from "../components/Member/BadgeModal";
import MemberInformation from "../components/Member/MemberInformation";
import SettingModal from "../components/Member/SettingModal";
import TabNavigation from "../components/Member/TabNavigation";
import { UpdateNotify } from "../components/Member/ToastNotify";
import Modal from "../components/Modal";
import {
  calculateBadges,
  calculateTaskValue,
  checkAndAwardAchievements,
  checkAndAwardBadges,
  deleteHabit,
  getAchievements,
  getBadges,
  getHabits,
  getUserAchievements,
  getUserBadges,
  getUserProfile,
  removeBadge,
  updateHabit,
  updateUserProfile,
  uploadAvatar,
} from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { habitCategories } from "../utils/HabitCategories";
import { actionTypes, initialState, reducer } from "../utils/HabitReducer";
import {
  calculateUncompletedFine,
  generateStatusArray,
} from "../utils/HabitUtils";

function Member() {
  const { user } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isActiveTab, setIsActiveTab] = useState("member");
  const [habitData, setHabitData] = useState({
    category: 0,
    title: "",
    frequency: "daily",
    amount: 0,
    startDate: "",
    endDate: "",
    status: [],
  });
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState("");
  const calendarRef = useRef(null);
  const [monthCalendarDate, setMonthCalendarDate] = useState(null);
  const [filter, setFilter] = useState("all");
  const [currentImage, setCurrentImage] = useState(habitPiggyLoading1);
  const [options] = useState([
    { label: "全部習慣", value: "all" },
    { label: "進行中", value: "in-progress" },
    { label: "已結束", value: "finished" },
  ]);

  const customSelectRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      dispatch({ type: actionTypes.SET_IS_LOADING, payload: true });
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          dispatch({
            type: actionTypes.SET_PROFILE_DATA,
            payload: userProfile,
          });
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
    dispatch({ type: actionTypes.SET_IS_LOADING, payload: false });
  }, [user]);

  useEffect(() => {
    const today = new Date();
    setMonthCalendarDate({
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        customSelectRef.current &&
        !customSelectRef.current.contains(e.target)
      ) {
        customSelectRef.current.closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    dispatch({ type: actionTypes.SET_ACHIEVEMENTS, payload: achievementsList });
  };

  const fetchUserAchievements = async (uid) => {
    const userAchievementsList = await getUserAchievements(uid);
    dispatch({
      type: actionTypes.SET_USER_ACHIEVEMENTS,
      payload: userAchievementsList,
    });
  };

  const fetchBadges = async () => {
    const badgesList = await getBadges();
    dispatch({ type: actionTypes.SET_BADGES, payload: badgesList });
  };

  const fetchUserBadges = async (uid) => {
    const userBadgesList = await getUserBadges(uid);
    dispatch({ type: actionTypes.SET_USER_BADGES, payload: userBadgesList });
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
        dispatch({
          type: actionTypes.SET_PROFILE_DATA,
          payload: updatedProfileData,
        });
        UpdateNotify.updateUserProfileNotify();
      } catch (error) {
        UpdateNotify.updateUserProfileErrorNotify();
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
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!file) return;
      if (!allowedTypes.includes(file.type)) return;
      try {
        const avatarUrl = await uploadAvatar(user.uid, file);
        dispatch({
          type: actionTypes.SET_PROFILE_DATA,
          payload: { ...state.profileData, avatar: avatarUrl },
        });
      } catch (error) {
        console.error("上傳頭像失敗", error);
      }
    } else if (name === "isDarkMode" || name === "isAcceptReminder") {
      dispatch({
        type: actionTypes.SET_PROFILE_DATA,
        payload: { ...state.profileData, [name]: value === "true" },
      });
    } else {
      dispatch({
        type: actionTypes.SET_PROFILE_DATA,
        payload: { ...state.profileData, [name]: value },
      });
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
      const newStatus = generateStatusArray(
        habitData.startDate,
        habitData.endDate,
        newFrequency,
      );
      setHabitData((prevData) => ({
        ...prevData,
        frequency: newFrequency,
        status: newStatus,
      }));
    } else if (name === "startDate" || name === "endDate") {
      const newHabitData = { ...habitData, [name]: value };
      const newStatus = generateStatusArray(
        newHabitData.startDate,
        newHabitData.endDate,
        newHabitData.frequency,
      );
      setHabitData((prevData) => ({
        ...prevData,
        [name]: value,
        status: newStatus,
      }));
    } else {
      setHabitData((prevData) => ({
        ...prevData,
        [name]: value,
        status: generateStatusArray(
          habitData.startDate,
          habitData.endDate,
          habitData.frequency,
        ),
      }));
    }
  };

  const fetchHabits = async () => {
    if (user) {
      try {
        const habitsList = await getHabits(user.uid);
        dispatch({ type: actionTypes.SET_HABITS, payload: habitsList });
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
    if (user && state.selectedHabit) {
      const start = new Date(habitData.startDate);
      const end = new Date(habitData.endDate);

      if (end <= start) {
        AlertNotify.dateErrorNotify();
        return;
      }

      const originalHabitData = state.selectedHabit;

      const updatedHabitData = {
        ...originalHabitData,
        ...habitData,
        id: state.selectedHabit.id,
        status: generateStatusArray(
          habitData.startDate,
          habitData.endDate,
          habitData.frequency,
        ),
      };

      await updateHabit(user.uid, state.selectedHabit.id, updatedHabitData);
      await calculateBadges(user.uid);
      await checkAndAwardBadges(user.uid);
      fetchHabits();
      setIsEditModalOpen(false);
      setIsDetailModalOpen(false);
      SuccessNotify.updateHabitNotify();
    } else {
      console.error("User not authenticated or habit not selected");
    }
  };

  const handleDeleteHabit = async () => {
    if (user && state.selectedHabit) {
      await deleteHabit(user.uid, state.selectedHabit.id);
      await calculateBadges(user.uid);
      await checkAndAwardBadges(user.uid);

      const updatedHabits = await getHabits(user.uid);
      dispatch({ type: actionTypes.SET_HABITS, payload: updatedHabits });

      const categoryHabits = updatedHabits.filter(
        (habit) => habit.category === state.selectedHabit.category,
      );
      if (categoryHabits.length === 0) {
        await removeBadge(user.uid, state.selectedHabit.category);
      }

      fetchHabits();
      setIsEditModalOpen(false);
      setIsDetailModalOpen(false);
      SuccessNotify.deleteHabitNotify();
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

  const handleDetailClick = (habit) => {
    dispatch({ type: actionTypes.SET_SELECTED_HABIT, payload: habit });
    dispatch({
      type: actionTypes.SET_UNCOMPLETED_FINE,
      payload: calculateUncompletedFine(habit),
    });
    setIsDetailModalOpen(true);
  };

  const filteredHabits = [
    ...state.habits.filter((habit) => {
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

        if (a.condition.count !== b.condition.count)
          return (a.condition.count || 0) - (b.condition.count || 0);
        if (a.condition.amount !== b.condition.amount)
          return (a.condition.amount || 0) - (b.condition.amount || 0);
        if (a.condition.percent !== b.condition.percent)
          return (a.condition.percent || 0) - (b.condition.percent || 0);
      }

      return 0;
    });
  };

  const sortedAchievements = sortAchievements(
    state.achievements,
    state.userAchievements,
  );

  const sortBadges = (badges, userBadges) => {
    return [...badges].sort((a, b) => {
      const aAchieved = userBadges.includes(a.id);
      const bAchieved = userBadges.includes(b.id);

      if (aAchieved && !bAchieved) return -1;
      if (!aAchieved && bAchieved) return 1;

      return 0;
    });
  };

  const sortedBadges = sortBadges(state.badges, state.userBadges);

  const calculateLevelAndPoints = (levelPoints) => {
    let level = Math.floor(levelPoints / 100);
    const points = levelPoints % 100;
    if (level > 99) {
      level = 99;
    }
    return { level, points };
  };

  const { level, points } = calculateLevelAndPoints(
    state.profileData.levelPoints,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) =>
        prevImage === habitPiggyLoading1
          ? habitPiggyLoading2
          : habitPiggyLoading1,
      );
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="space-y-4 p-4 md:py-10">
        <TabNavigation
          isActiveTab={isActiveTab}
          setIsActiveTab={setIsActiveTab}
        />
        {isActiveTab === "member" && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold leading-7 text-black dark:text-black-0">
                會員管理
              </h2>
              <settingIcons.TbSettings
                className="h-8 w-8 cursor-pointer text-black hover:text-alert dark:text-black-0"
                onClick={handleSettingModal}
              />
            </div>
            <div className="space-y-14">
              <MemberInformation
                profileData={state.profileData}
                currentImage={currentImage}
                level={level}
                points={points}
                isLoading={state.isLoading}
              />
              <AchievementList
                sortedAchievements={sortedAchievements}
                userAchievements={state.userAchievements}
                handleAchievementModal={handleAchievementModal}
                isLoading={state.isLoading}
              />
              <BadgeList
                sortedBadges={sortedBadges}
                userBadges={state.userBadges}
                handleBadgeModal={handleBadgeModal}
                isLoading={state.isLoading}
              />
            </div>
          </>
        )}
        {isActiveTab === "history" && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold leading-7 text-black dark:text-black-0">
                歷史習慣
              </h2>
              <div className="relative" ref={customSelectRef}>
                <CustomSelect
                  options={options}
                  value={filter}
                  onChange={setFilter}
                />
              </div>
            </div>
            <HabitList
              habits={filteredHabits}
              habitCategories={habitCategories}
              handleDetailClick={handleDetailClick}
            />
          </>
        )}
      </div>
      <Modal isOpen={isSettingModalOpen} onClose={handleSettingModal}>
        <SettingModal
          profileData={state.profileData}
          handleChange={handleChange}
          handleSaveAndClose={handleSaveAndClose}
          handleSettingModal={handleSettingModal}
        />
      </Modal>
      <Modal isOpen={isDetailModalOpen} onClose={handleDetailModal}>
        <DetailModal
          selectedHabit={state.selectedHabit}
          handleDetailModal={handleDetailModal}
          uncompletedFine={state.uncompletedFine}
          handleEditModal={handleEditModal}
          habitCategories={habitCategories}
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
          generateStatusArray={generateStatusArray}
        />
      </Modal>
      <Modal isOpen={isAchievementModalOpen} onClose={handleAchievementModal}>
        <AchievementModal
          handleAchievementModal={handleAchievementModal}
          userAchievements={state.userAchievements}
          sortedAchievements={sortedAchievements}
        />
      </Modal>
      <Modal isOpen={isBadgeModalOpen} onClose={handleBadgeModal}>
        <BadgeModal
          handleBadgeModal={handleBadgeModal}
          badges={state.badges}
          userBadges={state.userBadges}
          sortedBadges={sortedBadges}
        />
      </Modal>
    </>
  );
}

export default Member;
