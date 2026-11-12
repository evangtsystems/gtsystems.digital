import type { Metadata } from "next";
import Portfolio from "@/components/portfolio";
export const metadata: Metadata = { title: "Portfolio", description: "Explore digital projects by GTSystems." };
export default function Page() { return <Portfolio english />; }
