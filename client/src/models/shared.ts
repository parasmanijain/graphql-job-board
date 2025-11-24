// src/types.ts
export interface Company {
  id: string;
  name: string;
  description?: string;
  jobs?: Job[];
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company?: Company;
  date: string; // ISO string from the server
}

export interface CreateJobInput {
  title: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
}

export interface JobsResponse {
  items: Job[];
  totalCount: number;
}
