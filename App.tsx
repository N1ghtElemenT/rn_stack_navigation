import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { CartProvider } from "./src/context/CartContext";
import { FavoritesProvider } from "./src/context/FavoritesContext";
import DrawerNavigator from "./src/navigation/DrawerNavigator";

export default function App() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <DrawerNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </FavoritesProvider>
    </CartProvider>
  );
}

// import { NavigationContainer } from "@react-navigation/native";
// import AppTabNavigator from "./src/navigation/AppTabNavigator";
// import { DrawerNavigator } from "./src/navigation/DrawerNavigator";

// export default function App() {
//   return (
//     <NavigationContainer>
//       <DrawerNavigator />
//     </NavigationContainer>
//   );
// }

// import BookNavigator from "./src/bookshelf/BookNavigator";

// export default function App() {
//   return <BookNavigator />;
// }
