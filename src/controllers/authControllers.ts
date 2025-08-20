import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  loginDto,
  loginValidate,
  registerDto,
  registerValidate,
} from "../dtos/auth.dtos";
import UserModel from "../models/UserModel";
import createHttpError from "http-errors";
import { newJti, signAccessToken, signRefreshToken } from "../utils/jwt";
import { config } from "../config/config";
import { getExpiryDate } from "../utils/getExpiryDate";
import { setAuthCookies } from "../utils/cookie";
export const registerUser = async (req: Request, res: Response) => {
  try {
    const validate = registerValidate.safeParse(req.body);
    const data: registerDto = validate.data!;
    if (!validate.success) {
      return res.status(400).json({
        success: false,
        errorType: "dtos",
        message: validate.error.flatten().fieldErrors,
      });
    }

    const existUser = await UserModel.findOne({
      email: data.email,
      username: data.username,
    });

    if (existUser) {
      return res.status(400).json({
        success: false,
        errorType: "existUser",
        message: "User Already Exist!Please Enter Valid Email Or Username",
      });
    }

    const createUser = await UserModel.create({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
    });
    // Registration logic here
    res.status(201).json({
      success: true,
      message: "User Register successfully",
      data: createUser,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      const error = createHttpError(
        500,
        `Something Went Wrong! Error : ${err.message}`
      );
      throw error;
    } else {
      const error = createHttpError(500, `Server Error`);
      throw error;
    }
  }
};
export const loginUser = async (req: Request, res: Response) => {
  try {
    const validate = loginValidate.safeParse(req.body);

    if (!validate.success) {
      if (!validate.success) {
        return res.status(400).json({
          success: false,
          errorType: "dtos",
          message: validate.error.flatten().fieldErrors,
        });
      }
    }

    const data: loginDto = validate.data!;
    const existUser = await UserModel.findOne({ email: data.email }).select(
      "+password"
    );

    if (!existUser) {
      return res.status(400).json({
        success: false,
        errorType: "existUser",
        message: "User Not Found!Please Enter Valid Email Address.",
      });
    }
    const compare = await existUser.comparePassword(data.password);
    if (!compare) {
      return res.status(400).json({
        success: false,
        errorType: "compare",
        message: "Please Enter Valid Password.",
      });
    }

    const jti = newJti();
    const expiresAt = getExpiryDate(
      config.ACCESS_TOKEN_EXPIRES_IN,
      7 * 24 * 3600 * 1000
    );
    const accessToken = signAccessToken(existUser);
    const refreshToken = signRefreshToken(existUser, jti);
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    existUser.refreshTokens.push({
      jti,
      tokenHash,
      expiresAt,
    });
    await existUser.save();
    setAuthCookies(res, accessToken, refreshToken);
    res.status(200).json({
      success: true,
      message: "User Login Successfully",
      accessToken,
    });
  } catch (err) {
    if (err instanceof Error) {
      const error = createHttpError(500, {
        success: false,
        errorType: "loginFail",
        message: `Something Went Wrong! Error : ${err.message}`,
      });
      throw error;
    } else {
      const error = createHttpError(500, `Server Error`);
      throw error;
    }
  }
};
