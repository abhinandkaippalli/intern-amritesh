export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Corrected the email validation regex
    return regex.test(email);
  };
  
export const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    let initials = "";
  
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i][0]; // Fix: Access character with bracket notation
    }
  
    return initials.toUpperCase();
  };
  