// src/components/common/Header.js
// Header component with theme toggle and live cart badge

import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export const Header = ({
  title,
  showCart = true,
  showThemeToggle = true,
  onCartPress,
  onBackPress,
}) => {
  const { totalItems } = useCart();
  const { isDark, colors, toggleTheme } = useTheme();

  const themeBtnAnim = useRef(new Animated.Value(1)).current;

  const handleToggleTheme = () => {
    Animated.sequence([
      Animated.timing(themeBtnAnim, {
        toValue: 0.8,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(themeBtnAnim, {
        toValue: 1,
        friction: 3,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
    toggleTheme();
  };

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: colors.cardBackground,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* Left section: Back button & Title */}
      <View style={styles.leftContainer}>
        {onBackPress ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.textPrimary }]}>
              ←
            </Text>
          </TouchableOpacity>
        ) : null}
        <Text
          style={[styles.headerTitle, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      {/* Right section: Theme Toggle & Cart */}
      <View style={styles.rightContainer}>
        {showThemeToggle && (
          <TouchableOpacity
            style={[
              styles.themeToggleBtn,
              { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
            ]}
            onPress={handleToggleTheme}
            activeOpacity={0.8}
          >
            <Animated.Text
              style={[
                styles.themeIcon,
                { transform: [{ scale: themeBtnAnim }] },
              ]}
            >
              {isDark ? '☀️' : '🌙'}
            </Animated.Text>
          </TouchableOpacity>
        )}

        {showCart && (
          <TouchableOpacity
            style={styles.cartButton}
            onPress={onCartPress}
            activeOpacity={0.7}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {totalItems > 0 && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: colors.danger },
                ]}
              >
                <Text style={styles.badgeText}>
                  {totalItems > 99 ? '99+' : totalItems}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  themeIcon: {
    fontSize: 16,
  },
  cartButton: {
    padding: 6,
    position: 'relative',
  },
  cartIcon: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
