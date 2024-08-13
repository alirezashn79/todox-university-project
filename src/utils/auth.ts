import { sign, verify } from "jsonwebtoken";

export function generateAccessToken(payload: { phone: string }) {
  return sign(payload, process.env.ACCESS_SECRET_KEY as string, {
    expiresIn: "1h",
  });
}

export function generateRefreshToken(payload: { phone: string }) {
  return sign(payload, process.env.REFRESH_SECRET_KEY as string, {
    expiresIn: "24h",
  });
}

export function verifyAccessToken(token: string) {
  let result = null;
  try {
    result = verify(token, process.env.ACCESS_SECRET_KEY as string) as {
      phone: string;
    };
  } catch (error: any) {
    console.error(error.message);
  }

  return result;
}

export function verifyRefreshToken(token: string) {
  let result = null;
  try {
    result = verify(token, process.env.REFRESH_SECRET_KEY as string);
  } catch (error) {
    console.log(error);
  }

  return result;
}
