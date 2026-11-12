"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { websiteProjects } from "@/lib/site";
import Nav from "@/components/nav";

const symbols = ["▦", "⌁", "✳", "▣", "⌘", "↗", "◇", "◉"];
const capabilities = [
  { icon: "✳", title: ["AI engineering", "AI engineering"], description: ["Σχεδιάζουμε AI βοηθούς και αυτοματισμούς που ενσωματώνονται στις πραγματικές ανάγκες της επιχείρησής σας.", "We design AI assistants and automations around the real needs of your business."], tags: ["AI ASSISTANTS", "LLMs", "AUTOMATION"] },
  { icon: "</>", title: ["Web & εφαρμογές", "Web & applications"], description: ["Δημιουργούμε ιστοσελίδες, portals και εφαρμογές που συνδέουν την ψηφιακή παρουσία με την καθημερινή εργασία.", "We build websites, portals and applications that connect your digital presence with daily work."], tags: ["WEBSITES", "WEB APPS", "DASHBOARDS"] },
  { icon: "◇", title: ["Συστήματα & διασυνδέσεις", "Systems & integrations"], description: ["Συνδέουμε δεδομένα, εργαλεία και επιχειρησιακές ροές για να συνεργάζονται πιο αποτελεσματικά.", "We connect data, tools and business workflows so they work better together."], tags: ["INTEGRATIONS", "WORKFLOWS", "BUSINESS IT"] },
];

