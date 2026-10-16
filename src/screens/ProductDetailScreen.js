// src/screens/ProductDetailScreen.js
// Production-grade Elastic Product Details Screen with Theme Support

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Header } from '../components/common/Header';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const COLOR_VARIANTS = [
  { name: 'Dark Slate', hex: '#1E293B' },
  { name: 'Pure Silver', hex: '#CBD5E1' },
  { name: 'Royal Blue', hex: '#2563EB' },
];

const SIZE_VARIANTS = ['Standard', 'Pro Bundle (+ $29)', 'Exclusive Pack (+ $49)'];

export const ProductDetailScreen = ({
  navigation,
  route,
  product: propProduct,
  onBack,
  onOpenCart,
}) => {
  const product = route?.params?.product || propProduct;
  const { addToCart, isItemInCart } = useCart();
  const { isDark, colors } = useTheme();

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);
  const inCart = product ? isItemInCart(product.id) : false;

  // Elastic animation refs
  const qtyScaleAnim = useRef(new Animated.Value(1)).current;
  const addBtnScaleAnim = useRef(new Animated.Value(1)).current;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const handleOpenCart = () => {
    if (onOpenCart) {
      onOpenCart();
    } else if (navigation) {
      navigation.navigate('Cart');
    }
  };

  const triggerQtyBounce = () => {
    Animated.sequence([
      Animated.timing(qtyScaleAnim, {
        toValue: 1.2,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(qtyScaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleIncrement = () => {
    setSelectedQuantity((q) => q + 1);
    triggerQtyBounce();
  };

  const handleDecrement = () => {
    setSelectedQuantity((q) => Math.max(1, q - 1));
    triggerQtyBounce();
  };

  const handleAddToCart = () => {
    if (!product) return;

    Animated.sequence([
      Animated.timing(addBtnScaleAnim, {
        toValue: 0.94,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(addBtnScaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    for (let i = 0; i < selectedQuantity; i++) {
      addToCart(product);
    }
  };

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Details" showCart={false} onBackPress={handleBack} />
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>
            No product details found.
          </Text>
        </View>
      </View>
    );
  }

  const extraCost = selectedSize === 1 ? 29 : selectedSize === 2 ? 49 : 0;
  const unitPrice = product.price + extraCost;
  const totalPrice = unitPrice * selectedQuantity;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. Header with Cart Badge & Theme Toggle */}
      <Header
        title={product.category}
        showCart={true}
        showThemeToggle={true}
        onBackPress={handleBack}
        onCartPress={handleOpenCart}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. Hero Image Banner with Badges */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: product.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.floatingBadgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{product.category}</Text>
            </View>
            {product.isPopular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>★ Bestseller</Text>
              </View>
            )}
          </View>
        </View>

        {/* 3. Product Info Card */}
        <View
          style={[
            styles.contentContainer,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={[styles.productTitle, { color: colors.textPrimary }]}>
            {product.name}
          </Text>

          {/* Rating & Review Trust Strip */}
          <View style={styles.ratingRow}>
            <View style={styles.starBadge}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.ratingNumber}>{product.rating}</Text>
            </View>
            <Text
              style={[styles.reviewsCount, { color: colors.textSecondary }]}
            >
              ({product.reviewsCount} verified reviews)
            </Text>
            <View style={styles.inStockBadge}>
              <Text style={styles.inStockDot}>●</Text>
              <Text style={styles.inStockText}>In Stock</Text>
            </View>
          </View>

          {/* Pricing Row */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.primary }]}>
              ${unitPrice}
            </Text>
            {product.originalPrice && (
              <>
                <Text
                  style={[
                    styles.originalPrice,
                    { color: colors.textSecondary },
                  ]}
                >
                  ${product.originalPrice + extraCost}
                </Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    % OFF
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Color Variant Picker */}
          <View style={styles.variantSection}>
            <Text
              style={[styles.variantLabel, { color: colors.textPrimary }]}
            >
              Color Edition:{' '}
              <Text
                style={[
                  styles.variantSelectedName,
                  { color: colors.primary },
                ]}
              >
                {COLOR_VARIANTS[selectedColor].name}
              </Text>
            </Text>
            <View style={styles.swatchRow}>
              {COLOR_VARIANTS.map((c, index) => {
                const isSelected = selectedColor === index;
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    style={[
                      styles.swatchRing,
                      isSelected && { borderColor: colors.primary },
                    ]}
                    onPress={() => setSelectedColor(index)}
                  >
                    <View
                      style={[
                        styles.swatchCircle,
                        { backgroundColor: c.hex },
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Size / Package Options */}
          <View style={styles.variantSection}>
            <Text
              style={[styles.variantLabel, { color: colors.textPrimary }]}
            >
              Package Option
            </Text>
            <View style={styles.packageOptionRow}>
              {SIZE_VARIANTS.map((sizeName, index) => {
                const isSelected = selectedSize === index;
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    style={[
                      styles.sizeChip,
                      {
                        backgroundColor: isSelected
                          ? isDark
                            ? '#1E3A8A'
                            : '#EFF6FF'
                          : colors.inputBackground,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setSelectedSize(index)}
                  >
                    <Text
                      style={[
                        styles.sizeChipText,
                        {
                          color: isSelected
                            ? colors.primary
                            : colors.textSecondary,
                          fontWeight: isSelected ? '800' : '600',
                        },
                      ]}
                    >
                      {sizeName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Trust Value Props */}
          <View
            style={[
              styles.featuresRow,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={[styles.featureText, { color: colors.textPrimary }]}>
                24-48h Delivery
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔄</Text>
              <Text style={[styles.featureText, { color: colors.textPrimary }]}>
                7-Day Free Return
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🛡️</Text>
              <Text style={[styles.featureText, { color: colors.textPrimary }]}>
                100% Genuine
              </Text>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text
              style={[styles.sectionHeader, { color: colors.textPrimary }]}
            >
              Overview
            </Text>
            <Text
              style={[styles.descriptionText, { color: colors.textSecondary }]}
            >
              {product.description}
            </Text>
          </View>

          {/* Expandable Specifications Accordion */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.accordionHeader,
              { borderTopColor: colors.border },
            ]}
            onPress={() => setIsSpecsExpanded(!isSpecsExpanded)}
          >
            <Text
              style={[styles.accordionTitle, { color: colors.textPrimary }]}
            >
              Technical Specifications
            </Text>
            <Text
              style={[
                styles.accordionToggleIcon,
                { color: colors.textSecondary },
              ]}
            >
              {isSpecsExpanded ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {isSpecsExpanded && (
            <View
              style={[
                styles.accordionContent,
                { backgroundColor: colors.inputBackground },
              ]}
            >
              <View style={styles.specRow}>
                <Text
                  style={[styles.specLabel, { color: colors.textSecondary }]}
                >
                  Category
                </Text>
                <Text
                  style={[styles.specValue, { color: colors.textPrimary }]}
                >
                  {product.category}
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text
                  style={[styles.specLabel, { color: colors.textSecondary }]}
                >
                  Condition
                </Text>
                <Text
                  style={[styles.specValue, { color: colors.textPrimary }]}
                >
                  Brand New, Sealed Box
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text
                  style={[styles.specLabel, { color: colors.textSecondary }]}
                >
                  Warranty
                </Text>
                <Text
                  style={[styles.specValue, { color: colors.textPrimary }]}
                >
                  1 Year Official Manufacturer
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text
                  style={[styles.specLabel, { color: colors.textSecondary }]}
                >
                  Country of Origin
                </Text>
                <Text
                  style={[styles.specValue, { color: colors.textPrimary }]}
                >
                  Imported Quality
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 4. Bottom Sticky Elastic Action Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.cardBackground,
            borderTopColor: colors.border,
          },
        ]}
      >
        {/* Elastic Quantity Stepper */}
        <View
          style={[
            styles.quantityPicker,
            { backgroundColor: colors.inputBackground },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.qtyBtn,
              { backgroundColor: colors.cardBackground },
            ]}
            onPress={handleDecrement}
            activeOpacity={0.7}
          >
            <Text style={[styles.qtyBtnText, { color: colors.textPrimary }]}>
              −
            </Text>
          </TouchableOpacity>

          <Animated.Text
            style={[
              styles.qtyValue,
              { color: colors.textPrimary },
              { transform: [{ scale: qtyScaleAnim }] },
            ]}
          >
            {selectedQuantity}
          </Animated.Text>

          <TouchableOpacity
            style={[
              styles.qtyBtn,
              { backgroundColor: colors.cardBackground },
            ]}
            onPress={handleIncrement}
            activeOpacity={0.7}
          >
            <Text style={[styles.qtyBtnText, { color: colors.textPrimary }]}>
              +
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add to Cart Elastic Action Button */}
        <TouchableOpacity
          style={styles.actionBtnTouchable}
          activeOpacity={0.9}
          onPress={handleAddToCart}
        >
          <Animated.View
            style={[
              styles.actionButton,
              { backgroundColor: colors.primary },
              inCart && { backgroundColor: colors.primaryDark },
              { transform: [{ scale: addBtnScaleAnim }] },
            ]}
          >
            <Text style={styles.actionButtonText}>
              {inCart ? '✓ Add More' : 'Add to Cart'} • ${totalPrice}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageWrapper: {
    width: '100%',
    height: 300,
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingBadgeRow: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  popularBadge: {
    backgroundColor: '#F9B023',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  popularBadgeText: {
    color: '#78350F',
    fontSize: 11,
    fontWeight: '800',
  },
  contentContainer: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginTop: -22,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  starIcon: {
    color: '#D97706',
    fontSize: 12,
    marginRight: 4,
  },
  ratingNumber: {
    color: '#78350F',
    fontWeight: '800',
    fontSize: 12,
  },
  reviewsCount: {
    fontSize: 12,
    marginRight: 12,
  },
  inStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  inStockDot: {
    color: '#10B981',
    fontSize: 8,
    marginRight: 4,
  },
  inStockText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: '900',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discountBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 11,
  },
  variantSection: {
    marginBottom: 16,
  },
  variantLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  variantSelectedName: {
    fontWeight: '800',
  },
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swatchRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  swatchCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  packageOptionRow: {
    flexDirection: 'column',
    gap: 8,
  },
  sizeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sizeChipText: {
    fontSize: 12,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginVertical: 14,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 10,
    fontWeight: '700',
  },
  descriptionSection: {
    marginVertical: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    marginTop: 10,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  accordionToggleIcon: {
    fontSize: 12,
  },
  accordionContent: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  specLabel: {
    fontSize: 12,
  },
  specValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  quantityPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 4,
    marginRight: 12,
  },
  qtyBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '800',
  },
  qtyValue: {
    fontSize: 15,
    fontWeight: '800',
    marginHorizontal: 14,
  },
  actionBtnTouchable: {
    flex: 1,
  },
  actionButton: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
