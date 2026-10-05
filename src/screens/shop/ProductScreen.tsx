import { Ionicons } from "@expo/vector-icons";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProduct } from "../../api/products";
import { useCart } from "../../context/CartContext";
import type { ShopStackParamList } from "../../navigation/ShopNavigator";
import type { ShopTabParamList } from "../../navigation/ShopTabNavigator";
import { colors, radius, spacing } from "../../theme";
import { Product } from "../../types/shop";

type Props = CompositeScreenProps<
  NativeStackScreenProps<ShopStackParamList, "Product">,
  BottomTabScreenProps<ShopTabParamList>
>;

export default function ProductScreen({ route, navigation }: Props) {
  const { productId } = route.params;
  const { width: screenWidth } = useWindowDimensions();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getProduct(productId)
      .then((data) => {
        if (cancelled) return;
        if (data) {
          setProduct(data);
          setSelectedSize(data.sizes[0] ?? null);
          setSelectedColor(data.colors[0]?.name ?? null);
        } else {
          setError("Product not found");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load product");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top"]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top"]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
        <Text style={styles.centerText}>{error ?? "Product not found"}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const imageWidth = screenWidth - spacing.lg * 2;
  const size = selectedSize ?? product.sizes[0];
  const color = selectedColor ?? product.colors[0]?.name ?? "";

  const handleAddToCart = async () => {
    await addToCart(product, size, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = async () => {
    await addToCart(product, size, color);
    navigation.navigate("Cart");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.imageWrapper, { width: imageWidth }]}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <Text style={styles.sectionLabel}>Size</Text>
        <View style={styles.optionsRow}>
          {product.sizes.map((item) => {
            const isActive = item === size;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.sizeButton, isActive && styles.sizeButtonActive]}
                onPress={() => setSelectedSize(item)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.sizeText,
                    isActive && styles.sizeTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Color</Text>
        <View style={styles.optionsRow}>
          {product.colors.map((item) => {
            const isActive = item.name === color;
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.colorButton, isActive && styles.colorButtonActive]}
                onPress={() => setSelectedColor(item.name)}
                activeOpacity={0.8}
              >
                <View
                  style={[styles.colorCircle, { backgroundColor: item.hex }]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>
              {added ? "Added ✓" : "Add to Bag"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleBuyNow}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  header: {
    paddingHorizontal: spacing.md,
    height: 48,
    justifyContent: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  imageWrapper: {
    alignSelf: "center",
    height: 300,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.lg,
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primary,
    marginTop: spacing.sm,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  sizeButton: {
    minWidth: 48,
    height: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  sizeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sizeText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  sizeTextActive: {
    color: colors.white,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  colorButtonActive: {
    borderColor: colors.primary,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: radius.pill,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
