import knex, { Knex } from "knex";

/**
 * Create a strongly typed Knex connection.
 * You can later pass a table type map to enhance typing for queries.
 */
export const connection: Knex = knex({
  client: "better-sqlite3",
  connection: {
    filename: "./data/db.sqlite3",
  },
  useNullAsDefault: true,
});

/**
 * SQL logger for debugging
 */
connection.on("query", ({ sql, bindings }: { sql: string; bindings?: unknown[] }) => {
  const query = connection.raw(sql, bindings ?? []).toQuery();
  console.log("[db]", query);
});
