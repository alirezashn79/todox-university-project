import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    cookieStore.delete('token')
    cookieStore.delete('refreshToken')

    return Response.json({ message: 'See You Later 👋' })
  } catch (error) {
    return Response.json(
      { message: 'Server Error', error: error.message },
      {
        status: 500,
      }
    )
  }
}
