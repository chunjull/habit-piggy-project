import { Link } from "react-router-dom";
import { layoutIcons } from "../assets/icons";

import PropTypes from "prop-types";

function Layout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <nav className="fixed inset-x-0 bottom-0 md:static md:w-1/4 pt-2 pb-3 px-4 border bg-white z-10">
        <ul className="grid grid-cols-6 items-center md:grid-cols-1 md:gap-6">
          <li className="p-2">
            <Link to="/">Habit Piggy</Link>
          </li>
          <li className="p-2">
            <Link to="/home" className="flex flex-col items-center md:flex-row">
              <layoutIcons.TbHome2 className="w-6 h-6 md:mr-4" />
              <p>Home</p>
            </Link>
          </li>
          <li className="p-2">
            <Link to="/savings" className="flex flex-col items-center md:flex-row">
              <layoutIcons.TbCoin className="w-6 h-6 md:mr-4" />
              <p>Savings</p>
            </Link>
          </li>
          <li className="p-2">
            <Link to="/rank" className="flex flex-col items-center md:flex-row">
              <layoutIcons.TbMedal2 className="w-6 h-6 md:mr-4" />
              <p>Rank</p>
            </Link>
          </li>
          <li className="p-2">
            <Link to="/posts" className="flex flex-col items-center md:flex-row">
              <layoutIcons.TbMessage className="w-6 h-6 md:mr-4" />
              <p>Posts</p>
            </Link>
          </li>
          <li className="p-2">
            <Link to="/member" className="flex flex-col items-center md:flex-row">
              <layoutIcons.TbMoodSmile className="w-6 h-6 md:mr-4" />
              <p>Member</p>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex-1 mt-0">{children}</div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
