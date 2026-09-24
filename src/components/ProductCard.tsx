import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Product } from "../types/shop";
import { colors, radius, spacing } from "../theme";

interface ProductCardProps {
  product: Product;
  width: number;
  onPress: (product: Product) => void;
}

export default function ProductCard({
  product,
  width,
  onPress,
}: ProductCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { width }]}
      activeOpacity={0.8}
      onPress={() => onPress(product)}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {product.title}
      </Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  imageWrapper: {
    width: "100%",
    height: 170,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
});
