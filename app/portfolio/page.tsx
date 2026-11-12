import type { Metadata } from "next";
import Portfolio from "@/components/portfolio";
export const metadata: Metadata = { title: "Portfolio", description: "Ανακαλύψτε τα ψηφιακά έργα της GTSystems." };
export default function Page() { return <Portfolio />; }
