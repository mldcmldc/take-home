/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("url_clicks", function (table) {
    table.increments("id").primary();
    table.string("slug").notNullable(); // Could be foreign key to urls.slug
    table.timestamp("clicked_at").defaultTo(knex.fn.now());
    table.text("referer");
    table.text("user_agent");
    table.string("ip", 45); // IPv6 safe

    table
      .foreign("slug")
      .references("slug")
      .inTable("urls")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("url_clicks");
};
