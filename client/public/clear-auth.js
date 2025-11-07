// Clear localStorage script
// Run this in the browser console if you're having JWT token issues

console.log('🔧 Clearing authentication tokens...');

// Clear all auth-related items
localStorage.removeItem('token');
localStorage.removeItem('user');
localStorage.removeItem('auth');

// Optional: Clear everything
// localStorage.clear();

console.log('✅ Authentication tokens cleared!');
console.log('💡 Please refresh the page and login again.');
