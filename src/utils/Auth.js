export const saveUser = (userData) => {
  localStorage.setItem("fb_user", JSON.stringify(userData));
};

export const getUser = () => {
  const data = localStorage.getItem("fb_user");
  return data ? JSON.parse(data) : null;
};

export const authenticateUser = (email, password) => {
  const storedUser = getUser();
  if (!storedUser) return false;

  return (
    storedUser.email === email.trim() &&
    storedUser.password === password.trim()
  );
};

export const logoutUser = () => {
  localStorage.removeItem("fb_logged_in");
};

export const loginSession = () => {
  localStorage.setItem("fb_logged_in", "true");
};

export const isLoggedIn = () => {
  return localStorage.getItem("fb_logged_in") === "true";
};
