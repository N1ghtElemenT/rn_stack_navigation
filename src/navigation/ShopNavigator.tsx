import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "../screens/shop/CartScreen";
import ProductScreen from "../screens/shop/ProductScreen";
import ShopHomeScreen from "../screens/shop/ShopHomeScreen";

export type ShopStackParamList = {
  ShopHome: undefined;
  Product: { productId: string };
  Cart: undefined;
};

const Stack = createNativeStackNavigator<ShopStackParamList>();

export default function ShopNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShopHome" component={ShopHomeScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
}
