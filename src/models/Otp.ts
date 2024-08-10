import { model, models, Schema } from "mongoose";

interface IOtpModel {
  code: string;
  phone: string;
  expTime: number;
  isExpired: boolean;
}
const schema = new Schema<IOtpModel>({
  code: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  expTime: {
    type: Number,
    required: true,
  },
  isExpired: {
    type: Boolean,
    default: false,
  },
});

const otpModel = models.Otp || model<IOtpModel>("Otp", schema);

export default otpModel;
