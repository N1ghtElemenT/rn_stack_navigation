import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import * as SQLite from "expo-sqlite";
import { v4 as uuidv4 } from "uuid";
import type { IBookRow } from "../types";

const DB_NAME = process.env.EXPO_PUBLIC_DB_NAME ?? "books.db";
const LEGACY_AUTHORS_KEY = "authors";

class BookDatabase {
  private static instance: BookDatabase | null = null;
  private db: SQLite.SQLiteDatabase | null = null;
  private opening: Promise<SQLite.SQLiteDatabase> | null = null;

  private constructor() {}

  static getInstance(): BookDatabase {
    if (!BookDatabase.instance) {
      BookDatabase.instance = new BookDatabase();
    }
    return BookDatabase.instance;
  }

  openDatabase = (): Promise<SQLite.SQLiteDatabase> => {
    if (this.db) return Promise.resolve(this.db);

    if (!this.opening) {
      this.opening = this.initDatabase().catch((error) => {
        this.opening = null;
        throw error;
      });
    }

    return this.opening;
  };

  private initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    this.db = db;
    console.log("База даних відкрита");

    await this.createTables();
    await this.migrateLegacyAuthors();

    return db;
  };

  getDb = (): SQLite.SQLiteDatabase | null => this.db;

  private createTables = async (): Promise<void> => {
    if (!this.db) return;

    const table = "books";
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${table} (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL
      );
    `);
    console.log(`Таблиця ${table} створена`);

    const authorsTable = "authors";
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${authorsTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `);
    console.log(`Таблиця ${authorsTable} створена`);
  };

  private migrateLegacyAuthors = async (): Promise<void> => {
    if (!this.db) return;

    try {
      const stored = await AsyncStorage.getItem(LEGACY_AUTHORS_KEY);
      if (!stored) return;

      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        for (const name of parsed) {
          if (typeof name === "string" && name.trim()) {
            await this.db.runAsync(
              "INSERT OR IGNORE INTO authors (name) VALUES (?);",
              [name.trim()],
            );
          }
        }
      }

      await AsyncStorage.removeItem(LEGACY_AUTHORS_KEY);
    } catch (error) {
      console.error("Не вдалося перенести авторів до БД:", error);
    }
  };
  addBook = async (title: string, author: string): Promise<string> => {
    const db = await this.openDatabase();

    if (!title || !author) {
      throw new Error("Введіть назву та автора");
    }

    const id = uuidv4();
    try {
      await db.runAsync(
        "INSERT INTO books (id, title, author) VALUES (?, ?, ?);",
        [id, title, author],
      );
      console.log(`Книга "${title}" додана до БД з id: ${id}`);
      return id;
    } catch (error) {
      console.error("Помилка при додаванні книги:", error);
      throw error;
    }
  };

  getBooks = async (): Promise<IBookRow[]> => {
    const db = await this.openDatabase();

    return db.getAllAsync<IBookRow>(
      "SELECT id, title, author FROM books ORDER BY title;",
    );
  };

  searchBooks = async (query: string): Promise<IBookRow[]> => {
    const db = await this.openDatabase();

    const term = `%${query.trim()}%`;
    return db.getAllAsync<IBookRow>(
      `SELECT id, title, author FROM books
       WHERE title LIKE ? OR author LIKE ?
       ORDER BY title;`,
      [term, term],
    );
  };

  updateBook = async (
    id: string,
    title: string,
    author: string,
  ): Promise<void> => {
    const db = await this.openDatabase();

    if (!title || !author) {
      throw new Error("Введіть назву та автора");
    }

    try {
      const result = await db.runAsync(
        "UPDATE books SET title = ?, author = ? WHERE id = ?;",
        [title, author, id],
      );

      if (result.changes === 0) {
        throw new Error("Книгу не знайдено");
      }
    } catch (error) {
      console.error("Помилка при оновленні книги:", error);
      throw error;
    }
  };

  removeBook = async (id: string): Promise<void> => {
    const db = await this.openDatabase();

    await db.runAsync("DELETE FROM books WHERE id = ?;", [id]);
  };

  clearBooks = async (): Promise<void> => {
    const db = await this.openDatabase();

    await db.runAsync("DELETE FROM books;");
  };

  getAuthors = async (): Promise<string[]> => {
    const db = await this.openDatabase();

    const rows = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM authors ORDER BY name;",
    );
    return rows.map((row) => row.name);
  };

  addAuthor = async (name: string): Promise<boolean> => {
    const db = await this.openDatabase();

    const authorName = name.trim();
    if (!authorName) throw new Error("Введіть ім'я автора");

    const existing = await db.getFirstAsync<{ id: number }>(
      "SELECT id FROM authors WHERE name = ?;",
      [authorName],
    );
    if (existing) return false;

    await db.runAsync("INSERT INTO authors (name) VALUES (?);", [
      authorName,
    ]);
    return true;
  };
}

export const bookDatabase = BookDatabase.getInstance();
