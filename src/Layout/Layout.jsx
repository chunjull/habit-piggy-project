import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { logoutUser } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import Sidebar from "./Sidebar";

function Layout({ children, isModalOpen, modalContent }) {
  const navigate = useNavigate();
  const { setUser, isDarkMode } = useContext(AuthContext);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleResize = () => {
    if (window.innerWidth >= 1720) {
      setIsSidebarExpanded(true);
    } else {
      setIsSidebarExpanded(false);
    }
  };

  const toggleSidebarInSmallScreen = () => {
    if (window.innerWidth < 1720 && isSidebarExpanded) {
      setIsSidebarExpanded(!isSidebarExpanded);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`relative min-h-screen bg-light font-huninn dark:bg-black-950 ${isDarkMode ? "dark" : ""}`}
    >
      <div className="flex flex-col-reverse md:flex-row">
        <Sidebar
          isSidebarExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
          toggleSidebarInSmallScreen={toggleSidebarInSmallScreen}
          handleLogout={handleLogout}
        />
        <div
          className={`relative mx-auto my-0 flex min-h-screen w-full flex-col md:max-w-screen-lg md:flex-row md:px-4 xl:max-w-[1160px] ${
            isSidebarExpanded && window.innerWidth < 1536 ? "blur-sm" : ""
          }`}
        >
          <div className="relative mb-[86px] mt-0 w-full p-0 md:mb-0">
            {children}
          </div>
        </div>
      </div>
      {isModalOpen && <Modal isOpen={isModalOpen}>{modalContent}</Modal>}
      <Toaster />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
  isModalOpen: PropTypes.bool,
  modalContent: PropTypes.node,
};

export default Layout;
