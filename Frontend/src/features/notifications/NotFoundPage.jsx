import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

export default function NotFoundPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Page Not Found"
        subtitle="The page you are looking for does not exist."
      />
      <Link className="button" to="/dashboard">
        Back to dashboard
      </Link>
    </div>
  );
}
