import AlertToast from "../Toasts/AlertToast";
import SuccessToast from "../Toasts/SuccessToast";

const addPostNotify = () => SuccessToast("今天也是快樂的貓咪日");
const updatePostNotify = () => SuccessToast("已更新貼文！");
const deletePostNotify = () => SuccessToast("已刪除貼文！");
const addCommentNotify = () => SuccessToast("已新增留言！");
const updateCommentNotify = () => SuccessToast("已更新留言！");
const deleteCommentNotify = () => SuccessToast("已刪除留言！");
const contentAlertNotify = () => AlertToast("沒有內容不能發布喔！");
const authorAlertNotify = () => AlertToast("你沒有權限執行這個行為！");

export const SuccessNotify = {
  addPostNotify,
  updatePostNotify,
  deletePostNotify,
  addCommentNotify,
  updateCommentNotify,
  deleteCommentNotify,
};

export const AlertNotify = {
  contentAlertNotify,
  authorAlertNotify,
};
