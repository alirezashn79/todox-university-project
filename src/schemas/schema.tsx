import { any, date, object, string } from "zod";

export const zEmailSchema = object({
  email: string().trim().email(),
});

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
  title: string().trim().min(1),
  // body: string().trim().min(1),
  // priority: enum_(["1", "2", "3"]).default("1"),
  // time: coerce.date(),
  time: string().regex(/^([01][0-9]|2[0-3]):([0-5][0-9])$/),
  date: string().trim().min(4),
});

export const zTimeSchema = object({
  time: string().regex(/^([01][0-9]|2[0-3]):([0-5][0-9])$/),
});

export const zDate = object({
  time: date(),
});
export const zTodoSchemaClient = object({
  title: string().trim().min(1),
  // body: string().trim().min(1),
  // priority: enum_(["1", "2", "3"]).default("1"),
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
    .refine((file: File) => {
      if (file) {
        return file?.size <= MAX_FILE_SIZE;
      } else {
        return true;
      }
    }, "Max image size is 2MB.")
    .refine((file: File) => {
      if (file) {
        return ACCEPTED_IMAGE_TYPES.includes(file?.type);
      } else {
        return true;
      }
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
});

export const zClientImageSchema = object({
  avatar: any()
    .refine((files: File[]) => {
      if (files && files[0]) {
        return files?.[0]?.size <= MAX_FILE_SIZE;
      } else {
        return true;
      }
    }, `Max image size is 2MB.`)
    .refine((files: File[]) => {
      if (files && files[0]) {
        return ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type);
      } else {
        return true;
      }
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
});

export const zUserCreationServerSchema = object({
  fullName: string().trim().min(1),
  email: string().email(),
  password: string().min(4),
}).and(zServerAvatarSchema);

export const zUserCreationClientSchema = object({
  fullName: string().trim().min(1),
  email: string().trim().email(),
  password: string().trim().min(4),
}).and(zClientImageSchema);

export const zSignInForm = object({
  identifier: string().refine((value) => {
    const validateEmail = zEmailSchema.safeParse({ email: value });
    const validatePhone = zPhoneSchema.safeParse({ phone: value });
    if (validateEmail.success || validatePhone.success) {
      return true;
    } else {
      return false;
    }
  }, "ایمیل یا شماره صحیح نیست"),
  password: string().trim().min(4),
});
