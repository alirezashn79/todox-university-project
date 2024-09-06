import UserModel from "@/models/User";
import { zEditProfileSchema } from "@/schemas/schema";
import { hashPass } from "@/utils/auth";
import DbConnect from "@/utils/dbConnection";
import { isAuth } from "@/utils/serverHelpers";
import { S3 } from "aws-sdk";

export async function POST(req: Request) {
  try {
    const user = await isAuth();

    if (!user) {
      return Response.json(
        { message: "please login" },
        {
          status: 401,
        }
      );
    }

    const formData = await req.formData();
    const fullName = formData.get("fullName") || undefined;
    const username = formData.get("username") || undefined;
    const password = formData.get("password") || undefined;
    const avatar = (formData.get("avatar") as File) || undefined;

    const body = { fullName, username, password, avatar };
    const validationResult = zEditProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          message: "Invalid Date",
          error: validationResult.error.formErrors.fieldErrors,
        },
        {
          status: 422,
        }
      );
    }

    await DbConnect();

    if (validationResult.data.username) {
      const isUserExist = await UserModel.exists({
        username: validationResult.data.username,
      });
      if (isUserExist) {
        return Response.json(
          { message: "username already exist" },
          {
            status: 409,
          }
        );
      }
    }

    let hashedPassword;
    if (validationResult.data.password) {
      hashedPassword = await hashPass(validationResult.data.password);
    }

    let fileUrl;
    if (avatar) {
      const fileName = `avatar-${user.phone}-${avatar.name}`;

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
      await s3
        .deleteObject({
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: user.avatar.split("/avatars/")[1],
        } as any)
        .promise();
      const response = await s3.upload(params as any).promise();
      fileUrl = response.Location;
    }

    await UserModel.findByIdAndUpdate(user._id, {
      ...validationResult.data,
      password: hashedPassword,
      avatar: fileUrl,
    });

    return Response.json({ message: "profile updated" });
  } catch (error) {
    return Response.json(
      { message: "Server Error" },
      {
        status: 500,
      }
    );
  }
}
