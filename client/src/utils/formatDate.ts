const formatDate = (value: string): string => {
  const date = new Date(value);

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  };

  return new Intl.DateTimeFormat("pl-PL", options).format(date);
};

export default formatDate;
