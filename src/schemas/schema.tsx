import { any, object, string } from "zod";

export const zEmailSchema = object({
  email: string().trim().email("تایپ ایمیل صحیح نیست"),
});

export const zPhoneSchema = object({
  phone: string().regex(
    /^(?:(?:(?:\\+?|00)(98))|(0))?((?:90|91|92|93|99)[0-9]{8})$/g,
    "شماره موبایل صحیح نیست"
  ),
});
export const zCodeSchema = object({
  code: string().min(5).max(5),
});

export const zVerifyOtpServerSchema = zPhoneSchema.and(zCodeSchema);
export const zTimeSchema = object({
  time: string().refine((value) => {
    if (value) {
      return string().regex(/^([01][0-9]|2[0-3]):([0-5][0-9])$/g);
    } else {
      return true;
    }
  }),
});

export const zTodoSchemaServer = object({
  title: string().trim().min(1, "عنوان الزامی است"),
  date: string().trim().min(4),
}).and(zTimeSchema);

export const zTodoEditServer = object({
  title: string().trim().min(1, "عنوان الزامی است"),
}).and(zTimeSchema);

export const zTodoSchemaClient = object({
  title: string().trim().min(1, "عنوان الزامی است"),
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
    }, "حجم عکس باید کمتر از 2 مگابایت باشد")
    .refine((file: File) => {
      if (file) {
        return ACCEPTED_IMAGE_TYPES.includes(file?.type);
      } else {
        return true;
      }
    }, "تایپ های مورد قبول:  .jpg, .jpeg, .png and .webp formats are supported."),
});

export const zClientImageSchema = object({
  avatar: any()
    .refine((files: File[]) => {
      // if (files && files[0]) {
      return files?.[0]?.size <= MAX_FILE_SIZE;
      // } else {
      //   return true;
      // }
    }, "عکس الزامی و حجم آن باید کمتر از 2 مگابایت باشد")
    .refine((files: File[]) => {
      if (files && files[0]) {
        return ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type);
      } else {
        return true;
      }
    }, "تایپ های مورد قبول:  .jpg, .jpeg, .png and .webp formats are supported."),
});

export const zUserCreationServerSchema = object({
  fullName: string().trim().min(1, "نام الزامی است"),
  email: string().email("تایپ ایمیل صحیح نیست"),
  password: string().trim().min(4, "حداقل 4 کاراکتر وارد کنید"),
}).and(zServerAvatarSchema);

export const zUserCreationClientSchema = object({
  fullName: string().trim().min(1, "نام الزامی است"),
  email: string().trim().email("تایپ ایمیل صحیح نیست"),
  password: string().trim().min(4, "حداقل 4 کاراکتر وارد کنید"),
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
  password: string().trim().min(4, "حداقل 4 کاراکتر وارد کنید"),
});
