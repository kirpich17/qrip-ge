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
      // Decode token to show expiration info (only in browser)
      if (typeof window !== 'undefined' && typeof atob !== 'undefined') {
        try {
          const payload = JSON.parse(atob(authToken.split('.')[1]));
          const expiresAt = new Date(payload.exp * 1000);
          const now = new Date();
          const timeLeft = expiresAt - now;
          const isExpired = timeLeft < 0;
          
          if (isExpired) {
            console.warn("⚠️ Token is EXPIRED! Refresh should trigger on next API call.");
            console.warn("⚠️ Token expired at:", expiresAt.toLocaleString());
          } else {
            const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            
            let timeStr = '';
            if (daysLeft > 0) {
              timeStr = `${daysLeft}d ${hoursLeft}h`;
            } else if (hoursLeft > 0) {
              timeStr = `${hoursLeft}h ${minutesLeft}m`;
            } else {
              timeStr = `${minutesLeft}m`;
            }
            
            console.log(`✅ Using authToken (expires in ${timeStr}):`, authToken.substring(0, 50) + "...");
            console.log(`   Expires at: ${expiresAt.toLocaleString()}`);
          }
        } catch (e) {
          // Fallback to simple log if decoding fails
          console.log("✅ Using authToken:", authToken.substring(0, 50) + "...");
        }
      } else {
        // Server-side or no atob available
        console.log("✅ Using authToken:", authToken.substring(0, 50) + "...");
      }
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