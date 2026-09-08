export const generateOTP = (): number =>
  Math.floor(100000 + Math.random() * 900000);
