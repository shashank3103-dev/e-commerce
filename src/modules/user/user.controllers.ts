// user.controllers.ts
import { Request, Response } from "express";
import { prisma } from "../../prisma";

export const UserController = {
  async list(_req: Request, res: Response) {
    const users = await prisma.user.findMany();
    res.json({ success: true, users });
  },

  async me(req: any, res: Response) {
    const user = await prisma.user.findUnique({ where: { id: Number(req.user.sub) } });
    res.json({ success: true, user });
  }
};