import { Ionicons } from "@expo/vector-icons";
import type { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import CategoryCard from "../components/CategoryCard";
import type { DrawerParamList } from "../navigation/DrawerNavigator";
import { useCategoriesStore } from "../store/useCategoriesStore";
import { colors, radius, spacing } from "../theme";

type Props = DrawerScreenProps<DrawerParamList, "Categories">;

const HORIZONTAL_PADDING = spacing.lg;
const COLUMN_GAP = spacing.md;

export default function CategoriesScreen({ navigation }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const { categories, loading, error, reload, load } = useCategoriesStore();

  useEffect(() => {
    load();
  }, [load]);

  const cardWidth =
    (screenWidth - HORIZONTAL_PADDING * 2 - COLUMN_GAP) / 2;

  const openCategory = () => {
    navigation.navigate("Home");
  };

  if (loading && categories.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.centerText}>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.danger} />
        <Text style={styles.centerText}>
          Could not reach the server.{"\n"}Make sure json-server is running.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={reload}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      numColumns={2}
      ListHeaderComponent={
        <Text style={styles.heading}>Shop by category</Text>
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>No categories found</Text>
      }
      renderItem={({ item }) => (
        <CategoryCard
          category={item}
          width={cardWidth}
          onPress={openCategory}
        />
      )}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshing={loading}
      onRefresh={reload}
    />
  );
}

const styles = StyleSheet.create({
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  heading: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: spacing.xl,
  },
});
