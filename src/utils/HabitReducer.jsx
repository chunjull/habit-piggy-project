export const initialState = {
  habits: [],
  selectedDate: {
    year: null,
    month: null,
    day: null,
  },
  selectedHabit: null,
  weekDates: [],
  uncompletedFine: 0,
  monthCalendarDate: null,
  isLoading: false,
  completedCount: 0,
  savingsCount: 0,
  totalSavings: 0,
  chartData: [],
  categoryData: {},
  typeData: {},
  profileData: {
    uid: "",
    email: "",
    name: "",
    introduction: "",
    avatar: "",
    levelPoints: 0,
    isAcceptReminder: false,
    isDarkMode: false,
    achievements: [],
    badges: [],
    habits: [],
  },
  achievements: [],
  userAchievements: [],
  badges: [],
  userBadges: [],
};

export const actionTypes = {
  SET_HABITS: "SET_HABITS",
  SET_SELECTED_DATE: "SET_SELECTED_DATE",
  SET_SELECTED_HABIT: "SET_SELECTED_HABIT",
  SET_WEEK_DATES: "SET_WEEK_DATES",
  SET_UNCOMPLETED_FINE: "SET_UNCOMPLETED_FINE",
  SET_MONTH_CALENDAR_DATE: "SET_MONTH_CALENDAR_DATE",
  SET_IS_LOADING: "SET_IS_LOADING",
  SET_COMPLETED_COUNT: "SET_COMPLETED_COUNT",
  SET_SAVINGS_COUNT: "SAVINGS_COUNT",
  SET_TOTAL_SAVINGS: "SET_TOTAL_SAVINGS",
  SET_CHART_DATA: "SET_CHART_DATA",
  SET_CATEGORY_DATA: "SET_CATEGORY_DATA",
  SET_TYPE_DATA: "SET_TYPE_DATA",
  SET_PROFILE_DATA: "SET_PROFILE_DATA",
  SET_ACHIEVEMENTS: "SET_ACHIEVEMENTS",
  SET_USER_ACHIEVEMENTS: "SET_USER_ACHIEVEMENTS",
  SET_BADGES: "SET_BADGES",
  SET_USER_BADGES: "SET_USER_BADGES",
};

export function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_HABITS:
      return { ...state, habits: action.payload };
    case actionTypes.SET_SELECTED_DATE:
      return { ...state, selectedDate: action.payload };
    case actionTypes.SET_SELECTED_HABIT:
      return { ...state, selectedHabit: action.payload };
    case actionTypes.SET_WEEK_DATES:
      return { ...state, weekDates: action.payload };
    case actionTypes.SET_UNCOMPLETED_FINE:
      return { ...state, uncompletedFine: action.payload };
    case actionTypes.SET_MONTH_CALENDAR_DATE:
      return { ...state, monthCalendarDate: action.payload };
    case actionTypes.SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    case actionTypes.SET_COMPLETED_COUNT:
      return { ...state, completedCount: action.payload };
    case actionTypes.SET_SAVINGS_COUNT:
      return { ...state, savingsCount: action.payload };
    case actionTypes.SET_TOTAL_SAVINGS:
      return { ...state, totalSavings: action.payload };
    case actionTypes.SET_CHART_DATA:
      return { ...state, chartData: action.payload };
    case actionTypes.SET_CATEGORY_DATA:
      return { ...state, categoryData: action.payload };
    case actionTypes.SET_TYPE_DATA:
      return { ...state, typeData: action.payload };
    case actionTypes.SET_PROFILE_DATA:
      return { ...state, profileData: action.payload };
    case actionTypes.SET_ACHIEVEMENTS:
      return { ...state, achievements: action.payload };
    case actionTypes.SET_USER_ACHIEVEMENTS:
      return { ...state, userAchievements: action.payload };
    case actionTypes.SET_BADGES:
      return { ...state, badges: action.payload };
    case actionTypes.SET_USER_BADGES:
      return { ...state, userBadges: action.payload };
    default:
      return state;
  }
}
