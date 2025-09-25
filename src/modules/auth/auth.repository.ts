import { prisma } from "../../prisma";
import { Role } from "@prisma/client"; // import generated enum

export const AuthRepository = {
  /**
   * Find user by email
   */
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  /**
   * Create new user (defaults to USER)
   */
  createUser: (email: string, role: Role = Role.USER) =>
    prisma.user.create({
      data: { email, role },
    }),

  /**
   * Save or update OTP
   */
  saveOtp: (email: string, otp: string, expires: Date) =>
    prisma.user.upsert({
      where: { email },
      update: { otp, otpExpires: expires },
      create: {
        email,
        otp,
        otpExpires: expires,
        role: Role.USER,
      },
    }),

  /**
   * Verify if OTP matches and not expired
   */
  verifyOtp: async (email: string, otp: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      return null;
    }
    return user;
  },

  /**
   * Clear OTP after successful login
   */
  clearOtp: (userId: number) =>
    prisma.user.update({
      where: { id: userId },
      data: { otp: null, otpExpires: null },
    }),

  /**
   * Promote user → SUBADMIN or ADMIN
   */
  promoteUser: (userId: number, role: Role) =>
    prisma.user.update({
      where: { id: userId },
      data: { role },
    }),
};