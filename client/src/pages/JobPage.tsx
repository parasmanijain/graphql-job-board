import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/formatters.js';
import { useJob } from '../lib/graphql/hooks.js';

export const JobPage = () => {
  const { jobId } = useParams<{ jobId: string }>();

  if (!jobId) {
    return <div className="has-text-danger">Job ID is missing</div>;
  }
  const { job, loading, error } = useJob(jobId);

  console.log('[JobPage]', { job, loading, error });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error || !job) return <div className="has-text-danger">Data unavailable</div>;

  return (
    <div>
      <h1 className="title is-2">
        {job.title}
      </h1>
      <h2 className="subtitle is-4">
        <Link to={`/companies/${job.company?.id}`}>
          {job.company?.name}
        </Link>
      </h2>
      <div className="box">
        <div className="block has-text-grey">
          Posted: {formatDate(job.date, 'long')}
        </div>
        <p className="block">
          {job.description}
        </p>
      </div>
    </div>
  );
}