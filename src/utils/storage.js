// src/utils/storage.js
// Safe AsyncStorage helper functions in pure JavaScript

import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  // Save data to phone's storage
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving key "${key}" to AsyncStorage:`, error);
    }
  },

  // Get data from phone's storage
  async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error reading key "${key}" from AsyncStorage:`, error);
      return null;
    }
  },

  // Remove a key
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing key "${key}" from AsyncStorage:`, error);
    }
  },

  // Clear all storage
  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  },
};
