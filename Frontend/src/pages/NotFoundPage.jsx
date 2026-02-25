import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function NotFoundPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Page Not Found"
        subtitle="The page you requested could not be found."
      />
      <Link to="/" className="button">
        Back to Home
      </Link>
    </div>
  );
}
