import { any, date, enum as enum_, object, string } from "zod";

export const zPhoneSchema = object({
  phone: string()
    .min(11)
    .regex(/^(?:(?:(?:\\+?|00)(98))|(0))?((?:90|91|92|93|99)[0-9]{8})$/g),
});
export const zCodeSchema = object({
  code: string().min(5).max(5),
});

export const zVerifyOtpServerSchema = zPhoneSchema.and(zCodeSchema);

export const zTodoSchemaServer = object({
  title: string().trim().min(4),
  body: string().trim().min(6),
  priority: enum_(["1", "2", "3"]).default("1"),
  time: date(),
});

const MAX_FILE_SIZE = 2 * 1024 * 1024; //5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const zServerAvatarSchema = object({
  avatar: any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, "Max image size is 2MB.")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export const zUserCreationServerSchema = object({
  fName: string().trim().min(2),
  lName: string().trim().min(2),
  username: string().trim().min(2),
}).and(zServerAvatarSchema);
