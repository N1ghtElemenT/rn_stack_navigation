import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Image } from "react-native";
import CategoriesScreen from "../screens/CategoriesScreen";
import MyOrdersScreen from "../screens/MyOrdersScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { colors } from "../theme";
import ShopTabNavigator from "./ShopTabNavigator";

export type DrawerParamList = {
  Home: undefined;
  Categories: undefined;
  MyOrders: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const makeDrawerImageIcon = (source: number) => {
  const DrawerImageIcon = ({ color, size }: { color: string; size: number }) => (
    <Image
      source={source}
      resizeMode="contain"
      style={{ width: size, height: size, tintColor: color }}
    />
  );
  DrawerImageIcon.displayName = "DrawerImageIcon";
  return DrawerImageIcon;
};

const homeIcon = makeDrawerImageIcon(
  require("../../assets/icons-shop/home-icon-png.png"),
);

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "800" },
        headerShadowVisible: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerLabelStyle: { fontSize: 15, fontWeight: "600" },
        drawerStyle: { width: 300 },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={ShopTabNavigator}
        options={{
          headerShown: false,
          drawerIcon: homeIcon,
        }}
      />
      <Drawer.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: "Categories",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="MyOrders"
        component={MyOrdersScreen}
        options={{
          title: "My Orders",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
