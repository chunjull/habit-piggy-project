import { Link } from "react-router-dom";
import HabitPiggyLogo from "../assets/images/habit-piggy-logo.svg";

function Error() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <p className="font-normal text-lg leading-6 py-2">{`There's Nothing Delicious.`}</p>
      <img src={HabitPiggyLogo} alt="Habit Piggy Logo" className="w-60 h-60" />
      <Link to="/" className="font-normal text-lg leading-6 py-2 px-4 bg-primary rounded-2xl hover:bg-primary-dark">
        Do Habit
      </Link>
    </div>
  );
}
export default Error;
