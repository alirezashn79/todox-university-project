export interface IUser{
  _id: string;
  fullName: string;
  phone?: string;
  email?: string;
  avatar: string;
  username: string;
}

export interface ITodo{
  _id: string;
  title: string;
  isDone: boolean;
  time: string;
  date: string;
}
