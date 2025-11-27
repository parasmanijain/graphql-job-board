import { Link } from "react-router-dom";
import { Job } from "../models/shared.js";
import { formatDate } from "../lib/formatters.js";

interface JobItemProps {
    job: Job;
}

export const JobItem = ({ job }: JobItemProps) => {
    const title = job.company ? `${job.title} at ${job.company.name}` : job.title;

    return (
        <li className="media">
            <div className="media-left has-text-grey">{formatDate(job.date)}</div>
            <div className="media-content">
                <Link to={`/jobs/${job.id}`}>{title}</Link>
            </div>
        </li>
    );
}