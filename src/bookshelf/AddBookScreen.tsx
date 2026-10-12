import type { DrawerScreenProps } from "@react-navigation/drawer";
import { Alert } from "react-native";
import BookFormScreen from "./BookFormScreen";
import { bookDatabase } from "./db/BookDatabase";
import type { RootDrawerParamList } from "./types";

type Props = DrawerScreenProps<RootDrawerParamList, "Добавить книгу">;

const AddBookScreen = ({ navigation }: Props) => {
  const saveBook = async (title: string, author: string) => {
    await bookDatabase.addBook(title, author);

    Alert.alert("Успех", "Книга добавлена!");
    navigation.navigate("Список книг");
  };

  return (
    <BookFormScreen
      heading="Добавить книгу"
      submitLabel="Сохранить"
      onSubmit={saveBook}
    />
  );
};

export default AddBookScreen;
