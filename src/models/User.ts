import { model, models, Schema } from "mongoose";

interface IUserModel {
  fullName: string;
  phone: string;
  avatar?: string;
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
  avatar: String,
});

const UserModel = models.User || model<IUserModel>("User", schema);

export default UserModel;
