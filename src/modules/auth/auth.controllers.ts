import { Request, Response } from "express";
import { AuthService } from "./auth.services";

export const AuthController = {
  async sendOtp(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const result = await AuthService.sendOtp(email);
    res.json({ success: true, message: "OTP sent", data: result });
  },

  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const result = await AuthService.verifyOtp(email, otp);
      res.json({ success: true, message: "OTP verified", data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
}