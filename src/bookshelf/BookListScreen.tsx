import type { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";
import { bookDatabase } from "./db/BookDatabase";
import { styles } from "./styles";
import type { IBookRow, RootDrawerParamList } from "./types";

type Props = DrawerScreenProps<RootDrawerParamList, "Список книг">;

const BookListScreen = ({ navigation }: Props) => {
  const [books, setBooks] = useState<IBookRow[]>([]);
  const [query, setQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const term = query.trim();

      const request = term
        ? bookDatabase.searchBooks(term)
        : bookDatabase.getBooks();

      request
        .then((rows) => {
          if (active) setBooks(rows);
        })
        .catch((error) => console.error("Ошибка при загрузке книг", error));

      return () => {
        active = false;
      };
    }, [query]),
  );

  const deleteBook = async (id: string) => {
    try {
      await bookDatabase.removeBook(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении книги", error);
    }
  };

  const confirmDelete = (id: string) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;
    Alert.alert("Удаление", `Удалить книгу "${book.title}"?`, [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: () => deleteBook(id),
      },
    ]);
  };

  const clearAllBooks = async () => {
    try {
      await bookDatabase.clearBooks();
      setBooks([]);
    } catch (error) {
      console.error("Ошибка при очистке списка книг", error);
    }
  };

  const confirmClearAll = () => {
    Alert.alert("Очистить все", "Удалить все книги из списка?", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить все",
        style: "destructive",
        onPress: clearAllBooks,
      },
    ]);
  };

  const openEdit = (book: IBookRow) => {
    navigation.navigate("Редактировать книгу", {
      bookId: book.id,
      title: book.title,
      author: book.author,
    });
  };

  const isSearching = query.trim().length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Список книг</Text>
      <TextInput
        style={styles.input}
        placeholder="Поиск по названию или автору"
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        returnKeyType="search"
      />
      {books.length > 0 && (
        <View style={styles.actionsRow}>
          <Button
            title="Очистить все"
            color="#d9534f"
            onPress={confirmClearAll}
          />
        </View>
      )}
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isSearching ? "Ничего не найдено" : "Книг пока нет"}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>Автор: {item.author}</Text>
            </View>
            <View style={styles.bookActions}>
              <Button
                title="Изменить"
                color="#f0ad4e"
                onPress={() => openEdit(item)}
              />
              <Button
                title="Удалить"
                color="#d9534f"
                onPress={() => confirmDelete(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default BookListScreen;
