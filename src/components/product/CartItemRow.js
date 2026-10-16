// src/components/product/CartItemRow.js
// Elastic CartItemRow component with spring controls and theme support

import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export const CartItemRow = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { isDark, colors } = useTheme();
  const { product, quantity } = item;

  const qtyAnim = useRef(new Animated.Value(1)).current;

  const triggerBounce = () => {
    Animated.sequence([
      Animated.timing(qtyAnim, {
        toValue: 1.25,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(qtyAnim, {
        toValue: 1,
        friction: 3,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleDecrement = () => {
    triggerBounce();
    updateQuantity(product.id, -1);
  };

  const handleIncrement = () => {
    triggerBounce();
    updateQuantity(product.id, 1);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Product Thumbnail */}
      <View
        style={[
          styles.imageWrapper,
          { borderColor: colors.border, backgroundColor: colors.inputBackground },
        ]}
      >
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Product Details */}
      <View style={styles.details}>
        <Text style={[styles.categoryBadge, { color: colors.primary }]}>
          {product.category}
        </Text>
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {product.name}
        </Text>
        <Text style={[styles.unitPrice, { color: colors.textSecondary }]}>
          ${product.price} each
        </Text>

        {/* Elastic Quantity Controls */}
        <View
          style={[
            styles.quantityRow,
            { backgroundColor: colors.inputBackground },
          ]}
        >
          <TouchableOpacity
            style={[styles.qtyButton, { backgroundColor: colors.cardBackground }]}
            onPress={handleDecrement}
            activeOpacity={0.7}
          >
            <Text style={[styles.qtyButtonText, { color: colors.textPrimary }]}>
              −
            </Text>
          </TouchableOpacity>

          <Animated.Text
            style={[
              styles.qtyText,
              { color: colors.textPrimary },
              { transform: [{ scale: qtyAnim }] },
            ]}
          >
            {quantity}
          </Animated.Text>

          <TouchableOpacity
            style={[styles.qtyButton, { backgroundColor: colors.cardBackground }]}
            onPress={handleIncrement}
            activeOpacity={0.7}
          >
            <Text style={[styles.qtyButtonText, { color: colors.textPrimary }]}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Right Column: Total Price & Delete Button */}
      <View style={styles.rightColumn}>
        <TouchableOpacity
          style={[
            styles.deleteButton,
            { backgroundColor: isDark ? '#7F1D1D' : '#FEE2E2' },
          ]}
          onPress={() => removeFromCart(product.id)}
          activeOpacity={0.6}
        >
          <Text
            style={[
              styles.deleteButtonText,
              { color: isDark ? '#FCA5A5' : '#DC2626' },
            ]}
          >
            ✕
          </Text>
        </TouchableOpacity>

        <Text style={[styles.totalPrice, { color: colors.primary }]}>
          ${product.price * quantity}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  imageWrapper: {
    width: 76,
    height: 76,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  categoryBadge: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  unitPrice: {
    fontSize: 12,
    marginBottom: 6,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 8,
    padding: 2,
  },
  qtyButton: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '800',
    marginHorizontal: 10,
  },
  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
    paddingVertical: 2,
  },
  deleteButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '800',
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: '800',
  },
});
