// src/context/ThemeContext.js
// Context for Light / Dark theme management with persistence

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LightColors, DarkColors } from '../constants/colors';
import { Storage } from '../utils/storage';

const THEME_STORAGE_KEY = 'novastore_theme_preference';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Load saved theme from storage on start
  useEffect(() => {
    const loadTheme = async () => {
      const saved = await Storage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    await Storage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  const isDark = theme === 'dark';
  const colors = isDark ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light',
      isDark: false,
      colors: LightColors,
      toggleTheme: () => {},
    };
  }
  return context;
};
