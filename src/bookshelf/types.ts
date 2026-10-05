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
  "Добавить автора": undefined;
};
