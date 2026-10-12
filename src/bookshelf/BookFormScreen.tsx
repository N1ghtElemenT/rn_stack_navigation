import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { bookDatabase } from "./db/BookDatabase";
import { styles } from "./styles";
import type { RootDrawerParamList } from "./types";

type Props = {
  heading: string;
  submitLabel: string;
  initialValues?: { title: string; author: string };
  onSubmit: (title: string, author: string) => Promise<void>;
};

const BookFormScreen = ({
  heading,
  submitLabel,
  initialValues,
  onSubmit,
}: Props) => {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [author, setAuthor] = useState(initialValues?.author ?? "");
  const [authors, setAuthors] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      bookDatabase
        .getAuthors()
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

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      Alert.alert("Ошибка", "Введите название книги");
      return;
    }

    if (!author) {
      Alert.alert("Ошибка", "Выберите автора книги");
      return;
    }

    try {
      await onSubmit(trimmedTitle, author);
    } catch (error) {
      console.error("Ошибка при сохранении книги", error);
      Alert.alert("Ошибка", "Не удалось сохранить книгу");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={styles.title}>{heading}</Text>
        <TextInput
          style={styles.input}
          placeholder="Название книги"
          value={title}
          onChangeText={setTitle}
          returnKeyType="done"
        />
        <Text style={styles.sectionLabel}>Автор</Text>
        {authors.length === 0 ? (
          <Text style={styles.hint}>Авторов пока нет, создайте первого</Text>
        ) : (
          <View style={styles.chipsRow}>
            {authors.map((name) => {
              const isSelected = author === name;

              return (
                <Pressable
                  key={name}
                  onPress={() => setAuthor(name)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
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
          <Button title={submitLabel} onPress={handleSubmit} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BookFormScreen;

