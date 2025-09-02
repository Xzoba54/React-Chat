const formatFullDate = (value: string): string => {
  const date = new Date(value);

  const options: Intl.DateTimeFormatOptions = {
    hour12: false,
    year: "numeric",
    month: "long",
    day: "2-digit",
  };

  return new Intl.DateTimeFormat("us-US", options).format(date);
};

export const sameDay = (date: Date): boolean => {
  const now = new Date();

  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
};

export const onTheSameDay = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDay() === d2.getDay();
};

const getDayDiff = (date: Date): number => {
  const now = new Date();
  const timeDiff = now.getTime() - date.getTime();

  return timeDiff / (1000 * 60 * 60 * 24);
};

export const getMinutes = (date: string): number => {
  return new Date(date).getTime() / (1000 * 60);
};

const formatShortDate = (value: string, strict: boolean = false): string => {
  const date = new Date(value);

  let options: Intl.DateTimeFormatOptions = {
    hour12: false,
  };

  if (sameDay(date)) {
    options = {
      ...options,
      hour: "2-digit",
      minute: "2-digit",
    };
  } else if (getDayDiff(date) < 2) {
    options = {
      ...options,
      hour: "2-digit",
      minute: "2-digit",
    };
    if (strict) return "Yesterday " + Intl.DateTimeFormat("us-US", options).format(date);

    return "Yesterday";
  } else {
    options = {
      ...options,
      day: "2-digit",
      month: "2-digit",
    };
  }

  return new Intl.DateTimeFormat("us-US", options).format(date);
};

export { formatFullDate, formatShortDate };
