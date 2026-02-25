import { Link } from "react-router-dom";

const methodStyles = {
  GET: "bg-mint/20 text-ink",
  POST: "bg-ocean/20 text-ink",
  PUT: "bg-sun/30 text-ink",
  DELETE: "bg-blush/30 text-ink"
};

export default function EndpointListCard({ serviceId, endpoint }) {
  const route = `/endpoint/${serviceId}/${endpoint.id}`;

  return (
    <Link to={route} className="card flex flex-col gap-3 transition hover:shadow-glow">
      <div className="flex items-center justify-between">
        <span className={`tag ${methodStyles[endpoint.method] || "bg-frost text-dusk"}`}>
          {endpoint.method}
        </span>
        <span className="text-xs text-dusk/70">{endpoint.id}</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-ink">{endpoint.path}</h3>
        <p className="text-xs text-dusk/70">Fields: {endpoint.fields.length}</p>
      </div>
    </Link>
  );
}
