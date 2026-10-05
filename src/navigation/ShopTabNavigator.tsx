import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  getFocusedRouteNameFromRoute,
  type NavigatorScreenParams,
} from "@react-navigation/native";
import {
  SearchFocusProvider,
  useSearchFocus,
} from "../context/SearchFocusContext";
import CartScreen from "../screens/shop/CartScreen";
import FavoritesScreen from "../screens/shop/FavoritesScreen";
import ProfileScreen from "../screens/shop/ProfileScreen";
import SearchPlaceholderScreen from "../screens/shop/SearchPlaceholderScreen";
import ShopNavigator, { type ShopStackParamList } from "./ShopNavigator";
import { colors } from "../theme";

export type ShopTabParamList = {
  Home: NavigatorScreenParams<ShopStackParamList> | undefined;
  Search: undefined;
  Favorites: undefined;
  Cart: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<ShopTabParamList>();

const makeTabIcon = (source: number) => {
  const TabIcon = ({ color }: { color: string }) => (
    <Image
      source={source}
      resizeMode="contain"
      style={{ width: 24, height: 24, tintColor: color }}
    />
  );
  TabIcon.displayName = "TabIcon";
  return TabIcon;
};

const icons = {
  home: makeTabIcon(require("../../assets/icons-shop/home-icon-png.png")),
  search: makeTabIcon(require("../../assets/icons-shop/search-icon-png.png")),
  favorites: makeTabIcon(require("../../assets/icons-shop/heart-icon-png.png")),
  cart: makeTabIcon(require("../../assets/icons-shop/bag-icon-png.png")),
  profile: makeTabIcon(require("../../assets/icons-shop/profile-icon-png.png")),
};

const tabBarStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.border,
};

function ShopTabs() {
  const { requestFocus } = useSearchFocus();

  return (
    <Tab.Navigator
      backBehavior="initialRoute"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelVisibilityMode: "unlabeled",
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarHideOnKeyboard: true,
        tabBarStyle:
          route.name === "Home" &&
          getFocusedRouteNameFromRoute(route) === "Product"
            ? { ...tabBarStyle, display: "none" as const }
            : tabBarStyle,
      })}
    >
      <Tab.Screen
        name="Home"
        component={ShopNavigator}
        options={{ tabBarIcon: icons.home }}
      />
      <Tab.Screen
        name="Search"
        component={SearchPlaceholderScreen}
        options={{ tabBarIcon: icons.search }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Home", { screen: "ShopHome", pop: true });
            requestFocus();
          },
        })}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarIcon: icons.favorites }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarIcon: icons.cart }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: icons.profile }}
      />
    </Tab.Navigator>
  );
}

export default function ShopTabNavigator() {
  return (
    <SearchFocusProvider>
      <ShopTabs />
    </SearchFocusProvider>
  );
}