export default function IntroStory({ english = false }: { english?: boolean }) {
  const scene = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState<0 | 1 | 2>(0);
  const [aboutActive, setAboutActive] = useState(false);
  const [quoteActive, setQuoteActive] = useState(false);
  const [workActive, setWorkActive] = useState(false);
  const [projectActive, setProjectActive] = useState(false);
  const [cardsActive, setCardsActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [introHeaderVisible, setIntroHeaderVisible] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    let frame = 0;
    let lastTime = 0;
    let phase = 0;
    let boost = 0;
    let lastScroll = window.scrollY;
    const update = (now: number) => {
      frame = 0;
      const root = scene.current;
      const stage = canvas.current;
      if (!root || !stage) return;
      const siteHeader = document.getElementById("site-navigation");
      setIntroHeaderVisible(!siteHeader || siteHeader.getBoundingClientRect().top > 0);
      const distance = Math.max(1, root.offsetHeight - window.innerHeight);
      const rect = root.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -rect.top / distance));
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      const dt = lastTime ? Math.min((now - lastTime) / 1000, .05) : 0;
      lastTime = now;
      if (!reducedMotion && visible) {
        phase += (.32 + boost) * dt;
        boost *= Math.exp(-dt * 1.6);
      }
      // Keep the opening composition on screen while the ring turns; only then
      // move the camera and introduce the About chapter.
      const clamp = (value: number) => Math.max(0, Math.min(1, value));
      const welcomeExit = clamp((p - .14) / .07);
      const camera = clamp((p - .15) / .25);
      const aboutIn = clamp((p - .23) / .07);
      const aboutOut = clamp((p - .32) / .06);
      const quoteIn = clamp((p - .38) / .06);
      const quoteOut = clamp((p - .46) / .05);
      const cardsIn = clamp((p - .52) / .06);
      const cardsOut = clamp((p - .63) / .06);
      const light = clamp((p - .69) / .07);
      const workIn = clamp((p - .73) / .05);
      const workOut = clamp((p - .82) / .04);
      const projectIn = clamp((p - .87) / .05);
      root.style.setProperty("--intro-progress", String(p));
      root.style.setProperty("--intro-welcome-exit", String(welcomeExit));
      root.style.setProperty("--intro-camera", String(camera));
      root.style.setProperty("--intro-about", String(aboutIn * (1 - aboutOut)));
      root.style.setProperty("--intro-quote", String(quoteIn * (1 - quoteOut)));
      root.style.setProperty("--intro-cards", String(cardsIn * (1 - cardsOut)));
      root.style.setProperty("--intro-light", String(light));
      root.style.setProperty("--intro-work", String(workIn * (1 - workOut)));
      root.style.setProperty("--intro-project", String(projectIn));
      stage.querySelectorAll<HTMLElement>(".intro-story__tile").forEach((tile, index) => {
        // The near side of the circular track travels from right to left.
        const angle = index * Math.PI * 2 / symbols.length - phase;
        const mobile = window.innerWidth < 700;
        const radiusX = mobile ? 43 : 37;
        const depth = Math.cos(angle);
        const x = Math.sin(angle) * radiusX - camera * (mobile ? 3 : 9);
        // Tilt the orbit around the X axis: rear tiles rise, front tiles drop.
        const y = depth * ((mobile ? 10 : 13) + camera * (mobile ? 4 : 7)) + camera * 4;
        const scale = (.48 + (depth + 1) * .34) * (1 - light * .42);
        tile.style.transform = `translate(-50%, -50%) translate(${x}vw, ${y}vh) scale(${scale}) rotateY(${Math.sin(angle) * -25}deg) rotateX(${-14 + depth * 8}deg)`;
        tile.style.zIndex = String(Math.round(10 + depth * 8));
        tile.style.opacity = String((.36 + (depth + 1) * .32) * (1 - light * .3));
      });
      setChapter(p < .20 ? 0 : p < .70 ? 1 : 2);
      setAboutActive(aboutIn >= .5 && aboutOut < .5);
      setQuoteActive(quoteIn >= .5 && quoteOut < .5);
      setCardsActive(cardsIn >= .5 && cardsOut < .5);
      setWorkActive(workIn >= .5 && workOut < .5);
      setProjectActive(projectIn >= .5);
      if (!reducedMotion && visible) frame = requestAnimationFrame(update);
      else lastTime = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScroll);
      lastScroll = window.scrollY;
      if (!reducedMotion) boost = Math.min(3.5, boost + delta * .004);
      schedule();
    };
    schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", schedule); cancelAnimationFrame(frame); };
  }, [reducedMotion]);
  return <section className="intro-story" ref={scene} aria-label={english ? "Introduction to GTSystems" : "Γνωρίστε την GTSystems"}>
    <div className={`intro-story__site-header${introHeaderVisible ? "" : " intro-story__site-header--hidden"}`} inert={!introHeaderVisible}><Nav intro /></div>
    <div className="intro-story__stage" ref={canvas}>
      <div className="intro-story__stars" aria-hidden="true" />
      <div className="intro-story__light" aria-hidden="true" />
      <div className="intro-story__grid" aria-hidden="true" />
      <div className="intro-story__light-grid" aria-hidden="true" />
      <div className="intro-story__tiles" aria-hidden="true">{symbols.map((symbol, i) => <div className="intro-story__tile" key={i}><span>{symbol}</span></div>)}</div>
      <div className="intro-story__welcome" inert={!reducedMotion && chapter !== 0}>
        <div><p className="intro-story__eyebrow">{english ? "Technology that moves business forward" : "Τεχνολογία που κινεί την επιχείρησή σας"}</p><h1>{english ? <>Connected.<br />Built to work.</> : <>Συνδέουμε.<br />Δημιουργούμε.</>}</h1></div>
        <div className="intro-story__welcome-details"><p>{english ? "Business software, POS, networks and digital solutions, brought together by GTSystems." : "Εμπορικό λογισμικό, POS, δίκτυα και ψηφιακές λύσεις, μαζί σε ένα λειτουργικό σύνολο."}</p><Link href={english ? "/en/contact" : "/contact"}>{english ? "Talk to us" : "Επικοινωνήστε μαζί μας"} ↗</Link></div>
      </div>
      <div className="intro-story__about" inert={!reducedMotion && !aboutActive}>
        <div className="intro-story__chapter-label"><span>01</span> {english ? "ABOUT GTSYSTEMS" : "ΓΙΑ ΤΗΝ GTSYSTEMS"}</div>
        <h2>{english ? <>One partner.<br />Every connection.</> : <>Ένας συνεργάτης.<br />Κάθε σύνδεση.</>}</h2>
        <p>{english ? "We bring software, infrastructure and support together, so your business can work, connect and grow." : "Συνδέουμε λογισμικό, υποδομές και υποστήριξη, για να λειτουργεί η επιχείρησή σας και να εξελίσσεται."}</p>
        <div className="intro-story__tags"><span>BUSINESS SOFTWARE</span><span>POS & NETWORKS</span><span>WEB & SUPPORT</span></div>
        <a href="#site-navigation">{english ? "EXPLORE GTSYSTEMS" : "ΓΝΩΡΙΣΤΕ ΤΗΝ GTSYSTEMS"} ↓</a>
      </div>
      <div className="intro-story__manifesto" aria-hidden={!reducedMotion && !quoteActive} aria-label={english ? "Our approach" : "Η προσέγγισή μας"}>
        <p>{english ? "Technology should bring clarity." : "Η τεχνολογία δίνει λύσεις."}</p>
        <p>{english ? "Connected systems make progress possible." : "Οι σωστές συνδέσεις κάνουν τη διαφορά."}</p>
      </div>
      <section className="intro-story__capabilities" inert={!reducedMotion && !cardsActive} aria-label={english ? "Digital capabilities" : "Ψηφιακές δυνατότητες"}>
        <div className="intro-story__capabilities-grid">
          {capabilities.map((item, index) => <article className="intro-capability" key={item.title[1]}>
            <div className="intro-capability__art"><span className="intro-capability__number">{String(index + 1).padStart(2, "0")}</span><span className="intro-capability__icon" aria-hidden="true">{item.icon}</span></div>
            <div className="intro-capability__body"><h3>{item.title[english ? 1 : 0]}</h3><p>{item.description[english ? 1 : 0]}</p><div className="intro-capability__tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div><Link href={english ? "/en/web-development" : "/web-development"}>{english ? "Learn more" : "Μάθετε περισσότερα"} <span aria-hidden="true">↗</span></Link></div>
          </article>)}
        </div>
        <p className="intro-story__capabilities-hint">{english ? "Swipe to explore →" : "Σύρετε για περισσότερα →"}</p>
      </section>
      <section className="intro-story__work" inert={!reducedMotion && !workActive} aria-label={english ? "Our work" : "Τα έργα μας"}>
        <div className="intro-story__chapter-label"><span>02</span> {english ? "WORK" : "ΕΡΓΑ"}</div>
        <h2>{english ? <>Digital work, built for<br /><em>real businesses.</em></> : <>Ψηφιακά έργα, φτιαγμένα<br /><em>για πραγματικές ανάγκες.</em></>}</h2>
        <div className="intro-work-panel"><p>{english ? "From websites to custom applications, we build digital experiences around the people who use them." : "Από ιστοσελίδες μέχρι εφαρμογές, δημιουργούμε ψηφιακές λύσεις γύρω από τους ανθρώπους που τις χρησιμοποιούν."}</p><div><span><small>{english ? "PROJECTS" : "ΕΡΓΑ"}</small><strong>{websiteProjects.length}+</strong></span><span><small>{english ? "FOCUS" : "ΕΣΤΙΑΣΗ"}</small><strong>WEB · BUSINESS</strong></span></div><Link href={english ? "/en/portfolio" : "/portfolio"}>{english ? "Explore our work" : "Δείτε τα έργα μας"} ↗</Link></div>
      </section>
      <section className="intro-story__project" inert={!reducedMotion && !projectActive} aria-label={english ? "Featured project" : "Επιλεγμένο έργο"}>
        <div className="intro-project__copy"><div className="intro-project__label">01 / {english ? "FEATURED PROJECT" : "ΕΠΙΛΕΓΜΕΝΟ ΕΡΓΟ"}</div><h2>Aeolina Villas</h2><p>{english ? "A digital home for a collection of villas in Corfu. Explore the live website and more of our work." : "Μια ψηφιακή παρουσία για μια συλλογή από βίλες στην Κέρκυρα. Ανακαλύψτε την ιστοσελίδα και περισσότερα έργα μας."}</p><a href="https://aeolinavillas.com" target="_blank" rel="noopener noreferrer">{english ? "VISIT WEBSITE" : "ΕΠΙΣΚΕΨΗ ΙΣΤΟΣΕΛΙΔΑΣ"} ↗</a><Link href={english ? "/en/portfolio" : "/portfolio"}>{english ? "ALL PROJECTS" : "ΟΛΑ ΤΑ ΕΡΓΑ"} →</Link></div>
        <a className="intro-project__screen" href="https://aeolinavillas.com" target="_blank" rel="noopener noreferrer" aria-label={english ? "Visit Aeolina Villas" : "Επισκεφθείτε το Aeolina Villas"}><Image src="/portfolio-mobile-v3/01.jpg" alt="Aeolina Villas mobile website" fill sizes="(max-width: 700px) 40vw, 25vw" /></a>
      </section>
      <div className="intro-story__indicator" aria-live="polite"><strong>{String(chapter).padStart(2, "0")}</strong><span>CHAPTER<br /><b>{chapter === 0 ? "WELCOME" : chapter === 1 ? "ABOUT" : "WORK"}</b></span></div>
      <div className="intro-story__scroll-hint">{english ? "SCROLL TO EXPLORE" : "SCROLL ΓΙΑ ΠΕΡΙΗΓΗΣΗ"} ↓</div>
    </div>
  </section>;
}
