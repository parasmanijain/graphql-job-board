import { useState } from 'react';
import JobList from '../components/JobList.js';
import PaginationBar from '../components/PaginationBar.js';
import { useJobs } from '../lib/graphql/hooks.js';

const JOBS_PER_PAGE = 7;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { jobs, loading, error } = useJobs(JOBS_PER_PAGE, (currentPage - 1) * JOBS_PER_PAGE);

  console.log('[HomePage]', { jobs, loading, error });

  if (loading) return <div>Loading...</div>;
  if (error || !jobs) return <div className="has-text-danger">Data unavailable</div>;

  // TypeScript now knows `jobs` is defined
  const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE);

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <JobList jobs={jobs.items} />
    </div>
  );
}

export default HomePage;
