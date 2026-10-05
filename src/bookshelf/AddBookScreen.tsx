import { useFocusEffect } from "@react-navigation/native";
import type { DrawerScreenProps } from "@react-navigation/drawer";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { getAuthors } from "./authorStorage";
import { bookDatabase } from "./db/BookDatabase";
import { styles } from "./styles";
import type { RootDrawerParamList } from "./types";

type Props = DrawerScreenProps<RootDrawerParamList, "Добавить книгу">;

const AddBookScreen = ({ navigation }: Props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      getAuthors()
        .then((storedAuthors) => {
          if (active) setAuthors(storedAuthors);
        })
        .catch((error) => console.error("Ошибка при загрузке авторов", error));

      return () => {
        active = false;
      };
    }, []),
  );

  const openAuthorForm = () => navigation.navigate("Добавить автора");

  const saveBook = async () => {
    if (!title) {
      Alert.alert("Ошибка", "Введите название книги");
      return;
    }

    if (!author) {
      Alert.alert("Ошибка", "Выберите автора книги");
      return;
    }

    try {
      await bookDatabase.addBook(title, author);

      setTitle("");
      setAuthor("");
      Alert.alert("Успех", "Книга добавлена!");
      navigation.navigate("Список книг");
    } catch (error) {
      console.error("Ошибка при сохранении книги", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добавить книгу</Text>
      <TextInput style={styles.input} placeholder="Название книги" value={title} onChangeText={setTitle} />
      <Text style={styles.sectionLabel}>Автор</Text>
      {authors.length === 0 ? (
        <Text style={styles.hint}>Авторов пока нет, создайте первого</Text>
      ) : (
        <View style={styles.chipsRow}>
          {authors.map((name) => {
            const isSelected = author === name;

            return (
              <Pressable key={name} onPress={() => setAuthor(name)} style={[styles.chip, isSelected && styles.chipSelected]}>
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextSelected]}
                >
                  {name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
      <Button title="Добавить автора" onPress={openAuthorForm} />
      <View style={styles.bookFormButton}>
        <Button title="Сохранить" onPress={saveBook} />
      </View>
    </View>
  );
};

export default AddBookScreen;
