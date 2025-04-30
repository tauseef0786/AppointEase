// Format date to display in a readable format (e.g., "October 15, 2023")
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

// Format date to day of week (e.g., "Monday")
export function formatDayOfWeek(date) {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
}

// Format date to short day of week (e.g., "Mon")
export function formatShortDayOfWeek(date) {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
}

// Format date to month and year (e.g., "October 2023")
export function formatMonthYear(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

// Format time (e.g., "14:30" to "2:30 PM")
export function formatTime(time) {
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Generate array of dates for a week given a starting date
export function getWeekDates(startDate) {
  const start = new Date(startDate);
  const dates = [];
  
  // Reset to start of the week (Monday)
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  start.setDate(diff);
  
  // Generate 7 days (Monday to Sunday)
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  
  return dates;
}

// Get all dates in a month
export function getDatesInMonth(year, month) {
  const dates = [];
  const date = new Date(year, month, 1);
  
  // Get dates from previous month to fill the first week
  const firstDay = date.getDay();
  const prevMonthDates = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start
  
  if (prevMonthDates > 0) {
    const prevMonth = new Date(year, month, 0); // Last day of previous month
    for (let i = prevMonthDates - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonth.getDate() - i);
      dates.push({ date: prevDate, isCurrentMonth: false });
    }
  }
  
  // Get dates in current month
  while (date.getMonth() === month) {
    dates.push({ date: new Date(date), isCurrentMonth: true });
    date.setDate(date.getDate() + 1);
  }
  
  // Get dates from next month to fill the last week
  const lastDay = dates[dates.length - 1].date.getDay();
  const nextMonthDates = lastDay === 0 ? 0 : 7 - lastDay;
  
  for (let i = 1; i <= nextMonthDates; i++) {
    const nextDate = new Date(year, month + 1, i);
    dates.push({ date: nextDate, isCurrentMonth: false });
  }
  
  return dates;
}

// Check if two dates are the same day
export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// Generate time slots in 30-minute intervals for a day (8:00 AM to 5:00 PM)
export function generateTimeSlots() {
  const slots = [];
  const startHour = 8;
  const endHour = 17; // 5 PM
  
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < endHour) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  
  return slots;
}

// Get week range string, e.g., "October 10 - October 16"
export function getWeekRangeString(weekDates) {
  if (!weekDates || weekDates.length === 0) return '';
  
  const startDate = weekDates[0];
  const endDate = weekDates[weekDates.length - 1];
  
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' });
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' });
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }
}