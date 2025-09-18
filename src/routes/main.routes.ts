import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";


const router = Router();

// All routes go here
router.use("/auth", authRoutes); // Assuming you have shopRoutes defined similarly

export default router;
