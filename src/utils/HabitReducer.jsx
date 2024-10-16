export const initialState = {
  // home
  habitData: {
    category: null,
    title: "",
    frequency: { type: "" },
    amount: 0,
    startDate: "",
    endDate: "",
    status: [],
    type: "",
  },
  selectedDate: {
    year: null,
    month: null,
    day: null,
  },
  showMonthCalendar: false,
  selectedHabit: null,
  uncompletedFine: 0,
  monthCalendarDate: null,
  habits: [],
  weekDates: [],
  isLoading: false,
};

export const actionTypes = {
  SET_HABIT_DATA: "SET_HABIT_DATA",
  SET_SELECTED_DATE: "SET_SELECTED_DATE",
  SET_SHOW_MONTH_CALENDAR: "SET_SHOW_MONTH_CALENDAR",
  SET_SELECTED_HABIT: "SET_SELECTED_HABIT",
  SET_UNCOMPLETED_FINE: "SET_UNCOMPLETED_FINE",
  SET_MONTH_CALENDAR_DATE: "SET_MONTH_CALENDAR_DATE",
  SET_HABITS: "SET_HABITS",
  SET_WEEK_DATES: "SET_WEEK_DATES",
  SET_IS_LOADING: "SET_IS_LOADING",
};

export function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_HABIT_DATA:
      return { ...state, habitData: action.payload };
    case actionTypes.SET_SELECTED_DATE:
      return { ...state, selectedDate: action.payload };
    case actionTypes.SET_SHOW_MONTH_CALENDAR:
      return { ...state, showMonthCalendar: action.payload };
    case actionTypes.SET_SELECTED_HABIT:
      return { ...state, selectedHabit: action.payload };
    case actionTypes.SET_UNCOMPLETED_FINE:
      return { ...state, uncompletedFine: action.payload };
    case actionTypes.SET_MONTH_CALENDAR_DATE:
      return { ...state, monthCalendarDate: action.payload };
    case actionTypes.SET_HABITS:
      return { ...state, habits: action.payload };
    case actionTypes.SET_WEEK_DATES:
      return { ...state, weekDates: action.payload };
    case actionTypes.SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}
