import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTHORS_KEY = "authors";

export const getAuthors = async (): Promise<string[]> => {
  const storedAuthors = await AsyncStorage.getItem(AUTHORS_KEY);
  if (!storedAuthors) return [];

  const parsed: unknown = JSON.parse(storedAuthors);
  return Array.isArray(parsed) ? (parsed as string[]) : [];
};

export const addAuthor = async (name: string): Promise<boolean> => {
  const authors = await getAuthors();
  if (authors.includes(name)) return false;

  authors.push(name);
  await AsyncStorage.setItem(AUTHORS_KEY, JSON.stringify(authors));
  return true;
};
