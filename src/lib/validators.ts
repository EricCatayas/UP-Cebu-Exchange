export const validateFullName = (fullName: string): { isValid: boolean; message?: string } => {
  if (fullName.trim().length < 2) {
    return { isValid: false, message: 'Full name must be at least 2 characters long' };
  }
  return { isValid: true };
};

export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Invalid email format' };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
  if (!passwordRegex.test(password)) {
    return { isValid: false, message: 'Password must contain at least one letter and one number' };
  }

  return { isValid: true };
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): { isValid: boolean; message?: string } => {
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  return { isValid: true };
};

export const validatePhoneNumber = (phoneNumber: string): { isValid: boolean; message?: string } => {
  const phoneRegex = /^[0-9+\-() ]{7,20}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return { isValid: false, message: 'Invalid phone number format' };
  }
  return { isValid: true };
};
