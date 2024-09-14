import otpModel from "@/models/Otp";
import UserModel from "@/models/User";
import { zVerifyEmailOtpServerSchema } from "@/schemas/schema";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTempraryToken,
} from "@/utils/auth";
import DbConnect from "@/utils/dbConnection";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();

    const validationResult = await zVerifyEmailOtpServerSchema.parseAsync(
      reqBody
    );

    await DbConnect();

    const otpRecord = await otpModel.findOne({
      ...validationResult,
      isExpired: false,
    });

    if (!otpRecord) {
      return Response.json(
        { message: "invalid code" },
        {
          status: 400,
        }
      );
    }

    const now = new Date().getTime();

    if (now > otpRecord.expTime) {
      await otpModel.findByIdAndUpdate(otpRecord._id, {
        isExpired: true,
      });

      return Response.json(
        { message: "code expired" },
        {
          status: 410,
        }
      );
    }

    await otpModel.findByIdAndUpdate(otpRecord._id, {
      isExpired: true,
    });

    const cookiesStore = cookies();

    const user = await UserModel.exists({ email: validationResult.email });

    if (user) {
      const token = generateAccessToken({ identifier: validationResult.email });
      cookiesStore.set("token", token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sameSite: "strict",
      });

      const refreshToken = generateRefreshToken({
        identifier: validationResult.email,
      });
      cookiesStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        sameSite: "strict",
      });

      await UserModel.findByIdAndUpdate(user._id, {
        refreshToken,
      });
      return Response.json(
        { message: "Welcome Back" },
        {
          status: 200,
        }
      );
    } else {
      const temporaryToken = generateTempraryToken({
        identifier: validationResult.email,
      });
      cookiesStore.set("temporaryToken", temporaryToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return Response.json(
        { message: "Please Complete Your Profile" },
        {
          status: 202,
        }
      );
    }
  } catch (error) {
    return Response.json(
      { message: "Server Error", error },
      {
        status: 500,
      }
    );
  }
}
