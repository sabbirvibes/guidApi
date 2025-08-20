// src/utils/jwt.ts
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { IUser } from "../models/UserModel";
import { config } from "../config/config";
import { v4 as uuidv4 } from "uuid";
import { tokenDataInterface } from "../types/token";
export const signAccessToken = (user: IUser) => {
  const payload = <tokenDataInterface>{
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  const expiresIn = config.ACCESS_TOKEN_EXPIRES_IN;

  return jwt.sign(
    payload,
    config.JWT_ACCESS_SECRET as Secret,
    { expiresIn } as SignOptions
  );
};

export const signRefreshToken = (user: IUser, jti: string) => {
  const payload = <tokenDataInterface>{
    _id: user._id,
    email: user.email,
    role: user.role,
    jti,
  };

  const expiresIn = config.REFRESH_TOKEN_EXPIRES_IN;

  return jwt.sign(
    payload,
    config.JWT_REFRESH_SECRET as Secret,
    { expiresIn } as SignOptions
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.JWT_ACCESS_SECRET);
};
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET);
};

export const newJti = () => {
  return uuidv4();
};
