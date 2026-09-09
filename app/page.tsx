import Image from "next/image";
import Link from "next/link";
import { providers, services, websiteProjects } from "@/lib/site";

const process = [
  ["Ανάλυση", "Καταγράφουμε την ανάγκη, τα υπάρχοντα εργαλεία, τους κινδύνους και το αποτέλεσμα που θέλετε."],
  ["Σχεδιασμός", "Επιλέγουμε τον σωστό συνδυασμό λογισμικού, εξοπλισμού, δικτύου, υποστήριξης και web συστημάτων."],
  ["Υλοποίηση", "Ρυθμίζουμε, εγκαθιστούμε, συνδέουμε, δοκιμάζουμε και εκπαιδεύουμε την ομάδα σας."],
  ["Υποστήριξη", "Μένουμε δίπλα σας μετά την παράδοση με πρακτική, τοπική βοήθεια όταν χρειάζεται."],
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div>
            <p className="eyebrow">Business IT · Megasoft · RBS · POS · Networks · Web</p>
            <h1>Ο τεχνολογικός κορμός για επιχειρήσεις που κινούνται κάθε μέρα.</h1>
            <p>
              Η GTSystems συνδέει εμπορικό λογισμικό, RBS και POS ροές, ταμειακά συστήματα,
              δίκτυα, τηλεπικοινωνίες, ασφάλεια, τεχνική υποστήριξη και web εφαρμογές σε ένα
              λειτουργικό οικοσύστημα για την επιχείρησή σας.
            </p>
            <div className="hero__actions">
              <Link className="button button--light" href="/contact">
                Μιλήστε με την GTSystems
              </Link>
              <Link className="button button--ghost" href="/business-systems">
                Δείτε τις λύσεις
              </Link>
            </div>
          </div>

          <aside className="hero-panel" aria-label="GTSystems highlights">
            <div className="hero-panel__label">Integrated business stack</div>
            <div className="hero-panel__stat">
              <span className="hero-panel__number">20+</span>
              <span>χρόνια υποστήριξης τοπικών επιχειρήσεων</span>
            </div>
            <div className="hero-panel__stat">
              <span className="hero-panel__number">1</span>
              <span>συνεργάτης για λογισμικό, εξοπλισμό, δίκτυα και υποστήριξη</span>
            </div>
            <div className="hero-panel__stat">
              <span className="hero-panel__number">GR</span>
              <span>τεχνογνωσία ελληνικής αγοράς με εξυπηρέτηση από την Κέρκυρα</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="provider-strip" aria-label="Πάροχοι και τεχνολογίες">
        <div className="container provider-strip__inner">
          {providers.map((provider) => (
            <span key={provider.name}>{provider.name}</span>
          ))}
        </div>
      </section>

      <section className="band band--white">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Λύσεις</p>
              <h2>Όλα όσα χρειάζεται μια επιχείρηση για να λειτουργεί, να συνδέεται και να μεγαλώνει.</h2>
            </div>
            <p>
              Αντί για αποσπασματικά εργαλεία, συνδυάζουμε δοκιμασμένες πλατφόρμες, αξιόπιστη
              υποδομή και συνεχή υποστήριξη γύρω από την πραγματική ροή εργασίας σας.
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

      <section className="band">
        <div className="container split">
          <div>
            <p className="eyebrow">Γιατί GTSystems</p>
            <h2>Λύσεις για επιχειρήσεις που δεν μπορούν να σταματήσουν μέχρι να λυθεί ένα τεχνικό θέμα.</h2>
          </div>
          <div>
            <p>
              Το λογιστικό πρόγραμμα, το POS, το δίκτυο, οι συσκευές, η ιστοσελίδα και το reporting
              επηρεάζουν την ίδια καθημερινή λειτουργία. Βλέπουμε το σύνολο και φροντίζουμε τα
              κομμάτια να δουλεύουν μαζί με ξεκάθαρη ευθύνη και αξιόπιστη υποστήριξη.
            </p>
            <div className="section-actions">
              <Link className="button" href="/company">
                Η εταιρεία
              </Link>
              <Link className="button button--outline" href="/contact">
                Ζητήστε υποστήριξη
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="band band--white">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Πάροχοι & προϊόντα</p>
              <h2>Πραγματικά προϊόντα, σωστή παραμετροποίηση, υποστήριξη στην πράξη.</h2>
            </div>
            <p>
              Η GTSystems δεν εμφανίζει απλώς λογότυπα. Επιλέγει, εγκαθιστά και υποστηρίζει
              λύσεις που έχουν συγκεκριμένο ρόλο μέσα στην επιχείρηση: διαχείριση, ταμείο,
              παραγγελιοληψία, ασφάλεια και απομακρυσμένη τεχνική βοήθεια.
            </p>
          </div>

          <div className="provider-grid">
            {providers.map((provider) => (
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
              <p className="eyebrow">Portfolio ιστοσελίδων</p>
              <h2>Digital έργα που ήδη εξυπηρετούν επιχειρήσεις της Κέρκυρας.</h2>
            </div>
            <p>
              Ενδεικτικά έργα ιστοσελίδων της GTSystems σε φιλοξενία, λιανική, υπηρεσίες,
              καταλύματα, εστίαση, τουρισμό και τοπική επιχειρηματικότητα.
            </p>
          </div>

          <div className="portfolio-grid">
            {websiteProjects.slice(0, 6).map((project) => (
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

          <div className="section-actions">
            <Link className="button button--outline" href="/web-development">
              Δείτε περισσότερα έργα
            </Link>
          </div>
        </div>
      </section>

      <section className="band band--dark">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Πώς δουλεύουμε</p>
              <h2>Πρακτική διαδρομή από το πρόβλημα στο λειτουργικό σύστημα.</h2>
            </div>
            <p>
              Αναβάθμιση, εγκατάσταση, διασύνδεση και υποστήριξη ακολουθούν την ίδια αρχή:
              πρώτα καταλαβαίνουμε τη λειτουργία, μετά κάνουμε την τεχνολογία να την υπηρετεί.
            </p>
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
