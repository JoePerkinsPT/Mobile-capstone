import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for different types of data
const STORAGE_KEYS = {
  FAVORITES: 'favorites',
  USER_DETAILS: 'userDetails',
  DARK_MODE: 'darkMode',
  RECENT_MEDITATIONS: 'recentMeditations',
  NOTIFICATIONS: 'notifications',
  USER_SETTINGS: 'userSettings'
};

// Favorites operations
export const favoritesStorage = {
  getFavorites: async () => {
    try {
      const favorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  addToFavorites: async (item) => {
    try {
      const favorites = await favoritesStorage.getFavorites();
      const updatedFavorites = [...favorites, item];
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  },

  removeFromFavorites: async (itemTitle) => {
    try {
      const favorites = await favoritesStorage.getFavorites();
      const updatedFavorites = favorites.filter(item => item.title !== itemTitle);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  },

  clearFavorites: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.FAVORITES);
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }
  }
};

// User details operations
export const userStorage = {
  saveUserDetails: async (userDetails) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DETAILS, JSON.stringify(userDetails));
      return true;
    } catch (error) {
      console.error('Error saving user details:', error);
      return false;
    }
  },

  getUserDetails: async () => {
    try {
      const userDetails = await AsyncStorage.getItem(STORAGE_KEYS.USER_DETAILS);
      return userDetails ? JSON.parse(userDetails) : null;
    } catch (error) {
      console.error('Error getting user details:', error);
      return null;
    }
  },

  clearUserDetails: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DETAILS);
      return true;
    } catch (error) {
      console.error('Error clearing user details:', error);
      return false;
    }
  }
};

// Theme operations
export const themeStorage = {
  setDarkMode: async (isDarkMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(isDarkMode));
      return true;
    } catch (error) {
      console.error('Error setting dark mode:', error);
      return false;
    }
  },

  getDarkMode: async () => {
    try {
      const darkMode = await AsyncStorage.getItem(STORAGE_KEYS.DARK_MODE);
      return darkMode ? JSON.parse(darkMode) : false;
    } catch (error) {
      console.error('Error getting dark mode:', error);
      return false;
    }
  }
};

// Recent meditations operations
export const recentMeditationsStorage = {
  addRecentMeditation: async (meditation) => {
    try {
      const recent = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_MEDITATIONS);
      const recentArray = recent ? JSON.parse(recent) : [];
      const updatedRecent = [meditation, ...recentArray].slice(0, 5); // Keep only last 5
      await AsyncStorage.setItem(STORAGE_KEYS.RECENT_MEDITATIONS, JSON.stringify(updatedRecent));
      return true;
    } catch (error) {
      console.error('Error adding recent meditation:', error);
      return false;
    }
  },

  getRecentMeditations: async () => {
    try {
      const recent = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_MEDITATIONS);
      return recent ? JSON.parse(recent) : [];
    } catch (error) {
      console.error('Error getting recent meditations:', error);
      return [];
    }
  }
};

// Notifications operations
export const notificationsStorage = {
  saveNotification: async (notification) => {
    try {
      const notifications = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const notificationsArray = notifications ? JSON.parse(notifications) : [];
      const updatedNotifications = [notification, ...notificationsArray];
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
      return true;
    } catch (error) {
      console.error('Error saving notification:', error);
      return false;
    }
  },

  getNotifications: async () => {
    try {
      const notifications = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return notifications ? JSON.parse(notifications) : [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  clearNotifications: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
      return true;
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return false;
    }
  }
};

// User settings operations
export const settingsStorage = {
  saveSettings: async (settings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  },

  getSettings: async () => {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  }
}; 