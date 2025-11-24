import knex from "knex";
/**
 * Create a strongly typed Knex connection.
 * You can later pass a table type map to enhance typing for queries.
 */
export const connection = knex({
    client: "better-sqlite3",
    connection: {
        filename: "./data/db.sqlite3",
    },
    useNullAsDefault: true,
});
/**
 * SQL logger for debugging
 */
connection.on("query", ({ sql, bindings }) => {
    const query = connection.raw(sql, bindings ?? []).toQuery();
    console.log("[db]", query);
});
