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

const formatShortDate = (value: string): string => {
  const date = new Date(value);

  let options: Intl.DateTimeFormatOptions = {
    hour12: false,
  };

  const timeDiff = new Date().getTime() - date.getTime();
  const dayDiff = timeDiff / (1000 * 60 * 60 * 24);

  if (dayDiff < 1) {
    options = {
      ...options,
      hour: "2-digit",
      minute: "2-digit",
    };
  } else {
    options = {
      ...options,
      month: "2-digit",
      day: "2-digit",
    };
  }

  return new Intl.DateTimeFormat("us-US", options).format(date);
};

export { formatFullDate, formatShortDate };
