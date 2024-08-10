import { model, models, Schema, Types } from "mongoose";

interface ITodoModel {
  title: string;
  body: string;
  priority: "1" | "2" | "3";
  isDone: boolean;
  user: Types.ObjectId;
  time: Date;
}
const schema = new Schema<ITodoModel>({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    default: "1",
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
  time: {
    type: Date,
    required: true,
  },
});

const TodoModel = models.Todo || model<ITodoModel>("Todo", schema);

export default TodoModel;
