import { Link } from "react-router-dom";

const objectives = [
  "Design a scalable healthcare consultation system.",
  "Implement microservices using Spring Boot.",
  "Provide secure JWT-based authentication.",
  "Enable doctor-patient digital consultation.",
  "Automate medicine selection based on prescription.",
  "Integrate secure online payment.",
  "Implement AI-based specialist recommendation chatbot.",
  "Enable asynchronous communication between services."
];

const services = [
  "API Gateway",
  "Auth Service",
  "User Service",
  "Consultation Service",
  "Payment Service",
  "Pharmacy (Medicine) Service",
  "Notification Service",
  "AI Recommendation Service"
];

const modules = [
  "API Gateway: Routes requests and validates JWT.",
  "Auth Service: Handles registration, login, and role-based access.",
  "User Service: Manages patient and doctor profiles.",
  "Consultation Service: Handles symptom submission and prescription management.",
  "Payment Service: Manages consultation and medicine payments.",
  "Pharmacy Service: Maintains medicine catalog, stock, and automated cart logic.",
  "Notification Service: Sends emails for payments, prescriptions, and orders.",
  "AI Recommendation Service: Suggests specialist based on symptom analysis."
];

const workflow = [
  "Patient logs into the system.",
  "Patient interacts with AI chatbot and enters symptoms.",
  "AI suggests appropriate specialist.",
  "Patient submits consultation request.",
  "Doctor reviews and submits prescription.",
  "Patient completes consultation payment.",
  "Prescribed medicines are automatically added to cart.",
  "Patient purchases medicines.",
  "Prescription PDF and order confirmation are sent via email."
];

