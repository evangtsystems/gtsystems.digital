import Link from "next/link";
import type { FaqItem } from "@/lib/faq";

export default function FaqPage({
  locale,
  items,
}: {
  locale: "el" | "en";
  items: FaqItem[];
}) {
  const isEnglish = locale === "en";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{isEnglish ? "Help & answers" : "Βοήθεια & απαντήσεις"}</p>
          <h1>
            {isEnglish
              ? "Frequently asked questions about business IT"
              : "Συχνές ερωτήσεις για την πληροφορική επιχειρήσεων"}
          </h1>
          <p>
            {isEnglish
              ? "Answers about business software, POS, IT support, websites, and working with GTSystems across Greece."
              : "Απαντήσεις για επιχειρησιακό λογισμικό, POS, τεχνική υποστήριξη, ιστοσελίδες και συνεργασία με την GTSystems σε όλη την Ελλάδα."}
          </p>
        </div>
      </section>

      <section className="page-content faq-page">
        <div className="container faq-page__content">
          {items.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}</summary>
              <div className="faq-item__answer">
                <p>{item.answer}</p>
                {item.link && <Link href={item.link.href}>{item.link.label} →</Link>}
              </div>
            </details>
          ))}
          <div className="faq-page__contact">
            <h2>{isEnglish ? "Still have a question?" : "Έχετε κάποια άλλη ερώτηση;"}</h2>
            <p>
              {isEnglish
                ? "Tell us what your business needs and our team will help you find the right next step."
                : "Πείτε μας τι χρειάζεται η επιχείρησή σας και θα σας βοηθήσουμε να βρείτε το κατάλληλο επόμενο βήμα."}
            </p>
            <Link className="button" href={isEnglish ? "/en/contact" : "/contact"}>
              {isEnglish ? "Contact GTSystems" : "Επικοινωνία με την GTSystems"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
