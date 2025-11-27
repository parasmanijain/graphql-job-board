import { Job } from '../models/shared.js';
import { JobItem } from './JobItem.js';

interface JobListProps {
  jobs: Job[];
}

export const JobList = ({ jobs }: JobListProps) => {
  return (
    <ul className="box">
      {jobs.map((job) => (
        <JobItem key={job.id} job={job} />
      ))}
    </ul>
  );
}