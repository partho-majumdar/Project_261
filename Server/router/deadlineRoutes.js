import express from "express";
import { createDeadline } from "../controllers/deadlineController.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/create-deadline/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  createDeadline
);

export default router;
