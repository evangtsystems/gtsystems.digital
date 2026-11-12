"use client";

import { useEffect } from "react";

export default function DigitalScene() {
  useEffect(() => {
    const root = document.querySelector(".digital-experience");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: .12, rootMargin: "0px 0px -30px 0px" });
    root.classList.add("motion-ready");
    targets.forEach(target => observer.observe(target));
    return () => { observer.disconnect(); root.classList.remove("motion-ready"); };
  }, []);
  return <div className="digital-scene" aria-hidden="true">
    <div className="digital-scene__halo" /><div className="digital-scene__orbit digital-scene__orbit--one" /><div className="digital-scene__orbit digital-scene__orbit--two" />
    <div className="digital-scene__core"><span>GTSystems</span></div>
    <div className="digital-scene__node digital-scene__node--ai"><b>✳</b><span>AI</span></div>
    <div className="digital-scene__node digital-scene__node--web"><b>⌘</b><span>WEB APPS</span></div>
    <div className="digital-scene__node digital-scene__node--secure"><b>◇</b><span>SECURITY</span></div>
    <div className="digital-scene__node digital-scene__node--network"><b>⌁</b><span>NETWORKS</span></div>
    <div className="digital-scene__caption"><span>01 / CONNECTED SYSTEMS</span><span>DESIGNED TO WORK ↗</span></div>
  </div>;
}
