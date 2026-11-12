"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { websiteProjects } from "@/lib/site";

type Project = (typeof websiteProjects)[number];

function ProjectCard({ project, index, english, active }: { project: Project; index: number; english: boolean; active: boolean }) {
  const [failed, setFailed] = useState(false);
  return <article className="portfolio-scene" inert={!active} aria-labelledby={`project-title-${index}`}>
    <div className="portfolio-scene__grid" aria-hidden="true" />
    <div className="portfolio-scene__inner">
      <div className="portfolio-scene__info">
        <div className="portfolio-scene__labels"><span>{String(index + 1).padStart(2, "0")}</span><span>GT SYSTEMS / {english ? "SELECTED WORK" : "ΕΠΙΛΕΓΜΕΝΑ ΕΡΓΑ"}</span></div>
        <p className="portfolio-scene__category">{english ? "WEBSITE PROJECT" : project.category.toLocaleUpperCase("el-GR")}</p>
        <h2 id={`project-title-${index}`}>{project.title}</h2>
        <p className="portfolio-scene__description">{english ? "A digital presence created for a business in Corfu. Explore the live website." : "Μια ψηφιακή παρουσία για επιχειρήσεις της Κέρκυρας. Ανακαλύψτε την ιστοσελίδα."}</p>
        <a className="portfolio-scene__visit" href={project.website} target="_blank" rel="noopener noreferrer">{english ? "VISIT WEBSITE" : "ΕΠΙΣΚΕΨΗ ΙΣΤΟΣΕΛΙΔΑΣ"} <span aria-hidden="true">↗</span></a>
      </div>
      <a className="portfolio-scene__frame" href={project.website} target="_blank" rel="noopener noreferrer" aria-label={`${english ? "Visit" : "Επισκεφθείτε"} ${project.title}`}>
        <div className="portfolio-scene__media">
          {!failed ? <Image src={`/portfolio-mobile-v3/${String(index + 1).padStart(2, "0")}.jpg`} alt={`${project.title} website`} fill sizes="(max-width: 850px) 90vw, 60vw" priority={index === 0} onError={() => setFailed(true)} /> : <div className="portfolio-scene__fallback"><span>GT / DIGITAL</span><strong>{project.title}</strong><small>{english ? "EXPLORE PROJECT ↗" : "ΔΕΙΤΕ ΤΟ ΕΡΓΟ ↗"}</small></div>}
        </div>
      </a>

    </div>
  </article>;
}

export default function Portfolio({ english = false }: { english?: boolean }) {
  const gallery = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(media.matches);
    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);
  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = gallery.current;
      const belt = track.current;
      if (!root || !belt) return;
      const navHeight = document.querySelector(".nav")?.getBoundingClientRect().height ?? 0;
      root.style.setProperty("--portfolio-nav-height", `${navHeight}px`);
      const viewport = window.innerHeight - navHeight;
      const distance = Math.max(1, root.offsetHeight - viewport);
      const progress = Math.max(0, Math.min(1, (navHeight - root.getBoundingClientRect().top) / distance));
      const position = progress * (websiteProjects.length - 1);
      Array.from(belt.children).forEach((child, index) => {
        const slide = child as HTMLElement;
        const offset = index - position;
        const distance = Math.abs(offset);
        slide.style.transform = `translate3d(${offset * 90}%, 0, ${-distance * 550}px) rotateY(${-offset * 18}deg)`;
        slide.style.opacity = String(Math.max(0, 1 - distance * 0.7));
        slide.style.visibility = distance > 1.4 ? "hidden" : "visible";
      });
      root.style.setProperty("--scene-shift", `${(position * 75) % 120}px`);
      setActive(Math.round(position));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); cancelAnimationFrame(frame); };
  }, [reducedMotion]);
  const goTo = (index: number) => {
    const root = gallery.current;
    if (!root) return;
    const navHeight = document.querySelector(".nav")?.getBoundingClientRect().height ?? 0;
    const viewport = window.innerHeight - navHeight;
    const distance = root.offsetHeight - viewport;
    window.scrollTo({ top: window.scrollY + root.getBoundingClientRect().top - navHeight + distance * index / (websiteProjects.length - 1), behavior: "smooth" });
  };
  return <div className="portfolio-page">
    <section className="portfolio-intro" id="portfolio-intro">
      <div className="portfolio-intro__grid" aria-hidden="true" />
      <div className="portfolio-intro__inner"><p>GT SYSTEMS / DIGITAL WORK</p><h1>{english ? <>Ideas made<br /><em>visible.</em></> : <>Ιδέες που<br /><em>παίρνουν μορφή.</em></>}</h1><div className="portfolio-intro__bottom"><p>{english ? "A collection of digital projects made for the people and businesses of Corfu." : "Μια συλλογή ψηφιακών έργων για τους ανθρώπους και τις επιχειρήσεις της Κέρκυρας."}</p><a href="#portfolio-gallery">{english ? "EXPLORE THE PROJECTS" : "ΑΝΑΚΑΛΥΨΤΕ ΤΑ ΕΡΓΑ"} ↓</a></div><span className="portfolio-intro__count">{String(websiteProjects.length).padStart(2, "0")} / PROJECTS</span></div>
    </section>
    <div className="portfolio-gallery" id="portfolio-gallery" ref={gallery} style={{ "--project-count": websiteProjects.length } as React.CSSProperties}>
      <div className="portfolio-gallery__sticky">
        <div className="portfolio-world" aria-hidden="true"><div className="portfolio-world__floor" /><div className="portfolio-world__glow" /></div>
        <div className="portfolio-gallery__track" ref={track}>
          {websiteProjects.map((project, index) => <ProjectCard key={project.href} project={project} index={index} english={english} active={reducedMotion || index === active} />)}
        </div>
        <div className="portfolio-gallery__hud" aria-label={english ? "Project navigation" : "Πλοήγηση έργων"}>
          <span>{String(active + 1).padStart(2, "0")} / {String(websiteProjects.length).padStart(2, "0")}</span>
          <div className="portfolio-gallery__progress"><span style={{ width: `${(active + 1) / websiteProjects.length * 100}%` }} /></div>
          <button type="button" onClick={() => goTo(Math.max(0, active - 1))} disabled={active === 0} aria-label={english ? "Previous project" : "Προηγούμενο έργο"}>←</button>
          <button type="button" onClick={() => goTo(Math.min(websiteProjects.length - 1, active + 1))} disabled={active === websiteProjects.length - 1} aria-label={english ? "Next project" : "Επόμενο έργο"}>→</button>
          <span className="portfolio-gallery__hint">{english ? "SCROLL TO EXPLORE" : "SCROLL ΓΙΑ ΠΕΡΙΗΓΗΣΗ"} ↓</span>
        </div>
      </div>
    </div>
    <section className="portfolio-end"><p>GTSYSTEMS / DIGITAL</p><h2>{english ? "Let's make something work." : "Ας δημιουργήσουμε κάτι μαζί."}</h2><Link href={english ? "/en/contact" : "/contact"}>{english ? "START A CONVERSATION" : "ΕΠΙΚΟΙΝΩΝΗΣΤΕ ΜΑΖΙ ΜΑΣ"} ↗</Link></section>
  </div>;
}
