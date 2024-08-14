"use server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "./auth";
import UserModel from "@/models/User";
import { decodeToken, isExpired } from "react-jwt";
import DbConnect from "./dbConnection";
import { IUser } from "@/types";

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
