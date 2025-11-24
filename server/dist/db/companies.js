import DataLoader from "dataloader";
import { connection } from "./connection.js";
const getCompanyTable = () => connection.table("company");
/**
 * Get a single company by ID
 */
export async function getCompany(id) {
    return getCompanyTable().first().where({ id });
}
/**
 * Creates a DataLoader that batches & caches company lookups
 */
export function createCompanyLoader() {
    return new DataLoader(async (ids) => {
        const companies = await getCompanyTable()
            .select()
            .whereIn("id", ids);
        // preserve order to match DataLoader contract
        return ids.map((id) => companies.find((company) => company.id === id));
    });
}
