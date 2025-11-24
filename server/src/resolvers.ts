import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import {
  countJobs,
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
} from "./db/jobs.js";
import type { Job } from "./db/jobs.js";
import type { Company } from "./db/companies.js";
import type DataLoader from "dataloader";

/**
 * GraphQL context type passed from Apollo Server
 */
export interface GraphQLContext {
  user?: {
    id: string;
    companyId: string;
    email: string;
  };
  companyLoader: DataLoader<string, Company | undefined>;
}

/**
 * Argument type helpers
 */
interface IdArgs {
  id: string;
}

interface PaginationArgs {
  limit?: number;
  offset?: number;
}

interface CreateJobArgs {
  input: {
    title: string;
    description: string;
  };
}

interface UpdateJobArgs {
  input: {
    id: string;
    title?: string;
    description?: string;
  };
}

export const resolvers = {
  Query: {
    company: async (
      _root: unknown,
      { id }: IdArgs
    ): Promise<Company> => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError("No Company found with id " + id);
      }
      return company;
    },

    job: async (
      _root: unknown,
      { id }: IdArgs
    ): Promise<Job> => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError("No Job found with id " + id);
      }
      return job;
    },

    jobs: async (
      _root: unknown,
      { limit, offset }: PaginationArgs
    ): Promise<{ items: Job[]; totalCount: number }> => {
      const items = await getJobs(limit, offset);
      const totalCount = await countJobs();
      return { items, totalCount };
    },
  },

  Mutation: {
    createJob: async (
      _root: unknown,
      { input: { title, description } }: CreateJobArgs,
      { user }: GraphQLContext
    ): Promise<Job> => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      return createJob({
        companyId: user.companyId,
        title,
        description,
      });
    },

    deleteJob: async (
      _root: unknown,
      { id }: IdArgs,
      { user }: GraphQLContext
    ): Promise<Job> => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }

      const job = await deleteJob(id, user.companyId);
      if (!job) {
        throw notFoundError("No Job found with id " + id);
      }
      return job;
    },

    updateJob: async (
      _root: unknown,
      { input: { id, title, description } }: UpdateJobArgs,
      { user }: GraphQLContext
    ): Promise<Job> => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }

      const job = await updateJob({
        id,
        companyId: user.companyId,
        title,
        description,
      });

      if (!job) {
        throw notFoundError("No Job found with id " + id);
      }

      return job;
    },
  },

  Company: {
    jobs: (company: Company): Promise<Job[]> =>
      getJobsByCompany(company.id),
  },

  Job: {
    company: (
      job: Job,
      _args: unknown,
      { companyLoader }: GraphQLContext
    ) => {
      return companyLoader.load(job.companyId);
    },
    date: (job: Job): string => toIsoDate(job.createdAt),
  },
};

/**
 * Error helpers
 */
function notFoundError(message: string): GraphQLError {
  return new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
}

function unauthorizedError(message: string): GraphQLError {
  return new GraphQLError(message, {
    extensions: { code: "UNAUTHORIZED" },
  });
}

function toIsoDate(value: string): string {
  return value.slice(0, "yyyy-mm-dd".length);
}
