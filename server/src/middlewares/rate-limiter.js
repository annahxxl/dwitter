import rateLimit from "express-rate-limit";
import { config } from "../config.js";

export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequest,
  // keyGenerator: (req, res) => req.ip, // 사용자별 count
  keyGenerator: (req, res) => "dwitter", // Global하게 count
});
