import { model, models, Schema } from "mongoose";

interface IUserModel {
  fullName: string;
  phone: string;
  password: string;
  username: string;
  avatar?: string;
  refreshToken?: string;
}
const schema = new Schema<IUserModel>({
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: String,
  refreshToken: String,
});

const UserModel = models.User || model<IUserModel>("User", schema);

export default UserModel;
