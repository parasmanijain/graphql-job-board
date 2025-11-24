import { connection } from "./connection.js";
const getUserTable = () => connection.table("user");
/**
 * Get a user by ID
 */
export async function getUser(id) {
    return getUserTable().first().where({ id });
}
/**
 * Get a user by email
 */
export async function getUserByEmail(email) {
    return getUserTable().first().where({ email });
}
