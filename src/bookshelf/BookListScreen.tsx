import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert, Button, FlatList, Text, View } from "react-native";
import { bookDatabase } from "./db/BookDatabase";
import { styles } from "./styles";
import type { IBookRow } from "./types";

const BookListScreen = () => {
  const [books, setBooks] = useState<IBookRow[]>([]);

  const loadBooks = async () => {
    try {
      setBooks(await bookDatabase.getBooks());
    } catch (error) {
      console.error("Ошибка при загрузке книг", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, []),
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Список книг</Text>
      {books.length > 0 && (
        <View style={styles.actionsRow}>
          <Button title="Очистить все" color="#d9534f" onPress={confirmClearAll} />
        </View>
      )}
      <FlatList data={books} keyExtractor={(item) => item.id} ListEmptyComponent={<Text style={styles.emptyText}>Книг пока нет</Text>} renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>Автор: {item.author}</Text>
            </View>
            <Button title="Удалить" color="#d9534f" onPress={() => confirmDelete(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default BookListScreen;
