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
import { setupSwagger } from "./swagger";

//middleware
app.use(cors());
app.use(express.json());

setupSwagger(app);

/**
 * @swagger
 * /shorten:
 *   post:
 *     summary: Create a shortened URL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShortenRequest'
 *     responses:
 *       201:
 *         description: Successfully created short URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShortenResponse'
 */
app.post("/shorten", createUrlLimiter, async (req, res, next) => {
  try {
    const result = await createShortUrl(req.body);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /slug/{slug}:
 *   get:
 *     summary: Retrieve original URL from slug and log click
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the shortened URL
 *     responses:
 *       200:
 *         description: Returns the URL object for redirection in FE
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UrlDetails'
 *       404:
 *         description: Returns 404 if slug is not found or expired
 */
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

/**
 * @swagger
 * /urlclicks:
 *   get:
 *     summary: Get click statistics for all short URLs
 *     responses:
 *       200:
 *         description: List of click statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClickStat'
 */
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
