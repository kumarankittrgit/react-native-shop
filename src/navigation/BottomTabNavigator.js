// src/navigation/BottomTabNavigator.js
// Bottom Tab Navigation using @react-navigation/bottom-tabs with theme support

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { CartScreen } from '../screens/CartScreen';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

// Cart Tab Icon with live item count badge
const CartTabIcon = ({ focused }) => {
  const { totalItems } = useCart();
  const { colors } = useTheme();

  return (
    <View style={styles.iconWrapper}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiFocused]}>
        🛒
      </Text>
      {totalItems > 0 && (
        <View
          style={[
            styles.badge,
            { backgroundColor: colors.danger, borderColor: colors.cardBackground },
          ]}
        >
          <Text style={styles.badgeText}>
            {totalItems > 99 ? '99+' : totalItems}
          </Text>
        </View>
      )}
    </View>
  );
};

// Home Tab Icon
const HomeTabIcon = ({ focused }) => {
  return (
    <View style={styles.iconWrapper}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiFocused]}>
        🛍️
      </Text>
    </View>
  );
};

export const BottomTabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colors.cardBackground,
            borderTopColor: colors.border,
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: HomeTabIcon,
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: CartTabIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: -2,
  },
  iconWrapper: {
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabEmoji: {
    fontSize: 20,
    opacity: 0.65,
  },
  tabEmojiFocused: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
