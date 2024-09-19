import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import { getHabits, updateHabit, addHabit, addPost } from "../services/api";
import WeekCalendar from "../components/WeekCalendar";
import Modal from "../components/Modal";
import HabitModal from "../components/HabitModal";
import DetailModal from "../components/DetailModal";
import PostModal from "../components/PostModal";
import { Navigate } from "react-router-dom";

function Home() {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [habitData, setHabitData] = useState({
    category: 0,
    title: "",
    frequency: "daily",
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
  const [weekDates, setWeekDates] = useState([]);
  const [uncompletedFine, setUncompletedFine] = useState(0);
  const [isPost, setIsPost] = useState(false);
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
    setSelectedDate({
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
  };

  const handleDetailModal = () => {
    setIsDetailModalOpen(!isDetailModalOpen);
  };

  const handlePostModal = () => {
    setIsPostModalOpen(!isPostModalOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHabitData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateStatusArray = (startDate, endDate, frequency) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const statusArray = [];

    if (frequency === "daily") {
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        statusArray.push({ date: new Date(d).toDateString(), completed: false });
      }
    } else if (frequency === "weekly") {
      for (let d = start; d <= end; d.setDate(d.getDate() + 7)) {
        statusArray.push({ date: new Date(d).toDateString(), completed: false });
      }
    }

    return statusArray;
  };

  const handleAddHabit = async () => {
    if (user) {
      const statusArray = generateStatusArray(habitData.startDate, habitData.endDate, habitData.frequency);
      const newHabitData = { ...habitData, status: statusArray };
      await addHabit(user.uid, newHabitData);
      fetchHabits();
      handleHabitModal();
    } else {
      console.error("User not authenticated");
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
        habitId: selectedHabit.id,
      };
      await addPost(user.uid, postData);
      setIsPost(true);
      handlePostModal();
      setPostContent("");
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
          handleChange={handleChange}
          handleAddHabit={handleAddHabit}
          handleFocus={handleFocus}
          showMonthCalendar={showMonthCalendar}
          calendarTarget={calendarTarget}
          selectedDate={selectedDate}
          handleSelectDate={handleSelectDate}
          calendarRef={calendarRef}
          handleHabitModal={handleHabitModal}
        />
      </Modal>
      <Modal isOpen={isDetailModalOpen} onClose={handleDetailModal}>
        <DetailModal selectedHabit={selectedHabit} handleDetailModal={handleDetailModal} handlePostModal={handlePostModal} uncompletedFine={uncompletedFine} />
      </Modal>
      <Modal isOpen={isPostModalOpen} onClose={handlePostModal}>
        <PostModal postContent={postContent} setPostContent={setPostContent} handleAddPost={handleAddPost} handlePostModal={handlePostModal} />
      </Modal>
    </>
  );
}

export default Home;
