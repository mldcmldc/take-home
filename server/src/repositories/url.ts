import { Knex } from "knex";
import { UrlClickType, UrlType } from "@app/types/url.js";

export function createUrlRepository(db: Knex) {
  return {
    findUrlBySlug: async (slug: string) => {
      return db("urls").where({ slug }).first();
    },

    createUrl: async (data: UrlType) => {
      return db("urls").insert(data).returning("*");
    },

    slugExists: async (slug: string) => {
      const result = await db("urls").where({ slug }).first();
      return !!result;
    },

    // non-blocking
    logClick: ({ slug, referer, user_agent, ip }: UrlClickType) => {
      return db("url_clicks").insert({
        slug,
        referer,
        user_agent,
        ip,
      });
    },

    // can be improved further to add pagination
    getUrlClicks: async () => {
      return await db("url_clicks")
        .select("slug")
        .count("* as total_clicks")
        .countDistinct("ip as unique_visitors")
        .groupBy("slug")
        .orderBy([
          { column: "total_clicks", order: "desc" },
          { column: "unique_visitors", order: "desc" },
        ])
        .limit(50);
    },
  };
}
