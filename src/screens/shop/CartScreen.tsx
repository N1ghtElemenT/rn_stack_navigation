import { Ionicons } from "@expo/vector-icons";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CartItemCard from "../../components/cart/CartItemCard";
import { useCart } from "../../context/CartContext";
import useProducts from "../../hooks/useProducts";
import type { ShopTabParamList } from "../../navigation/ShopTabNavigator";
import { colors, radius, spacing } from "../../theme";
import { CartLine } from "../../types/shop";

type Props = BottomTabScreenProps<ShopTabParamList, "Cart">;

const SHIPPING_PRICE = 5;

export default function CartScreen({ navigation }: Props) {
  const {
    items,
    loading: cartLoading,
    error: cartError,
    reload: reloadCart,
    updateQuantity,
  } = useCart();
  const { products, loading: productsLoading } = useProducts();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Home");
    }
  };

  const lines = useMemo<CartLine[]>(() => {
    return items
      .map((entry) => {
        const product = products.find((p) => p.id === entry.productId);
        return product ? { entry, product } : null;
      })
      .filter((line): line is CartLine => line !== null);
  }, [items, products]);

  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.price * line.entry.quantity,
    0,
  );
  const shipping = subtotal > 0 ? SHIPPING_PRICE : 0;
  const total = subtotal + shipping;

  const loading = cartLoading || productsLoading;

  const renderSummary = () => (
    <View style={styles.summary}>
      <Text style={styles.summaryTitle}>Order Summary</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Shipping</Text>
        <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={styles.placeOrderButton}
        activeOpacity={0.85}
        onPress={() => {}}
      >
        <Text style={styles.placeOrderText}>PLACE ORDER</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top"]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.centerText}>Loading your bag...</Text>
      </SafeAreaView>
    );
  }

  if (cartError && items.length === 0) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top"]}>
        <Ionicons
          name="cloud-offline-outline"
          size={48}
          color={colors.textSecondary}
        />
        <Text style={styles.centerText}>Could not load your bag</Text>
        <Text style={styles.errorDetail}>{cartError}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          activeOpacity={0.85}
          onPress={reloadCart}
        >
          <Text style={styles.retryText}>TRY AGAIN</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>YOUR BAG</Text>
        <View style={styles.backButton} />
      </View>

      <FlatList
        data={lines}
        keyExtractor={(item) => item.entry.id}
        renderItem={({ item }) => (
          <CartItemCard line={item} onUpdateQuantity={updateQuantity} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Your bag is empty</Text>
          </View>
        }
        ListFooterComponent={renderSummary}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  centerText: {
    marginTop: spacing.md,
    fontSize: 15,
    color: colors.textSecondary,
  },
  errorDetail: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
  retryButton: {
    marginTop: spacing.lg,
    height: 48,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  retryText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    paddingHorizontal: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
    color: colors.text,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  summary: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  placeOrderButton: {
    marginTop: spacing.lg,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  placeOrderText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
