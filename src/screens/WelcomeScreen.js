// src/screens/WelcomeScreen.js
// Production-grade Onboarding & Welcome Screen for NovaStore with Theme Support

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 'slide-1',
    badge: 'NEW GENERATION 2026',
    title: 'Curated Luxury\n& Modern Tech',
    subtitle:
      'Explore handpicked premium audio, trending designer footwear, and smart accessories all in one place.',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    tag: '🎧 Sony WH-1000XM5',
    price: '$299',
    chip: '🔥 Bestseller',
  },
  {
    id: 'slide-2',
    badge: 'LIGHTNING DISPATCH',
    title: 'Superfast 24h\nDoorstep Delivery',
    subtitle:
      'Instant order processing with live doorstep tracking. Free express shipping on all orders over $200.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    tag: '👟 Nike Air Max 270',
    price: '$159',
    chip: '⚡ Express 24h',
  },
  {
    id: 'slide-3',
    badge: 'AUTHENTIC & TRUSTED',
    title: '100% Genuine\n& Easy Returns',
    subtitle:
      'Every product is verified and guaranteed authentic with brand warranty and 7-day hassle-free returns.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    tag: '⌚ Apple Watch Series 9',
    price: '$399',
    chip: '🛡️ Verified Authentic',
  },
];

const SOCIAL_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
];

