// src/constants/colors.js
// Light and Dark theme palette definitions

export const LightColors = {
  primary: '#2A4BA0',        // Main brand color (Deep Blue)
  primaryDark: '#153075',    // Darker shade for buttons/headers
  secondary: '#F9B023',      // Accent color (Yellow/Orange for badges/stars)
  background: '#F8F9FB',     // Screen background (Soft off-white)
  cardBackground: '#FFFFFF', // Card background
  inputBackground: '#F1F5F9',// Search & inputs background
  textPrimary: '#1E222B',    // Headings and title text
  textSecondary: '#64748B',  // Subtitles and muted text
  border: '#E2E8F0',         // Card borders and dividers
  danger: '#EF4444',         // Error/delete
  success: '#10B981',        // Success badge
  white: '#FFFFFF',
  black: '#000000',
  isDark: false,
};

export const DarkColors = {
  primary: '#4F75FF',        // Bright blue for dark mode
  primaryDark: '#3A5ECC',    // Darker active blue
  secondary: '#FBBF24',      // Warm gold
  background: '#0F172A',     // Dark slate screen background
  cardBackground: '#1E293B', // Slate card background
  inputBackground: '#1E293B',// Search & input dark background
  textPrimary: '#F8FAFC',    // Pure bright white
  textSecondary: '#94A3B8',  // Soft slate text
  border: '#334155',         // Muted dark border
  danger: '#F87171',         // Red alert
  success: '#34D399',        // Green badge
  white: '#FFFFFF',
  black: '#000000',
  isDark: true,
};

// Default export for backward compatibility
export const Colors = LightColors;
