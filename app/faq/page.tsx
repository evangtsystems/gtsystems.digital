import type { Metadata } from "next";
import FaqPage from "@/components/faq-page";
import { greekFaq } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Συχνές ερωτήσεις για υπηρεσίες πληροφορικής επιχειρήσεων",
  description:
    "Απαντήσεις για εμπορικό λογισμικό, ταμειακά και POS, τεχνική υποστήριξη, δίκτυα και κατασκευή ιστοσελίδων από την GTSystems.",
  alternates: {
    canonical: "/faq",
    languages: { el: "/faq", en: "/en/faq" },
  },
};

export default function GreekFaqPage() {
  return <FaqPage locale="el" items={greekFaq} />;
}
