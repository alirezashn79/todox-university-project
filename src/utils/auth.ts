import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

export function generateTempraryToken(payload: { identifier: string }) {
  return sign(payload, process.env.TEMPORARY_SECRET_KEY as string);
}

export function generateAccessToken(payload: { identifier: string }) {
  return sign(payload, process.env.ACCESS_SECRET_KEY as string, {
    expiresIn: "24h",
  });
}

export function generateRefreshToken(payload: { identifier: string }) {
  return sign(payload, process.env.REFRESH_SECRET_KEY as string, {
    expiresIn: "14 days",
  });
}

export function verifyTemporaryToken(token: string) {
  let result = null;
  try {
    result = verify(token, process.env.TEMPORARY_SECRET_KEY as string) as {
      identifier: string;
    };
  } catch (error: any) {
    console.log(error.message);
  }

  return result;
}

export function verifyAccessToken(token: string) {
  let result = null;
  try {
    result = verify(token, process.env.ACCESS_SECRET_KEY as string) as {
      identifier: string;
    };
  } catch (error: any) {
    console.log(error.message);
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

export async function hashPass(password: string) {
  const hashedPass = await hash(password, 10);
  return hashedPass;
}

export async function comparePass(pass: string, hashed: string) {
  const result = await compare(pass, hashed);
  return result;
}
