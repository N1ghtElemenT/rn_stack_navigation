import type { DrawerScreenProps } from "@react-navigation/drawer";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { addAuthor } from "./authorStorage";
import { styles } from "./styles";
import type { RootDrawerParamList } from "./types";

type Props = DrawerScreenProps<RootDrawerParamList, "Добавить автора">;

const AddAuthorScreen = ({ navigation }: Props) => {
  const [name, setName] = useState("");
  const saveAuthor = async () => {
    const authorName = name.trim();

    if (!authorName) {
      Alert.alert("Ошибка", "Введите имя автора");
      return;
    }

    try {
      const created = await addAuthor(authorName);

      if (!created) {
        Alert.alert("Ошибка", "Такой автор уже существует");
        return;
      }

      setName("");
      Alert.alert("Успех", "Автор добавлен!");

      if (navigation.canGoBack()) navigation.goBack();
      else navigation.navigate("Список книг");
    } catch (error) {
      console.error("Ошибка при сохранении автора", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добавить автора</Text>
      <TextInput style={styles.input} placeholder="Имя автора" value={name} onChangeText={setName} />
      <Button title="Сохранить" onPress={saveAuthor} />
    </View>
  );
};

export default AddAuthorScreen;
