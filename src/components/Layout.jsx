import { Link, useLocation, useNavigate } from "react-router-dom";
import { layoutIcons, generalIcons } from "../assets/icons";
import PropTypes from "prop-types";
import Modal from "./Modal";
import { useContext } from "react";
import { logoutUser } from "../services/api";
import { AuthContext } from "../utils/AuthContext";

function Layout({ children, isModalOpen, modalContent }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    alert("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="font-sans bg-light">
      <div className="max-w-[1160px] my-0 mx-auto flex flex-col md:flex-row min-h-screen relative">
        <nav className="fixed inset-x-0 bottom-0 md:w-20 2xl:w-[360px] pt-2 pb-3 px-4 md:p-4 bg-black-50 z-10 md:fixed md:top-0 md:left-0 md:h-full md:overflow-auto md:flex md:flex-col md:justify-between md:items-center md:space-y-4 2xl:justify-start 2xl:items-start">
          <div className="flex justify-center w-full 2xl:justify-between items-center 2xl:py-4">
            <p className="hidden 2xl:block font-normal text-2xl leading-8 font-lobster text-black pl-4">Habit Piggy</p>
            <generalIcons.TbLayoutSidebarRight className="hidden md:block w-8 h-8 text-black hover:text-alert cursor-pointer mt-4 2xl:m-0" />
          </div>
          <div className="md:flex md:flex-col md:justify-between w-full md:h-4/5 2xl:h-full">
            <ul className="grid grid-cols-5 items-center md:grid-cols-1 md:gap-4 w-full">
              <Link to="/home" className="block">
                <li className={`2xl:py-2 2xl:px-4 2xl:rounded-full hover:2xl:bg-primary-light cursor-pointer ${location.pathname === "/home" ? "2xl:bg-primary" : ""}`}>
                  <div className="flex flex-col gap-1 2xl:gap-0 items-center 2xl:flex-row">
                    <div className={`flex justify-center py-1 hover:bg-primary-light rounded-2xl w-3/5 md:w-full 2xl:w-fit ${location.pathname === "/home" ? "bg-light 2xl:bg-transparent" : ""}`}>
                      <layoutIcons.TbHome2 className={`w-6 h-6 md:w-8 md:h-8 2xl:mr-4 ${location.pathname === "/home" ? "text-primary-dark 2xl:text-black-50" : ""}`} />
                    </div>
                    <p className="text-black font-normal text-xs leading-4 md:text-sm  md:leading-5 2xl:text-base 2xl:leading-6">主頁</p>
                  </div>
                </li>
              </Link>
              <Link to="/savings" className="block">
                <li className={`2xl:py-2 2xl:px-4 2xl:rounded-full hover:2xl:bg-primary-light cursor-pointer ${location.pathname === "/savings" ? "2xl:bg-primary" : ""}`}>
                  <div className="flex flex-col gap-1 2xl:gap-0 items-center 2xl:flex-row">
                    <div className={`flex justify-center py-1 hover:bg-primary-light rounded-2xl w-3/5 md:w-full 2xl:w-fit ${location.pathname === "/savings" ? "bg-light 2xl:bg-transparent" : ""}`}>
                      <layoutIcons.TbCoin className={`w-6 h-6 md:w-8 md:h-8 2xl:mr-4 ${location.pathname === "/savings" ? "text-primary-dark 2xl:text-black-50" : ""}`} />
                    </div>
                    <p className="text-black font-normal text-xs leading-4 md:text-sm md:leading-5 2xl:text-base 2xl:leading-6">存款</p>
                  </div>
                </li>
              </Link>
              <Link to="/rank" className="block">
                <li className={`2xl:py-2 2xl:px-4 2xl:rounded-full hover:2xl:bg-primary-light cursor-pointer ${location.pathname === "/rank" ? "2xl:bg-primary" : ""}`}>
                  <div className="flex flex-col gap-1 2xl:gap-0 items-center 2xl:flex-row">
                    <div className={`flex justify-center py-1 hover:bg-primary-light rounded-2xl w-3/5 md:w-full 2xl:w-fit ${location.pathname === "/rank" ? "bg-light 2xl:bg-transparent" : ""}`}>
                      <layoutIcons.TbMedal2 className={`w-6 h-6 md:w-8 md:h-8 2xl:mr-4 ${location.pathname === "/rank" ? "text-primary-dark 2xl:text-black-50" : ""}`} />
                    </div>
                    <p className="text-black font-normal text-xs leading-4 md:text-sm md:leading-5 2xl:text-base 2xl:leading-6">排行</p>
                  </div>
                </li>
              </Link>
              <Link to="/posts" className="block">
                <li className={`2xl:py-2 2xl:px-4 2xl:rounded-full hover:2xl:bg-primary-light cursor-pointer ${location.pathname === "/posts" ? "2xl:bg-primary" : ""}`}>
                  <div className="flex flex-col gap-1 2xl:gap-0 items-center 2xl:flex-row">
                    <div className={`flex justify-center py-1 hover:bg-primary-light rounded-2xl w-3/5 md:w-full 2xl:w-fit ${location.pathname === "/posts" ? "bg-light 2xl:bg-transparent" : ""}`}>
                      <layoutIcons.TbMessage className={`w-6 h-6 md:w-8 md:h-8 2xl:mr-4 ${location.pathname === "/posts" ? "text-primary-dark 2xl:text-black-50" : ""}`} />
                    </div>
                    <p className="text-black font-normal text-xs leading-4 md:text-sm  md:leading-5 2xl:text-base 2xl:leading-6">貼文</p>
                  </div>
                </li>
              </Link>
              <Link to="/member" className="block">
                <li className={`2xl:py-2 2xl:px-4 2xl:rounded-full hover:2xl:bg-primary-light cursor-pointer ${location.pathname === "/member" ? "2xl:bg-primary" : ""}`}>
                  <div className="flex flex-col gap-1 2xl:gap-0 items-center 2xl:flex-row">
                    <div className={`flex justify-center py-1 hover:bg-primary-light rounded-2xl w-3/5 md:w-full 2xl:w-fit ${location.pathname === "/member" ? "bg-light 2xl:bg-transparent" : ""}`}>
                      <layoutIcons.TbMoodSmile className={`w-6 h-6 md:w-8 md:h-8 2xl:mr-4 ${location.pathname === "/member" ? "text-primary-dark 2xl:text-black-50" : ""}`} />
                    </div>
                    <p className="text-black font-normal text-xs leading-4 md:text-sm  md:leading-5 2xl:text-base 2xl:leading-6">會員</p>
                  </div>
                </li>
              </Link>
            </ul>
            <button onClick={handleLogout} className="hidden md:block w-full mt-auto 2xl:mt-auto pb-8">
              <div className="2xl:py-2 2xl:px-4 2xl:rounded-full hover:2xl:bg-primary-light cursor-pointer">
                <div className="flex flex-col gap-1 2xl:gap-0 items-center 2xl:flex-row">
                  <div className="flex justify-center py-1 hover:bg-primary-light rounded-2xl w-3/5 md:w-full 2xl:w-fit">
                    <generalIcons.TbLogout className="w-6 h-6 md:w-8 md:h-8 2xl:mr-4" />
                  </div>
                  <p className="text-black font-normal text-xs leading-4 md:text-sm md:leading-5 2xl:text-base 2xl:leading-6">登出</p>
                </div>
              </div>
            </button>
          </div>
        </nav>
        <div className="mt-0 mb-[86px] md:mb-0 md:ml-20 w-full p-0 relative">
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
