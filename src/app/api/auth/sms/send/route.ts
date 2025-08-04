import otpModel from '@/models/Otp'
import { zPhoneSchema } from '@/schemas/schema'
import DbConnect from '@/utils/dbConnection'
import axios from 'axios'

export async function POST(req: Request) {
  try {
    const reqBody = await req.json()

    const validationResult = await zPhoneSchema.parseAsync(reqBody)

    await DbConnect()
    const now = Date.now()

    const result = await otpModel.findOne({
      phone: validationResult.phone,
      isExpired: false,
    })

    if (result) {
      if (result.expTime < now) {
        await otpModel.findByIdAndUpdate(result._id, {
          isExpired: true,
        })
      } else {
        return Response.json(
          {
            message: 'You just requested a code, apply in two minutes',
            expTime: result.expTime,
          },
          {
            status: 451,
          }
        )
      }
    }

    const code = Math.floor(Math.random() * 90000) + 10000
    let expTime
    try {
      await axios.post('http://ippanel.com/api/select', {
        op: 'pattern',
        user: process.env.WEB_SERVICE_USERNAME,
        pass: process.env.WEB_SERVICE_PASS,
        fromNum: '3000505',
        toNum: validationResult.phone,
        patternCode: process.env.PATTERN_CODE,
        inputData: [{ 'verification-code': code }],
      })
      expTime = Date.now() + 120_000
      await otpModel.create({
        phone: validationResult.phone,
        code,
        expTime,
      })
    } catch (error) {
      return Response.json({ message: 'error to send code' }, { status: 400 })
    }

    // expTime = Date.now() + 120_000;
    // await otpModel.create({
    //   phone: validationResult.phone,
    //   code,
    //   expTime,
    // });

    return Response.json(
      { message: 'code sent successfully :))', expTime },
      {
        status: 201,
      }
    )
  } catch (error) {
    Response.json(
      { message: 'Server Error', error },
      {
        status: 500,
      }
    )
  }
}
