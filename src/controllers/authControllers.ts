import { Request, Response } from "express";
export const registerUser = async (req: Request, res: Response) => {
  try {
    // Registration logic here
    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(500).send(`Server error: ${err}`);
  }
};
