import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import useProducts from "../../hooks/useProducts";
import { ShopStackParamList } from "../../navigation/ShopNavigator";
import { colors, radius, spacing } from "../../theme";
import { Product } from "../../types/shop";

type Props = NativeStackScreenProps<ShopStackParamList, "ShopHome">;

const HORIZONTAL_PADDING = spacing.lg;
const COLUMN_GAP = spacing.md;

export default function ShopHomeScreen({ navigation }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const { products, loading, error, reload } = useProducts();
  const { cartCount } = useCart();
  const [search, setSearch] = useState("");

  const cardWidth =
    (screenWidth - HORIZONTAL_PADDING * 2 - COLUMN_GAP) / 2;

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      product.title.toLowerCase().includes(query),
    );
  }, [products, search]);

  const openProduct = (product: Product) => {
    navigation.navigate("Product", { productId: product.id });
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View style={styles.headerSide} />

        <View style={styles.titleWrapper}>
          <Text style={styles.title}>
            <Text style={styles.titleAccent}>AURA </Text>
            <Text style={styles.titleDark}>SHOP</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerSide}
          onPress={() => navigation.navigate("Cart")}
        >
          <Ionicons name="cart-outline" size={26} color={colors.text} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartCount > 9 ? "9+" : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
        </View>

        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
          <Ionicons name="options-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top"]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.centerText}>Loading products...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top"]}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.danger} />
        <Text style={styles.centerText}>
          Could not reach the server.{"\n"}Make sure json-server is running.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={reload}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found</Text>
        }
        renderItem={({ item }) => (
          <ProductCard product={item} width={cardWidth} onPress={openProduct} />
        )}
        columnWrapperStyle={{ justifyContent: "space-between" }}
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
    textAlign: "center",
    lineHeight: 22,
  },
  retryButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  retryText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    marginTop: spacing.sm,
  },
  headerSide: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
  },
  titleAccent: {
    color: colors.primary,
  },
  titleDark: {
    color: colors.text,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    paddingRight: spacing.sm,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    padding: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: spacing.xl,
  },
});
