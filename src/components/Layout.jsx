import { Link, useLocation } from "react-router-dom";
import { layoutIcons } from "../assets/icons";
import PropTypes from "prop-types";
import Modal from "./Modal";

function Layout({ children, isModalOpen, modalContent }) {
  const location = useLocation();

  return (
    <div className="font-sans bg-light">
      <div className="max-w-[1160px] my-0 mx-auto px-4 flex flex-col md:flex-row min-h-screen relative">
        <nav className="fixed inset-x-0 bottom-0 md:w-[224px] pt-2 pb-3 px-4 md:p-4 bg-black-50 z-10 md:fixed md:top-0 md:left-0 md:h-full md:overflow-auto md:border-r md:border-primary-dark">
          <ul className="grid grid-cols-5 items-center md:grid-cols-1 md:gap-4">
            <li className={`md:p-2 md:rounded-lg hover:md:bg-primary-light ${location.pathname === "/home" ? "md:bg-primary" : ""}`}>
              <Link to="/home" className="flex flex-col gap-1 md:gap-0 items-center md:flex-row">
                <layoutIcons.TbHome2 className={`w-6 h-6 md:mr-4 ${location.pathname === "/home" ? "text-primary md:text-black-50" : ""}`} />
                <p className="text-black font-normal text-xs leading-4 md:text-base md:leading-6">主頁</p>
              </Link>
            </li>
            <li className={`md:p-2 md:rounded-lg hover:md:bg-primary-light ${location.pathname === "/savings" ? "md:bg-primary" : ""}`}>
              <Link to="/savings" className="flex flex-col items-center md:flex-row">
                <layoutIcons.TbCoin className={`w-6 h-6 md:mr-4 ${location.pathname === "/savings" ? "text-primary md:text-black-50" : ""}`} />
                <p className="text-black font-normal text-xs leading-4 md:text-base md:leading-6">存款</p>
              </Link>
            </li>
            <li className={`md:p-2 md:rounded-lg hover:md:bg-primary-light ${location.pathname === "/rank" ? "md:bg-primary" : ""}`}>
              <Link to="/rank" className="flex flex-col items-center md:flex-row">
                <layoutIcons.TbMedal2 className={`w-6 h-6 md:mr-4 ${location.pathname === "/rank" ? "text-primary md:text-black-50" : ""}`} />
                <p className="text-black font-normal text-xs leading-4 md:text-base md:leading-6">排行</p>
              </Link>
            </li>
            <li className={`md:p-2 md:rounded-lg hover:md:bg-primary-light ${location.pathname === "/posts" ? "md:bg-primary" : ""}`}>
              <Link to="/posts" className="flex flex-col items-center md:flex-row">
                <layoutIcons.TbMessage className={`w-6 h-6 md:mr-4 ${location.pathname === "/posts" ? "text-primary md:text-black-50" : ""}`} />
                <p className="text-black font-normal text-xs leading-4 md:text-base md:leading-6">貼文</p>
              </Link>
            </li>
            <li className={`md:p-2 md:rounded-lg hover:md:bg-primary-light ${location.pathname === "/member" ? "md:bg-primary" : ""}`}>
              <Link to="/member" className="flex flex-col items-center md:flex-row">
                <layoutIcons.TbMoodSmile className={`w-6 h-6 md:mr-4 ${location.pathname === "/member" ? "text-primary md:text-black-50" : ""}`} />
                <p className="text-black font-normal text-xs leading-4 md:text-base md:leading-6">會員</p>
              </Link>
            </li>
          </ul>
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
