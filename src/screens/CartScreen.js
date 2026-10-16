// src/screens/CartScreen.js
// Production-grade Elastic Cart & Checkout Screen with Theme Support

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
} from 'react-native';
import { Header } from '../components/common/Header';
import { CartItemRow } from '../components/product/CartItemRow';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export const CartScreen = ({ navigation, onBack, onExplore }) => {
  const { cart, totalAmount, clearCart } = useCart();
  const { isDark, colors } = useTheme();

  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percent
  const [couponError, setCouponError] = useState('');

  // Elastic animation
  const checkoutBtnScale = useRef(new Animated.Value(1)).current;
  const modalPopScale = useRef(new Animated.Value(0.7)).current;

  // Free shipping threshold: $200
  const freeThreshold = 200;
  const isFreeDelivery = totalAmount >= freeThreshold || totalAmount === 0;
  const deliveryFee = isFreeDelivery ? 0 : 15;
  const remainingForFree = Math.max(freeThreshold - totalAmount, 0);
  const progressPercent = Math.min((totalAmount / freeThreshold) * 100, 100);

  // Discount calculation
  const discountAmount = Math.round((totalAmount * appliedDiscount) / 100);
  const finalTotal = Math.max(0, totalAmount - discountAmount + deliveryFee);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      if (navigation.canGoBack && navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('HomeTab');
      }
    }
  };

  const handleExplore = () => {
    if (onExplore) {
      onExplore();
    } else if (navigation) {
      navigation.navigate('HomeTab');
    }
  };

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (code === 'NOVA20') {
      setAppliedDiscount(20);
      setCouponError('');
      setCouponCode('NOVA20');
    } else if (code === 'FIRST10') {
      setAppliedDiscount(10);
      setCouponError('');
      setCouponCode('FIRST10');
    } else {
      setCouponError('Invalid promo code. Try NOVA20');
    }
  };

  const handleCheckout = () => {
    Animated.sequence([
      Animated.timing(checkoutBtnScale, {
        toValue: 0.94,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(checkoutBtnScale, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    setIsSuccessModalVisible(true);
    Animated.spring(modalPopScale, {
      toValue: 1,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  const handleFinishOrder = () => {
    clearCart();
    setAppliedDiscount(0);
    setCouponCode('');
    setIsSuccessModalVisible(false);
    modalPopScale.setValue(0.7);
    handleExplore();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. Top Header with Theme Toggle */}
      <Header
        title="My Cart"
        showCart={false}
        showThemeToggle={true}
        onBackPress={handleBack}
      />

      {cart.length === 0 ? (
        // 2. Empty State
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconCircle,
              { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
            ]}
          >
            <Text style={styles.emptyIcon}>🛍️</Text>
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            Your Cart is Empty
          </Text>
          <Text
            style={[styles.emptySubtitle, { color: colors.textSecondary }]}
          >
            Looks like you haven't added anything to your cart yet. Explore our
            handpicked collections and discounts!
          </Text>
          <TouchableOpacity
            style={[styles.shopNowButton, { backgroundColor: colors.primary }]}
            onPress={handleExplore}
            activeOpacity={0.85}
          >
            <Text style={styles.shopNowButtonText}>Explore Products →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // 3. Cart Items List + Elastic Summary
        <View style={styles.content}>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.product.id}
            renderItem={({ item }) => <CartItemRow item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View
                style={[
                  styles.deliveryProgressCard,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                    borderColor: isDark ? '#334155' : '#DBEAFE',
                  },
                ]}
              >
                <View style={styles.progressTextRow}>
                  <Text style={styles.progressTruck}>🚚</Text>
                  <Text
                    style={[styles.progressTitle, { color: colors.primary }]}
                  >
                    {isFreeDelivery
                      ? '🎉 Free Express Delivery Unlocked!'
                      : `Add $${remainingForFree} more for FREE Delivery`}
                  </Text>
                </View>
                <View
                  style={[
                    styles.progressBackground,
                    { backgroundColor: isDark ? '#334155' : '#DBEAFE' },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${progressPercent}%`,
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            }
            ListFooterComponent={
              <View style={styles.summarySection}>
                {/* Promo Code Input Card */}
                <View
                  style={[
                    styles.promoCard,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.promoCardTitle,
                      { color: colors.textPrimary },
                    ]}
                  >
                    Have a Promo Code?
                  </Text>
                  <View style={styles.couponInputRow}>
                    <TextInput
                      style={[
                        styles.couponInput,
                        {
                          backgroundColor: colors.inputBackground,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        },
                      ]}
                      placeholder="Enter promo code (e.g. NOVA20)"
                      placeholderTextColor={colors.textSecondary}
                      value={couponCode}
                      onChangeText={(t) => {
                        setCouponCode(t);
                        setCouponError('');
                      }}
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity
                      style={[
                        styles.applyBtn,
                        { backgroundColor: colors.primary },
                      ]}
                      onPress={() => handleApplyCoupon()}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.applyBtnText}>
                        {appliedDiscount > 0 ? 'Applied' : 'Apply'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {couponError ? (
                    <Text style={styles.couponErrorText}>{couponError}</Text>
                  ) : null}

                  {appliedDiscount > 0 ? (
                    <View style={styles.discountAppliedBadge}>
                      <Text style={styles.discountAppliedText}>
                        ✓ {appliedDiscount}% Discount Applied successfully!
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleApplyCoupon('NOVA20')}
                      style={styles.quickCouponChip}
                    >
                      <Text
                        style={[
                          styles.quickCouponText,
                          { color: colors.primary },
                        ]}
                      >
                        Tap to apply <Text style={styles.boldTag}>NOVA20</Text>{' '}
                        (20% OFF)
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Order Summary Breakdown Card */}
                <View
                  style={[
                    styles.summaryCard,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.summaryTitle,
                      { color: colors.textPrimary },
                    ]}
                  >
                    Price Breakdown
                  </Text>

                  <View style={styles.summaryRow}>
                    <Text
                      style={[
                        styles.summaryLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Subtotal
                    </Text>
                    <Text
                      style={[
                        styles.summaryValue,
                        { color: colors.textPrimary },
                      ]}
                    >
                      ${totalAmount}
                    </Text>
                  </View>

                  {appliedDiscount > 0 && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.discountLabel}>
                        Discount ({appliedDiscount}%)
                      </Text>
                      <Text style={styles.discountValue}>-${discountAmount}</Text>
                    </View>
                  )}

                  <View style={styles.summaryRow}>
                    <Text
                      style={[
                        styles.summaryLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Delivery Fee
                    </Text>
                    <Text
                      style={[
                        styles.summaryValue,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {isFreeDelivery ? (
                        <Text style={styles.freeText}>FREE</Text>
                      ) : (
                        `$${deliveryFee}`
                      )}
                    </Text>
                  </View>

                  <View
                    style={[styles.divider, { backgroundColor: colors.border }]}
                  />

                  <View style={styles.totalRow}>
                    <Text
                      style={[
                        styles.totalLabel,
                        { color: colors.textPrimary },
                      ]}
                    >
                      Total Payable
                    </Text>
                    <Text
                      style={[
                        styles.totalValue,
                        { color: colors.primary },
                      ]}
                    >
                      ${finalTotal}
                    </Text>
                  </View>
                </View>

                {/* Elastic Checkout Button */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={handleCheckout}
                >
                  <Animated.View
                    style={[
                      styles.checkoutButton,
                      { backgroundColor: colors.primary },
                      { transform: [{ scale: checkoutBtnScale }] },
                    ]}
                  >
                    <Text style={styles.checkoutButtonText}>
                      Proceed to Checkout • ${finalTotal}
                    </Text>
                    <Text style={styles.checkoutArrow}>→</Text>
                  </Animated.View>
                </TouchableOpacity>

                <Text
                  style={[
                    styles.securityNote,
                    { color: colors.textSecondary },
                  ]}
                >
                  🔒 256-Bit SSL Encrypted & Secure Checkout
                </Text>
              </View>
            }
          />
        </View>
      )}

      {/* 4. Elastic Order Success Celebration Modal */}
      <Modal
        visible={isSuccessModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalCard,
              { backgroundColor: colors.cardBackground },
              { transform: [{ scale: modalPopScale }] },
            ]}
          >
            <View style={styles.celebrateCircle}>
              <Text style={styles.celebrateEmoji}>🎉</Text>
            </View>

            <Text
              style={[styles.modalTitle, { color: colors.textPrimary }]}
            >
              Order Confirmed!
            </Text>
            <Text
              style={[styles.modalOrderId, { color: colors.primary }]}
            >
              Order ID: #NOV-{Math.floor(100000 + Math.random() * 900000)}
            </Text>

            <Text
              style={[styles.modalSubtitle, { color: colors.textSecondary }]}
            >
              Thank you for shopping with NovaStore! Your package has been scheduled for express dispatch.
            </Text>

            <View
              style={[
                styles.modalDetailsBox,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.modalDetailRow}>
                <Text
                  style={[
                    styles.modalDetailLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Total Paid:
                </Text>
                <Text
                  style={[
                    styles.modalDetailValue,
                    { color: colors.textPrimary },
                  ]}
                >
                  ${finalTotal}
                </Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text
                  style={[
                    styles.modalDetailLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Estimated Arrival:
                </Text>
                <Text
                  style={[
                    styles.modalDetailValue,
                    { color: colors.textPrimary },
                  ]}
                >
                  Tomorrow by 5 PM
                </Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text
                  style={[
                    styles.modalDetailLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Payment Method:
                </Text>
                <Text
                  style={[
                    styles.modalDetailValue,
                    { color: colors.textPrimary },
                  ]}
                >
                  Cash / Card on Delivery
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.modalDoneButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleFinishOrder}
              activeOpacity={0.85}
            >
              <Text style={styles.modalDoneText}>Continue Shopping</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 14,
    paddingBottom: 40,
  },
  deliveryProgressCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  progressTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressTruck: {
    fontSize: 14,
    marginRight: 6,
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBackground: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  summarySection: {
    marginTop: 6,
  },
  promoCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  promoCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
    marginRight: 8,
  },
  applyBtn: {
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  couponErrorText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  discountAppliedBadge: {
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  discountAppliedText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  quickCouponChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  quickCouponText: {
    fontSize: 11,
    fontWeight: '600',
  },
  boldTag: {
    fontWeight: '800',
  },
  summaryCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  discountLabel: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
  },
  discountValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  freeText: {
    color: '#10B981',
    fontWeight: '800',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  checkoutButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginRight: 8,
  },
  checkoutArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  securityNote: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  shopNowButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shopNowButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  celebrateCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  celebrateEmoji: {
    fontSize: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalOrderId: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  modalDetailsBox: {
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginBottom: 18,
    borderWidth: 1,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  modalDetailLabel: {
    fontSize: 12,
  },
  modalDetailValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalDoneButton: {
    height: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDoneText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
