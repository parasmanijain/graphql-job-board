import { useQuery, useMutation } from "@apollo/client/react";
import {
  companyByIdQuery,
  createJobMutation,
  jobByIdQuery,
  jobsQuery,
} from "./queries.js";
import {
  Company,
  CreateJobInput,
  Job,
  JobsResponse,
} from "../../models/shared.js";

// ----------------- useCompany -----------------
export function useCompany(id: string) {
  const { data, loading, error } = useQuery<{ company: Company }>(
    companyByIdQuery,
    { variables: { id } }
  );

  return {
    company: data?.company,
    loading,
    error: Boolean(error),
  };
}

// ----------------- useJob -----------------
export function useJob(id: string) {
  const { data, loading, error } = useQuery<{ job: Job }>(jobByIdQuery, {
    variables: { id },
  });

  return {
    job: data?.job,
    loading,
    error: Boolean(error),
  };
}

// ----------------- useJobs -----------------
export function useJobs(limit: number, offset: number) {
  const { data, loading, error } = useQuery<{ jobs: JobsResponse }>(jobsQuery, {
    variables: { limit, offset },
    fetchPolicy: "network-only",
  });

  return {
    jobs: data?.jobs, // type: JobsResponse | undefined
    loading,
    error: Boolean(error),
  };
}

// ----------------- useCreateJob -----------------
export function useCreateJob() {
  const [mutate, { loading }] = useMutation<
    { job: Job },
    { input: CreateJobInput }
  >(createJobMutation);

  const createJob = async (
    title: string,
    description: string
  ): Promise<Job> => {
    const { data } = await mutate({
      variables: { input: { title, description } },
      update: (cache, { data }) => {
        if (!data) return;
        cache.writeQuery({
          query: jobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      },
    });

    if (!data) throw new Error("Job creation failed");
    return data.job;
  };

  return {
    createJob,
    loading,
  };
}
