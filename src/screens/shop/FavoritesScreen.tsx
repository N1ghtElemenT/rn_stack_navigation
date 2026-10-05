import { Ionicons } from "@expo/vector-icons";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { CompositeNavigationProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../../components/ProductCard";
import { useFavorites } from "../../context/FavoritesContext";
import type { ShopStackParamList } from "../../navigation/ShopNavigator";
import type { ShopTabParamList } from "../../navigation/ShopTabNavigator";
import { useProductsStore } from "../../store/useProductsStore";
import { colors, radius, spacing } from "../../theme";
import { Product } from "../../types/shop";

type FavoritesNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<ShopTabParamList, "Favorites">,
  NativeStackNavigationProp<ShopStackParamList>
>;

const HORIZONTAL_PADDING = spacing.lg;
const COLUMN_GAP = spacing.md;

export default function FavoritesScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const navigation = useNavigation<FavoritesNavigation>();
  const { products, loading, error, reload, load } = useProductsStore();
  const {
    items: favorites,
    loading: favoritesLoading,
    initialized: favoritesInitialized,
    isFavorite,
    toggleFavorite,
    reload: reloadFavorites,
  } = useFavorites();

  useEffect(() => {
    load();
  }, [load]);

  const favoriteProducts = products.filter((product) =>
    favorites.some((favorite) => favorite.productId === product.id),
  );

  const cardWidth =
    (screenWidth - HORIZONTAL_PADDING * 2 - COLUMN_GAP) / 2;

  const openProduct = (product: Product) => {
    navigation.navigate("Home", {
      screen: "Product",
      params: { productId: product.id },
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>FAVORITES</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Image
        source={require("../../../assets/icons-shop/heart-icon-png.png")}
        resizeMode="contain"
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the heart on a product to add it here.
      </Text>
    </View>
  );

  if (loading || !favoritesInitialized) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top"]}>
        {renderHeader()}
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.centerText}>Loading favorites...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top"]}>
        {renderHeader()}
        <View style={styles.center}>
          <Ionicons
            name="cloud-offline-outline"
            size={48}
            color={colors.danger}
          />
          <Text style={styles.centerText}>
            Could not reach the server.{"\n"}Make sure json-server is running.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={reload}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <FlatList
        data={favoriteProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            width={cardWidth}
            onPress={openProduct}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={(product) => toggleFavorite(product.id)}
          />
        )}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={
          favoriteProducts.length === 0
            ? [styles.listContent, styles.emptyContent]
            : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        refreshing={favoritesLoading}
        onRefresh={reloadFavorites}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
    color: colors.text,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  centerText: {
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
  emptyContent: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    tintColor: colors.border,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
