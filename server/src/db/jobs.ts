import { connection } from "./connection.js";
import { generateId } from "./ids.js";

/**
 * Shape of a job record in the database
 * (extend this if your table contains more columns)
 */
export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  createdAt: string; // ISO timestamp string
}

const getJobTable = () => connection.table<Job>("job");

/**
 * Count total number of jobs in the database
 */
export async function countJobs(): Promise<number> {
  const result = await getJobTable().first().count<{ count: number }>("* as count");
  return Number(result.count);
}

/**
 * Get jobs with optional pagination (ordered by creation desc)
 */
export async function getJobs(
  limit?: number,
  offset?: number
): Promise<Job[]> {
  const query = getJobTable().select().orderBy("createdAt", "desc");

  if (limit !== undefined) query.limit(limit);
  if (offset !== undefined) query.offset(offset);

  return query;
}

/**
 * Get jobs belonging to a specific company
 */
export async function getJobsByCompany(companyId: string): Promise<Job[]> {
  return getJobTable().select().where({ companyId });
}

/**
 * Get a single job by ID
 */
export async function getJob(id: string): Promise<Job | undefined> {
  return getJobTable().first().where({ id });
}

/**
 * Create a new job entry
 */
export async function createJob({
  companyId,
  title,
  description,
}: Pick<Job, "companyId" | "title" | "description">): Promise<Job> {
  const job: Job = {
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
export async function deleteJob(
  id: string,
  companyId: string
): Promise<Job | null> {
  const job = await getJobTable().first().where({ id, companyId });
  if (!job) return null;

  await getJobTable().delete().where({ id });
  return job;
}

/**
 * Update a job — only if it belongs to the given company
 */
export async function updateJob({
  id,
  companyId,
  title,
  description,
}: {
  id: string;
  companyId: string;
  title?: string;
  description?: string;
}): Promise<Job | null> {
  const job = await getJobTable().first().where({ id, companyId });
  if (!job) return null;

  const updatedFields: Partial<Pick<Job, "title" | "description">> = {
    title,
    description,
  };

  await getJobTable().update(updatedFields).where({ id });
  return { ...job, ...updatedFields };
}
