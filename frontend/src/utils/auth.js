export const getToken = () => localStorage.getItem("tokenUser");

export const isAuthenticated = () => Boolean(getToken());

export const redirectIfNotAuthenticated = () => {
  if (!isAuthenticated()) {
    window.location.href = "/login.html";
  }
};

export const logout = () => {
  localStorage.removeItem("tokenUser");
};

export const headers = () => {
  const token = getToken();
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};
