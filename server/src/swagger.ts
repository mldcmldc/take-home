import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "URL Shortener API",
      version: "1.0.0",
      description: "API for creating and retrieving shortened URLs",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
    components: {
      schemas: {
        ShortenRequest: {
          type: "object",
          properties: {
            long_url: {
              type: "string",
              example: "https://example.com",
            },
            slug: {
              type: "string",
              example: "abc123",
              nullable: true,
            },
            expires_at: {
              type: "string",
              format: "date-time",
              example: "2021-08-01T00:00:00.000Z",
              nullable: true,
            },
            utm_source: {
              type: "string",
              example: "google",
              nullable: true,
            },
            utm_medium: {
              type: "string",
              example: "cpc",
              nullable: true,
            },
            utm_campaign: {
              type: "string",
              example: "abc123",
              nullable: true,
            },
            utm_content: {
              type: "string",
              example: "abc123",
              nullable: true,
            },
          },
        },
        ShortenResponse: {
          type: "object",
          properties: {
            slug: {
              type: "string",
              example: "abc123",
            },
            id: {
              type: "number",
              example: 1,
            },
          },
        },
        UrlDetails: {
          type: "object",
          properties: {
            id: {
              type: "number",
              example: 1,
            },
            long_url: {
              type: "string",
              example: "https://example.com",
            },
            slug: {
              type: "string",
              example: "abc123",
            },
            expires_at: {
              type: "string",
              format: "date-time",
              example: "2021-08-01T00:00:00.000Z",
              nullable: true,
            },
            utm_source: {
              type: "string",
              example: "google",
              nullable: true,
            },
            utm_medium: {
              type: "string",
              example: "cpc",
              nullable: true,
            },
            utm_campaign: {
              type: "string",
              example: "abc123",
              nullable: true,
            },
            utm_content: {
              type: "string",
              example: "abc123",
              nullable: true,
            },
          },
        },
        ClickStat: {
          type: "object",
          properties: {
            slug: {
              type: "string",
            },
            ip: {
              type: "string",
            },
            referer: {
              type: "string",
            },
            user_agent: {
              type: "string",
            },
            clicked_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
  },
  apis: ["./src/rest-api.ts"], // <- path to your annotated route file
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
