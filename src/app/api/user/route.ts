import UserModel from "@/models/User";
import { zEmailSchema, zUserCreationServerSchema } from "@/schemas/schema";
import {
  generateAccessToken,
  generateRefreshToken,
  hashPass,
  verifyTemporaryToken,
} from "@/utils/auth";
import DbConnect from "@/utils/dbConnection";
import { S3 } from "aws-sdk";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const temporaryToken = cookieStore.get("temporaryToken");

    if (!temporaryToken) {
      return Response.json(
        { message: "Unauthorized token" },
        {
          status: 401,
        }
      );
    }

    const payload = verifyTemporaryToken(temporaryToken.value);

    if (!payload) {
      return Response.json(
        { message: "Unauthorized payload" },
        {
          status: 401,
        }
      );
    }

    const formData = await req.formData();
    const fullName = formData.get("fullName");
    const username = formData.get("username");
    const password = formData.get("password");
    const avatar = formData.get("avatar") as File;

    const body = {
      fullName,
      username,
      password,
      avatar,
    };

    const validationResult = zUserCreationServerSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          message: "Invalid Data",
          error: validationResult.error.formErrors.fieldErrors,
        },
        {
          status: 422,
        }
      );
    }

    await DbConnect();

    const isUser = await UserModel.exists({
      username: validationResult.data.username,
    });

    if (!!isUser) {
      return Response.json(
        { message: "Username already exist" },
        {
          status: 422,
        }
      );
    }

    const hashedPass = await hashPass(validationResult.data.password);

    let fileUrl;
    if (!!avatar) {
      const fileName = `avatar-${payload.identifier}-${avatar.name}`;

      const arrayBuffer = await avatar.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const s3 = new S3({
        accessKeyId: process.env.LIARA_ACCESS_KEY,
        secretAccessKey: process.env.LIARA_SECRET_KEY,
        endpoint: process.env.LIARA_ENDPOINT,
      });

      const params = {
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
      };
      const response = await s3.upload(params as any).promise();
      fileUrl = response.Location;
    }

    const token = generateAccessToken({ identifier: payload.identifier });

    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      sameSite: "strict",
    });

    const refreshToken = generateRefreshToken({
      identifier: payload.identifier,
    });
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      sameSite: "strict",
    });

    const isEmailOrIsPhone = zEmailSchema.safeParse({
      email: payload.identifier,
    });

    const data = await UserModel.create({
      ...validationResult.data,
      password: hashedPass,
      phone: isEmailOrIsPhone.success ? undefined : payload.identifier,
      email: isEmailOrIsPhone.success ? isEmailOrIsPhone.data.email : undefined,
      avatar: fileUrl,
      refreshToken,
    });

    cookieStore.delete("temporaryToken");

    return Response.json(
      { message: "user created successfully", data },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return Response.json(
      { message: "Server Error", error: error.message },
      {
        status: 500,
      }
    );
  }
}
