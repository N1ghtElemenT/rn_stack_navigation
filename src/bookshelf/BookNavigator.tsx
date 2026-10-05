import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import AddAuthorScreen from "./AddAuthorScreen";
import AddBookScreen from "./AddBookScreen";
import BookListScreen from "./BookListScreen";
import { bookDatabase } from "./db/BookDatabase";
import type { RootDrawerParamList } from "./types";

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const BookNavigator = () => {
  useEffect(() => {
    bookDatabase.openDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Список книг">
        <Drawer.Screen name="Список книг" component={BookListScreen} />
        <Drawer.Screen name="Добавить книгу" component={AddBookScreen} />
        <Drawer.Screen name="Добавить автора" component={AddAuthorScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default BookNavigator;
