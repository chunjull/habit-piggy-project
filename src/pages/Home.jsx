import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../utils/AuthContext";
import { addHabit, getHabits, updateHabit, addPost } from "../services/api";
import WeekCalendar from "../components/WeekCalendar";
import MonthCalendar from "../components/MonthCalendar";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const fetchHabits = async () => {
    const habitsList = await getHabits(user.uid);
    setHabits(habitsList || []);
  };

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
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
        statusArray.push({ date: new Date(d).getTime(), completed: false });
      }
    } else if (frequency === "weekly") {
      for (let d = start; d <= end; d.setDate(d.getDate() + 7)) {
        statusArray.push({ date: new Date(d).getTime(), completed: false });
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
      handleModal();
    } else {
      console.error("User not authenticated");
    }
  };

  const handleSelectDate = (date) => {
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

  const handleCheck = async (habitId, date) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const updatedStatus = habit.status.map((status) => (status.date === date ? { ...status, completed: !status.completed } : status));
        return { ...habit, status: updatedStatus };
      }
      return habit;
    });
    setHabits(updatedHabits);

    const habitToUpdate = updatedHabits.find((habit) => habit.id === habitId);
    await updateHabit(user.uid, habitId, habitToUpdate);
  };

  const handleDetailClick = (habit) => {
    setSelectedHabit(habit);
    setIsDetailModalOpen(true);
  };

  const handleAddPost = async () => {
    if (user && selectedHabit) {
      const postData = {
        content: postContent,
        habitId: selectedHabit.id,
      };
      await addPost(user.uid, postData);
      handlePostModal();
      setPostContent("");
    }
  };

  return (
    <>
      <div className="p-4 bg-slate-300 mb-6">
        <WeekCalendar date={selectedDate} onSelect={handleSelectDate} />
        {selectedDate && (
          <div className="mt-4">
            <p>Selected Date: {`${selectedDate.year}-${selectedDate.month + 1}-${selectedDate.day}`}</p>
          </div>
        )}
      </div>
      <ul className="space-y-4 p-4">
        {Array.isArray(habits) &&
          habits.map((habit) => (
            <li key={habit.id} className="px-2 py-4 bg-slate-100">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-10 h-10 bg-yellow-400"></div>
                  <div className="flex flex-col">
                    <h3>{habit.title}</h3>
                    <p>{habit.frequency}</p>
                  </div>
                </div>
                <button className="bg-white" onClick={() => handleDetailClick(habit)}>
                  Detail
                </button>
              </div>
              <div className="grid grid-cols-7">
                {habit.status.map((status) => (
                  <div key={status.date} className="text-center">
                    <div>{new Date(status.date).toLocaleDateString("en-US", { weekday: "short" })}</div>
                    <button className={`border ${status.completed ? "bg-yellow-400" : ""}`} onClick={() => handleCheck(habit.id, status.date)}>
                      Check
                    </button>
                  </div>
                ))}
              </div>
            </li>
          ))}
      </ul>
      <button className="fixed right-4 bottom-20 bg-slate-300" onClick={handleModal}>
        add habit
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-100 w-2/3 h-fit p-4 space-y-4">
            <div className="flex justify-between gap-4">
              <div className="flex gap-4 w-full">
                <label htmlFor="category">
                  <input type="number" name="category" id="category" className="w-10 h-10" value={habitData.category} onChange={handleChange} />
                </label>
                <input type="text" name="title" placeholder="輸入習慣名稱" className="px-4" value={habitData.title} onChange={handleChange} />
              </div>
              <button onClick={handleModal}>Close</button>
            </div>
            <div className="flex justify-between gap-4">
              <label htmlFor="frequency">習慣頻率</label>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="frequency"
                  id="daily"
                  value="daily"
                  className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-slate-500 checked:border-transparent focus:outline-none"
                  checked={habitData.frequency === "daily"}
                  onChange={handleChange}
                />
                <label htmlFor="daily">每日</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="frequency"
                  id="weekly"
                  value="weekly"
                  className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-slate-500 checked:border-transparent focus:outline-none"
                  checked={habitData.frequency === "weekly"}
                  onChange={handleChange}
                />
                <label htmlFor="weekly">每週</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="frequency"
                  id="specificDay"
                  value="specificDays"
                  className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-slate-500 checked:border-transparent focus:outline-none"
                  checked={habitData.frequency === "specificDays"}
                  onChange={handleChange}
                />
                <label htmlFor="specificDay">特定日期</label>
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <label htmlFor="amount">習慣罰款</label>
              <div className="flex gap-2">
                <p>NT$</p>
                <input type="number" name="amount" id="amount" className="px-4" value={habitData.amount} onChange={handleChange} />
              </div>
            </div>
            <div className="flex justify-between gap-4 w-full">
              <label htmlFor="range" className="text-nowrap">
                養成期間
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="startDate"
                  id="startDate"
                  className="text-center"
                  placeholder="開始日期"
                  value={habitData.startDate}
                  onFocus={() => handleFocus("startDate")}
                  onChange={handleChange}
                />
                {showMonthCalendar && calendarTarget === "startDate" && (
                  <div ref={calendarRef} className="absolute z-10 bg-white shadow-lg w-[300px]">
                    <MonthCalendar date={selectedDate} onSelect={handleSelectDate} />
                  </div>
                )}
              </div>
              <p>~</p>
              <div className="relative">
                <input
                  type="text"
                  name="endDate"
                  id="endDate"
                  className="text-center"
                  placeholder="結束日期"
                  value={habitData.endDate}
                  onFocus={() => handleFocus("endDate")}
                  onChange={handleChange}
                />
                {showMonthCalendar && calendarTarget === "endDate" && (
                  <div ref={calendarRef} className="absolute z-10 bg-white shadow-lg w-[300px]">
                    <MonthCalendar date={selectedDate} onSelect={handleSelectDate} />
                  </div>
                )}
              </div>
            </div>
            <button className="w-full border" onClick={handleAddHabit}>
              養成習慣
            </button>
          </div>
        </div>
      )}
      {isDetailModalOpen && selectedHabit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 bg-yellow-50 w-2/3 h-fit space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-yellow-400"></div>
                <div className="flex flex-col">
                  <div className="flex gap-2">
                    <h3>{selectedHabit.title}</h3>
                    <button>edit</button>
                  </div>
                  <p>{selectedHabit.frequency}</p>
                </div>
              </div>
              <button onClick={handleDetailModal}>close</button>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {selectedHabit.status.map((status, index) => (
                <div key={index} className={`border w-1/7 h-10 ${index < selectedHabit.status.filter((s) => s.completed).length ? "bg-yellow-400" : ""}`}></div>
              ))}
            </div>
            <div className="flex justify-between">
              <p>累積存款：</p>
              <p>NT$ Not sure how to do</p>
              {/* {selectedHabit.status.filter((status) => status.completed).length * 50} */}
            </div>
            <button className="py-1 w-full bg-yellow-400" onClick={handlePostModal}>
              發佈貼文
            </button>
          </div>
        </div>
      )}
      {isPostModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 bg-white w-2/3 h-fit space-y-4">
            <div className="flex justify-between items-center">
              <h3>發佈貼文</h3>
              <button onClick={handlePostModal}>close</button>
            </div>
            <textarea className="w-full h-40 border p-2" placeholder="輸入貼文內容..." required value={postContent} onChange={(e) => setPostContent(e.target.value)}></textarea>
            <button className="py-1 w-full bg-slate-300" onClick={handleAddPost}>
              發佈
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
