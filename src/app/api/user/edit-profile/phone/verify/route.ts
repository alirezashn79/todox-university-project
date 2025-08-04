import otpModel from '@/models/Otp'
import UserModel from '@/models/User'
import { zVerifyOtpServerSchema } from '@/schemas/schema'
import DbConnect from '@/utils/dbConnection'
import { isAuth } from '@/utils/serverHelpers'

export async function POST(req: Request) {
  try {
    const user = await isAuth()

    if (!user) {
      return Response.json(
        { message: 'please login' },
        {
          status: 401,
        }
      )
    }
    const reqBody = await req.json()

    const validationResult = await zVerifyOtpServerSchema.parseAsync(reqBody)

    await DbConnect()

    const otpRecord = await otpModel.findOne({
      ...validationResult,
      isExpired: false,
    })

    if (!otpRecord) {
      return Response.json(
        { message: 'invalid code' },
        {
          status: 400,
        }
      )
    }

    const now = new Date().getTime()

    if (now > otpRecord.expTime) {
      await otpModel.findByIdAndUpdate(otpRecord._id, {
        isExpired: true,
      })

      return Response.json(
        { message: 'code expired' },
        {
          status: 410,
        }
      )
    }

    await otpModel.findByIdAndUpdate(otpRecord._id, {
      isExpired: true,
    })

    await UserModel.findByIdAndUpdate(user._id, {
      $set: { phone: validationResult.phone },
    })

    return Response.json({ message: 'phone changed' })
  } catch (error) {
    return Response.json(
      { message: 'Server Error', error },
      {
        status: 500,
      }
    )
  }
}
