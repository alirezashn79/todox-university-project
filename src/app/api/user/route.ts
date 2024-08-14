import UserModel from "@/models/User";
import { zUserCreationServerSchema } from "@/schemas/schema";
import { generateRefreshToken, verifyAccessToken } from "@/utils/auth";
import baseURL from "@/utils/baseUrl";
import { writeFile } from "fs/promises";
import { cookies } from "next/headers";
import path from "path";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return Response.json(
        { message: "Unauthorized token" },
        {
          status: 401,
        }
      );
    }

    const payload = verifyAccessToken(token.value);

    if (!payload) {
      return Response.json(
        { message: "Unauthorized token" },
        {
          status: 401,
        }
      );
    }

    const formData = await req.formData();
    const fullName = formData.get("fullName");
    const avatar = formData.get("avatar") as File;

    const body = { fullName, avatar: avatar };

    const validationResult = await zUserCreationServerSchema.parseAsync(body);

    let fileUrl;
    if (avatar) {
      const fileName = `${Date.now()}-${avatar.name}`;
      const filePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "avatars",
        fileName
      );
      fileUrl = `${baseURL}/uploads/avatars/${fileName}`;

      const arrayBuffer = await avatar.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await writeFile(filePath, buffer);
    }

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
