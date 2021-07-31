export type Command<T> = {
  title: string;
  command: string;
  arguments?: T[];
  handler: (params: T) => void;
};
