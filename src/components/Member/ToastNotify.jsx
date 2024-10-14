import SuccessToast from "../Toasts/SuccessToast";
import AlertToast from "../Toasts/AlertToast";

const updateUserProfileNotify = () => SuccessToast("更新個人資料成功！");
const updateUserProfileErrorNotify = () => AlertToast("更新個人資料失敗！");

export const UpdateNotify = {
  updateUserProfileNotify,
  updateUserProfileErrorNotify,
};
