export interface IBook {
  title: string;
  author: string;
}

export interface IBookRow extends IBook {
  id: string;
}

export type RootDrawerParamList = {
  "Список книг": undefined;
  "Добавить книгу": undefined;
  "Редактировать книгу": { bookId: string; title: string; author: string };
  "Добавить автора": undefined;
};
