import otpModel from "@/models/Otp";
import UserModel from "@/models/User";
import { zVerifyOtpServerSchema } from "@/schemas/schema";
import { generateAccessToken, generateRefreshToken } from "@/utils/auth";
import DbConnect from "@/utils/dbConnection";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();

    const validationResult = await zVerifyOtpServerSchema.parseAsync(reqBody);

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

    const accessToken = generateAccessToken({ phone: validationResult.phone });

    await otpModel.findByIdAndUpdate(otpRecord._id, {
      isExpired: true,
    });

    return Response.json(
      { message: "Phone Number Verified" },
      {
        headers: {
          "Set-Cookie": `token=${accessToken};path=/;httpOnly=true;max-age=3600`,
        },
      }
    );
  } catch (error) {
    return Response.json(
      { message: "Server Error", error },
      {
        status: 500,
      }
    );
  }
}
