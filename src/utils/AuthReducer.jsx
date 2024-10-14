export const initialState = {
  isLogin: true,
  isLoggedIn: false,
  isLoading: false,
  loginError: "",
};

export const actionTypes = {
  SET_IS_LOGIN: "SET_IS_LOGIN",
  SET_IS_LOGGED_IN: "SET_IS_LOGGED_IN",
  SET_IS_LOADING: "SET_IS_LOADING",
  SET_LOGIN_ERROR: "SET_LOGIN_ERROR",
};

export function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_IS_LOGIN:
      return { ...state, isLogin: action.payload };
    case actionTypes.SET_IS_LOGGED_IN:
      return { ...state, isLoggedIn: action.payload };
    case actionTypes.SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    case actionTypes.SET_LOGIN_ERROR:
      return { ...state, loginError: action.payload };
    default:
      return state;
  }
}
