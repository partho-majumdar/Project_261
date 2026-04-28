import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler.js";
import ErrorHandler from "./error.js";
import { User } from "../models/user.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource.", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id).select(
    "-resetPasswordToken -resetPasswordExpire",
  );

  if (!req.user) {
    return next(new ErrorHandler("User not found with this id.", 404));
  }
  next();
});

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403,
        ),
      );
    }
    next();
  };
};
