import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import ShopNavigator from './src/navigation/ShopNavigator';
import { CartProvider } from './src/context/CartContext';
import { AppTabNavigator } from './src/navigation/AppTabNavigator';

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <ShopNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </CartProvider>
    // <NavigationContainer>
    //   <AppTabNavigator />
    //   <StatusBar style="auto" />
    // </NavigationContainer>
  );
}
