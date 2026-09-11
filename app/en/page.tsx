import Image from "next/image";
import Link from "next/link";
import { providers, supplierLogos, websiteProjects } from "@/lib/site";

const services = [
  {
    title: "Business Software",
    summary:
      "Commercial, accounting, retail, restaurant, and reporting systems configured around your workflow.",
    points: ["Megasoft applications", "ERP-adjacent workflows", "Business intelligence"],
    image: "https://gtsystems.gr/wp-content/uploads/2019/01/megasoft-600x389.jpg",
  },
  {
    title: "Cash & POS Systems",
    summary:
      "Cash registers, tax systems, weighing integrations, setup, training, and dependable local support.",
    points: ["Cash registers", "Tax compliance", "Retail and hospitality"],
    image: "https://gtsystems.gr/wp-content/uploads/2019/01/cashiers-600x389.jpg",
  },
  {
    title: "IT Support",
    summary:
      "Support contracts, computer and laptop service, hardware supply, security, and practical daily help.",
    points: ["Support contracts", "Hardware service", "Remote assistance"],
    image: "https://gtsystems.gr/wp-content/uploads/2019/01/support-600x389.jpg",
  },
];

const process = [
  ["Assess", "We map the business need, current tools, risks, and the result you want."],
  ["Design", "We choose the right mix of software, hardware, network, support, and web systems."],
  ["Implement", "We configure, install, connect, test, and train your team."],
  ["Support", "We stay close after launch with practical local help when it matters."],
];

const englishProviders = [
  {
    name: "Megasoft",
    category: "Business Software",
    product: "PRISMA Win",
    tone: "Commercial management, electronic invoicing, mobile workflows",
    description:
      "PRISMA Win supports daily operations, business organization, information management, and tax-related business needs.",
    bullets: ["Commercial management", "Electronic invoicing", "Real-time business view"],
    image: providers[0].image,
    href: providers[0].href,
  },
  {
    name: "RBS",
    category: "Retail & POS",
    product: "PEPPER All in One / NINE POS",
    tone: "Cash register and POS in one device, restaurant workflows, retail, myDATA",
    description:
      "RBS covers retail and restaurant transactions with PEPPER All in One, NINE POS, EDASYS, and modern fiscal cash systems.",
    bullets: ["PEPPER All in One", "NINE POS", "AADE / myDATA compliance"],
    image: providers[1].image,
    href: providers[1].href,
  },
  {
    name: "Bitdefender",
    category: "Cybersecurity",
    product: "GravityZone",
    tone: "Endpoint protection, risk management, business security",
    description:
      "GravityZone gives businesses endpoint protection, threat prevention, and a centralized security view across devices and services.",
    bullets: ["Business Security", "Threat prevention", "Endpoint visibility"],
    image: providers[2].image,
    href: providers[2].href,
  },
];

export default function EnglishHomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div>
            <p className="eyebrow">Business IT · POS · Networks · Web</p>
            <h1>The technology backbone for businesses that move every day.</h1>
            <p>
              GTSystems connects business software, RBS and POS flows, cash systems, networks,
              telecoms, security, support, and web applications into one working business ecosystem.
            </p>
            <div className="hero__actions">
              <Link className="button button--light" href="/en/contact">
                Talk to GTSystems
              </Link>
              <Link className="button button--ghost" href="/en/business-systems">
                Explore Solutions
              </Link>
            </div>
          </div>

          <aside className="hero-panel" aria-label="GTSystems highlights">
            <div className="hero-panel__label">Integrated business stack</div>
            <div className="hero-panel__stat">
              <span className="hero-panel__number">20+</span>
              <span>years supporting local businesses</span>
            </div>
            <div className="hero-panel__stat">
              <span className="hero-panel__number">5+</span>
              <span>partner for software, hardware, networks, and support</span>
            </div>
            <div className="hero-panel__stat">
              <span className="hero-panel__number">GR</span>
              <span>Greek-market know-how with service across Greece</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="provider-strip" aria-label="Providers and technologies">
        <div className="container provider-strip__inner">
          <div className="supplier-marquee">
            {[...supplierLogos, ...supplierLogos].map((supplier, index) => (
              <span className="supplier-logo" key={`${supplier.name}-${index}`}>
                <Image src={supplier.logo} alt={supplier.name} fill sizes="170px" style={{ objectFit: "contain" }} />
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--white">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Solutions</p>
              <h2>Everything a business needs to operate, connect, and grow.</h2>
            </div>
            <p>
              We combine proven platforms, reliable infrastructure, and ongoing support around
              your real workflow.
            </p>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <div className="service-card__image">
                  <Image src={service.image} alt="" fill sizes="(max-width: 880px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                </div>
                <div className="service-card__body">
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                  <ul>
                    {service.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--white">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Providers & products</p>
              <h2>Real products, correct configuration, practical support.</h2>
            </div>
            <p>
              GTSystems selects, installs, configures, and supports products with a clear role
              inside the business: management, checkout, ordering, security, and remote assistance.
            </p>
          </div>

          <div className="provider-grid">
            {englishProviders.map((provider) => (
              <a className="provider-card" href={provider.href} key={provider.name} target="_blank" rel="noopener noreferrer">
                <span className="provider-card__media">
                  <Image src={provider.image} alt="" fill sizes="(max-width: 880px) 100vw, 50vw" style={{ objectFit: "contain" }} />
                </span>
                <span className="provider-card__body">
                  <span className="provider-card__category">{provider.category}</span>
                  <span className="provider-card__title">
                    <span>
                      <small>{provider.name}</small>
                      <strong>{provider.product}</strong>
                    </span>
                  </span>
                  <span className="provider-card__tone">{provider.tone}</span>
                  <span className="provider-card__description">{provider.description}</span>
                  <span className="provider-card__bullets">
                    {provider.bullets.map((bullet) => (
                      <span key={bullet}>{bullet}</span>
                    ))}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--white">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Website portfolio</p>
              <h2>Digital work already serving Corfu businesses.</h2>
            </div>
            <p>A sample of current GTSystems website projects across hospitality, retail, services, accommodation, and tourism.</p>
          </div>
          <div className="portfolio-grid">
            {websiteProjects.slice(0, 6).map((project) => (
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

      <section className="band band--dark">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">How we work</p>
              <h2>A practical path from problem to working system.</h2>
            </div>
          </div>
          <div className="process">
            {process.map(([title, text]) => (
              <div className="process__item" key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
