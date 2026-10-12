import type { DrawerScreenProps } from "@react-navigation/drawer";
import { useEffect } from "react";
import { Alert } from "react-native";
import BookFormScreen from "./BookFormScreen";
import { bookDatabase } from "./db/BookDatabase";
import type { RootDrawerParamList } from "./types";

type Props = DrawerScreenProps<RootDrawerParamList, "Редактировать книгу">;

const EditBookScreen = ({ route, navigation }: Props) => {
  const params = route.params;

  useEffect(() => {
    if (!params) navigation.navigate("Список книг");
  }, [params, navigation]);

  if (!params) return null;

  const { bookId, title, author } = params;

  const updateBook = async (nextTitle: string, nextAuthor: string) => {
    await bookDatabase.updateBook(bookId, nextTitle, nextAuthor);

    Alert.alert("Успех", "Книга обновлена!");
    navigation.navigate("Список книг");
  };

  return (
    <BookFormScreen
      key={bookId}
      heading="Редактировать книгу"
      submitLabel="Сохранить изменения"
      initialValues={{ title, author }}
      onSubmit={updateBook}
    />
  );
};

export default EditBookScreen;
