import { connection } from "./connection.js";
import { generateId } from "./ids.js";
const getJobTable = () => connection.table("job");
/**
 * Count total number of jobs in the database
 */
export async function countJobs() {
    const result = await getJobTable().first().count("* as count");
    return Number(result.count);
}
/**
 * Get jobs with optional pagination (ordered by creation desc)
 */
export async function getJobs(limit, offset) {
    const query = getJobTable().select().orderBy("createdAt", "desc");
    if (limit !== undefined)
        query.limit(limit);
    if (offset !== undefined)
        query.offset(offset);
    return query;
}
/**
 * Get jobs belonging to a specific company
 */
export async function getJobsByCompany(companyId) {
    return getJobTable().select().where({ companyId });
}
/**
 * Get a single job by ID
 */
export async function getJob(id) {
    return getJobTable().first().where({ id });
}
/**
 * Create a new job entry
 */
export async function createJob({ companyId, title, description, }) {
    const job = {
        id: generateId(),
        companyId,
        title,
        description,
        createdAt: new Date().toISOString(),
    };
    await getJobTable().insert(job);
    return job;
}
/**
 * Delete a job — only if it belongs to the given company
 */
export async function deleteJob(id, companyId) {
    const job = await getJobTable().first().where({ id, companyId });
    if (!job)
        return null;
    await getJobTable().delete().where({ id });
    return job;
}
/**
 * Update a job — only if it belongs to the given company
 */
export async function updateJob({ id, companyId, title, description, }) {
    const job = await getJobTable().first().where({ id, companyId });
    if (!job)
        return null;
    const updatedFields = {
        title,
        description,
    };
    await getJobTable().update(updatedFields).where({ id });
    return { ...job, ...updatedFields };
}
