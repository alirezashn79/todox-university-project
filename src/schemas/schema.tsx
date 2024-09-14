import { any, object, string } from "zod";

export const zPhoneSchema = object({
  phone: string().regex(
    /^(?:(?:(?:\\+?|00)(98))|(0))?((?:90|91|92|93|99)[0-9]{8})$/g,
    "شماره موبایل صحیح نیست"
  ),
});
export const zEmailSchema = object({
  email: string().trim().email("فرمت ایمیل صحیح نیست"),
});
export const zCodeSchema = object({
  code: string().min(5).max(5),
});

export const zVerifyOtpServerSchema = zPhoneSchema.and(zCodeSchema);
export const zVerifyEmailOtpServerSchema = zEmailSchema.and(zCodeSchema);
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
      // if (files && files[0]) {
      return ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type);
      // } else {
      //   return true;
      // }
    }, "تایپ های مورد قبول:  .jpg, .jpeg, .png and .webp formats are supported."),
});

export const zUserCreationServerSchema = object({
  fullName: string().trim().min(1, "نام الزامی است"),
  username: string()
    .trim()
    .regex(/^[a-z0-9_-]{3,15}$/g)
    .min(4, "تایپ نام کاربری صحیح نیست"),
  password: string().trim().min(4, "حداقل 4 کاراکتر وارد کنید"),
  avatar: any()
    .refine((file: File) => {
      if (!!file) {
        return file?.size <= MAX_FILE_SIZE;
      } else {
        return true;
      }
    }, "عکس الزامی و حجم آن باید کمتر از 2 مگابایت باشد")
    .refine((file: File) => {
      if (!!file) {
        return ACCEPTED_IMAGE_TYPES.includes(file?.type);
      } else {
        return true;
      }
    }, "تایپ های مورد قبول:  .jpg, .jpeg, .png and .webp formats are supported."),
});

export const zUserCreationClientSchema = object({
  fullName: string().trim().min(1, "نام الزامی است"),
  username: string()
    .trim()
    .regex(/^[a-z0-9_-]{3,15}$/g)
    .min(4, "تایپ نام کاربری صحیح نیست"),
  password: string().trim().min(4, "حداقل 4 کاراکتر وارد کنید"),
  avatar: any()
    .refine((files: File[]) => {
      if (files && files[0]) {
        return files?.[0]?.size <= MAX_FILE_SIZE;
      } else {
        return true;
      }
    }, "عکس الزامی و حجم آن باید کمتر از 2 مگابایت باشد")
    .refine((files: File[]) => {
      if (files && files[0]) {
        return ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type);
      } else {
        return true;
      }
    }, "تایپ های مورد قبول:  .jpg, .jpeg, .png and .webp formats are supported."),
});

export const zEditProfileSchema = object({
  avatar: any()
    .refine((file: File) => {
      return file?.size <= MAX_FILE_SIZE;
    }, "حجم عکس باید کمتر از 2 مگابایت باشد")
    .refine((file: File) => {
      return ACCEPTED_IMAGE_TYPES.includes(file?.type);
    }, "تایپ های مورد قبول:  .jpg, .jpeg, .png and .webp formats are supported."),
});

export const zEditInfoSchema = object({
  fullName: string().trim().min(1, "نام الزامی است"),
  username: string()
    .trim()
    .regex(/^[a-z0-9_-]{3,15}$/g)
    .min(4, "تایپ نام کاربری صحیح نیست"),
}).partial();

export const zPass = object({
  newPass: string().trim().min(4, "حداقل 4 کاراکتر وارد کنید"),
  confirmPass: string().trim().min(4, "حداقل 4 کاراکتر وارد کنید"),
}).superRefine(({ newPass, confirmPass }, ctx) => {
  if (newPass !== confirmPass) {
    ctx.addIssue({
      code: "custom",
      message: "با رمزعبور جدید مغایرت دارد",
      path: ["confirmPass"],
    });
  }
});

export const zPassServer = object({
  newPass: string().trim().min(4, "حداقل 4 کاراکتر وارد کنید"),
});

const zUsernameSchema = object({
  username: string()
    .trim()
    .regex(/^[a-z0-9_-]{3,15}$/g)
    .min(4, "تایپ نام کاربری صحیح نیست"),
});

export const zSignInForm = object({
  identifier: string().refine((value) => {
    const validateUsername = zUsernameSchema.safeParse({ username: value });
    const validatePhone = zPhoneSchema.safeParse({ phone: value });
    const validateEmail = zEmailSchema.safeParse({ email: value });
    if (
      validateUsername.success ||
      validatePhone.success ||
      validateEmail.success
    ) {
      return true;
    } else {
      return false;
    }
  }, "نام کاربری یا شماره یا ایمیل صحیح نیست"),
  password: string().trim().min(4, "حداقل 4 کاراکتر وارد کنید"),
});
