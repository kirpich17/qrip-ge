export const localStorageAuthUserData = () => {
  try {
    const loginData = localStorage.getItem("loginData");
    const authToken = localStorage.getItem("authToken");
    
    if (!loginData && !authToken) {
      console.log("❌ No authentication data found");
      return {
        user: null,
        token: null,
      };
    }

    if (authToken) {
      const user = loginData ? JSON.parse(loginData) : null;
      console.log("✅ Using authToken:", authToken);
      return {
        user,
        token: authToken,
      };
    }

    if (loginData) {
      const parsedData = JSON.parse(loginData);
      const token = parsedData.data?.token || parsedData.token;
      return {
        user: parsedData.data || parsedData,
        token,
      };
    }
    
    return {
      user: null,
      token: null,
    };
  } catch (error) {
    console.error("❌ Error parsing auth data:", error);
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