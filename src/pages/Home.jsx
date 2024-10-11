import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { AuthContext } from "../utils/AuthContext";
import {
  getHabits,
  updateHabit,
  addHabit,
  deleteHabit,
  calculateTaskValue,
  checkAndAwardAchievements,
  calculateBadges,
  checkAndAwardBadges,
  removeBadge,
  getUserProfile,
  updateUserProfile,
} from "../services/api";
import WeekCalendar from "../components/WeekCalendar";
import Modal from "../components/Modal";
import HabitModal from "../components/HabitModal";
import DetailModal from "../components/DetailModal";
import EditModal from "../components/EditModal";
import { habitIcons, habitAddIcon } from "../assets/icons";
import HabitList from "../components/HabitList";
import habitPiggyLogo from "../assets/images/habit-piggy-logo.svg";
import toast from "react-hot-toast";

function Home() {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [habitData, setHabitData] = useState({
    category: null,
    title: "",
    frequency: { type: "daily" },
    amount: 0,
    startDate: "",
    endDate: "",
    status: [],
    type: "",
  });
  const [habits, setHabits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [weekDates, setWeekDates] = useState([]);
  const [uncompletedFine, setUncompletedFine] = useState(0);
  const [monthCalendarDate, setMonthCalendarDate] = useState(null);
  const calendarRef = useRef(null);

  const { user } = useContext(AuthContext);

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
    if (user) {
      fetchHabits();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowMonthCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const today = new Date();
    setSelectedDate({
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
    });
    setMonthCalendarDate({
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
    });
  }, []);

  const isDateInRange = (date, startDate, endDate) => {
    const targetDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    targetDate.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return targetDate >= start && targetDate <= end;
  };

  const fetchHabits = async (selectedDate = null) => {
    const habitsList = await getHabits(user.uid);
    const today = selectedDate ? new Date(selectedDate.year, selectedDate.month, selectedDate.day) : new Date();
    const filteredHabits = habitsList.filter((habit) => isDateInRange(today, habit.startDate, habit.endDate));
    setHabits(filteredHabits || []);
  };

  const handleHabitModal = () => {
    setIsHabitModalOpen(!isHabitModalOpen);
    setHabitData({
      category: null,
      title: "",
      frequency: "daily",
      amount: 0,
      startDate: "",
      endDate: "",
      status: [],
      type: "",
    });
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
    setIsDetailModalOpen(false);
    setIsEditModalOpen(!isEditModalOpen);
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

  const handleAddHabit = async () => {
    if (user) {
      const start = new Date(habitData.startDate);
      const end = new Date(habitData.endDate);

      if (end <= start) {
        dateErrorNotify();
        return;
      }

      const statusArray = generateStatusArray(habitData.startDate, habitData.endDate, habitData.frequency);
      const newHabitData = { ...habitData, status: statusArray };
      await addHabit(user.uid, newHabitData);
      await calculateBadges(user.uid);
      await checkAndAwardBadges(user.uid);
      fetchHabits();
      handleHabitModal();
      setHabitData({
        category: null,
        title: "",
        frequency: { type: "daily" },
        amount: 0,
        startDate: "",
        endDate: "",
        status: [],
        type: "",
      });
      addHabitNotify();
    } else {
      console.error("User not authenticated");
    }
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
      const taskValue = await calculateTaskValue(user.uid, "habit");
      await checkAndAwardAchievements(user.uid, "habit", taskValue);
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

      const taskValue = await calculateTaskValue(user.uid, "habit");
      await checkAndAwardAchievements(user.uid, "habit", taskValue);

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

  const handleSelectDate = async (date) => {
    setSelectedDate(date);
    await fetchHabits(date);
  };

  const handleWeekChange = useCallback(
    (weekDates) => {
      setWeekDates(weekDates);
    },
    [setWeekDates]
  );

  const handleMonthCalendarSelectDate = (range) => {
    setHabitData((prevData) => ({
      ...prevData,
      startDate: `${range.start.year}-${range.start.month + 1}-${range.start.value}`,
      endDate: `${range.end.year}-${range.end.month + 1}-${range.end.value}`,
    }));
    setShowMonthCalendar(false);
  };

  const updateUserLevelPoints = async (userId, points) => {
    try {
      const userDoc = await getUserProfile(userId);
      const currentLevelPoints = Number(userDoc.levelPoints);
      const pointsToAdd = Number(points);
      const newLevelPoints = currentLevelPoints + pointsToAdd;
      await updateUserProfile(userId, { levelPoints: newLevelPoints });
    } catch (error) {
      console.error("Error getting user profile: ", error);
    }
  };

  const handleCheck = async (habitId, date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate > today) {
      checkErrorNotify();
      return;
    }

    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const updatedStatus = habit.status.map((status) => {
          if (new Date(status.date).toDateString() === targetDate.toDateString()) {
            const newCompletedStatus = !status.completed;
            if (newCompletedStatus) {
              updateUserLevelPoints(user.uid, habit.amount);
              checkHabitNotify();
            } else {
              updateUserLevelPoints(user.uid, -habit.amount);
              unCheckHabitNotify();
            }
            return { ...status, completed: newCompletedStatus };
          }
          return status;
        });
        return { ...habit, status: updatedStatus };
      }
      return habit;
    });

    setHabits(updatedHabits);

    const habitToUpdate = updatedHabits.find((habit) => habit.id === habitId);
    try {
      await updateHabit(user.uid, habitId, habitToUpdate);
      await handleAchievements("habit");
    } catch (error) {
      console.error("Error updating habit in Firestore: ", error);
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

  const handleAchievements = async (taskType) => {
    if (!user || !user.uid) return;

    try {
      const taskValue = await calculateTaskValue(user.uid, taskType);
      await checkAndAwardAchievements(user.uid, taskType, taskValue);
    } catch (error) {
      console.error("Error handling achievements: ", error);
    }
  };

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

  const addHabitNotify = () => CustomToast("從今天開始培養習慣吧！");
  const updateHabitNotify = () => CustomToast("人要時時刻刻做好準備！");
  const deleteHabitNotify = () => CustomToast("這段感情只有我在付出🥲");
  const checkHabitNotify = () => CustomToast("給你一個乖寶寶印章");
  const unCheckHabitNotify = () => CustomToast("要記得回來完成喔！");
  const dateErrorNotify = () => AlertToast("結束日期必須晚於開始日期喔！");
  const checkErrorNotify = () => AlertToast("只能在今天之前打卡喔！");

  return (
    <div className="md:pb-6">
      <WeekCalendar date={selectedDate} onSelect={handleSelectDate} onWeekChange={handleWeekChange} />
      <HabitList habits={habits} habitCategories={habitCategories} handleDetailClick={handleDetailClick} weekDates={weekDates} handleCheck={handleCheck} />
      <div
        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center fixed right-4 bottom-20 md:bottom-10 bg-primary hover:bg-primary-dark cursor-pointer"
        onClick={handleHabitModal}
      >
        <habitAddIcon.TbPlus className="w-8 h-8 md:w-10 md:h-10 text-black-0" />
      </div>
      <Modal isOpen={isHabitModalOpen}>
        <Modal isOpen={isHabitModalOpen}>
          <HabitModal
            habitData={habitData}
            handleHabitChange={handleHabitChange}
            handleAddHabit={handleAddHabit}
            showMonthCalendar={showMonthCalendar}
            calendarRef={calendarRef}
            handleHabitModal={handleHabitModal}
            habitCategories={habitCategories}
            setHabitData={setHabitData}
            monthCalendarDate={monthCalendarDate}
            handleMonthCalendarSelectDate={handleMonthCalendarSelectDate}
            setShowMonthCalendar={setShowMonthCalendar}
            generateStatusArray={generateStatusArray}
          />
        </Modal>
      </Modal>
      <Modal isOpen={isDetailModalOpen} onClose={handleDetailModal}>
        <DetailModal selectedHabit={selectedHabit} handleDetailModal={handleDetailModal} uncompletedFine={uncompletedFine} handleEditModal={handleEditModal} habitCategories={habitCategories} />
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={handleEditModal}>
        <EditModal
          habitData={habitData}
          handleHabitChange={handleHabitChange}
          handleUpdateHabit={handleUpdateHabit}
          showMonthCalendar={showMonthCalendar}
          calendarRef={calendarRef}
          handleEditModal={handleEditModal}
          handleDeleteHabit={handleDeleteHabit}
          habitCategories={habitCategories}
          setHabitData={setHabitData}
          monthCalendarDate={monthCalendarDate}
          handleMonthCalendarSelectDate={handleMonthCalendarSelectDate}
          setShowMonthCalendar={setShowMonthCalendar}
          generateStatusArray={generateStatusArray}
        />
      </Modal>
    </div>
  );
}

export default Home;
