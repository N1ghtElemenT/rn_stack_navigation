import AsyncStorage from "@react-native-async-storage/async-storage";
import type { IBook } from "./types";

const BOOKS_KEY = "books";

export const getBooks = async (): Promise<IBook[]> => {
  const storedBooks = await AsyncStorage.getItem(BOOKS_KEY);
  if (!storedBooks) return [];
  const parsed: unknown = JSON.parse(storedBooks);
  return Array.isArray(parsed) ? (parsed as IBook[]) : [];
};

const saveBooks = async (books: IBook[]): Promise<void> => {
  await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(books));
};

export const addBook = async (book: IBook): Promise<void> => {
  const books = await getBooks();
  books.push(book);
  await saveBooks(books);
};

export const removeBookAt = async (index: number): Promise<void> => {
  const books = await getBooks();
  if (index < 0 || index >= books.length) return;
  books.splice(index, 1);
  await saveBooks(books);
};

export const clearBooks = async (): Promise<void> => {
  await AsyncStorage.removeItem(BOOKS_KEY);
};
