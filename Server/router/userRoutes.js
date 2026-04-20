import express from "express";
import {
  registerUser,
  login,
  getUser,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import multer from "multer";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/me", getUser);
router.get("/logout", logout);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;