const technologies = [
  "Java 17 / 21",
  "Spring Boot 3",
  "Spring Security",
  "JWT Authentication",
  "Spring Cloud Gateway",
  "Eureka Service Registry",
  "Kafka / RabbitMQ",
  "MySQL",
  "Razorpay / Stripe",
  "Maven",
  "PDF Generation Library",
  "Rule-Based AI Logic"
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl space-y-12 px-6 py-16">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-ink px-4 py-2 text-white">
              <span className="text-sm font-semibold">Research Overview</span>
            </div>
            <div className="space-y-3">
              <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">
                MediConnect
              </h1>
              <p className="text-base text-dusk/80">
                Microservices-Based Healthcare Consultation Platform with AI Specialist
                Recommendation
              </p>
            </div>
            <p className="text-sm text-dusk/80">
              MediConnect is a microservices-based healthcare consultation platform
              developed using Java Spring Boot. The system enables patients to digitally
              submit medical symptoms and consult specialized doctors while integrating
              authentication, prescription automation, payments, and email delivery.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="button" to="/login">
                Sign in
              </Link>
              <a className="button-secondary" href="#abstract">
                Read the research
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-dusk/70">
                  Architecture
                </p>
                <p className="text-xl font-semibold text-ink">8 Services</p>
                <p className="text-sm text-dusk/80">
                  Independent deployment with API Gateway and Eureka registry.
                </p>
              </div>
              <div className="card space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-dusk/70">
                  Intelligence
                </p>
                <p className="text-xl font-semibold text-ink">AI Recommendation</p>
                <p className="text-sm text-dusk/80">
                  Symptom analysis suggests the right specialist before booking.
                </p>
              </div>
            </div>
          </div>

          <div className="card space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-dusk/70">
                System at a glance
              </p>
              <h2 className="text-lg font-semibold text-ink">
                Secure, scalable, and patient-centered.
              </h2>
            </div>
            <div className="space-y-3 text-sm text-dusk/80">
              <p>
                Distributed architecture principles power MediConnect: API Gateway routing,
                JWT authentication, service registry discovery, and event-driven
                communication for resilience.
              </p>
              <p>
                The platform aligns clinical workflows with digital convenience, enabling
                fast triage, specialist matching, and automated prescription fulfillment.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="tag bg-frost text-dusk">JWT</span>
              <span className="tag bg-frost text-dusk">Microservices</span>
              <span className="tag bg-frost text-dusk">Event-Driven</span>
              <span className="tag bg-frost text-dusk">AI Chatbot</span>
            </div>
          </div>
        </section>

        <section id="abstract" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card space-y-3">
            <h2 className="section-title">Abstract</h2>
            <p className="text-sm text-dusk/80">
              MediConnect is a microservices-based healthcare consultation platform developed
              using Java Spring Boot. The system enables patients to digitally submit medical
              symptoms and consult specialized doctors. The platform integrates secure
              authentication, automated prescription-based medicine selection, online payment
              processing, and email-based prescription delivery.
            </p>
            <p className="text-sm text-dusk/80">
              An AI-based chatbot service has been integrated to analyze patient symptoms and
              recommend the appropriate medical specialist before booking a consultation. The
              system follows modern distributed architecture principles including API Gateway,
              service registry, JWT authentication, and event-driven communication.
            </p>
          </div>
          <div className="card space-y-3">
            <h2 className="section-title">Introduction</h2>
            <p className="text-sm text-dusk/80">
              Healthcare accessibility for preliminary consultation is a major challenge. This
              project provides a scalable digital healthcare consultation system using
              microservices architecture. The system ensures modularity, scalability,
              independent deployment, and intelligent specialist recommendation.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="card space-y-3">
            <h2 className="section-title">Objectives</h2>
            <ul className="space-y-2 text-sm text-dusk/80">
              {objectives.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="card space-y-3">
            <h2 className="section-title">System Architecture</h2>
            <p className="text-sm text-dusk/80">
              The system follows Microservices Architecture consisting of 8 services:
            </p>
            <ul className="space-y-2 text-sm text-dusk/80">
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
            <p className="text-sm text-dusk/80">
              Each service maintains its own database and communicates via REST APIs and
              event-driven messaging (Kafka/RabbitMQ).
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card space-y-4">
            <h2 className="section-title">AI Recommendation Service</h2>
            <p className="text-sm text-dusk/80">
              The AI Recommendation Service analyzes patient symptoms and suggests the
              appropriate specialist doctor using rule-based keyword classification.
            </p>
            <div className="space-y-2 text-sm text-dusk/80">
              <p className="text-xs font-semibold uppercase tracking-widest text-dusk/70">
                Workflow
              </p>
              <ol className="space-y-2">
                <li>Patient enters symptoms in chatbot interface.</li>
                <li>AI service analyzes keywords.</li>
                <li>Service returns recommended specialist category.</li>
                <li>Patient proceeds to book consultation.</li>
              </ol>
            </div>
          </div>
          <div className="card space-y-4">
            <div className="rounded-2xl bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-dusk/70">
                Example
              </p>
              <p className="text-sm text-dusk/80">Symptoms: Chest pain, shortness of breath</p>
              <p className="text-sm font-semibold text-ink">
                Suggested Specialist: Cardiologist
              </p>
            </div>
            <p className="text-sm text-dusk/80">
              The chatbot does not provide medical diagnosis; it only recommends specialist
              categories.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="card space-y-3">
            <h2 className="section-title">Module Description</h2>
            <ul className="space-y-2 text-sm text-dusk/80">
              {modules.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="card space-y-3">
            <h2 className="section-title">System Workflow</h2>
            <ol className="space-y-2 text-sm text-dusk/80">
              {workflow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card space-y-3">
            <h2 className="section-title">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span key={tech} className="tag bg-frost text-dusk">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="card space-y-3">
            <h2 className="section-title">Conclusion</h2>
            <p className="text-sm text-dusk/80">
              MediConnect demonstrates a scalable and secure microservices-based healthcare
              platform integrating authentication, distributed communication, automated
              medicine selection, payment processing, notification handling, and AI-based
              specialist recommendation.
            </p>
            <p className="text-sm text-dusk/80">
              The project reflects real-world enterprise architecture practices and
              intelligent healthcare system design.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
