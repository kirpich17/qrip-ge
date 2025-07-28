export const localStorageAuthUserData = () => {
  try {
    const user = JSON.parse(localStorage.getItem("loginData") || "{}");
    const token = localStorage.getItem("authToken");
    return {
      user,
      token,
    };
  } catch (error) {
    return {
      user: null,
      token: null,
    };
  }
};


export const logoutUser = () => {
  try {
    localStorage.removeItem("loginData");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
  } catch (error) {
    console.error("Logout error:", error);
  }
};