export const WelcomeScreen = ({ navigation, onGetStarted }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isDark, colors, toggleTheme } = useTheme();
  const flatListRef = useRef(null);
  const scaleBtnAnim = useRef(new Animated.Value(1)).current;

  const handleFinish = () => {
    if (onGetStarted) {
      onGetStarted();
    } else if (navigation) {
      navigation.replace('Main');
    }
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleBtnAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleBtnAnim, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const renderSlideItem = ({ item }) => (
    <View style={styles.slideContainer}>
      {/* Product Visual Card with Real High-Res Photography */}
      <View
        style={[
          styles.imageCardContainer,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Floating Tag / Price Pill */}
        <View style={styles.floatingPriceBadge}>
          <Text style={styles.floatingPriceText}>{item.price}</Text>
        </View>

        {/* Floating Category / Status Chip */}
        <View style={styles.floatingStatusChip}>
          <Text style={styles.floatingStatusText}>{item.chip}</Text>
        </View>

        {/* Product label footer overlay */}
        <View style={styles.cardFooterOverlay}>
          <Text style={styles.productLabelText} numberOfLines={1}>
            {item.tag}
          </Text>
        </View>
      </View>

      {/* Slide Badge Pill */}
      <View style={styles.slideBadgeWrapper}>
        <View
          style={[
            styles.slideBadge,
            {
              backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
              borderColor: isDark ? '#334155' : '#DBEAFE',
            },
          ]}
        >
          <Text style={[styles.slideBadgeDot, { color: colors.primary }]}>
            ●
          </Text>
          <Text style={[styles.slideBadgeText, { color: colors.primary }]}>
            {item.badge}
          </Text>
        </View>
      </View>

      {/* Slide Title & Description */}
      <Text style={[styles.slideTitle, { color: colors.textPrimary }]}>
        {item.title}
      </Text>
      <Text style={[styles.slideSubtitle, { color: colors.textSecondary }]}>
        {item.subtitle}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Top App Header with Brand Logo, Theme Toggle & Skip Button */}
      <View style={styles.topHeader}>
        <View style={styles.logoRow}>
          <View
            style={[
              styles.logoIconCircle,
              { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
            ]}
          >
            <Text style={styles.logoEmoji}>🛍️</Text>
          </View>
          <Text style={[styles.logoText, { color: colors.textPrimary }]}>
            Nova
            <Text style={[styles.logoTextAccent, { color: colors.primary }]}>
              Store
            </Text>
          </Text>
        </View>

        <View style={styles.headerRightActions}>
          {/* Theme Toggle Button */}
          <TouchableOpacity
            style={[
              styles.themeToggleBtn,
              { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity
            onPress={handleFinish}
            activeOpacity={0.7}
            style={[
              styles.skipButton,
              { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
            ]}
          >
            <Text
              style={[
                styles.skipButtonText,
                { color: colors.textSecondary },
              ]}
            >
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Swipable Onboarding Slider */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderSlideItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        />

        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {SLIDES.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  isActive
                    ? [styles.dotActive, { backgroundColor: colors.primary }]
                    : [
                        styles.dotInactive,
                        {
                          backgroundColor: isDark ? '#334155' : '#CBD5E1',
                        },
                      ],
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* Social Proof & Trust Strip */}
      <View
        style={[
          styles.trustSection,
          {
            backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.avatarStack}>
          {SOCIAL_AVATARS.map((avatarUrl, idx) => (
            <Image
              key={idx}
              source={{ uri: avatarUrl }}
              style={[styles.avatarImage, idx > 0 && styles.avatarOverlap]}
            />
          ))}
        </View>
        <View style={styles.trustInfo}>
          <View style={styles.starsRow}>
            <Text style={styles.starIcon}>★ ★ ★ ★ ★</Text>
            <Text
              style={[styles.ratingNumber, { color: colors.textPrimary }]}
            >
              4.9/5
            </Text>
          </View>
          <Text
            style={[styles.trustSubtext, { color: colors.textSecondary }]}
          >
            Trusted by 50,000+ active shoppers
          </Text>
        </View>
      </View>

      {/* Promo Offer Banner */}
      <View
        style={[
          styles.promoBanner,
          {
            backgroundColor: isDark ? '#362F1E' : '#FEF3C7',
          },
        ]}
      >
        <Text style={styles.promoIcon}>🎁</Text>
        <Text
          style={[
            styles.promoText,
            { color: isDark ? '#FDE68A' : '#92400E' },
          ]}
        >
          Use code{' '}
          <Text
            style={[
              styles.promoCode,
              { color: isDark ? '#FCD34D' : '#B45309' },
            ]}
          >
            NOVA20
          </Text>{' '}
          for 20% off your 1st order!
        </Text>
      </View>

      {/* Bottom Sticky Action Area */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleNext}
        >
          <Animated.View
            style={[
              styles.ctaButton,
              { backgroundColor: colors.primary },
              { transform: [{ scale: scaleBtnAnim }] },
            ]}
          >
            <Text style={styles.ctaButtonText}>
              {currentIndex === SLIDES.length - 1
                ? 'Explore NovaStore'
                : 'Continue'}
            </Text>
            <Text style={styles.ctaArrow}>→</Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Guest / Direct Entry Link */}
        <TouchableOpacity
          style={styles.signInRow}
          activeOpacity={0.7}
          onPress={handleFinish}
        >
          <Text
            style={[styles.signInMuted, { color: colors.textSecondary }]}
          >
            Already have an account?{' '}
          </Text>
          <Text style={[styles.signInLink, { color: colors.primary }]}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoEmoji: {
    fontSize: 16,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  logoTextAccent: {
    fontWeight: '800',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  themeIcon: {
    fontSize: 15,
  },
  skipButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skipButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  slideContainer: {
    width: width,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCardContainer: {
    width: width - 48,
    height: 195,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  floatingPriceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  floatingPriceText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  floatingStatusChip: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  floatingStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardFooterOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  productLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  slideBadgeWrapper: {
    marginBottom: 6,
  },
  slideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  slideBadgeDot: {
    fontSize: 8,
    marginRight: 6,
  },
  slideBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 28,
  },
  slideSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
  },
  dotInactive: {
    width: 6,
  },
  trustSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarOverlap: {
    marginLeft: -10,
  },
  trustInfo: {
    flex: 1,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    color: '#F59E0B',
    fontSize: 11,
    marginRight: 4,
    letterSpacing: 1,
  },
  ratingNumber: {
    fontSize: 11,
    fontWeight: '700',
  },
  trustSubtext: {
    fontSize: 10,
    fontWeight: '500',
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  promoIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  promoText: {
    fontSize: 11,
    fontWeight: '600',
  },
  promoCode: {
    fontWeight: '800',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  ctaArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signInMuted: {
    fontSize: 12,
  },
  signInLink: {
    fontSize: 12,
    fontWeight: '700',
  },
});
