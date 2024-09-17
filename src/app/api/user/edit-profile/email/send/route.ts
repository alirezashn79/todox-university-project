import otpModel from "@/models/Otp";
import UserModel from "@/models/User";
import { zEmailSchema } from "@/schemas/schema";
import DbConnect from "@/utils/dbConnection";
import { isAuth } from "@/utils/serverHelpers";
import nodemailer from "nodemailer";

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
    const reqBody = await req.json();

    const validationResult = await zEmailSchema.parseAsync(reqBody);

    const isEmailExist = await UserModel.exists({
      email: validationResult.email,
    });

    if (isEmailExist) {
      return Response.json(
        { message: "email already exist" },
        {
          status: 409,
        }
      );
    }

    await DbConnect();
    const now = new Date().getTime();

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
        from: `Todox Info <${MAIL_ADDRESS}>`,
        to: validationResult.email,
        subject: "کد تایید تود ایکس",
        html: `<section
        style="direction: rtl; text-align: right; max-width: 42rem; padding: 2rem 1.5rem; margin: 0 auto; background-color: #111827;font-family: Arial, sans-serif;"
      >
        <header>
          <h1 style="font-size: 1.5rem; color: #3b82f6;">تودو ایکس</h1>
        </header>
      
        <main style="margin-top: 2rem;">
      
          <p style="margin-top: 0.5rem; line-height: 1.75; color: #d1d5db;">کد تایید شما</p>
      
          <div
            style="margin-top: 1rem;"
          >
           <p style="font-size: 1.2rem; font-weight: bold; color: #d1d5db">
           ${code}
           </p>
          </div>
      
          <p style="margin-top: 1rem; line-height: 1.75; color: #d1d5db;">
            این کد 2 دقیقه اعتبار دارد
          </p>
      
          <p style="margin-top: 2rem; color: #d1d5db;">
            با احترام, <br />
            تودو ایکس
          </p>
        </main>
      
        <footer style="margin-top: 2rem;">
          <p style="color: #9ca3af;">
            این ایمیل صرفا برای تایید شما در تودو ایکس است
          </p>
      
          <p style="margin-top: 0.75rem; color: #9ca3af;">
            © ${new Date().getFullYear()} Todox . All Rights Reserved.
          </p>
        </footer>
      </section>
      `,
      });
    } catch (error) {
      return Response.json({ message: "error to send code" }, { status: 400 });
    }

    // expTime = new Date().getTime() + 120_000;
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
