import { connection } from "./connection.js";

/**
 * Shape of a user record in the database
 * (extend this if your table contains more columns)
 */
export interface User {
  id: string;
  email: string;
  password: string;
  companyId: string;
}

const getUserTable = () => connection.table<User>("user");

/**
 * Get a user by ID
 */
export async function getUser(id: string): Promise<User | undefined> {
  return getUserTable().first().where({ id });
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string): Promise<User | undefined> {
  return getUserTable().first().where({ email });
}
