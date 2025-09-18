import { prisma } from "../../prisma";

export const AuthRepository = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),

  createUser: (email: string, role: string = "user") =>
    prisma.user.create({ data: { email, role } }),

saveOtp: (email: string, otp: string, expires: Date) =>
  prisma.user.upsert({
    where: { email },
    update: { otp, otpExpires: expires },
    create: { email, otp, otpExpires: expires, role: "user" },
  }),


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
};
