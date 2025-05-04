import dotenv from "dotenv";
import express from "express";
import cors from "cors";
dotenv.config();

const app = express();
import {
  createShortUrl,
  getShortUrl,
  getUrlClicks,
  logClick,
} from "./services/url";
import errorHandler from "./middleware/error-handler";
import {
  checkAndLogLimiter,
  createUrlLimiter,
} from "./middleware/rate-limiters";

//middleware
app.use(cors());
app.use(express.json());

app.post("/shorten", createUrlLimiter, async (req, res, next) => {
  try {
    const result = await createShortUrl(req.body);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

app.get("/slug/:slug", checkAndLogLimiter, async (req, res, next) => {
  const { slug } = req.params;

  try {
    const url = await getShortUrl(slug);

    logClick({
      slug,
      referer: req.get("referer"),
      user_agent: req.get("user-agent"),
      ip: req.ip,
    }).catch(console.error);

    res.status(201).json(url);
  } catch (err) {
    next(err);
  }
});

app.get("/urlclicks", async (req, res, next) => {
  try {
    const url = await getUrlClicks();

    res.status(201).json(url);
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
