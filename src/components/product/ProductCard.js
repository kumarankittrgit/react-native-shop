// src/components/product/ProductCard.js
// Elastic ProductCard with spring micro-interactions & theme support

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export const ProductCard = ({ product, onPress }) => {
  const { addToCart, isItemInCart } = useCart();
  const { isDark, colors } = useTheme();
  const inCart = isItemInCart(product.id);

  const [isWishlisted, setIsWishlisted] = useState(false);

  // Elastic animation refs
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const addBtnScale = useRef(new Animated.Value(1)).current;

  // Elastic Card Press
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 60,
    }).start();
  };

  // Wishlist Heart Bounce
  const toggleWishlist = (e) => {
    e.stopPropagation?.();
    setIsWishlisted((prev) => !prev);
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.4,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Add Button Bounce
  const handleAddToCart = (e) => {
    e.stopPropagation?.();
    Animated.sequence([
      Animated.timing(addBtnScale, {
        toValue: 0.85,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(addBtnScale, {
        toValue: 1,
        friction: 3,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
    addToCart(product);
  };

  // Calculate discount percentage
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Product Image with Badges */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Discount Pill */}
          {discountPercent > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discountPercent}%</Text>
            </View>
          )}

          {/* Wishlist Heart Button */}
          <TouchableOpacity
            style={[
              styles.wishlistButton,
              {
                backgroundColor: isDark
                  ? 'rgba(30, 41, 59, 0.88)'
                  : 'rgba(255, 255, 255, 0.9)',
              },
            ]}
            onPress={toggleWishlist}
            activeOpacity={0.7}
          >
            <Animated.Text
              style={[
                styles.heartIcon,
                { transform: [{ scale: heartScale }] },
              ]}
            >
              {isWishlisted ? '❤️' : '🤍'}
            </Animated.Text>
          </TouchableOpacity>

          {/* Popular Tag */}
          {product.isPopular && (
            <View style={styles.badgePopular}>
              <Text style={styles.badgePopularText}>★ Trending</Text>
            </View>
          )}
        </View>

        {/* Product Details */}
        <View style={styles.infoContainer}>
          <Text style={[styles.category, { color: colors.textSecondary }]}>
            {product.category}
          </Text>
          <Text
            style={[styles.title, { color: colors.textPrimary }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {product.name}
          </Text>

          <View style={styles.ratingRow}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={[styles.ratingText, { color: colors.textPrimary }]}>
              {product.rating}
            </Text>
            <Text style={[styles.reviewsText, { color: colors.textSecondary }]}>
              ({product.reviewsCount})
            </Text>
          </View>

          {/* Price & Add to Cart Button */}
          <View style={styles.bottomRow}>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: colors.primary }]}>
                ${product.price}
              </Text>
              {product.originalPrice && (
                <Text
                  style={[
                    styles.originalPrice,
                    { color: colors.textSecondary },
                  ]}
                >
                  ${product.originalPrice}
                </Text>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAddToCart}
            >
              <Animated.View
                style={[
                  styles.addButton,
                  { backgroundColor: colors.primary },
                  inCart && (isDark ? styles.addedButtonDark : styles.addedButton),
                  { transform: [{ scale: addBtnScale }] },
                ]}
              >
                <Text
                  style={[
                    styles.addButtonText,
                    inCart && (isDark ? styles.addedButtonTextDark : styles.addedButtonText),
                  ]}
                >
                  {inCart ? '✓ Added' : '+ Add'}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 14,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  heartIcon: {
    fontSize: 14,
  },
  badgePopular: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(249, 176, 35, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePopularText: {
    color: '#78350F',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  infoContainer: {
    padding: 12,
  },
  category: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    minHeight: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  ratingStar: {
    color: '#F59E0B',
    fontSize: 12,
    marginRight: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
  reviewsText: {
    fontSize: 11,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'column',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
  },
  originalPrice: {
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    minWidth: 64,
    alignItems: 'center',
  },
  addedButton: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  addedButtonDark: {
    backgroundColor: '#064E3B',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  addedButtonText: {
    color: '#059669',
  },
  addedButtonTextDark: {
    color: '#34D399',
  },
});
