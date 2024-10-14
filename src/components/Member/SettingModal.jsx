import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { modalIcons, settingIcons } from "../../assets/icons";
import { AuthContext } from "../../utils/AuthContext";
import { updateUserProfile, uploadAvatar, logoutUser } from "../../services/api";
import { useNavigate } from "react-router-dom";
import SwitchButton from "./SwitchButton";

const SettingModal = ({ profileData, handleSettingModal, handleSaveAndClose }) => {
  const { setIsDarkMode, user } = useContext(AuthContext);
  const [localProfileData, setLocalProfileData] = useState(profileData);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalProfileData(profileData);
  }, [profileData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: localProfileData.name || "",
      introduction: localProfileData.introduction || "",
    },
  });

  const handleLogout = async () => {
    await logoutUser();
    user(null);
    navigate("/");
  };

  const nameValue = watch("name");

  const isDarkMode = localProfileData.isDarkMode;

  const handleThemeChange = () => {
    setLocalProfileData((prevData) => ({
      ...prevData,
      isDarkMode: !prevData.isDarkMode,
    }));
    setIsDarkMode(!localProfileData.isDarkMode);
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

  const handleSave = async (data) => {
    try {
      if (localProfileData.avatarFile) {
        const avatarUrl = await uploadAvatar(user.uid, localProfileData.avatarFile);
        localProfileData.avatar = avatarUrl;
      }
      await updateUserProfile(user.uid, { ...localProfileData, ...data });
      handleSaveAndClose({ ...localProfileData, ...data });
    } catch (error) {
      console.error("更新資料失敗", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg leading-7 text-black dark:text-black-0">設定</h3>
        <modalIcons.TbX className="w-8 h-8 cursor-pointer hover:text-alert text-black dark:text-black-0" onClick={handleSettingModal} />
      </div>
      <div>
        <p className="mb-1 font-normal text-base leading-6 text-black dark:text-black-0">會員頭像</p>
        <div className="flex items-center gap-3">
          <img src={localProfileData.avatar} alt="user's avatar" className="w-12 h-12 rounded-full object-cover outline outline-primary-dark dark:outline-primary" />
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
      <div>
        <div className="relative group flex items-center mb-2">
          <label htmlFor="name" className="font-bold text-base leading-6 text-black dark:text-black-0">
            會員名稱
          </label>
          <modalIcons.TbInfoCircle className="w-4 h-4 text-black-500 dark:text-black-200 ml-2 inline-block" />
          <span className="absolute -bottom-1 left-[104px] transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:-bottom-2 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark whitespace-normal break-words">
            會員名稱可以是中文、英文、數字或符號，但不得超過 9 個字符
          </span>
        </div>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="請輸入會員名稱"
          className={`px-4 py-1 w-full rounded border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 ${
            errors.name || nameValue.length > 9 ? "mb-1" : "mb-4"
          }`}
          {...register("name", {
            required: "會員名稱是必填項目",
            maxLength: {
              value: 9,
              message: "會員名稱不得超過 9 個字符",
            },
          })}
        />
        {(errors.name || nameValue.length > 9) && <p className="text-alert dark:text-red-500 mt-1 mb-3">{errors.name ? errors.name.message : "會員名稱不得超過 9 個字符"}</p>}
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
          {...register("introduction")}
        />
      </div>
      <div className="border"></div>
      <div className="flex justify-between items-center">
        <p className="font-normal text-base leading-6 text-black dark:text-black-0">深色模式</p>
        <div className="relative w-fit text-nowrap">
          <SwitchButton isOn={isDarkMode} handleToggle={handleThemeChange} />
        </div>
      </div>
      <button type="submit" className="text-center w-full bg-primary rounded-xl font-medium text-sm leading-5 py-1 hover:bg-primary-dark">
        儲存
      </button>
      <button
        type="button"
        onClick={handleLogout}
        className="md:hidden text-center w-full bg-black-700 dark:bg-black-200 rounded-xl font-medium text-sm leading-5 py-1 text-black-0 dark:text-black hover:bg-alert hover:dark:bg-alert"
      >
        登出
      </button>
    </form>
  );
};

SettingModal.propTypes = {
  profileData: PropTypes.object.isRequired,
  handleSaveAndClose: PropTypes.func.isRequired,
  handleSettingModal: PropTypes.func.isRequired,
};

export default SettingModal;
