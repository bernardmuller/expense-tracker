const coerceUnknown = (value: unknown): unknown => {
  if (typeof value !== "string") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  const num = Number(value);
  if (!isNaN(num) && value !== "") return num;
  return value;
};

export default coerceUnknown;
