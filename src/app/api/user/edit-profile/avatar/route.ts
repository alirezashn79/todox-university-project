import UserModel from "@/models/User";
import { zEditProfileSchema } from "@/schemas/schema";
import DbConnect from "@/utils/dbConnection";
import { isAuth } from "@/utils/serverHelpers";
import { S3 } from "aws-sdk";

export async function PUT(req: Request) {
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
    const avatar = formData.get("avatar") as File;

    const validationResult = zEditProfileSchema.safeParse({
      avatar,
    });

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

    const fileName = `avatar-${user.phone}-${avatar.name}`;

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
    await s3
      .deleteObject({
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: user.avatar.split("/avatars/")[1],
      } as any)
      .promise();
    const response = await s3.upload(params as any).promise();
    const fileUrl = response.Location;

    await UserModel.findByIdAndUpdate(user._id, {
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
