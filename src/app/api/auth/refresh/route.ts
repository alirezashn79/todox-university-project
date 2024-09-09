import UserModel from "@/models/User";
import { generateAccessToken, verifyRefreshToken } from "@/utils/auth";
import DbConnect from "@/utils/dbConnection";
import { decodeToken } from "react-jwt";

interface IDecodedToken {
  phone: string;
}

export async function GET(req: Request) {
  try {
    console.log("----------------enter api-----------------");
    const refreshToken = req.headers.get("authorization")?.split(" ")[1];

    if (!refreshToken || !verifyRefreshToken(refreshToken)) {
      throw new Error("refresh token is expired");
    }

    const decodedToken = decodeToken<IDecodedToken>(refreshToken);
    console.log("----------------decoded api-----------------");

    await DbConnect();

    const userDB = await UserModel.findOne(
      { phone: decodedToken?.phone },
      "phone"
    );
    console.log("----------------userDb-----------------");

    if (!userDB) {
      throw new Error("Refresh Token not available");
    }
    console.log("----------------user Db not found-----------------");

    const newAccessToken = generateAccessToken({
      phone: userDB.phone,
    });

    console.log("----------------new Access-----------------");

    return Response.json(newAccessToken);
  } catch (error) {
    return Response.json(
      { message: "Server Error", error: error.message },
      {
        status: 500,
      }
    );
  }
}
