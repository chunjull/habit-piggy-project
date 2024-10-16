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
};

export const actionTypes = {
  SET_HABITS: "SET_HABITS",
  SET_SELECTED_DATE: "SET_SELECTED_DATE",
  SET_SELECTED_HABIT: "SET_SELECTED_HABIT",
  SET_WEEK_DATES: "SET_WEEK_DATES",
  SET_UNCOMPLETED_FINE: "SET_UNCOMPLETED_FINE",
  SET_MONTH_CALENDAR_DATE: "SET_MONTH_CALENDAR_DATE",
  SET_IS_LOADING: "SET_IS_LOADING",
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
    default:
      return state;
  }
}
