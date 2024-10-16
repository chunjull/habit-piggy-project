import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { generalIcons, layoutIcons } from "../assets/icons";

const Sidebar = ({ isSidebarExpanded, toggleSidebar, toggleSidebarInSmallScreen, handleLogout }) => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" ? (
        <nav
          className={`pt-2 pb-3 px-4 bg-black-50 dark:bg-black-800 sticky bottom-0 md:top-0 md:bottom-auto flex gap-x-4 z-50 border-t border-primary md:p-4 md:flex-col md:justify-between md:border-t-0 md:border-r md:h-svh transition-all duration-200 ease-in-out ${
            isSidebarExpanded ? "md:w-[240px]" : "md:w-20"
          }`}
        >
          <div className={`hidden md:flex md:items-center ${isSidebarExpanded ? "md:justify-between" : "md:justify-center"}`}>
            <p className={`text-black dark:text-black-0 font-lobster font-normal text-2xl leading-8 ml-6 hidden text-nowrap ${isSidebarExpanded ? "md:block" : ""}`}>Habit Piggy</p>
            <generalIcons.TbLayoutSidebarRight className="w-6 h-6 md:w-8 md:h-8 text-black dark:text-black-0 hover:text-alert cursor-pointer" onClick={toggleSidebar} />
          </div>
          <ul className="grid grid-cols-5 items-center w-full md:grid-cols-1 md:gap-4 transition-all duration-200 ease-in-out">
            <Link to="/home" className="block" onClick={toggleSidebarInSmallScreen}>
              <li
                className={`md:py-1 md:px-2 flex flex-col items-center gap-1 ${isSidebarExpanded ? "md:rounded-full md:flex-row hover:md:bg-primary-light" : ""} ${
                  location.pathname === "/home" && isSidebarExpanded ? "md:bg-primary" : ""
                }`}
              >
                <div
                  className={`flex justify-center items-center py-1 px-4 rounded-xl md:px-2 md:aspect-square ${isSidebarExpanded ? "md:bg-transparent dark:bg-transparent" : ""} ${
                    location.pathname === "/home" ? "bg-light dark:bg-black-950" : "hover:bg-primary-light"
                  } ${location.pathname === "/home" && isSidebarExpanded ? "md:bg-transparent hover:bg-primary-light hover:md:bg-transparent" : ""}`}
                >
                  <layoutIcons.TbHome2
                    className={`w-6 h-6 md:w-8 md:h-8 ${isSidebarExpanded ? "md:text-black dark:text-black-0" : ""} ${
                      location.pathname === "/home" ? "text-primary-dark" : "text-black dark:text-black-0"
                    } ${location.pathname === "/home" && isSidebarExpanded ? "" : "md:text-black"} ${location.pathname === "/home" && !isSidebarExpanded ? "md:text-primary-dark" : ""}`}
                  />
                </div>
                <p className="text-black dark:text-black-0 font-normal text-xs leading-4 text-nowrap md:text-base md:leading-6">主頁</p>
              </li>
            </Link>
            <Link to="/savings" className="block" onClick={toggleSidebarInSmallScreen}>
              <li
                className={`md:py-1 md:px-2 flex flex-col items-center gap-1 ${isSidebarExpanded ? "md:rounded-full md:flex-row hover:md:bg-primary-light" : ""} ${
                  location.pathname === "/savings" && isSidebarExpanded ? "md:bg-primary" : ""
                }`}
              >
                <div
                  className={`flex justify-center items-center py-1 px-4 rounded-xl md:px-2 md:aspect-square ${isSidebarExpanded ? "md:bg-transparent dark:bg-transparent" : ""} ${
                    location.pathname === "/savings" ? "bg-light dark:bg-black-950" : "hover:bg-primary-light"
                  } ${location.pathname === "/savings" && isSidebarExpanded ? "md:bg-transparent hover:bg-primary-light hover:md:bg-transparent" : ""}`}
                >
                  <layoutIcons.TbCoin
                    className={`w-6 h-6 md:w-8 md:h-8 ${isSidebarExpanded ? "md:text-black dark:text-black-0" : ""} ${
                      location.pathname === "/savings" ? "text-primary-dark" : "text-black dark:text-black-0"
                    } ${location.pathname === "/savings" && isSidebarExpanded ? "" : "md:text-black"} ${location.pathname === "/savings" && !isSidebarExpanded ? "md:text-primary-dark" : ""}`}
                  />
                </div>
                <p className="text-black dark:text-black-0 font-normal text-xs leading-4 text-nowrap md:text-base md:leading-6">存款</p>
              </li>
            </Link>
            <Link to="/rank" className="block" onClick={toggleSidebarInSmallScreen}>
              <li
                className={`md:py-1 md:px-2 flex flex-col items-center gap-1 ${isSidebarExpanded ? "md:rounded-full md:flex-row hover:md:bg-primary-light" : ""} ${
                  location.pathname === "/rank" && isSidebarExpanded ? "md:bg-primary" : ""
                }`}
              >
                <div
                  className={`flex justify-center items-center py-1 px-4 rounded-xl md:px-2 md:aspect-square ${isSidebarExpanded ? "md:bg-transparent dark:bg-transparent" : ""} ${
                    location.pathname === "/rank" ? "bg-light dark:bg-black-950" : "hover:bg-primary-light"
                  } ${location.pathname === "/rank" && isSidebarExpanded ? "md:bg-transparent hover:bg-primary-light hover:md:bg-transparent" : ""}`}
                >
                  <layoutIcons.TbMedal2
                    className={`w-6 h-6 md:w-8 md:h-8 ${isSidebarExpanded ? "md:text-black dark:text-black-0" : ""} ${
                      location.pathname === "/rank" ? "text-primary-dark" : "text-black dark:text-black-0"
                    } ${location.pathname === "/rank" && isSidebarExpanded ? "" : "md:text-black"} ${location.pathname === "/rank" && !isSidebarExpanded ? "md:text-primary-dark" : ""}`}
                  />
                </div>
                <p className="text-black dark:text-black-0 font-normal text-xs leading-4 text-nowrap md:text-base md:leading-6">排行</p>
              </li>
            </Link>
            <Link to="/posts" className="block" onClick={toggleSidebarInSmallScreen}>
              <li
                className={`md:py-1 md:px-2 flex flex-col items-center gap-1 ${isSidebarExpanded ? "md:rounded-full md:flex-row hover:md:bg-primary-light" : ""} ${
                  location.pathname === "/posts" && isSidebarExpanded ? "md:bg-primary" : ""
                }`}
              >
                <div
                  className={`flex justify-center items-center py-1 px-4 rounded-xl md:px-2 md:aspect-square ${isSidebarExpanded ? "md:bg-transparent dark:bg-transparent" : ""} ${
                    location.pathname === "/posts" ? "bg-light dark:bg-black-950" : "hover:bg-primary-light"
                  } ${location.pathname === "/posts" && isSidebarExpanded ? "md:bg-transparent hover:bg-primary-light hover:md:bg-transparent" : ""}`}
                >
                  <layoutIcons.TbMessage
                    className={`w-6 h-6 md:w-8 md:h-8 ${isSidebarExpanded ? "md:text-black dark:text-black-0" : ""} ${
                      location.pathname === "/posts" ? "text-primary-dark" : "text-black dark:text-black-0"
                    } ${location.pathname === "/posts" && isSidebarExpanded ? "" : "md:text-black"} ${location.pathname === "/posts" && !isSidebarExpanded ? "md:text-primary-dark" : ""}`}
                  />
                </div>
                <p className="text-black dark:text-black-0 font-normal text-xs leading-4 text-nowrap md:text-base md:leading-6">貼文</p>
              </li>
            </Link>
            <Link to="/member" className="block" onClick={toggleSidebarInSmallScreen}>
              <li
                className={`md:py-1 md:px-2 flex flex-col items-center gap-1 ${isSidebarExpanded ? "md:rounded-full md:flex-row hover:md:bg-primary-light" : ""} ${
                  location.pathname === "/member" && isSidebarExpanded ? "md:bg-primary" : ""
                }`}
              >
                <div
                  className={`flex justify-center items-center py-1 px-4 rounded-xl md:px-2 md:aspect-square ${isSidebarExpanded ? "md:bg-transparent dark:bg-transparent" : ""} ${
                    location.pathname === "/member" ? "bg-light dark:bg-black-950" : "hover:bg-primary-light"
                  } ${location.pathname === "/member" && isSidebarExpanded ? "md:bg-transparent hover:bg-primary-light hover:md:bg-transparent" : ""}`}
                >
                  <layoutIcons.TbMoodSmile
                    className={`w-6 h-6 md:w-8 md:h-8 ${isSidebarExpanded ? "md:text-black dark:text-black-0" : ""} ${
                      location.pathname === "/member" ? "text-primary-dark" : "text-black dark:text-black-0"
                    } ${location.pathname === "/member" && isSidebarExpanded ? "" : "md:text-black"} ${location.pathname === "/member" && !isSidebarExpanded ? "md:text-primary-dark" : ""}`}
                  />
                </div>
                <p className="text-black dark:text-black-0 font-normal text-xs leading-4 text-nowrap md:text-base md:leading-6">會員</p>
              </li>
            </Link>
          </ul>
          <Link
            to="/"
            className={`hidden md:block ${location.pathname === "/" ? "invisible" : ""}`}
            onClick={() => {
              handleLogout();
              toggleSidebarInSmallScreen();
            }}
          >
            <div className={`md:py-1 md:px-2 flex flex-col items-center gap-1 ${isSidebarExpanded ? "md:rounded-full md:flex-row hover:md:bg-primary-light" : ""}`}>
              <div
                className={`flex justify-center items-center py-1 px-4 rounded-xl md:px-2 md:aspect-square ${isSidebarExpanded ? "md:bg-transparent dark:bg-transparent" : "hover:bg-primary-light"}`}
              >
                <generalIcons.TbLogout className={`w-6 h-6 md:w-8 md:h-8 dark:text-black-0 ${isSidebarExpanded ? "md:text-black" : ""}`} />
              </div>
              <p className={`text-black dark:text-black-0 ${isSidebarExpanded ? "text-base leading-6 text-nowrap" : "hidden"}`}>登出</p>
            </div>
          </Link>
        </nav>
      ) : null}
    </>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  isSidebarExpanded: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  toggleSidebarInSmallScreen: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};
