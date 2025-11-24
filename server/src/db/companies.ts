import DataLoader from "dataloader";
import { connection } from "./connection.js";

/**
 * Shape of one company record in the database
 * (extend this if more fields exist)
 */
export interface Company {
  id: string;
  name: string;
  // add fields here if your table has more columns
}

const getCompanyTable = () => connection.table<Company>("company");

/**
 * Get a single company by ID
 */
export async function getCompany(id: string): Promise<Company | undefined> {
  return getCompanyTable().first().where({ id });
}

/**
 * Creates a DataLoader that batches & caches company lookups
 */
export function createCompanyLoader() {
  return new DataLoader<string, Company | undefined>(async (ids) => {
    const companies = await getCompanyTable()
      .select()
      .whereIn("id", ids as string[]);

    // preserve order to match DataLoader contract
    return ids.map((id) => companies.find((company) => company.id === id));
  });
}
