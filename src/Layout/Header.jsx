import { Link } from "react-router-dom";
import HabitPiggyLogo from "../assets/images/habit-piggy-logo.svg";

const Header = () => {
  return (
    <header className="mt-4 flex items-center justify-between rounded border border-black-950 px-4 py-1">
      <div className="flex items-center gap-2">
        <img
          src={HabitPiggyLogo}
          alt="Habit Piggy Logo"
          className="h-12 w-12 cursor-pointer"
        />
        <h1 className="cursor-pointer font-lobster text-2xl leading-8">
          Habit Piggy
        </h1>
      </div>
      <nav className="flex gap-2">
        <Link
          to="#"
          className="cursor-pointer px-4 py-2 text-sm font-normal leading-5"
        >
          How to Use?
        </Link>
        <Link
          to="/"
          className="cursor-pointer rounded bg-primary px-4 py-2 text-sm font-normal leading-5 hover:bg-primary-dark"
        >
          Login
        </Link>
      </nav>
    </header>
  );
};

export default Header;
