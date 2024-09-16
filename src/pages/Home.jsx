import { useState, useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import { addHabit } from "../services/api";

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

  const { user } = useContext(AuthContext);

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
      handleModal(); // Close the modal after adding the habit
    } else {
      console.error("User not authenticated");
    }
  };

  return (
    <>
      <div className="p-4 bg-slate-300 mb-6">
        <div className="flex justify-between mb-3">
          <button>prev</button>
          <h1>September</h1>
          <button>next</button>
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
      </div>
      <ul className="space-y-4 p-4">
        <li className="px-2 py-4 bg-slate-100">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-yellow-400"></div>
              <div className="flex flex-col">
                <h3>規劃當日工作</h3>
                <p>每天</p>
              </div>
            </div>
            <button className="w-6 h-6">C</button>
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
          <div className="flex justify-between gap-4">
            <label htmlFor="range">養成期間</label>
            <input type="date" name="startDate" id="startDate" value={habitData.startDate} onChange={handleChange} />
            <p>~</p>
            <input type="date" name="endDate" id="endDate" value={habitData.endDate} onChange={handleChange} />
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
