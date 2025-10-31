export const validatePasswordLength = (password: string) => {
  return password.length >= 12;
};

export const validatePasswordHasUppercase = (password: string) => {
  return /[A-Z]/.test(password);
};

export const validatePasswordHasLowercase = (password: string) => {
  return /[a-z]/.test(password);
};

export const validatePasswordHasSpecialChar = (password: string) => {
  return /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
};

export const validatePasswordHasNumber = (password: string) => {
  return /[0-9]/.test(password);
};
