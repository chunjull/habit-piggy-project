import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../utils/AuthContext";
import { addHabit, getHabits } from "../services/api";
import WeekCalendar from "../components/WeekCalendar";
import MonthCalendar from "../components/MonthCalendar";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitData, setHabitData] = useState({
    category: 0,
    title: "",
    frequency: "daily",
    amount: 0,
    startDate: "",
    endDate: "",
  });
  const [habits, setHabits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState("");
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
    setHabits(habitsList);
  };

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHabitData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddHabit = async () => {
    if (user) {
      await addHabit(user.uid, habitData);
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
        {habits.map((habit) => (
          <li key={habit.id} className="px-2 py-4 bg-slate-100">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-yellow-400"></div>
                <div className="flex flex-col">
                  <h3>{habit.title}</h3>
                  <p>{habit.frequency}</p>
                </div>
              </div>
              <button className="bg-white">Detail</button>
            </div>
            <div className="flex justify-between">
              <div className="w-1/7">Sun</div>
              <div className="w-1/7">Mon</div>
              <div className="w-1/7">Tue</div>
              <div className="w-1/7">Wed</div>
              <div className="w-1/7">Thu</div>
              <div className="w-1/7">Fri</div>
              <div className="w-1/7">Sat</div>
            </div>
          </li>
        ))}
      </ul>
      <button className="fixed right-4 bottom-20 bg-slate-300" onClick={handleModal}>
        add habit
      </button>
      {isModalOpen && (
        <div className="bg-slate-100 w-2/3 h-fit absolute inset-0 p-4 space-y-4">
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
              <input type="text" name="endDate" id="endDate" className="text-center" placeholder="結束日期" value={habitData.endDate} onFocus={() => handleFocus("endDate")} onChange={handleChange} />
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
      )}
    </>
  );
}

export default Home;
