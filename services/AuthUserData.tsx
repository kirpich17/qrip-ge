export const localStorageAuthUserData = () => {
    const userData = localStorage.getItem("loginData");
  
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        return parsedData;
      } catch (error) {
        return {};
      }
    }
    return {};
  };