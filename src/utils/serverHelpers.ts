import { cookies } from "next/headers";
import { verifyAccessToken } from "./auth";
import UserModel from "@/models/User";

export async function isAuth() {
  let user = null;
  const cookieStore = cookies();

  const token = cookieStore.get("token");

  if (token) {
    const payload = verifyAccessToken(token.value);
    console.log(payload?.phone);
    if (payload) {
      const isExist = await UserModel.exists({ phone: payload.phone });
      if (isExist) {
        user = {
          _id: isExist._id,
          phone: payload.phone,
        };
      }
    }
  }

  return user;
}
