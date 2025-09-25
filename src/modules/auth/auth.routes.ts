import { Router } from "express";
import { AuthController } from "./auth.controllers";
import validate from "../../middlewares/validate";
import { sendOtpSchema, verifyOtpSchema } from "./auth.schemas";


const router = Router();

router.post("/send-otp",validate(sendOtpSchema), AuthController.sendOtp);
router.post("/verify-otp", validate(verifyOtpSchema), AuthController.verifyOtp);

// Only admin can promote users

export default router;