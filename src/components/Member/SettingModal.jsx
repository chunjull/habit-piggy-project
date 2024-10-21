import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { modalIcons, settingIcons } from "../../assets/icons";
import {
  logoutUser,
  updateUserProfile,
  uploadAvatar,
} from "../../services/api";
import { AuthContext } from "../../utils/AuthContext";
import SwitchButton from "./SwitchButton";

const SettingModal = ({
  profileData,
  handleSettingModal,
  handleSaveAndClose,
}) => {
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
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
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
        const avatarUrl = await uploadAvatar(
          user.uid,
          localProfileData.avatarFile,
        );
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold leading-7 text-black dark:text-black-0">
          設定
        </h3>
        <modalIcons.TbX
          className="h-8 w-8 cursor-pointer text-black hover:text-alert dark:text-black-0"
          onClick={handleSettingModal}
        />
      </div>
      <div>
        <p className="mb-1 text-base font-normal leading-6 text-black dark:text-black-0">
          會員頭像
        </p>
        <div className="flex items-center gap-3">
          <img
            src={localProfileData.avatar}
            alt="user's avatar"
            className="h-12 w-12 rounded-full object-cover outline outline-primary-dark dark:outline-primary"
          />
          <div className="space-y-1">
            <div className="relative inline-block">
              <input
                type="file"
                name="avatar"
                id="profile"
                onChange={handleLocalChange}
                accept="image/jpg,image/jpeg,image/png,image/gif"
                className="absolute inset-0 hidden h-full w-full cursor-pointer opacity-0"
              />
              <label
                htmlFor="profile"
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-2 py-1 text-sm font-medium leading-5 text-black hover:bg-primary-dark"
              >
                <settingIcons.TbPhoto className="h-5 w-5" />
                更換頭像
              </label>
            </div>
            <p className="text-sm font-normal leading-5 text-black dark:text-black-0">
              您的頭像將會被公開。
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="group relative mb-2 flex items-center">
          <label
            htmlFor="name"
            className="text-base font-bold leading-6 text-black dark:text-black-0"
          >
            會員名稱
          </label>
          <modalIcons.TbInfoCircle className="ml-2 inline-block h-4 w-4 text-black-500 dark:text-black-200" />
          <span className="pointer-events-none absolute -bottom-1 left-[104px] z-50 w-fit -translate-x-0 transform whitespace-normal break-words rounded bg-primary-dark p-2 text-sm text-white opacity-0 transition-opacity before:absolute before:-bottom-2 before:-left-4 before:-translate-y-full before:transform before:border-8 before:border-transparent before:border-r-primary-dark before:content-[''] group-hover:pointer-events-auto group-hover:opacity-100">
            會員名稱可以是中文、英文、數字或符號，但不得超過 9 個字符
          </span>
        </div>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="請輸入會員名稱"
          className={`w-full rounded border border-black-300 px-4 py-1 text-base font-normal leading-6 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark ${
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
        {(errors.name || nameValue.length > 9) && (
          <p className="mb-3 mt-1 text-alert dark:text-red-500">
            {errors.name ? errors.name.message : "會員名稱不得超過 9 個字符"}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="introduction"
          className="mb-1 text-base font-normal leading-6 text-black dark:text-black-0"
        >
          自我介紹
        </label>
        <input
          type="text"
          name="introduction"
          id="introduction"
          placeholder="自我介紹"
          className="w-full rounded border border-black-300 px-4 py-1 text-base font-normal leading-6 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark"
          {...register("introduction")}
        />
      </div>
      <div className="border"></div>
      <div className="flex items-center justify-between">
        <p className="text-base font-normal leading-6 text-black dark:text-black-0">
          深色模式
        </p>
        <div className="relative w-fit text-nowrap">
          <SwitchButton isOn={isDarkMode} handleToggle={handleThemeChange} />
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-primary py-1 text-center text-sm font-medium leading-5 hover:bg-primary-dark"
      >
        儲存
      </button>
      <button
        type="button"
        onClick={handleLogout}
        className="w-full rounded-xl bg-black-700 py-1 text-center text-sm font-medium leading-5 text-black-0 hover:bg-alert dark:bg-black-200 dark:text-black hover:dark:bg-alert md:hidden"
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
