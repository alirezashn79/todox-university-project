"use server";
import UserModel from "@/models/User";
import { IUser } from "@/types";
import { cookies } from "next/headers";
import { decodeToken, isExpired } from "react-jwt";
import DbConnect from "./dbConnection";

export async function isAuth() {
  let user = null;
  const cookieStore = cookies();

  const token = cookieStore.get("token");

  if (token && !isExpired(token.value)) {
    const decodedToken = decodeToken<{
      phone: string;
    }>(token.value);
    await DbConnect();

    const userDB = await UserModel.findOne(
      { phone: decodedToken?.phone },
      "avatar fullName phone"
    );
    if (userDB) {
      user = JSON.parse(JSON.stringify(userDB)) as IUser;
    }
  }

  return user;
}
