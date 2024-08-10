import { model, models, Schema } from "mongoose";

interface IUserModel {
  fName: string;
  lName: string;
  username: string;
  phone: string;
  avatar?: string;
}
const schema = new Schema<IUserModel>({
  fName: {
    type: String,
    required: true,
  },
  lName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  avatar: String,
});

const UserModel = models.User || model<IUserModel>("User", schema);

export default UserModel;
