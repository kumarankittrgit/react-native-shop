// src/navigation/RootNavigator.js
// Native Stack Navigation using @react-navigation/native-stack

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { CartScreen } from '../screens/CartScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* 1. Onboarding / Welcome Screen */}
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />

      {/* 2. Main Tab Navigator (Shop & Cart Bottom Tabs) */}
      <Stack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />

      {/* 3. Product Detail Screen (Pushed on stack when product card is clicked) */}
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />

      {/* 4. Cart Screen (Also available as full screen stack modal from Header/Detail) */}
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};
