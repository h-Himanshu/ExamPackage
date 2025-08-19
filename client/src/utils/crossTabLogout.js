// Cross-tab logout synchronization utility
// This handles logout events across multiple browser tabs

class CrossTabLogout {
  constructor() {
    this.storageKey = 'exam-app-logout-event';
    this.init();
  }

  init() {
    // Listen for storage events (cross-tab communication)
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // Listen for page visibility changes to refresh stale tabs
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  handleStorageChange(event) {
    // Check if it's our logout event
    if (event.key === this.storageKey && event.newValue) {
      console.log('Logout detected in another tab');
      this.performLogout();
    }
  }

  handleVisibilityChange() {
    // When tab becomes visible, check if user is still authenticated
    if (!document.hidden) {
      this.checkAuthenticationStatus();
    }
  }

  async checkAuthenticationStatus() {
    try {
      const response = await fetch('/user', {
        credentials: 'include',
        method: 'GET'
      });
      
      if (!response.ok) {
        // User is no longer authenticated, redirect to login
        console.log('Authentication expired, redirecting to login');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      // On error, redirect to login for safety
      window.location.href = '/login';
    }
  }

  triggerLogout() {
    // Trigger logout event for all tabs
    const timestamp = Date.now().toString();
    localStorage.setItem(this.storageKey, timestamp);
    
    // Clean up the storage item after a short delay
    setTimeout(() => {
      localStorage.removeItem(this.storageKey);
    }, 1000);
  }

  performLogout() {
    // Perform the actual logout
    fetch('/API/logout', {
      method: 'GET',
      credentials: 'include'
    })
    .then(() => {
      // Redirect to login page
      window.location.href = '/login';
    })
    .catch((error) => {
      console.error('Logout error:', error);
      // Redirect anyway for security
      window.location.href = '/login';
    });
  }

  // Method to be called when user clicks logout
  async initiateLogout() {
    try {
      // First, perform logout on server
      const response = await fetch('/API/logout', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        console.log('Logout successful');
      } else {
        console.error('Logout failed with status:', response.status);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }

    // Trigger cross-tab logout regardless of server response
    this.triggerLogout();
    
    // Navigate to login
    window.location.href = '/login';
  }

  cleanup() {
    window.removeEventListener('storage', this.handleStorageChange);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}

// Create a singleton instance
const crossTabLogout = new CrossTabLogout();

export default crossTabLogout;
