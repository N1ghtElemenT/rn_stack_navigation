import "react-native-get-random-values";
import * as SQLite from "expo-sqlite";
import { v4 as uuidv4 } from "uuid";
import type { IBookRow } from "../types";

const DB_NAME = process.env.EXPO_PUBLIC_DB_NAME ?? "books.db";

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

  // Підключаємось до БД асінхронно (без повторних відкриттів)
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

  // Додаємо книгу
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

    return db.getAllAsync<IBookRow>("SELECT id, title, author FROM books;");
  };

  removeBook = async (id: string): Promise<void> => {
    const db = await this.openDatabase();

    await db.runAsync("DELETE FROM books WHERE id = ?;", [id]);
  };

  clearBooks = async (): Promise<void> => {
    const db = await this.openDatabase();

    await db.runAsync("DELETE FROM books;");
  };
}

export const bookDatabase = BookDatabase.getInstance();
