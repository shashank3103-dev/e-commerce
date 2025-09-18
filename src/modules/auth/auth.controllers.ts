import { Request, Response } from "express";
import { AuthService } from "./auth.services";
import { ok, fail, AppError } from "../../utils/http";

export const AuthController = {
  sendOtp: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) throw new AppError("Email is required", 422);
      const result = await AuthService.sendOtp(email);
      return res.json(ok(result, "OTP sent successfully"));
    } catch (err: any) {
      if (err instanceof AppError)
        return res.status(err.status).json(fail(err.message, err.status, err.details));
      return res.status(500).json(fail("Internal Server Error", 500, err.message));
    }
  },

  verifyOtp: async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) throw new AppError("Email and OTP are required", 422);
      const result = await AuthService.verifyOtp(email, otp);
      return res.json(ok(result, "OTP verified successfully"));
    } catch (err: any) {
      if (err instanceof AppError)
        return res.status(err.status).json(fail(err.message, err.status, err.details));
      return res.status(500).json(fail("Internal Server Error", 500, err.message));
    }
  },

  // profile: async (req: Request, res: Response) => {
  //   try {
  //     const userId = parseInt(req.user!.sub);
  //     const user = await AuthService.getProfile(userId);
  //     return res.json(ok(user, "Profile fetched successfully"));
  //   } catch (err: any) {
  //     if (err instanceof AppError)
  //       return res.status(err.status).json(fail(err.message, err.status, err.details));
  //     return res.status(500).json(fail("Internal Server Error", 500, err.message));
  //   }
  // },
};