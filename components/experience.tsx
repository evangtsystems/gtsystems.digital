"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { websiteProjects } from "@/lib/site";

export function Orbit({ english = false }: { english?: boolean }) {
  const prefix = english ? "/en" : "";
  const items = [
    { icon: "▦", label: "BUSINESS IT", href: `${prefix}/business-systems` },
    { icon: "⌁", label: "NETWORKS", href: `${prefix}/web-apps` },
    { icon: "✳", label: "WEB & APPS", href: `${prefix}/web-development` },
    { icon: "▣", label: "POS", href: `${prefix}/business-systems#cash-pos` },
  ];
  return <div className="orbit-scene" aria-label={english ? "Explore our services" : "Εξερευνήστε τις υπηρεσίες μας"}>
    {items.map((item, index) => <div className={`orbit-path orbit-path--${index}`} key={item.label}><Link href={item.href} className="orbit-tile"><span aria-hidden="true">{item.icon}</span><small>{item.label}</small></Link></div>)}
  </div>;
}

export function ProjectShowcase({ english = false }: { english?: boolean }) {
  const [index, setIndex] = useState(0);
  const projects = websiteProjects.slice(0, 6);
  const project = projects[index];
  return <section className="project-stage" aria-label={english ? "Selected projects" : "Επιλεγμένα έργα"}>
    <div className="project-stage__grid" aria-hidden="true" />
    <div className="container project-stage__inner">
      <div className="project-stage__copy">
        <div className="project-stage__tag">02 / {english ? "SELECTED WORK" : "ΕΠΙΛΕΓΜΕΝΑ ΕΡΓΑ"}</div>
        <p className="project-stage__count">{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</p>
        <h2>{project.title}</h2>
        <p>{english ? "A digital presence created for a business in Corfu. Explore the live website and discover more of our work." : `Μια ψηφιακή παρουσία για την επιχείρηση ${project.title}. Επισκεφθείτε την ιστοσελίδα και ανακαλύψτε περισσότερα έργα μας.`}</p>
        <a className="project-stage__link" href={project.website} target="_blank" rel="noopener noreferrer">{english ? "VISIT WEBSITE" : "ΕΠΙΣΚΕΨΗ ΙΣΤΟΣΕΛΙΔΑΣ"} ↗</a>
        <div className="project-stage__controls"><button type="button" onClick={() => setIndex((index + projects.length - 1) % projects.length)} aria-label={english ? "Previous project" : "Προηγούμενο έργο"}>←</button><button type="button" onClick={() => setIndex((index + 1) % projects.length)} aria-label={english ? "Next project" : "Επόμενο έργο"}>→</button></div>
      </div>
      <a className="project-stage__screen" href={project.website} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} ↗`}>
        <div className="project-stage__browser"><span /><span /><span /><small>{project.title}</small></div>
        <div className="project-stage__image"><Image src={project.image} alt={`${project.title}`} fill sizes="(max-width: 800px) 90vw, 60vw" style={{objectFit: "cover"}} /></div>
      </a>
    </div>
  </section>;
}
