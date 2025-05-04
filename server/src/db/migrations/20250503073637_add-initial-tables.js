/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("urls", function (table) {
    table.increments("id").primary();
    table.string("slug", 128).unique().notNullable(); // Shortened slug (e.g., 'abc123')
    table.text("long_url").notNullable(); // Original long URL
    table.string("utm_source", 255).nullable();
    table.string("utm_medium", 255).nullable();
    table.string("utm_campaign", 255).nullable();
    table.string("utm_term", 255).nullable();
    table.string("utm_content", 255).nullable();
    table.timestamp("expires_at").nullable(); // Optional expiration
    table.timestamps(true, true); // created_at and updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("urls");
};
