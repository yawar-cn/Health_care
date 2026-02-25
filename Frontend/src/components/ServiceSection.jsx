import EndpointCard from "./EndpointCard";
import ServiceHeader from "./ServiceHeader";

export default function ServiceSection({ service, baseUrl, token }) {
  return (
    <section id={service.id} className="space-y-8">
      <ServiceHeader
        title={service.title}
        description={service.description}
        accent={service.accent}
      />
      <div className="grid gap-6">
        {service.endpoints.map((endpoint) => (
          <EndpointCard
            key={`${service.id}-${endpoint.title}`}
            endpoint={endpoint}
            baseUrl={baseUrl}
            token={token}
          />
        ))}
      </div>
    </section>
  );
}
