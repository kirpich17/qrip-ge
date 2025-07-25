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
