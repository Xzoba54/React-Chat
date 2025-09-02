const formatTime = (value: string): string => {
  const date = new Date(value);

  const options: Intl.DateTimeFormatOptions = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Intl.DateTimeFormat("us-US", options).format(date);
};

export { formatTime };
