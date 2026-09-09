import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { websiteProjects } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI, Ιστοσελίδες, Cybersecurity & Digital Υποδομές",
  description:
    "AI αυτοματισμοί, custom web apps, cybersecurity, επαγγελματικές ιστοσελίδες, δίκτυα, Wi-Fi και τηλεπικοινωνιακές υποδομές από την GTSystems.",
};

const capabilities = [
  {
    title: "AI αυτοματισμοί",
    text: "Chatbots, εσωτερικοί βοηθοί, ταξινόμηση αιτημάτων, σύνοψη εγγράφων και αυτοματισμοί που μειώνουν χειροκίνητη εργασία.",
    tags: ["AI assistants", "Lead routing", "Document flows"],
  },
  {
    title: "Custom web apps",
    text: "Portals, dashboards, booking flows, admin panels και εφαρμογές που χτίζονται γύρω από τη δική σας διαδικασία.",
    tags: ["Dashboards", "Portals", "Workflows"],
  },
  {
    title: "Cybersecurity",
    text: "Endpoint προστασία, πολιτικές πρόσβασης, backup λογική, απομακρυσμένη υποστήριξη και έλεγχος ρίσκου για την ομάδα σας.",
    tags: ["Bitdefender", "Access rules", "Risk control"],
  },
  {
    title: "Δίκτυα & cloud υποδομές",
    text: "Wi-Fi κάλυψη, δομημένη καλωδίωση, τηλεφωνικά κέντρα, ασφαλής πρόσβαση και υποδομή που αντέχει στην καθημερινή χρήση.",
    tags: ["Wi-Fi", "Telecoms", "Secure access"],
  },
];

const aiUses = [
  "Αυτόματη οργάνωση αιτημάτων από φόρμες και email",
  "AI βοηθός για συχνές ερωτήσεις πελατών ή προσωπικού",
  "Σύνδεση website με CRM, εμπορικό λογισμικό ή reporting",
  "Dashboards για πωλήσεις, υποστήριξη, κρατήσεις ή εργασίες",
];

export default function WebDevelopmentPage() {
  return (
    <>
      <section className="page-hero page-hero--digital">
        <div className="container digital-hero">
          <div>
            <p className="eyebrow">AI · Custom apps · Cybersecurity · Networks</p>
            <h1>Digital συστήματα που κάνουν την επιχείρηση πιο γρήγορη, πιο ασφαλή, πιο έξυπνη.</h1>
            <p>
              Δεν κατασκευάζουμε απλώς ιστοσελίδες. Σχεδιάζουμε web εφαρμογές, AI workflows,
              αυτοματισμούς, cybersecurity και υποδομές που συνδέουν πελάτες, προσωπικό,
              δεδομένα και καθημερινές εργασίες.
            </p>
            <div className="hero__actions">
              <Link className="button button--light" href="/contact">
                Συζητήστε ένα digital project
              </Link>
              <Link className="button button--ghost" href="#ai">
                Δείτε AI δυνατότητες
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
              <span>ενιαία τεχνική ευθύνη από ιδέα μέχρι υποστήριξη</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Τι μπορούμε να χτίσουμε</p>
              <h2>Από website μέχρι AI εργαλεία και ασφαλή λειτουργία.</h2>
            </div>
            <p>
              Κάθε λύση σχεδιάζεται γύρω από τη δουλειά που πρέπει να γίνει: προβολή, πωλήσεις,
              υποστήριξη, reporting, ασφάλεια, συνεργασία ή εσωτερική παραγωγικότητα.
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
            <p className="eyebrow">AI στην πράξη</p>
            <h2>Όχι hype. Μικροί, χρήσιμοι αυτοματισμοί που μπαίνουν στη ροή της επιχείρησης.</h2>
            <p>
              Η αξία του AI δεν είναι να φαίνεται εντυπωσιακό σε demo. Είναι να μειώνει χρόνο,
              λάθη και καθυστερήσεις σε πραγματικές εργασίες: αιτήματα πελατών, απαντήσεις,
              κατηγοριοποίηση, αναφορές, προτάσεις και εσωτερική γνώση.
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
            <h2>Προστασία πριν το πρόβλημα γίνει διακοπή λειτουργίας.</h2>
            <p>
              Endpoint security, ασφαλής απομακρυσμένη πρόσβαση, έλεγχος συσκευών και πρακτικές
              πολιτικές που ταιριάζουν σε μικρές και μεσαίες επιχειρήσεις.
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
            <h2>Custom λύσεις που κουμπώνουν στα εργαλεία που ήδη χρησιμοποιείτε.</h2>
            <p>
              Forms, portals, dashboards, CRM flows, διασυνδέσεις με εμπορικά συστήματα και
              αυτοματισμοί για να μην ξαναγράφεται η ίδια πληροφορία σε τρία σημεία.
            </p>
          </div>
        </div>
      </section>

      <section className="band band--white">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Έργα ιστοσελίδων</p>
              <h2>Ιστοσελίδες που έχουν παραδοθεί για πραγματικές επιχειρήσεις.</h2>
            </div>
            <p>
              Το portfolio της GTSystems περιλαμβάνει καταστήματα, ξενοδοχεία, καταλύματα,
              εστιατόρια, εταιρείες υπηρεσιών, τουριστικά projects και τοπικούς οργανισμούς.
            </p>
          </div>

          <div className="portfolio-summary">
            <span>Καταστήματα</span>
            <span>Ξενοδοχεία</span>
            <span>Καταλύματα</span>
            <span>Υπηρεσίες</span>
            <span>Καφέ - Εστιατόρια</span>
          </div>

          <div className="portfolio-grid">
            {websiteProjects.map((project) => (
              <a className="portfolio-card" href={project.website} key={project.href} target="_blank" rel="noopener noreferrer">
                <Image src={project.image} alt="" fill sizes="(max-width: 880px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                <span className="portfolio-card__content">
                  <span className="portfolio-card__tag">{project.category}</span>
                  <h3>{project.title}</h3>
                  <span className="portfolio-card__link">Επίσκεψη ιστοσελίδας</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
