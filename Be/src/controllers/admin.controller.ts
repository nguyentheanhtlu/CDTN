import { Request, Response } from "express";
import { User } from "../models/user.model";

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await User.find({}).select('-password')

    console.log(accounts)

    res.json({
      message: 'Thành công',
      data: accounts
    })
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}