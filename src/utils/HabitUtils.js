export const generateStatusArray = (startDate, endDate, frequency) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const statusArray = [];

  if (frequency.type === "daily") {
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      statusArray.push({ date: new Date(d).toDateString(), completed: false });
    }
  } else if (frequency.type === "weekly") {
    const selectedDay = frequency.day;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === selectedDay) {
        statusArray.push({ date: new Date(d).toDateString(), completed: false });
      }
    }
  } else if (frequency.type === "specificDays") {
    const days = Object.values(frequency.days);
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      if (days.includes(d.getDay())) {
        statusArray.push({ date: new Date(d).toDateString(), completed: false });
      }
    }
  }

  return statusArray;
};

export const calculateUncompletedFine = (habit) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const uncompletedCount = habit.status.filter((status) => {
    const statusDate = new Date(status.date);
    statusDate.setHours(0, 0, 0, 0);
    return statusDate < today && !status.completed;
  }).length;
  return uncompletedCount * habit.amount;
};
