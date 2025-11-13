/**
 * Expire Token Now - For Testing Token Refresh
 * 
 * Copy and paste this entire script into your browser console
 * This will modify your token to be expired, triggering refresh on next API call
 */

(function expireTokenNow() {
  console.log('🧪 ===== EXPIRING TOKEN FOR TESTING =====\n');
  
  // Get current token
  const currentToken = localStorage.getItem('authToken');
  if (!currentToken) {
    console.error('❌ No token found. Please login first.');
    return;
  }
  
  try {
    // Decode token
    const parts = currentToken.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid token format');
      return;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    console.log('📋 Current Token Info:');
    console.log('   User ID:', payload.userId);
    console.log('   User Type:', payload.userType);
    console.log('   Issued at:', new Date(payload.iat * 1000).toLocaleString());
    console.log('   Expires at:', new Date(payload.exp * 1000).toLocaleString());
    
    // Check if already expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      console.log('\n⚠️ Token is already expired!');
      return;
    }
    
    // Modify expiration to be 1 hour ago
    const expiredPayload = {
      ...payload,
      exp: now - 3600, // Expired 1 hour ago
      iat: payload.iat // Keep original issued time
    };
    
    console.log('\n🔄 Modifying token expiration...');
    console.log('   Old expiration:', new Date(payload.exp * 1000).toLocaleString());
    console.log('   New expiration:', new Date(expiredPayload.exp * 1000).toLocaleString());
    
    // Re-encode payload (note: signature will be invalid, but that's okay for testing)
    const expiredPayloadBase64 = btoa(JSON.stringify(expiredPayload))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    // Create expired token (with invalid signature - this will cause 401)
    const expiredToken = parts[0] + '.' + expiredPayloadBase64 + '.' + parts[2];
    
    // Save expired token
    localStorage.setItem('authToken', expiredToken);
    
    console.log('\n✅ Token expired successfully!');
    console.log('   Expired token saved to localStorage');
    console.log('\n📝 Next Steps:');
    console.log('   1. Open Network tab in DevTools');
    console.log('   2. Navigate to another admin page or refresh dashboard');
    console.log('   3. Watch for:');
    console.log('      - First request → 401 Unauthorized');
    console.log('      - POST /api/admin/refresh-token → 200 OK ✅');
    console.log('      - Original request retried → 200 OK ✅');
    console.log('\n💡 The token signature is now invalid, so backend will reject it with 401,');
    console.log('   which will trigger the automatic token refresh!');
    
  } catch (error) {
    console.error('❌ Error expiring token:', error);
    console.log('\n🔄 Alternative: Setting completely invalid token...');
    localStorage.setItem('authToken', 'expired_token_for_testing_' + Date.now());
    console.log('✅ Invalid token set. This will also trigger 401 errors.');
  }
})();

