import otpModel from "@/models/Otp";
import { zEmailSchema } from "@/schemas/schema";
import DbConnect from "@/utils/dbConnection";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();

    const validationResult = await zEmailSchema.parseAsync(reqBody);

    await DbConnect();
    const now = Date.now();

    const result = await otpModel.findOne({
      email: validationResult.email,
      isExpired: false,
    });

    if (result) {
      if (result.expTime < now) {
        await otpModel.findByIdAndUpdate(result._id, {
          isExpired: true,
        });
      } else {
        return Response.json(
          {
            message: "You just requested a code, apply in two minutes",
            expTime: result.expTime,
          },
          {
            status: 451,
          }
        );
      }
    }

    const code = Math.floor(Math.random() * 90000) + 10000;

    let expTime;
    const MAIL_HOST = process.env.MAIL_HOST;
    const MAIL_PORT = process.env.MAIL_PORT;
    const MAIL_USER = process.env.MAIL_USER;
    const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
    const MAIL_ADDRESS = process.env.MAIL_ADDRESS;

    try {
      const transporter = nodemailer.createTransport({
        host: MAIL_HOST,
        port: Number(MAIL_PORT),
        auth: {
          user: MAIL_USER,
          pass: MAIL_PASSWORD,
        },
      });

      expTime = Date.now() + 120_000;
      await otpModel.create({
        email: validationResult.email,
        code,
        expTime,
      });

      await transporter.sendMail({
        from: MAIL_ADDRESS,
        to: validationResult.email,
        subject: "کد تایید تود ایکس",
        html: `<h1>
        ${code}
          </h1>`,
      });
    } catch (error) {
      return Response.json({ message: "error to send code" }, { status: 400 });
    }

    // expTime = Date.now() + 120_000;
    // await otpModel.create({
    //   email: validationResult.email,
    //   code,
    //   expTime,
    // });

    return Response.json(
      { message: "code sent successfully :))", expTime },
      {
        status: 201,
      }
    );
  } catch (error) {
    Response.json(
      { message: "Server Error", error },
      {
        status: 500,
      }
    );
  }
}
