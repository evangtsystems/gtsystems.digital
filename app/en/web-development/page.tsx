import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { websiteProjects } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI, Websites, Cybersecurity & Digital Infrastructure",
  description: "AI automations, custom web apps, cybersecurity, business websites, wired networks, Wi-Fi, cabling, and telecom infrastructure by GTSystems.",
};

const capabilities = [
  {
    title: "AI automations",
    text: "Chatbots, internal assistants, request classification, document summaries, and workflows that reduce manual work.",
    tags: ["AI assistants", "Lead routing", "Document flows"],
  },
  {
    title: "Custom web apps",
    text: "Portals, dashboards, booking flows, admin panels, and applications built around your own process.",
    tags: ["Dashboards", "Portals", "Workflows"],
  },
  {
    title: "Cybersecurity",
    text: "Endpoint protection, access rules, backup thinking, remote support, and practical risk control for your team.",
    tags: ["Bitdefender", "Access rules", "Risk control"],
  },
  {
    title: "Networks & cloud infrastructure",
    text: "Wi-Fi coverage, structured cabling, telecom centers, secure access, and infrastructure that can handle daily use.",
    tags: ["Wi-Fi", "Telecoms", "Secure access"],
  },
];

const aiUses = [
  "Automatic organization of requests from forms and email",
  "AI assistant for common customer or staff questions",
  "Website connection with CRM, business software, or reporting",
  "Dashboards for sales, support, reservations, or tasks",
];

export default function EnglishWebDevelopmentPage() {
  return (
    <>
      <section className="page-hero page-hero--digital">
        <div className="container digital-hero">
          <div>
            <p className="eyebrow">AI · Custom apps · Cybersecurity · Networks</p>
            <h1>Digital systems that make your business faster, safer, and smarter.</h1>
            <p>
              We do not only build websites. We design web applications, AI workflows, automations,
              cybersecurity, and infrastructure that connect customers, staff, data, and daily work.
            </p>
            <div className="hero__actions">
              <Link className="button button--light" href="/en/contact">
                Discuss a digital project
              </Link>
              <Link className="button button--ghost" href="#ai">
                View AI capabilities
              </Link>
            </div>
          </div>
          <div className="digital-console" aria-label="Digital services overview">
            <div className="digital-console__top">
              <span>GTSystems Digital Stack</span>
              <strong>Live</strong>
            </div>
            <div className="digital-console__grid">
              <span>AI</span>
              <span>Web Apps</span>
              <span>Cybersecurity</span>
              <span>Networks</span>
              <span>Automation</span>
              <span>Support</span>
            </div>
            <div className="digital-console__metric">
              <strong>1</strong>
              <span>single technical owner from idea to support</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">What we can build</p>
              <h2>From websites to AI tools and secure operations.</h2>
            </div>
            <p>
              Every solution is designed around the work that needs to happen: visibility, sales,
              support, reporting, security, collaboration, or internal productivity.
            </p>
          </div>
          <div className="capability-grid">
            {capabilities.map((capability) => (
              <article className="capability-card" key={capability.title}>
                <h3>{capability.title}</h3>
                <p>{capability.text}</p>
                <div>
                  {capability.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ai-section" id="ai">
        <div className="container ai-layout">
          <div>
            <p className="eyebrow">Practical AI</p>
            <h2>No hype. Small, useful automations that fit into business workflows.</h2>
            <p>
              AI becomes valuable when it reduces time, errors, and delays in real work: customer
              requests, answers, classification, reports, suggestions, and internal knowledge.
            </p>
          </div>
          <div className="ai-panel">
            {aiUses.map((use) => (
              <div className="ai-panel__item" key={use}>
                <span />
                <p>{use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--white">
        <div className="container feature-mosaic">
          <div className="feature-tile feature-tile--dark">
            <p className="eyebrow">Cybersecurity</p>
            <h2>Protection before a problem becomes downtime.</h2>
            <p>
              Endpoint security, secure remote access, device control, and practical policies for
              small and medium businesses.
            </p>
          </div>
          <div className="feature-tile">
            <Image
              src="https://techzone.bitdefender.com/en/image/uuid-86e7b4f2-523c-2bc3-6d88-69d152f35250.jpg"
              alt=""
              fill
              sizes="(max-width: 880px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="feature-tile">
            <Image
              src="https://rbs.gr/wp-content/uploads/2026/02/pepper-all-in-one-landing-pic-rbs-1-768x788.webp"
              alt=""
              fill
              sizes="(max-width: 880px) 100vw, 50vw"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="feature-tile feature-tile--green">
            <p className="eyebrow">Customize</p>
            <h2>Custom solutions that connect with the tools you already use.</h2>
            <p>
              Forms, portals, dashboards, CRM flows, business software integrations, and automations
              so the same information is not retyped in three places.
            </p>
          </div>
        </div>
      </section>

      <section className="band band--white">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Current work</p>
              <h2>Websites delivered for real businesses.</h2>
            </div>
            <p>
              The current GTSystems portfolio includes stores, hotels, accommodation businesses,
              restaurants, service companies, tourism projects, and local organizations.
            </p>
          </div>
          <div className="portfolio-grid">
            {websiteProjects.map((project) => (
              <a className="portfolio-card" href={project.website} key={project.href} target="_blank" rel="noopener noreferrer">
                <Image src={project.image} alt="" fill sizes="(max-width: 880px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                <span className="portfolio-card__content">
                  <span className="portfolio-card__tag">{project.category}</span>
                  <h3>{project.title}</h3>
                  <span className="portfolio-card__link">Visit website</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
