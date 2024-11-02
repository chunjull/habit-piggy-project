import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { habitAddIcon } from "../assets/icons";
import DetailModal from "../components/Home/DetailModal";
import EditModal from "../components/Home/EditModal";
import HabitList from "../components/Home/HabitList";
import HabitModal from "../components/Home/HabitModal";
import { AlertNotify, SuccessNotify } from "../components/Home/ToastNotify";
import WeekCalendar from "../components/Home/WeekCalendar";
import Modal from "../components/Modal";
import {
  addHabit,
  calculateBadges,
  calculateTaskValue,
  checkAndAwardAchievements,
  checkAndAwardBadges,
  deleteHabit,
  getHabits,
  getUserProfile,
  removeBadge,
  updateHabit,
  updateUserProfile,
} from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { habitCategories } from "../utils/HabitCategories";
import { actionTypes, initialState, reducer } from "../utils/HabitReducer";
import {
  calculateUncompletedFine,
  generateStatusArray,
} from "../utils/HabitUtils";

function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [habitData, setHabitData] = useState({
    category: null,
    title: "",
    frequency: { type: "" },
    amount: 0,
    startDate: "",
    endDate: "",
    status: [],
    type: "",
  });
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const calendarRef = useRef(null);

  const { user } = useContext(AuthContext);

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
    dispatch({
      type: actionTypes.SET_SELECTED_DATE,
      payload: {
        year: today.getFullYear(),
        month: today.getMonth(),
        day: today.getDate(),
      },
    });
    dispatch({
      type: actionTypes.SET_MONTH_CALENDAR_DATE,
      payload: {
        year: today.getFullYear(),
        month: today.getMonth(),
        day: today.getDate(),
      },
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
    const today = selectedDate
      ? new Date(selectedDate.year, selectedDate.month, selectedDate.day)
      : new Date();
    const filteredHabits = habitsList.filter((habit) =>
      isDateInRange(today, habit.startDate, habit.endDate),
    );
    dispatch({ type: actionTypes.SET_HABITS, payload: filteredHabits || [] });
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

  const handleAddHabit = async () => {
    if (user) {
      const start = new Date(habitData.startDate);
      const end = new Date(habitData.endDate);

      if (end <= start) {
        AlertNotify.dateErrorNotify();
        return;
      }

      const statusArray = generateStatusArray(
        habitData.startDate,
        habitData.endDate,
        habitData.frequency,
      );
      const newHabitData = { ...habitData, status: statusArray };
      await addHabit(user.uid, newHabitData);
      await calculateBadges(user.uid);
      await checkAndAwardBadges(user.uid);
      fetchHabits();
      handleHabitModal();
      setHabitData({
        category: null,
        title: "",
        frequency: { type: "" },
        amount: 0,
        startDate: "",
        endDate: "",
        status: [],
        type: "",
      });
      SuccessNotify.addHabitNotify();
    } else {
      console.error("User not authenticated");
    }
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
      const taskValue = await calculateTaskValue(user.uid, "habit");
      await checkAndAwardAchievements(user.uid, "habit", taskValue);
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

      const taskValue = await calculateTaskValue(user.uid, "habit");
      await checkAndAwardAchievements(user.uid, "habit", taskValue);

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

  const handleSelectDate = async (date) => {
    dispatch({ type: actionTypes.SET_SELECTED_DATE, payload: date });
    await fetchHabits(date);
  };

  const handleWeekChange = useCallback(
    (weekDates) => {
      dispatch({ type: actionTypes.SET_WEEK_DATES, payload: weekDates });
    },
    [dispatch],
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
      SuccessNotify.checkErrorNotify();
      return;
    }

    const updatedHabits = state.habits.map((habit) => {
      if (habit.id === habitId) {
        const updatedStatus = habit.status.map((status) => {
          if (
            new Date(status.date).toDateString() === targetDate.toDateString()
          ) {
            const newCompletedStatus = !status.completed;
            if (newCompletedStatus) {
              updateUserLevelPoints(user.uid, habit.amount);
              SuccessNotify.checkHabitNotify();
            } else {
              updateUserLevelPoints(user.uid, -habit.amount);
              SuccessNotify.unCheckHabitNotify();
            }
            return { ...status, completed: newCompletedStatus };
          }
          return status;
        });
        return { ...habit, status: updatedStatus };
      }
      return habit;
    });

    dispatch({ type: actionTypes.SET_HABITS, payload: updatedHabits });

    const habitToUpdate = updatedHabits.find((habit) => habit.id === habitId);
    try {
      await updateHabit(user.uid, habitId, habitToUpdate);
      await handleAchievements("habit");
    } catch (error) {
      console.error("Error updating habit in Firestore: ", error);
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

  const handleAchievements = async (taskType) => {
    if (!user || !user.uid) return;

    try {
      const taskValue = await calculateTaskValue(user.uid, taskType);
      await checkAndAwardAchievements(user.uid, taskType, taskValue);
    } catch (error) {
      console.error("Error handling achievements: ", error);
    }
  };

  return (
    <div className="md:pb-6">
      <WeekCalendar
        date={state.selectedDate}
        onSelect={handleSelectDate}
        onWeekChange={handleWeekChange}
      />
      <HabitList
        habits={state.habits}
        habitCategories={habitCategories}
        handleDetailClick={handleDetailClick}
        weekDates={state.weekDates}
        handleCheck={handleCheck}
      />
      <div
        className="fixed bottom-20 right-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary hover:bg-primary-dark md:bottom-4 md:h-12 md:w-12 2xl:right-40"
        onClick={handleHabitModal}
      >
        <habitAddIcon.TbPlus className="h-8 w-8 text-black-0 md:h-10 md:w-10" />
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
            monthCalendarDate={state.monthCalendarDate}
            handleMonthCalendarSelectDate={handleMonthCalendarSelectDate}
            setShowMonthCalendar={setShowMonthCalendar}
            generateStatusArray={generateStatusArray}
          />
        </Modal>
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
          showMonthCalendar={showMonthCalendar}
          calendarRef={calendarRef}
          handleEditModal={handleEditModal}
          handleDeleteHabit={handleDeleteHabit}
          habitCategories={habitCategories}
          setHabitData={setHabitData}
          monthCalendarDate={state.monthCalendarDate}
          handleMonthCalendarSelectDate={handleMonthCalendarSelectDate}
          setShowMonthCalendar={setShowMonthCalendar}
          generateStatusArray={generateStatusArray}
        />
      </Modal>
    </div>
  );
}

export default Home;
