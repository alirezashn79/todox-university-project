import UserModel from "@/models/User";
import { generateAccessToken, verifyRefreshToken } from "@/utils/auth";
import DbConnect from "@/utils/dbConnection";
import { decodeToken } from "react-jwt";

interface IDecodedToken {
  identifier: string;
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
      {
        $or: [
          { phone: decodedToken?.identifier },
          { email: decodedToken?.identifier },
        ],
      },

      "phone email"
    );
    console.log("----------------userDb-----------------");

    if (!userDB) {
      throw new Error("Refresh Token not available");
    }
    console.log("----------------user Db not found-----------------");

    const newAccessToken = generateAccessToken({
      identifier: userDB.phone || userDB.email,
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
