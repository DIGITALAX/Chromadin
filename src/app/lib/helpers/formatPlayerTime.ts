export const formatPlayerTime = (seconds: number) => {
  if (seconds <= 0 || !seconds) {
    return "00:00:00:00";
  }

  let hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  let milliseconds = Math.floor((seconds % 1) * 100);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}:${milliseconds
    .toString()
    .padStart(2, "0")}`;
};
