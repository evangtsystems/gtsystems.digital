import type { Metadata } from "next";
import Nav from "../components/nav";
import Footer from "../components/footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: "GT Systems Digital — Digital Agency for Business Websites & Systems",
    template: "%s — GT Systems Digital",
  },
  description:
    "Digital agency for business websites, web applications, and systems automation. We build sites that convert and systems that scale.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
          background: "linear-gradient(180deg, #070815 0%, #0b0e1b 60%, #070815 120%)",
          color: "#f5f5f5",
        }}
      >
        <Nav />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
