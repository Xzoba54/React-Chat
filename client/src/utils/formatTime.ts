const formatTime = (value: number) => {
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};
export default formatTime;
