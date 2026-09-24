import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, radius, spacing } from "../../theme";
import { CartLine } from "../../types/shop";

interface CartItemCardProps {
  line: CartLine;
  onUpdateQuantity: (entryId: string, quantity: number) => void;
}

export default function CartItemCard({
  line,
  onUpdateQuantity,
}: CartItemCardProps) {
  const { entry, product } = line;

  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.meta}>
          Size {entry.size} · Color {entry.color}
        </Text>
        <Text style={styles.price}>${(product.price * entry.quantity).toFixed(2)}</Text>
      </View>

      <View style={styles.quantity}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => onUpdateQuantity(entry.id, entry.quantity - 1)}
        >
          <Ionicons name="remove" size={16} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.quantityValue}>{entry.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => onUpdateQuantity(entry.id, entry.quantity + 1)}
        >
          <Ionicons name="add" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  info: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginTop: 4,
  },
  quantity: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityValue: {
    minWidth: 24,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
});
