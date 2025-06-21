import { model, models, Schema, Types } from "mongoose";

interface ITodoModel {
  title: string;
  isDone: boolean;
  user: Types.ObjectId;
  date: string;
  time?: string;
}
const schema = new Schema<ITodoModel>({
  title: {
    type: String,
    required: true,
  },
  isDone: {
    type: Boolean,
    default: false,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  time: String,
  date: {
    type: String,
    required: true,
  },
});

const TodoModel = models.Todo || model<ITodoModel>("Todo", schema);

export default TodoModel;
