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

const sameDay = (date: Date): boolean => {
  const now = new Date();

  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
};

const getDayDiff = (date: Date): number => {
  const now = new Date();
  const timeDiff = now.getTime() - date.getTime();

  return timeDiff / (1000 * 60 * 60 * 24);
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
