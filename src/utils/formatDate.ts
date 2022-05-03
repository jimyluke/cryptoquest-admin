export const formatDate = (timestampString: string) => {
  const date = new Date(timestampString);
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${String(day).padStart(2, '0')}.${String(month).padStart(
    2,
    '0'
  )}.${year} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(seconds).padStart(2, '0')}`;
};
