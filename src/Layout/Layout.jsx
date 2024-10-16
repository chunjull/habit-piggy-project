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
    <div className={`font-huninn bg-light dark:bg-black-950 relative min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex flex-col-reverse md:flex-row">
        <Sidebar isSidebarExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} toggleSidebarInSmallScreen={toggleSidebarInSmallScreen} handleLogout={handleLogout} />
        <div
          className={`w-full md:max-w-screen-lg xl:max-w-[1160px] md:px-4 my-0 mx-auto flex flex-col md:flex-row min-h-screen relative ${
            isSidebarExpanded && window.innerWidth < 1536 ? "blur-sm" : ""
          }`}
        >
          <div className="mt-0 mb-[86px] md:mb-0 w-full p-0 relative">{children}</div>
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
