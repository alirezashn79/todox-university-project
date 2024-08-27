import UserModel from "@/models/User";
import { zUserCreationServerSchema } from "@/schemas/schema";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyTemporaryToken,
} from "@/utils/auth";
import baseURL from "@/utils/baseUrl";
import { writeFile } from "fs/promises";
import { cookies } from "next/headers";
import path from "path";
import { S3 } from "aws-sdk";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const temporaryToken = cookieStore.get("temporaryToken");

    console.log(temporaryToken);
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
    const avatar = formData.get("avatar") as File;

    const body = { fullName, avatar };

    const validationResult = await zUserCreationServerSchema.parseAsync(body);

    let fileUrl;
    if (avatar) {
      // const fileName = `${Date.now()}-${avatar.name}`;
      const fileName = `${Date.now()}-${validationResult.fullName}-${
        payload.phone
      }`;
      // const filePath = path.join(
      //   process.cwd(),
      //   "public",
      //   "uploads",
      //   "avatars",
      //   fileName
      // );
      // fileUrl = `${baseURL}/uploads/avatars/${fileName}`;

      const arrayBuffer = await avatar.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // await writeFile(filePath, buffer);
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

      console.log("response-------", response);
      fileUrl = response.Location;
    }

    const token = generateAccessToken({ phone: payload.phone });

    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
    });

    const refreshToken = generateRefreshToken({
      phone: payload.phone,
    });
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600 * 24,
      sameSite: "strict",
    });

    const data = await UserModel.create({
      ...validationResult,
      phone: payload.phone,
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
