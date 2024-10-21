import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { generalIcons, layoutIcons } from "../assets/icons";

const Sidebar = ({
  isSidebarExpanded,
  toggleSidebar,
  toggleSidebarInSmallScreen,
  handleLogout,
}) => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" ? (
        <nav
          className={`sticky bottom-0 z-50 flex gap-x-4 border-t border-primary bg-black-50 px-4 pb-3 pt-2 transition-all duration-200 ease-in-out dark:bg-black-800 md:bottom-auto md:top-0 md:h-svh md:flex-col md:justify-between md:border-r md:border-t-0 md:p-4 ${
            isSidebarExpanded ? "md:w-[240px]" : "md:w-20"
          }`}
        >
          <div
            className={`hidden md:flex md:items-center ${isSidebarExpanded ? "md:justify-between" : "md:justify-center"}`}
          >
            <p
              className={`ml-6 hidden text-nowrap font-lobster text-2xl font-normal leading-8 text-black dark:text-black-0 ${isSidebarExpanded ? "md:block" : ""}`}
            >
              Habit Piggy
            </p>
            <generalIcons.TbLayoutSidebarRight
              className="h-6 w-6 cursor-pointer text-black hover:text-alert dark:text-black-0 md:h-8 md:w-8"
              onClick={toggleSidebar}
            />
          </div>
          <ul className="grid w-full grid-cols-5 items-center transition-all duration-200 ease-in-out md:grid-cols-1 md:gap-4">
            <Link
              to="/home"
              className="block"
              onClick={toggleSidebarInSmallScreen}
            >
              <li
                className={`flex flex-col items-center gap-1 md:px-2 md:py-1 ${isSidebarExpanded ? "md:flex-row md:rounded-full hover:md:bg-primary-light" : ""} ${
                  location.pathname === "/home" && isSidebarExpanded
                    ? "md:bg-primary"
                    : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center rounded-xl px-4 py-1 md:aspect-square md:px-2 ${isSidebarExpanded ? "dark:bg-transparent md:bg-transparent" : ""} ${
                    location.pathname === "/home"
                      ? "bg-light dark:bg-black-950"
                      : "hover:bg-primary-light"
                  } ${location.pathname === "/home" && isSidebarExpanded ? "hover:bg-primary-light md:bg-transparent hover:md:bg-transparent" : ""}`}
                >
                  <layoutIcons.TbHome2
                    className={`h-6 w-6 md:h-8 md:w-8 ${isSidebarExpanded ? "dark:text-black-0 md:text-black" : ""} ${
                      location.pathname === "/home"
                        ? "text-primary-dark"
                        : "text-black dark:text-black-0"
                    } ${location.pathname === "/home" && isSidebarExpanded ? "" : "md:text-black"} ${location.pathname === "/home" && !isSidebarExpanded ? "md:text-primary-dark" : ""}`}
                  />
                </div>
                <p className="text-nowrap text-xs font-normal leading-4 text-black dark:text-black-0 md:text-base md:leading-6">
                  主頁
                </p>
              </li>
            </Link>
            <Link
              to="/savings"
              className="block"
              onClick={toggleSidebarInSmallScreen}
            >
              <li
                className={`flex flex-col items-center gap-1 md:px-2 md:py-1 ${isSidebarExpanded ? "md:flex-row md:rounded-full hover:md:bg-primary-light" : ""} ${
                  location.pathname === "/savings" && isSidebarExpanded
                    ? "md:bg-primary"
                    : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center rounded-xl px-4 py-1 md:aspect-square md:px-2 ${isSidebarExpanded ? "dark:bg-transparent md:bg-transparent" : ""} ${
                    location.pathname === "/savings"
                      ? "bg-light dark:bg-black-950"
                      : "hover:bg-primary-light"
                  } ${location.pathname === "/savings" && isSidebarExpanded ? "hover:bg-primary-light md:bg-transparent hover:md:bg-transparent" : ""}`}
                >
                  <layoutIcons.TbCoin
                    className={`h-6 w-6 md:h-8 md:w-8 ${isSidebarExpanded ? "dark:text-black-0 md:text-black" : ""} ${
                      location.pathname === "/savings"
                        ? "text-primary-dark"
                        : "text-black dark:text-black-0"
                    } ${location.pathname === "/savings" && isSidebarExpanded ? "" : "md:text-black"} ${location.pathname === "/savings" && !isSidebarExpanded ? "md:text-primary-dark" : ""}`}
                  />
                </div>
                <p className="text-nowrap text-xs font-normal leading-4 text-black dark:text-black-0 md:text-base md:leading-6">
                  存款
                </p>
              </li>
            </Link>
            <Link
              to="/rank"
              className="block"
              onClick={toggleSidebarInSmallScreen}
            >
              <li
                className={`flex flex-col items-center gap-1 md:px-2 md:py-1 ${isSidebarExpanded ? "md:flex-row md:rounded-full hover:md:bg-primary-light" : ""} ${
                  location.pathname === "/rank" && isSidebarExpanded
                    ? "md:bg-primary"
                    : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center rounded-xl px-4 py-1 md:aspect-square md:px-2 ${isSidebarExpanded ? "dark:bg-transparent md:bg-transparent" : ""} ${
                    location.pathname === "/rank"
                      ? "bg-light dark:bg-black-950"
                      : "hover:bg-primary-light"
                  } ${location.pathname === "/rank" && isSidebarExpanded ? "hover:bg-primary-light md:bg-transparent hover:md:bg-transparent" : ""}`}
                >
                  <layoutIcons.TbMedal2
                    className={`h-6 w-6 md:h-8 md:w-8 ${isSidebarExpanded ? "dark:text-black-0 md:text-black" : ""} ${
                      location.pathname === "/rank"
                        ? "text-primary-dark"
                        : "text-black dark:text-black-0"
                    } ${location.pathname === "/rank" && isSidebarExpanded ? "" : "md:text-black"} ${location.pathname === "/rank" && !isSidebarExpanded ? "md:text-primary-dark" : ""}`}
                  />
                </div>
                <p className="text-nowrap text-xs font-normal leading-4 text-black dark:text-black-0 md:text-base md:leading-6">
                  排行
                </p>
              </li>
            </Link>
            <Link
              to="/posts"
              className="block"
              onClick={toggleSidebarInSmallScreen}
            >
              <li
                className={`flex flex-col items-center gap-1 md:px-2 md:py-1 ${isSidebarExpanded ? "md:flex-row md:rounded-full hover:md:bg-primary-light" : ""} ${
                  location.pathname === "/posts" && isSidebarExpanded
                    ? "md:bg-primary"
                    : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center rounded-xl px-4 py-1 md:aspect-square md:px-2 ${isSidebarExpanded ? "dark:bg-transparent md:bg-transparent" : ""} ${
                    location.pathname === "/posts"
                      ? "bg-light dark:bg-black-950"
                      : "hover:bg-primary-light"
                  } ${location.pathname === "/posts" && isSidebarExpanded ? "hover:bg-primary-light md:bg-transparent hover:md:bg-transparent" : ""}`}
                >
                  <layoutIcons.TbMessage
                    className={`h-6 w-6 md:h-8 md:w-8 ${isSidebarExpanded ? "dark:text-black-0 md:text-black" : ""} ${
                      location.pathname === "/posts"
                        ? "text-primary-dark"
                        : "text-black dark:text-black-0"
                    } ${location.pathname === "/posts" && isSidebarExpanded ? "" : "md:text-black"} ${location.pathname === "/posts" && !isSidebarExpanded ? "md:text-primary-dark" : ""}`}
                  />
                </div>
                <p className="text-nowrap text-xs font-normal leading-4 text-black dark:text-black-0 md:text-base md:leading-6">
                  貼文
                </p>
              </li>
            </Link>
            <Link
              to="/member"
              className="block"
              onClick={toggleSidebarInSmallScreen}
            >
              <li
                className={`flex flex-col items-center gap-1 md:px-2 md:py-1 ${isSidebarExpanded ? "md:flex-row md:rounded-full hover:md:bg-primary-light" : ""} ${
                  location.pathname === "/member" && isSidebarExpanded
                    ? "md:bg-primary"
                    : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center rounded-xl px-4 py-1 md:aspect-square md:px-2 ${isSidebarExpanded ? "dark:bg-transparent md:bg-transparent" : ""} ${
                    location.pathname === "/member"
                      ? "bg-light dark:bg-black-950"
                      : "hover:bg-primary-light"
                  } ${location.pathname === "/member" && isSidebarExpanded ? "hover:bg-primary-light md:bg-transparent hover:md:bg-transparent" : ""}`}
                >
                  <layoutIcons.TbMoodSmile
                    className={`h-6 w-6 md:h-8 md:w-8 ${isSidebarExpanded ? "dark:text-black-0 md:text-black" : ""} ${
                      location.pathname === "/member"
                        ? "text-primary-dark"
                        : "text-black dark:text-black-0"
                    } ${location.pathname === "/member" && isSidebarExpanded ? "" : "md:text-black"} ${location.pathname === "/member" && !isSidebarExpanded ? "md:text-primary-dark" : ""}`}
                  />
                </div>
                <p className="text-nowrap text-xs font-normal leading-4 text-black dark:text-black-0 md:text-base md:leading-6">
                  會員
                </p>
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
            <div
              className={`flex flex-col items-center gap-1 md:px-2 md:py-1 ${isSidebarExpanded ? "md:flex-row md:rounded-full hover:md:bg-primary-light" : ""}`}
            >
              <div
                className={`flex items-center justify-center rounded-xl px-4 py-1 md:aspect-square md:px-2 ${isSidebarExpanded ? "dark:bg-transparent md:bg-transparent" : "hover:bg-primary-light"}`}
              >
                <generalIcons.TbLogout
                  className={`h-6 w-6 dark:text-black-0 md:h-8 md:w-8 ${isSidebarExpanded ? "md:text-black" : ""}`}
                />
              </div>
              <p
                className={`text-black dark:text-black-0 ${isSidebarExpanded ? "text-nowrap text-base leading-6" : "hidden"}`}
              >
                登出
              </p>
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
