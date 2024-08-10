import UserModel from "@/models/User";
import { zUserCreationServerSchema } from "@/schemas/schema";
import { generateRefreshToken, verifyAccessToken } from "@/utils/auth";
import baseURL from "@/utils/baseUrl";
import DbConnect from "@/utils/dbConnection";
import { writeFile } from "fs/promises";
import { cookies } from "next/headers";
import path from "path";

export async function POST(req: Request) {
  try {
    // codes

    const cookieStore = cookies();

    const token = cookieStore.get("token");

    if (!token) {
      return Response.json(
        { message: "Unauthorized cookie" },
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
    const fName = formData.get("fName");
    const lName = formData.get("lName");
    const username = formData.get("username");
    const avatar = formData.get("avatar") as File;

    const body = { fName, lName, username, avatar };

    const validationResult = await zUserCreationServerSchema.parseAsync(body);

    const isUsernameExist = await UserModel.exists({
      username: validationResult.username,
    });
    if (isUsernameExist) {
      return Response.json(
        { message: "username already taken" },
        {
          status: 409,
        }
      );
    }

    const fileName = `${Date.now()}-${avatar.name}`;
    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "avatars",
      fileName
    );
    const fileUrl = `${baseURL}/uploads/avatars/${fileName}`;

    const arrayBuffer = await avatar.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await writeFile(filePath, buffer);

    const refreshToken = generateRefreshToken({ phone: payload.phone });

    await DbConnect();

    const data = await UserModel.create({
      ...validationResult,
      phone: payload.phone,
      avatar: fileUrl,
    });

    return Response.json(
      { message: "user created successfully", data },
      {
        status: 201,
        headers: {
          "Set-Cookie": `refresh-token=${refreshToken};path=/;httpOnly;max-age=5400`,
        },
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
