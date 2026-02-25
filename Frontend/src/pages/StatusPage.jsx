import { useLocation, useParams } from "react-router-dom";
import Alert from "../components/Alert";
import PageHeader from "../components/PageHeader";

export default function StatusPage() {
  const { state } = useLocation();
  const { status } = useParams();

  const isSuccess = status === "success";
  const title = state?.title || (isSuccess ? "Success" : "Something went wrong");
  const description =
    state?.description ||
    (isSuccess
      ? "The operation completed successfully."
      : "The operation did not complete. Check logs for details.");

  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle={description} />
      <Alert
        type={isSuccess ? "success" : "error"}
        title={isSuccess ? "Completed" : "Failed"}
        description={description}
      />
    </div>
  );
}
