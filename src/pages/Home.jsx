import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import { getHabits, updateHabit, addHabit, addPost, deleteHabit } from "../services/api";
import WeekCalendar from "../components/WeekCalendar";
import Modal from "../components/Modal";
import HabitModal from "../components/HabitModal";
import DetailModal from "../components/DetailModal";
import PostModal from "../components/PostModal";
import EditModal from "../components/EditModal";
import { Navigate } from "react-router-dom";
import { habitIcons } from "../assets/icons";

function Home() {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [habitData, setHabitData] = useState({
    category: null,
    title: "",
    frequency: { type: "daily" },
    amount: 0,
    startDate: "",
    endDate: "",
    status: [],
  });
  const [habits, setHabits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState("");
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [postBackground, setPostBackground] = useState("");
  const [weekDates, setWeekDates] = useState([]);
  const [uncompletedFine, setUncompletedFine] = useState(0);
  const [monthCalendarDate, setMonthCalendarDate] = useState(null);
  const [isPost, setIsPost] = useState(false);
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
    const filteredHabits = habitsList.filter((habit) => isDateInRange(today, habit.startDate, habit.endDate)).sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
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
    });
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
      const selectedDays = habitData.frequency.days || [];
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        if (selectedDays.includes(daysOfWeek[d.getDay()])) {
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
        alert("結束日期必須晚於開始日期");
        return;
      }

      const statusArray = generateStatusArray(habitData.startDate, habitData.endDate, habitData.frequency);
      const newHabitData = { ...habitData, status: statusArray };
      await addHabit(user.uid, newHabitData);
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
      });
    } else {
      console.error("User not authenticated");
    }
  };

  const handleUpdateHabit = async () => {
    if (user && selectedHabit) {
      const start = new Date(habitData.startDate);
      const end = new Date(habitData.endDate);

      if (end <= start) {
        alert("結束日期必須晚於開始日期");
        return;
      }

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

  const handleSelectDate = async (date) => {
    setSelectedDate(date);
    await fetchHabits(date);
    if (calendarTarget) {
      setHabitData((prev) => ({
        ...prev,
        [calendarTarget]: `${date.year}-${String(date.month + 1).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`,
      }));
      setShowMonthCalendar(false);
      setCalendarTarget("");
    }
  };

  const handleMonthCalendarSelectDate = (date) => {
    setMonthCalendarDate(date);
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

  const handleCheck = async (habitId, date) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const updatedStatus = habit.status.map((status) => {
          if (new Date(status.date).toDateString() === new Date(date).toDateString()) {
            return { ...status, completed: !status.completed };
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

  if (isPost) {
    return <Navigate to="/posts" />;
  }

  return (
    <>
      <WeekCalendar date={selectedDate} onSelect={handleSelectDate} onWeekChange={setWeekDates} />
      <ul className="space-y-4 p-4 mb-11">
        {Array.isArray(habits) &&
          habits.map((habit) => {
            const habitCategory = habitCategories.find((category) => category.id === habit.category);
            const HabitIcon = habitCategory ? habitCategory.icon : null;
            return (
              <li key={habit.id} className="px-2 py-4 bg-slate-100">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">{HabitIcon && <HabitIcon className="w-8 h-8" />}</div>
                    <div className="flex flex-col">
                      <h3>{habit.title}</h3>
                      <div className="flex">
                        <p>
                          {habit.frequency.type}｜罰款 ${habit.amount}｜已達成 {habit.status.filter((status) => status.completed).length}
                        </p>
                        <p className="text-gray-500">/{habit.status.length}</p>
                      </div>
                    </div>
                  </div>
                  <button className="bg-white" onClick={() => handleDetailClick(habit)}>
                    Detail
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                    <div key={index} className="text-center">
                      {day}
                    </div>
                  ))}
                  {weekDates.map((date, index) => {
                    const status = habit.status.find((s) => new Date(s.date).toDateString() === new Date(date.year, date.month, date.day).toDateString());
                    return (
                      <button
                        key={index}
                        className={`border w-full ${status && status.completed ? "bg-yellow-400" : "bg-gray-200"}`}
                        onClick={() => status && handleCheck(habit.id, status.date)}
                        disabled={!status}
                      >
                        {status ? "CHECK" : ""}
                      </button>
                    );
                  })}
                </div>
              </li>
            );
          })}
      </ul>
      <button className="fixed right-4 bottom-20 bg-slate-300" onClick={handleHabitModal}>
        add habit
      </button>
      <Modal isOpen={isHabitModalOpen}>
        <HabitModal
          habitData={habitData}
          handleHabitChange={handleHabitChange}
          handleAddHabit={handleAddHabit}
          handleFocus={handleFocus}
          showMonthCalendar={showMonthCalendar}
          calendarTarget={calendarTarget}
          calendarRef={calendarRef}
          handleHabitModal={handleHabitModal}
          habitCategories={habitCategories}
          setHabitData={setHabitData}
          monthCalendarDate={monthCalendarDate}
          handleMonthCalendarSelectDate={handleMonthCalendarSelectDate}
        />
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
        />
      </Modal>
    </>
  );
}

export default Home;
