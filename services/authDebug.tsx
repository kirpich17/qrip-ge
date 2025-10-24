// Debug utility for authentication issues
export const debugAuth = () => {
  console.log("🔍 === AUTHENTICATION DEBUG ===");
  
  // Check localStorage
  const loginData = localStorage.getItem("loginData");
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  
  console.log("📦 LocalStorage Contents:");
  console.log("loginData:", loginData);
  console.log("authToken:", authToken);
  console.log("userRole:", userRole);
  console.log("isAuthenticated:", isAuthenticated);
  
  // Try to parse loginData
  if (loginData) {
    try {
      const parsed = JSON.parse(loginData);
      console.log("📋 Parsed loginData:", parsed);
      console.log("🔑 Token in loginData:", parsed.token || parsed.data?.token);
      console.log("👤 User in loginData:", parsed.user || parsed.data);
    } catch (error) {
      console.error("❌ Error parsing loginData:", error);
    }
  }
  
  console.log("🔍 === END DEBUG ===");
};

// Function to clear all auth data
export const clearAllAuth = () => {
  console.log("🧹 Clearing all authentication data...");
  localStorage.removeItem("loginData");
  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("isAuthenticated");
  console.log("✅ All auth data cleared");
};

// Function to manually set auth data (for testing)
export const setTestAuth = (token: string, user: any) => {
  console.log("🧪 Setting test authentication data...");
  localStorage.setItem("loginData", JSON.stringify({ token, user }));
  localStorage.setItem("authToken", token);
  localStorage.setItem("userRole", user.userType || "user");
  localStorage.setItem("isAuthenticated", "true");
  console.log("✅ Test auth data set");
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuth;
  (window as any).clearAllAuth = clearAllAuth;
  (window as any).setTestAuth = setTestAuth;
}
