import { Link, useLocation } from "react-router-dom";
import { layoutIcons } from "../assets/icons";
import PropTypes from "prop-types";

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <nav className="fixed inset-x-0 bottom-0 md:w-1/4 pt-2 pb-3 px-4 border bg-white z-10 md:fixed md:top-0 md:left-0 md:h-full md:overflow-auto">
        <ul className="grid grid-cols-6 items-center md:grid-cols-1 md:gap-6">
          <li className="p-2">
            <Link to="/">Habit Piggy</Link>
          </li>
          <li className={`p-2 rounded-lg hover:md:bg-yellow-300 ${location.pathname === "/home" ? "md:bg-yellow-400" : ""}`}>
            <Link to="/home" className="flex flex-col items-center md:flex-row">
              <layoutIcons.TbHome2 className={`w-6 h-6 md:mr-4 ${location.pathname === "/home" ? "text-yellow-400 md:text-white" : ""}`} />
              <p>Home</p>
            </Link>
          </li>
          <li className={`p-2 rounded-lg hover:md:bg-yellow-300 ${location.pathname === "/savings" ? "md:bg-yellow-400" : ""}`}>
            <Link to="/savings" className="flex flex-col items-center md:flex-row">
              <layoutIcons.TbCoin className={`w-6 h-6 md:mr-4 ${location.pathname === "/savings" ? "text-yellow-400 md:text-white" : ""}`} />
              <p>Savings</p>
            </Link>
          </li>
          <li className={`p-2 rounded-lg hover:md:bg-yellow-300 ${location.pathname === "/rank" ? "md:bg-yellow-400" : ""}`}>
            <Link to="/rank" className="flex flex-col items-center md:flex-row">
              <layoutIcons.TbMedal2 className={`w-6 h-6 md:mr-4 ${location.pathname === "/rank" ? "text-yellow-400 md:text-white" : ""}`} />
              <p>Rank</p>
            </Link>
          </li>
          <li className={`p-2 rounded-lg hover:md:bg-yellow-300 ${location.pathname === "/posts" ? "md:bg-yellow-400" : ""}`}>
            <Link to="/posts" className="flex flex-col items-center md:flex-row">
              <layoutIcons.TbMessage className={`w-6 h-6 md:mr-4 ${location.pathname === "/posts" ? "text-yellow-400 md:text-white" : ""}`} />
              <p>Posts</p>
            </Link>
          </li>
          <li className={`p-2 rounded-lg hover:md:bg-yellow-300 ${location.pathname === "/member" ? "md:bg-yellow-400" : ""}`}>
            <Link to="/member" className="flex flex-col items-center md:flex-row">
              <layoutIcons.TbMoodSmile className={`w-6 h-6 md:mr-4 ${location.pathname === "/member" ? "text-yellow-400 md:text-white" : ""}`} />
              <p>Member</p>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-0 mb-[86px] md:mb-0 md:ml-[244px] w-full">{children}</div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
