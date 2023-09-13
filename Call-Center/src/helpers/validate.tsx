export const validate = {
  email: (value: string) => {
    // Regular expression for email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(value);
  },
  phone: (value: string) => {
    // Regular expression for phone number validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(value);
  },
  password: (value: string) => {
    // Regular expression for password validation (at least 8 characters with letters and numbers)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(value);
  },
  notEmpty: (value: string) => {
    return value.trim() !== '';
  },
};

export function hash(input: string):string {
  let hash = 0;
  if (input.length === 0) return "asdfkla";

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }

  return hash.toString(16); // Convert to hexadecimal representation
}
export function truncateString(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input; // Return the original string if it's already within or equal to the maxLength
  } else {
    return input.substring(0, maxLength) + '...'; // Truncate and add '...' at the end
  }
}
export function formatDatabaseTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };

  return date.toLocaleString('en-US', options);
}