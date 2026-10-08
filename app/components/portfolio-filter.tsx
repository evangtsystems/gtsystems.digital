"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type WebsiteProject = {
  title: string;
  category: string;
  href: string;
  website: string;
  image: string;
};

const englishCategories: Record<string, string> = {
  Καταστήματα: "Stores",
  Ξενοδοχεία: "Hotels",
  Καταλύματα: "Accommodation",
  Υπηρεσίες: "Services",
  "Καφέ - Εστιατόρια": "Cafés & Restaurants",
};

const projectCategories = [
  "Καταστήματα",
  "Ξενοδοχεία",
  "Καταλύματα",
  "Υπηρεσίες",
  "Καφέ - Εστιατόρια",
];

function normalizedCategory(category: string) {
  return category === "Κατάστημα" ? "Καταστήματα" : category;
}

export function PortfolioFilter({
  projects,
  locale,
}: {
  projects: WebsiteProject[];
  locale: "el" | "en";
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = useMemo(
    () => projectCategories.filter((category) =>
      projects.some((project) => normalizedCategory(project.category) === category),
    ),
    [projects],
  );
  const visibleProjects = selectedCategory
    ? projects.filter((project) => normalizedCategory(project.category) === selectedCategory)
    : projects;

  const allLabel = locale === "el" ? "Όλα" : "All";
  const visitLabel = locale === "el" ? "Επίσκεψη ιστοσελίδας" : "Visit website";

  return (
    <>
      <div className="portfolio-summary" role="group" aria-label={locale === "el" ? "Φίλτρο κατηγορίας έργων" : "Filter projects by category"}>
        <button
          className="portfolio-filter"
          type="button"
          aria-pressed={selectedCategory === null}
          onClick={() => setSelectedCategory(null)}
        >
          {allLabel}
        </button>
        {categories.map((category) => (
          <button
            className="portfolio-filter"
            type="button"
            key={category}
            aria-pressed={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {locale === "en" ? englishCategories[category] ?? category : category}
          </button>
        ))}
      </div>

      <div className="portfolio-grid" aria-live="polite">
        {visibleProjects.map((project) => (
          <a className="portfolio-card" href={project.website} key={project.href} target="_blank" rel="noopener noreferrer">
            {project.image ? (
              <Image src={project.image} alt="" fill sizes="(max-width: 880px) 100vw, 33vw" style={{ objectFit: "cover" }} />
            ) : (
              <span className="portfolio-card__placeholder" aria-hidden="true">{project.title.slice(0, 1)}</span>
            )}
            <span className="portfolio-card__content">
              <span className="portfolio-card__tag">
                {locale === "en"
                  ? englishCategories[normalizedCategory(project.category)] ?? project.category
                  : normalizedCategory(project.category)}
              </span>
              <h3>{project.title}</h3>
              <span className="portfolio-card__link">{visitLabel}</span>
            </span>
          </a>
        ))}
      </div>
    </>
  );
}
