import { useParams } from 'react-router';
import JobList from '../components/JobList.js';
import { useCompany } from '../lib/graphql/hooks.js';

function CompanyPage() {
  const { companyId } = useParams<{ companyId: string }>();

  // Handle missing companyId
  if (!companyId) {
    return <div className="has-text-danger">Company ID is missing</div>;
  }

  const { company, loading, error } = useCompany(companyId);

  console.log('[CompanyPage]', { company, loading, error });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error || !company) {
    return <div className="has-text-danger">Data unavailable</div>;
  }

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-5">Jobs at {company.name}</h2>
      {/* Provide a default empty array if jobs is undefined */}
      <JobList jobs={company.jobs ?? []} />
    </div>
  );
}

export default CompanyPage;
