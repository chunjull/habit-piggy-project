export const initialState = {
  posts: [],
  filter: "all",
  options: [
    { label: "全部貼文", value: "all" },
    { label: "僅限自己", value: "personal" },
  ],
  commentSection: {},
  commentContent: "",
  editingComment: {},
  currentPost: null,
  postContent: "",
  postBackground: "",
  backgrounds: [],
  isHighlighted: false,
  userData: null,
  showConfirmModal: false,
  confirmAction: null,
  isLoading: false,
};

export const actionTypes = {
  SET_POST: "SET_POST",
  SET_FILTER: "SET_FILTER",
  SET_COMMENT_SECTION: "SET_COMMENT_SECTION",
  SET_COMMENT_CONTENT: "SET_COMMENT_CONTENT",
  SET_EDITING_COMMENT: "SET_EDITING_COMMENT",
  SET_CURRENT_POST: "SET_CURRENT_POST",
  SET_POST_CONTENT: "SET_POST_CONTENT",
  SET_POST_BACKGROUND: "SET_POST_BACKGROUND",
  SET_BACKGROUNDS: "SET_BACKGROUNDS",
  SET_IS_HIGHLIGHTED: "SET_IS_HIGHLIGHTED",
  SET_USER_DATA: "SET_USER_DATA",
  SET_SHOW_CONFIRM_MODAL: "SET_SHOW_CONFIRM_MODAL",
  SET_CONFIRM_ACTION: "SET_CONFIRM_ACTION",
  SET_IS_LOADING: "SET_IS_LOADING",
};

export function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_POST:
      return { ...state, posts: action.payload };
    case actionTypes.SET_FILTER:
      return { ...state, filter: action.payload };
    case actionTypes.SET_COMMENT_SECTION:
      return { ...state, commentSection: action.payload };
    case actionTypes.SET_COMMENT_CONTENT:
      return { ...state, commentContent: action.payload };
    case actionTypes.SET_EDITING_COMMENT:
      return { ...state, editingComment: action.payload };
    case actionTypes.SET_CURRENT_POST:
      return { ...state, currentPost: action.payload };
    case actionTypes.SET_POST_CONTENT:
      return { ...state, postContent: action.payload };
    case actionTypes.SET_POST_BACKGROUND:
      return { ...state, postBackground: action.payload };
    case actionTypes.SET_BACKGROUNDS:
      return { ...state, backgrounds: action.payload };
    case actionTypes.SET_IS_HIGHLIGHTED:
      return { ...state, isHighlighted: action.payload };
    case actionTypes.SET_USER_DATA:
      return { ...state, userData: action.payload };
    case actionTypes.SET_SHOW_CONFIRM_MODAL:
      return { ...state, showConfirmModal: action.payload };
    case actionTypes.SET_CONFIRM_ACTION:
      return { ...state, confirmAction: action.payload };
    case actionTypes.SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}
