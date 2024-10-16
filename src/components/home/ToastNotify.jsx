import AlertToast from "../Toasts/AlertToast";
import SuccessToast from "../Toasts/SuccessToast";

const addHabitNotify = () => SuccessToast("從今天開始培養習慣吧！");
const updateHabitNotify = () => SuccessToast("人要時時刻刻做好準備！");
const deleteHabitNotify = () => SuccessToast("這段感情只有我在付出🥲");
const checkHabitNotify = () => SuccessToast("給你一個乖寶寶印章");
const unCheckHabitNotify = () => SuccessToast("要記得回來完成喔！");
const dateErrorNotify = () => AlertToast("結束日期必須晚於開始日期喔！");
const checkErrorNotify = () => AlertToast("只能在今天之前打卡喔！");
const habitTitleErrorNotify = () => AlertToast("習慣名稱不能為空或僅包含空格！");
const addHabitErrorNotify = () => AlertToast("沒有完整填寫資料的話，沒辦法送出喔！");

export const SuccessNotify = {
  addHabitNotify,
  updateHabitNotify,
  deleteHabitNotify,
  checkHabitNotify,
  unCheckHabitNotify,
};

export const AlertNotify = {
  dateErrorNotify,
  checkErrorNotify,
  habitTitleErrorNotify,
  addHabitErrorNotify,
};
