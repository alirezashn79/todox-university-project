import UserModel from "@/models/User";
import { generateAccessToken, verifyRefreshToken } from "@/utils/auth";
import DbConnect from "@/utils/dbConnection";
import { decodeToken } from "react-jwt";

interface IDecodedToken {
  phone: string;
}

export async function GET(req: Request) {
  try {
    const refreshToken = req.headers.get("authorization")?.split(" ")[1];

    if (!refreshToken || !verifyRefreshToken(refreshToken)) {
      throw new Error("refresh token is expired");
    }

    const decodedToken = decodeToken<IDecodedToken>(refreshToken);

    await DbConnect();

    const userDB = await UserModel.findOne(
      { phone: decodedToken?.phone },
      "phone"
    );

    if (!userDB) throw new Error("Refresh Token not available");

    const newAccessToken = generateAccessToken({
      phone: userDB.phone,
    });

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
