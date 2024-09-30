import { Link, useLocation, useNavigate } from "react-router-dom";
import { layoutIcons, generalIcons } from "../assets/icons";
import PropTypes from "prop-types";
import Modal from "./Modal";
import { useContext, useState, useEffect } from "react";
import { logoutUser } from "../services/api";
import { AuthContext } from "../utils/AuthContext";

function Layout({ children, isModalOpen, modalContent }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    alert("Logged out successfully");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleResize = () => {
    if (window.innerWidth >= 1536) {
      setIsSidebarExpanded(true);
    } else {
      setIsSidebarExpanded(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="font-sans bg-light relative min-h-screen">
      <nav
        className={`pt-2 pb-3 px-4 bg-black-50 fixed inset-x-0 bottom-0 flex gap-x-4 z-50 border-t border-primary md:p-4 md:flex-col md:justify-between md:border-t-0 md:border-r md:h-full ${
          isSidebarExpanded ? "md:w-[240px]" : "md:w-20"
        }`}
      >
        <div className={`hidden md:flex md:items-center ${isSidebarExpanded ? "md:justify-between" : "md:justify-center"}`}>
          <p className={`font-lobster font-bold text-2xl leading-8 ml-6 hidden ${isSidebarExpanded ? "md:block" : ""}`}>Habit Piggy</p>
          <generalIcons.TbLayoutSidebarRight className="w-6 h-6 md:w-8 md:h-8 hover:text-alert cursor-pointer" onClick={toggleSidebar} />
        </div>
        <ul className="grid grid-cols-5 items-center w-full md:grid-cols-1 md:gap-4">
          <Link to="/home" className="block">
            <li
              className={`md:py-1 md:px-2 flex flex-col items-center gap-1 ${isSidebarExpanded ? "md:rounded-full md:flex-row hover:md:bg-primary-light" : ""} ${
                location.pathname === "/home" && isSidebarExpanded ? "md:bg-primary" : ""
              }`}
            >
              <div
                className={`flex justify-center items-center py-1 px-4 rounded-xl md:px-2 md:aspect-square ${isSidebarExpanded ? "md:bg-transparent" : ""} ${
                  location.pathname === "/home" ? "bg-light" : "hover:bg-primary-light"
                } ${location.pathname === "/home" && isSidebarExpanded ? "md:bg-transparent hover:bg-primary-light hover:md:bg-transparent" : ""}`}
              >
                <layoutIcons.TbHome2
                  className={`w-6 h-6 md:w-8 md:h-8 ${isSidebarExpanded ? "md:text-black" : ""} ${location.pathname === "/home" ? "text-primary-dark" : "text-black"} ${
                    location.pathname === "/home" && isSidebarExpanded ? "" : "md:text-black"
                  } ${location.pathname === "/home" && !isSidebarExpanded ? "md:text-primary-dark" : ""}`}
                />
              </div>
              <p className="font-normal text-xs leading-4 text-nowrap md:text-base md:leading-6">主頁</p>
            </li>
          </Link>
          <Link to="/savings" className="block">
            <li
              className={`md:py-1 md:px-2 flex flex-col items-center gap-1 ${isSidebarExpanded ? "md:rounded-full md:flex-row hover:md:bg-primary-light" : ""} ${
                location.pathname === "/savings" && isSidebarExpanded ? "md:bg-primary" : ""
              }`}
            >
              <div
                className={`flex justify-center items-center py-1 px-4 rounded-xl md:px-2 md:aspect-square ${isSidebarExpanded ? "md:bg-transparent" : ""} ${
                  location.pathname === "/savings" ? "bg-light" : "hover:bg-primary-light"
                } ${location.pathname === "/savings" && isSidebarExpanded ? "md:bg-transparent hover:bg-primary-light hover:md:bg-transparent" : ""}`}
              >
                <layoutIcons.TbCoin
                  className={`w-6 h-6 md:w-8 md:h-8 ${isSidebarExpanded ? "md:text-black" : ""} ${location.pathname === "/savings" ? "text-primary-dark" : "text-black"} ${
                    location.pathname === "/savings" && isSidebarExpanded ? "" : "md:text-black"
                  } ${location.pathname === "/savings" && !isSidebarExpanded ? "md:text-primary-dark" : ""}`}
                />
              </div>
              <p className="font-normal text-xs leading-4 text-nowrap md:text-base md:leading-6">存款</p>
            </li>
          </Link>
          <Link to="/rank" className="block">
            <li
              className={`md:py-1 md:px-2 flex flex-col items-center gap-1 ${isSidebarExpanded ? "md:rounded-full md:flex-row hover:md:bg-primary-light" : ""} ${
                location.pathname === "/rank" && isSidebarExpanded ? "md:bg-primary" : ""
              }`}
            >
              <div
                className={`flex justify-center items-center py-1 px-4 rounded-xl md:px-2 md:aspect-square ${isSidebarExpanded ? "md:bg-transparent" : ""} ${
                  location.pathname === "/rank" ? "bg-light" : "hover:bg-primary-light"
                } ${location.pathname === "/rank" && isSidebarExpanded ? "md:bg-transparent hover:bg-primary-light hover:md:bg-transparent" : ""}`}
              >
                <layoutIcons.TbMedal2
                  className={`w-6 h-6 md:w-8 md:h-8 ${isSidebarExpanded ? "md:text-black" : ""} ${location.pathname === "/rank" ? "text-primary-dark" : "text-black"} ${
                    location.pathname === "/rank" && isSidebarExpanded ? "" : "md:text-black"
                  } ${location.pathname === "/rank" && !isSidebarExpanded ? "md:text-primary-dark" : ""}`}
                />
              </div>
              <p className="font-normal text-xs leading-4 text-nowrap md:text-base md:leading-6">排行</p>
            </li>
          </Link>
          <Link to="/posts" className="block">
            <li
              className={`md:py-1 md:px-2 flex flex-col items-center gap-1 ${isSidebarExpanded ? "md:rounded-full md:flex-row hover:md:bg-primary-light" : ""} ${
                location.pathname === "/posts" && isSidebarExpanded ? "md:bg-primary" : ""
              }`}
            >
              <div
                className={`flex justify-center items-center py-1 px-4 rounded-xl md:px-2 md:aspect-square ${isSidebarExpanded ? "md:bg-transparent" : ""} ${
                  location.pathname === "/posts" ? "bg-light" : "hover:bg-primary-light"
                } ${location.pathname === "/posts" && isSidebarExpanded ? "md:bg-transparent hover:bg-primary-light hover:md:bg-transparent" : ""}`}
              >
                <layoutIcons.TbMessage
                  className={`w-6 h-6 md:w-8 md:h-8 ${isSidebarExpanded ? "md:text-black" : ""} ${location.pathname === "/posts" ? "text-primary-dark" : "text-black"} ${
                    location.pathname === "/posts" && isSidebarExpanded ? "" : "md:text-black"
                  } ${location.pathname === "/posts" && !isSidebarExpanded ? "md:text-primary-dark" : ""}`}
                />
              </div>
              <p className="font-normal text-xs leading-4 text-nowrap md:text-base md:leading-6">貼文</p>
            </li>
          </Link>
          <Link to="/member" className="block">
            <li
              className={`md:py-1 md:px-2 flex flex-col items-center gap-1 ${isSidebarExpanded ? "md:rounded-full md:flex-row hover:md:bg-primary-light" : ""} ${
                location.pathname === "/member" && isSidebarExpanded ? "md:bg-primary" : ""
              }`}
            >
              <div
                className={`flex justify-center items-center py-1 px-4 rounded-xl md:px-2 md:aspect-square ${isSidebarExpanded ? "md:bg-transparent" : ""} ${
                  location.pathname === "/member" ? "bg-light" : "hover:bg-primary-light"
                } ${location.pathname === "/member" && isSidebarExpanded ? "md:bg-transparent hover:bg-primary-light hover:md:bg-transparent" : ""}`}
              >
                <layoutIcons.TbMoodSmile
                  className={`w-6 h-6 md:w-8 md:h-8 ${isSidebarExpanded ? "md:text-black" : ""} ${location.pathname === "/member" ? "text-primary-dark" : "text-black"} ${
                    location.pathname === "/member" && isSidebarExpanded ? "" : "md:text-black"
                  } ${location.pathname === "/member" && !isSidebarExpanded ? "md:text-primary-dark" : ""}`}
                />
              </div>
              <p className="font-normal text-xs leading-4 text-nowrap md:text-base md:leading-6">會員</p>
            </li>
          </Link>
        </ul>
        <Link to="/" className={`hidden md:block ${location.pathname === "/" ? "invisible" : ""}`} onClick={handleLogout}>
          <div className={`md:py-1 md:px-2 flex flex-col items-center gap-1 ${isSidebarExpanded ? "md:rounded-full md:flex-row hover:md:bg-primary-light" : ""}`}>
            <div className={`flex justify-center items-center py-1 px-4 rounded-xl md:px-2 md:aspect-square ${isSidebarExpanded ? "md:bg-transparent" : "hover:bg-primary-light"}`}>
              <generalIcons.TbLogout className={`w-6 h-6 md:w-8 md:h-8 ${isSidebarExpanded ? "md:text-black" : ""}`} />
            </div>
            <p className={`${isSidebarExpanded ? "text-base leading-6 text-nowrap" : "hidden"}`}>登出</p>
          </div>
        </Link>
      </nav>
      <div className={`max-w-[1160px] my-0 mx-auto flex flex-col md:flex-row min-h-screen relative`}>
        <div className="mt-0 mb-[86px] md:mb-0 w-full p-0 relative">{children}</div>
      </div>
      {isModalOpen && <Modal isOpen={isModalOpen}>{modalContent}</Modal>}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
  isModalOpen: PropTypes.bool.isRequired,
  modalContent: PropTypes.node,
};

export default Layout;
