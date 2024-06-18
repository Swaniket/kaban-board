export type TId = string | number;

export type TColumn = {
  id: TId;
  title: string;
};

export type TTask = {
  id: TId;
  columnId: TId;
  content: string;
};
