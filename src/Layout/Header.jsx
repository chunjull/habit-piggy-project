import { Link } from "react-router-dom";
import HabitPiggyLogo from "../assets/images/habit-piggy-logo.svg";

const Header = () => {
  return (
    <header className="py-1 px-4 mt-4 flex justify-between items-center border border-black-950 rounded">
      <div className="flex items-center gap-2">
        <img src={HabitPiggyLogo} alt="Habit Piggy Logo" className="w-12 h-12 cursor-pointer" />
        <h1 className="font-lobster text-2xl leading-8 cursor-pointer">Habit Piggy</h1>
      </div>
      <nav className="flex gap-2">
        <Link to="#" className="font-normal text-sm leading-5 py-2 px-4 cursor-pointer">
          How to Use?
        </Link>
        <Link to="/" className="bg-primary font-normal text-sm leading-5 py-2 px-4 rounded hover:bg-primary-dark cursor-pointer">
          Login
        </Link>
      </nav>
    </header>
  );
};

export default Header;
