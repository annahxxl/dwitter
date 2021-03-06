import express from "express";
import "express-async-errors";
import { body } from "express-validator";
import { validate } from "../middlewares/validator.js";
import { isAuth } from "../middlewares/auth.js";
import * as authController from "../controllers/auth.js";

const router = express.Router();

const validateCredential = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("username should be at least 3 characters"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("password should be at least 5 characters"),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body("name").notEmpty().withMessage("name is missing"),
  body("email").isEmail().normalizeEmail().withMessage("invalid email"),
  body("url")
    .isURL()
    .withMessage("invalid URL")
    .optional({ nullable: true, checkFalsy: true }),
];

router.post("/signup", validateSignup, authController.signup);

router.post("/login", validateCredential, authController.login);

router.post("/logout", authController.logout);

router.get("/me", isAuth, authController.me);

router.get("/csrf-token", authController.csrfToken);

export default router;
