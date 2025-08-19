import { Request, Response } from "express";
import { registerDto, registerValidate } from "../dtos/auth.dtos";
import UserModel from "../models/UserModel";
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
  } catch (err) {
    res.status(500).send(`Server error: ${err}`);
  }
};
