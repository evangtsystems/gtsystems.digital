import type { Metadata } from "next";
import FaqPage from "@/components/faq-page";
import { englishFaq } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Frequently asked questions about business IT services",
  description:
    "Answers about business software, POS systems, IT support, networks, and website development from GTSystems.",
  alternates: {
    canonical: "/en/faq",
    languages: { el: "/faq", en: "/en/faq" },
  },
};

export default function EnglishFaqPage() {
  return <FaqPage locale="en" items={englishFaq} />;
}
