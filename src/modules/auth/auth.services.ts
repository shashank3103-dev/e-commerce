import { AuthRepository } from "./auth.repository";
import { sendMail } from "../../utils/mailer";
import { prisma } from "../../prisma";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { AppError } from "../../utils/http";

export const AuthService = {
  sendOtp: async (email: string) => {
    let user = await AuthRepository.findByEmail(email);

    if (!user) {
      // Default role: USER
      user = await prisma.user.create({ data: { email, role: "USER" } });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6‑digit OTP
    const expires = new Date(Date.now() + 5 * 60 * 1000); // valid for 5 mins

    await AuthRepository.saveOtp(email, otp, expires);

    // 🔥 For DEV: console log OTP so you can test without email setup
    console.log(`📩 OTP for ${email}: ${otp}`);

    // Try sending email (catch errors but don't block flow)
    try {
      await sendMail(email, "Your OTP Code", `Your OTP is ${otp}`);
    } catch (err) {
      console.error("Failed to send email:", err);
    }

    return { email, expires };
  },

  verifyOtp: async (email: string, otp: string) => {
    const user = await AuthRepository.verifyOtp(email, otp);
    if (!user) throw new AppError("Invalid or expired OTP", 400);

    // ⚡ Invalidate OTP after successful verification
    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpires: null },
    });

    // ✅ Issue tokens
    const accessToken = signAccessToken({
      sub: user.id.toString(),
      role: user.role as any,
    });

    const refreshToken = signRefreshToken({
      sub: user.id.toString(),
      role: user.role as any,
    });

    return { accessToken, refreshToken, role: user.role };
  },

  getProfile: async (userId: number) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);
    return user;
  },
};