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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1536) {
        setIsSidebarExpanded(true);
      } else {
        setIsSidebarExpanded(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="font-sans bg-light">
      <nav className="pt-2 pb-3 px-4 bg-black-50 fixed inset-x-0 bottom-0 flex gap-x-4 z-50 border-t border-primary md:w-[360px]">
        <div className="hidden">
          <p className="">Habit Piggy</p>
          <generalIcons.TbLayoutSidebarRight className="w-6 h-6" onClick={toggleSidebar} />
        </div>
        <ul className="grid grid-cols-5 items-center w-full">
          <Link to="/home" className="block">
            <li className="rounded-full">
              <div className="flex flex-col items-center gap-1">
                <div className={`flex justify-center py-1 px-4 rounded-xl ${location.pathname === "/home" ? "bg-light" : "hover:bg-primary-light"}`}>
                  <layoutIcons.TbHome2 className={`w-6 h-6 ${location.pathname === "/home" ? "text-primary-dark" : "text-black"}`} />
                </div>
                <p className="font-normal text-xs leading-4">主頁</p>
              </div>
            </li>
          </Link>
          <Link to="/savings" className="block">
            <li className="rounded-full">
              <div className="flex flex-col items-center gap-1">
                <div className={`flex justify-center py-1 px-4 rounded-xl ${location.pathname === "/savings" ? "bg-light" : "hover:bg-primary-light"}`}>
                  <layoutIcons.TbCoin className={`w-6 h-6 ${location.pathname === "/savings" ? "text-primary-dark" : "text-black"}`} />
                </div>
                <p className="font-normal text-xs leading-4">主頁</p>
              </div>
            </li>
          </Link>
          <Link to="/rank" className="block">
            <li className="rounded-full">
              <div className="flex flex-col items-center gap-1">
                <div className={`flex justify-center py-1 px-4 rounded-xl ${location.pathname === "/rank" ? "bg-light" : "hover:bg-primary-light"}`}>
                  <layoutIcons.TbMedal2 className={`w-6 h-6 ${location.pathname === "/rank" ? "text-primary-dark" : "text-black"}`} />
                </div>
                <p className="font-normal text-xs leading-4">主頁</p>
              </div>
            </li>
          </Link>
          <Link to="/posts" className="block">
            <li className="rounded-full">
              <div className="flex flex-col items-center gap-1">
                <div className={`flex justify-center py-1 px-4 rounded-xl ${location.pathname === "/posts" ? "bg-light" : "hover:bg-primary-light"}`}>
                  <layoutIcons.TbMessage className={`w-6 h-6 ${location.pathname === "/posts" ? "text-primary-dark" : "text-black"}`} />
                </div>
                <p className="font-normal text-xs leading-4">主頁</p>
              </div>
            </li>
          </Link>
          <Link to="/member" className="block">
            <li className="rounded-full">
              <div className="flex flex-col items-center gap-1">
                <div className={`flex justify-center py-1 px-4 rounded-xl ${location.pathname === "/member" ? "bg-light" : "hover:bg-primary-light"}`}>
                  <layoutIcons.TbMoodSmile className={`w-6 h-6 ${location.pathname === "/member" ? "text-primary-dark" : "text-black"}`} />
                </div>
                <p className="font-normal text-xs leading-4">主頁</p>
              </div>
            </li>
          </Link>
        </ul>
        <button className="hidden" onClick={handleLogout}>
          <generalIcons.TbLogout className="w-6 h-6" />
        </button>
      </nav>
      <div className={`max-w-[1160px] my-0 mx-auto flex flex-col md:flex-row min-h-screen relative`}>
        <div className="mt-0 mb-[86px] md:mb-0 w-full p-0 relative">
          {children}
          <Modal isOpen={isModalOpen}>{modalContent}</Modal>
        </div>
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
  isModalOpen: PropTypes.bool.isRequired,
  modalContent: PropTypes.node,
};

export default Layout;
