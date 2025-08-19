import { Request, Response } from "express";
import createHttpError from "http-errors";
export const registerUser = async (req: Request, res: Response) => {
  try {
    const error = createHttpError(400, "Bad Request: Invalid user data");
    throw error;
    // Registration logic here
    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(500).send(`Server error: ${err}`);
  }
};
