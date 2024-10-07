import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { modalIcons, settingIcons } from "../assets/icons";
import CustomSelect from "./CustomSelect";
import { AuthContext } from "../utils/AuthContext";
import { updateUserProfile, uploadAvatar } from "../services/api";

const SettingModal = ({ profileData, handleSettingModal, handleSaveAndClose }) => {
  const { setIsDarkMode, user } = useContext(AuthContext);
  const [localProfileData, setLocalProfileData] = useState(profileData);

  useEffect(() => {
    setLocalProfileData(profileData);
  }, [profileData]);

  const isDarkMode = localProfileData.isDarkMode ? "true" : "false";
  const isAcceptReminder = localProfileData.isAcceptReminder ? "true" : "false";

  const themeOptions = [
    { value: "false", label: "淺色" },
    { value: "true", label: "深色" },
  ];

  const reminderOptions = [
    { value: "false", label: "否" },
    { value: "true", label: "是" },
  ];

  const handleThemeChange = (value) => {
    setLocalProfileData((prevData) => ({
      ...prevData,
      isDarkMode: value === "true",
    }));
    setIsDarkMode(value === "true");
  };

  const handleLocalChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!file) return;
      if (!allowedTypes.includes(file.type)) return;
      setLocalProfileData((prevData) => ({
        ...prevData,
        avatar: URL.createObjectURL(file),
        avatarFile: file,
      }));
    } else {
      setLocalProfileData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      if (localProfileData.avatarFile) {
        const avatarUrl = await uploadAvatar(user.uid, localProfileData.avatarFile);
        localProfileData.avatar = avatarUrl;
      }
      await updateUserProfile(user.uid, localProfileData);
      handleSaveAndClose(localProfileData);
    } catch (error) {
      console.error("更新資料失敗", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg leading-7 text-black dark:text-black-0">設定</h3>
        <modalIcons.TbX className="w-8 h-8 cursor-pointer hover:text-alert text-black dark:text-black-0" onClick={handleSettingModal} />
      </div>
      <div>
        <p className="mb-1 font-normal text-base leading-6 text-black dark:text-black-0">會員頭像</p>
        <div className="flex items-center gap-3">
          <img src={localProfileData.avatar} alt="user's avatar" className="w-12 h-12 rounded-full outline outline-primary-dark dark:outline-primary" />
          <div className="space-y-1">
            <div className="relative inline-block">
              <input
                type="file"
                name="avatar"
                id="profile"
                onChange={handleLocalChange}
                accept="image/jpg,image/jpeg,image/png,image/gif"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden"
              />
              <label htmlFor="profile" className="cursor-pointer bg-primary text-black font-medium text-sm leading-5 py-1 px-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark">
                <settingIcons.TbPhoto className="w-5 h-5" />
                更換頭像
              </label>
            </div>
            <p className="font-normal text-sm leading-5 text-black dark:text-black-0">您的頭像將會被公開。</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="mb-1 font-normal text-base leading-6 text-black dark:text-black-0">
          會員名稱
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="會員名稱"
          className="px-4 py-1 w-full rounded border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6"
          value={localProfileData.name || ""}
          onChange={handleLocalChange}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="introduction" className="mb-1 font-normal text-base leading-6 text-black dark:text-black-0">
          自我介紹
        </label>
        <input
          type="text"
          name="introduction"
          id="introduction"
          placeholder="自我介紹"
          className="px-4 py-1 w-full rounded border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6"
          value={localProfileData.introduction || ""}
          onChange={handleLocalChange}
        />
      </div>
      <div className="border"></div>
      <div className="flex justify-between items-center">
        <p className="font-normal text-base leading-6 text-black dark:text-black-0">主題色彩</p>
        <div className="relative w-fit text-nowrap">
          <CustomSelect options={themeOptions} value={isDarkMode} onChange={handleThemeChange} />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="font-normal text-base leading-6 text-black dark:text-black-0">接收 Email 提醒</p>
        <div className="relative w-fit">
          <CustomSelect options={reminderOptions} value={isAcceptReminder} onChange={(value) => setLocalProfileData((prevData) => ({ ...prevData, isAcceptReminder: value === "true" }))} />
        </div>
      </div>
      <button className="text-center w-full bg-primary rounded-xl font-medium text-sm leading-5 py-1 hover:bg-primary-dark" onClick={handleSave}>
        儲存
      </button>
    </div>
  );
};

SettingModal.propTypes = {
  profileData: PropTypes.object.isRequired,
  handleSaveAndClose: PropTypes.func.isRequired,
  handleSettingModal: PropTypes.func.isRequired,
};

export default SettingModal;
