import rateLimit from "express-rate-limit";

export const checkAndLogLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 15, // 15 requests per 10 seconds (~90/min)
  message: {
    error:
      "Too many requests checking short links from this IP. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const createUrlLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    error: "Too many URLs created from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
