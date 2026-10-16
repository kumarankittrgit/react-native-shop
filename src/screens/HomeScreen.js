// src/screens/HomeScreen.js
// Production-grade Elastic Catalog Screen for NovaStore with Theme Support

import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { Header } from '../components/common/Header';
import { ProductCard } from '../components/product/ProductCard';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export const HomeScreen = ({
  navigation,
  onProductSelect,
  onOpenCart,
  onOpenWelcome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { totalAmount } = useCart();
  const { isDark, colors } = useTheme();

  // Elastic pill anim
  const pillScaleAnim = useRef(new Animated.Value(1)).current;

  const handleProductSelect = (product) => {
    if (onProductSelect) {
      onProductSelect(product);
    } else if (navigation) {
      navigation.navigate('ProductDetail', { product });
    }
  };

  const handleOpenCart = () => {
    if (onOpenCart) {
      onOpenCart();
    } else if (navigation) {
      navigation.navigate('CartTab');
    }
  };

  const handleOpenWelcome = () => {
    if (onOpenWelcome) {
      onOpenWelcome();
    } else if (navigation) {
      navigation.navigate('Welcome');
    }
  };

  const handleCategoryPress = (cat) => {
    setSelectedCategory(cat);
    Animated.sequence([
      Animated.timing(pillScaleAnim, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(pillScaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Search and Category filter logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Free shipping tracker calculations
  const freeShippingThreshold = 200;
  const progressPercent = Math.min(
    (totalAmount / freeShippingThreshold) * 100,
    100
  );
  const remainingForFree = Math.max(freeShippingThreshold - totalAmount, 0);

  // List Header with Banner and Meter
  const renderListHeader = () => (
    <View style={styles.headerSection}>
      {/* Free Delivery Elastic Tracker */}
      <View
        style={[
          styles.shippingTrackerCard,
          {
            backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
            borderColor: isDark ? '#334155' : '#DBEAFE',
          },
        ]}
      >
        <View style={styles.trackerTopRow}>
          <Text style={styles.trackerIcon}>🚚</Text>
          <Text style={[styles.trackerTitle, { color: colors.primary }]}>
            {totalAmount >= freeShippingThreshold
              ? '🎉 Unlocked Free Express Delivery!'
              : totalAmount > 0
              ? `Add $${remainingForFree} more for FREE Delivery`
              : 'Free Express Shipping on orders over $200'}
          </Text>
        </View>
        <View
          style={[
            styles.progressBarBackground,
            { backgroundColor: isDark ? '#334155' : '#DBEAFE' },
          ]}
        >
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progressPercent}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>
      </View>

      {/* Featured Flash Deal Banner */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.dealBanner}
        onPress={() => setSelectedCategory('All')}
      >
        <View style={styles.dealContent}>
          <View style={styles.dealBadge}>
            <Text style={styles.dealBadgeText}>⚡ FLASH DEAL</Text>
          </View>
          <Text style={styles.dealTitle}>Summer Tech Drop</Text>
          <Text style={styles.dealSubtitle}>
            Up to 40% OFF trending gadgets & audio
          </Text>
          <View style={styles.dealCodeRow}>
            <Text style={styles.dealCodeText}>Code: </Text>
            <Text style={styles.dealCodeTag}>NOVA20</Text>
          </View>
        </View>
        <View style={styles.dealVisualBox}>
          <Text style={styles.dealVisualEmoji}>🎧</Text>
          <View style={styles.dealDiscountTag}>
            <Text style={styles.dealDiscountText}>-40%</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Results summary bar */}
      <View style={styles.resultsSummaryRow}>
        <Text style={[styles.resultsCountText, { color: colors.textSecondary }]}>
          {filteredProducts.length}{' '}
          {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
        </Text>
        {selectedCategory !== 'All' && (
          <TouchableOpacity
            onPress={() => setSelectedCategory('All')}
            style={[
              styles.resetFilterButton,
              { backgroundColor: colors.inputBackground },
            ]}
          >
            <Text style={[styles.resetFilterText, { color: colors.primary }]}>
              Clear Filter ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. Header with Cart Badge & Theme Toggle */}
      <Header
        title="⚡ NovaStore"
        showCart={true}
        showThemeToggle={true}
        onCartPress={handleOpenCart}
        onBackPress={handleOpenWelcome}
      />

      {/* 2. Search Bar */}
      <View
        style={[
          styles.searchWrapper,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.inputBackground },
          ]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search products, shoes, audio..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={[styles.clearText, { color: colors.textSecondary }]}>
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 3. Horizontal Elastic Category Pills */}
      <View
        style={[
          styles.categoryContainer,
          {
            backgroundColor: colors.cardBackground,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.8}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.inputBackground,
                  },
                ]}
                onPress={() => handleCategoryPress(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textSecondary,
                    },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 4. Products Grid using FlatList */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => handleProductSelect(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              No Products Found
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.textSecondary }]}
            >
              Try searching with another keyword or category.
            </Text>
            <TouchableOpacity
              style={[styles.resetSearchBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              <Text style={styles.resetSearchBtnText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  clearText: {
    fontSize: 14,
    padding: 4,
  },
  categoryContainer: {
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  categoryScroll: {
    paddingHorizontal: 14,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
  },
  headerSection: {
    paddingHorizontal: 6,
    paddingTop: 8,
    marginBottom: 6,
  },
  shippingTrackerCard: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  trackerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  trackerIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  trackerTitle: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  progressBarBackground: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  dealBanner: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  dealContent: {
    flex: 1,
  },
  dealBadge: {
    backgroundColor: '#F9B023',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  dealBadgeText: {
    color: '#78350F',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dealTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  dealSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 8,
  },
  dealCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dealCodeText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  dealCodeTag: {
    color: '#FCD34D',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dealVisualBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: 12,
  },
  dealVisualEmoji: {
    fontSize: 32,
  },
  dealDiscountTag: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dealDiscountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  resultsSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  resultsCountText: {
    fontSize: 13,
    fontWeight: '700',
  },
  resetFilterButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resetFilterText: {
    fontSize: 11,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetSearchBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resetSearchBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
