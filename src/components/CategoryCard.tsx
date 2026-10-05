import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Category } from "../types/shop";
import { colors, radius, spacing } from "../theme";

interface CategoryCardProps {
  category: Category;
  width: number;
  onPress: (category: Category) => void;
}

export default function CategoryCard({
  category,
  width,
  onPress,
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { width }]}
      activeOpacity={0.8}
      onPress={() => onPress(category)}
    >
      <Image
        source={{ uri: category.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.name} numberOfLines={2}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  image: {
    width: "100%",
    height: 170,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
});
