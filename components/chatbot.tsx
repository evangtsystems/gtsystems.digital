"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import LiveChat from "@/components/live-chat";

type ChatLink = { label: string; href: string };
type Message = {
  id: number;
  role: "visitor" | "assistant";
  text: string;
  links?: ChatLink[];
};

const contactPhone = "+302661700610";
const contactEmail = "info@gtsystems.gr";

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ς/g, "σ");
}

function getAnswer(question: string, isEnglish: boolean): Omit<Message, "id" | "role"> {
  const text = normalizeText(question);
  const link = (label: string, href: string): ChatLink => ({ label, href });

  if (/faq|frequently asked|common questions|συχνεσ ερωτησεισ|συχνες ερωτησεις/.test(text)) {
    return isEnglish
      ? {
          text: "Browse answers about business software, POS, support, websites, service coverage, and pricing.",
          links: [link("Frequently asked questions", "/en/faq")],
        }
      : {
          text: "Δείτε απαντήσεις για λογισμικό, POS, τεχνική υποστήριξη, ιστοσελίδες, εξυπηρέτηση και κόστος.",
          links: [link("Συχνές ερωτήσεις", "/faq")],
        };
  }

  if (/price|pricing|cost|quote|offer|τιμη|κοστοσ|κοστο|προσφορα|χρεωση/.test(text)) {
    return isEnglish
      ? {
          text: "Pricing depends on the software, equipment, and support your business needs. Tell us a little about the project and we’ll help you find the right solution.",
          links: [link("Request a quote", "/en/contact")],
        }
      : {
          text: "Το κόστος εξαρτάται από το λογισμικό, τον εξοπλισμό και την υποστήριξη που χρειάζεται η επιχείρησή σας. Πείτε μας λίγα λόγια για το έργο σας για να σας προτείνουμε την κατάλληλη λύση.",
          links: [link("Ζητήστε προσφορά", "/contact")],
        };
  }

  if (/contact|phone|call|email|επικοινων|τηλεφων|τηλ\b|email|mail\b/.test(text)) {
    return isEnglish
      ? {
          text: "You can call or email GTSystems, or send a message through the contact page.",
          links: [
            link("Call +30 26617 00610", `tel:${contactPhone}`),
            link("Email info@gtsystems.gr", `mailto:${contactEmail}`),
            link("Contact form", "/en/contact"),
          ],
        }
      : {
          text: "Μπορείτε να καλέσετε ή να στείλετε email στην GTSystems, ή να αφήσετε μήνυμα από τη σελίδα επικοινωνίας.",
          links: [
            link("Καλέστε +30 26617 00610", `tel:${contactPhone}`),
            link("Email info@gtsystems.gr", `mailto:${contactEmail}`),
            link("Φόρμα επικοινωνίας", "/contact"),
          ],
        };
  }

  if (/support|help|problem|issue|service|υποστηρι|βλαβ|τεχνικ|επισκευ|service/.test(text)) {
    return isEnglish
      ? {
          text: "GTSystems supports business software, computers, networks, POS systems, and connected tools. Contact us and describe what’s happening so we can point you to the right help.",
          links: [link("Get support", "/en/contact"), link("IT support services", "/en/web-apps")],
        }
      : {
          text: "Η GTSystems υποστηρίζει επιχειρησιακό λογισμικό, υπολογιστές, δίκτυα, POS και συνδεδεμένα συστήματα. Επικοινωνήστε μαζί μας και περιγράψτε το θέμα για να σας κατευθύνουμε.",
          links: [link("Ζητήστε υποστήριξη", "/contact"), link("Υπηρεσίες τεχνικής υποστήριξης", "/web-apps")],
        };
  }

  if (/website|web site|websites|web app|webapp|site|ιστοσελ|website|σελιδα|web\b|digital|ai\b|τεχνητη νοημοσυνη/.test(text)) {
    return isEnglish
      ? {
          text: "GTSystems builds business websites and web applications, and can connect them with your business workflows.",
          links: [link("Websites & digital services", "/en/web-development")],
        }
      : {
          text: "Η GTSystems κατασκευάζει επαγγελματικές ιστοσελίδες και web εφαρμογές και μπορεί να τις συνδέσει με τις διαδικασίες της επιχείρησής σας.",
          links: [link("Ιστοσελίδες & digital υπηρεσίες", "/web-development")],
        };
  }

  if (/software|pos|cash|till|erp|rbs|λογισμικ|ταμειακ|ταμειο|εμπορικ|παραγγελι/.test(text)) {
    return isEnglish
      ? {
          text: "GTSystems helps businesses with commercial software, cash register and POS systems, equipment, and their ongoing support.",
          links: [link("Business systems", "/en/business-systems")],
        }
      : {
          text: "Η GTSystems βοηθά επιχειρήσεις με εμπορικό λογισμικό, ταμειακά και POS συστήματα, εξοπλισμό και τη συνεχή υποστήριξή τους.",
          links: [link("Επιχειρησιακά συστήματα", "/business-systems")],
        };
  }

  if (/network|wifi|wi-fi|internet|δικτυ|ιντερνετ|ασυρματ/.test(text)) {
    return isEnglish
      ? {
          text: "GTSystems can help with business networks, Wi-Fi coverage, connectivity, and related support.",
          links: [link("Networks & digital services", "/en/web-development")],
        }
      : {
          text: "Η GTSystems αναλαμβάνει εταιρικά δίκτυα, κάλυψη Wi-Fi, συνδεσιμότητα και σχετική τεχνική υποστήριξη.",
          links: [link("Δίκτυα & digital υπηρεσίες", "/web-development")],
        };
  }

  if (/where|location|based|greece|corfu|που ειστε|που βρισκε|ελλαδα|κερκυρα|εξυπηρετ/.test(text)) {
    return isEnglish
      ? {
          text: "GTSystems is based in Corfu and supports businesses across Greece.",
          links: [link("About GTSystems", "/en/company"), link("Contact us", "/en/contact")],
        }
      : {
          text: "Η GTSystems έχει έδρα στην Κέρκυρα και υποστηρίζει επιχειρήσεις σε όλη την Ελλάδα.",
          links: [link("Σχετικά με την GTSystems", "/company"), link("Επικοινωνία", "/contact")],
        };
  }

  if (/service|services|υπηρεσι|τι κανετε|what do you do|what can you/.test(text)) {
    return isEnglish
      ? {
          text: "GTSystems brings business software, POS and cash systems, IT support, networks, websites, and web apps together with one team supporting businesses across Greece.",
          links: [link("Explore our solutions", "/en/business-systems"), link("Contact us", "/en/contact")],
        }
      : {
          text: "Η GTSystems συνδυάζει επιχειρησιακό λογισμικό, POS και ταμειακά, τεχνική υποστήριξη, δίκτυα, ιστοσελίδες και web εφαρμογές, με εξυπηρέτηση σε όλη την Ελλάδα.",
          links: [link("Δείτε τις λύσεις μας", "/business-systems"), link("Επικοινωνία", "/contact")],
        };
  }

  if (/experience|how long|years|εμπειρι|ποσα χρονια/.test(text)) {
    return isEnglish
      ? {
          text: "GTSystems has been supporting businesses for more than 20 years, with service across Greece.",
          links: [link("About GTSystems", "/en/company")],
        }
      : {
          text: "Η GTSystems βρίσκεται δίπλα στις επιχειρήσεις για περισσότερα από 20 χρόνια, με εξυπηρέτηση σε όλη την Ελλάδα.",
          links: [link("Σχετικά με την GTSystems", "/company")],
        };
  }

  return isEnglish
    ? {
        text: "I can help you find information about business software, POS systems, IT support, networks, and websites. What are you looking for?",
        links: [link("View our solutions", "/en/business-systems"), link("Contact GTSystems", "/en/contact")],
      }
    : {
        text: "Μπορώ να σας βοηθήσω με πληροφορίες για επιχειρησιακό λογισμικό, POS, τεχνική υποστήριξη, δίκτυα και ιστοσελίδες. Τι χρειάζεστε;",
        links: [link("Δείτε τις λύσεις μας", "/business-systems"), link("Επικοινωνία με την GTSystems", "/contact")],
      };
}

export default function Chatbot({ chatUrl = "", turnstileSiteKey = "" }: { chatUrl?: string; turnstileSiteKey?: string }) {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");
  return <ChatbotContent key={isEnglish ? "en" : "el"} chatUrl={chatUrl} turnstileSiteKey={turnstileSiteKey} isEnglish={isEnglish} />;
}

function ChatbotContent({ chatUrl, turnstileSiteKey, isEnglish }: { chatUrl: string; turnstileSiteKey: string; isEnglish: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextId, setNextId] = useState(1);
  const [live, setLive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [isOpen, messages]);

  function sendMessage(value: string) {
    const question = value.trim();
    if (!question) return;

    const answer = getAnswer(question, isEnglish);
    setMessages((current) => [
      ...current,
      { id: nextId, role: "visitor", text: question },
      { id: nextId + 1, role: "assistant", ...answer },
    ]);
    setNextId((current) => current + 2);
    setDraft("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(draft);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") setIsOpen(false);
  }

  const suggestions = isEnglish
    ? ["What services do you offer?", "I need IT support", "I’m looking for a website", "FAQs"]
    : ["Τι υπηρεσίες προσφέρετε;", "Χρειάζομαι τεχνική υποστήριξη", "Θέλω ιστοσελίδα", "Συχνές ερωτήσεις"];

  return (
    <div className="chatbot">
      {isOpen && (
        <section className="chatbot__panel" role="dialog" aria-label={isEnglish ? "GTSystems chat assistant" : "Βοηθός συνομιλίας GTSystems"}>
          <header className="chatbot__header">
            <span className="chatbot__status" aria-hidden="true" />
            <div>
              <strong>{live ? (isEnglish ? "GTSystems team" : "Ομάδα GTSystems") : (isEnglish ? "GTSystems assistant" : "Βοηθός GTSystems")}</strong>
              <span>{live ? (isEnglish ? "Messages to our team" : "Μηνύματα προς την ομάδα μας") : (isEnglish ? "Here to point you in the right direction" : "Για να σας κατευθύνει στη σωστή λύση")}</span>
            </div>
            <button className="chatbot__close" type="button" onClick={() => setIsOpen(false)} aria-label={isEnglish ? "Close chat" : "Κλείσιμο συνομιλίας"}>
              ×
            </button>
          </header>

          {live ? <LiveChat apiUrl={chatUrl} siteKey={turnstileSiteKey} english={isEnglish} onBack={() => setLive(false)} /> : <>
          <div className="chatbot__messages" ref={messagesRef} aria-live="polite">
            <div className="chatbot__message chatbot__message--assistant">
              {isEnglish
                ? "Hello! How can I help with your business today?"
                : "Γεια σας! Πώς μπορώ να βοηθήσω την επιχείρησή σας;"}
            </div>
            {messages.map((message) => (
              <div key={message.id}>
                <div className={`chatbot__message chatbot__message--${message.role}`}>
                  {message.text}
                </div>
                {message.links && (
                  <div className="chatbot__links">
                    {message.links.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {messages.length === 0 && (
              <div className="chatbot__suggestions">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)}>
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="chatbot__form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="chatbot-message">
              {isEnglish ? "Type your question" : "Γράψτε την ερώτησή σας"}
            </label>
            <input
              id="chatbot-message"
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={isEnglish ? "Type a question…" : "Γράψτε την ερώτησή σας…"}
              maxLength={500}
            />
            <button type="submit" disabled={!draft.trim()} aria-label={isEnglish ? "Send message" : "Αποστολή μηνύματος"}>
              {isEnglish ? "Send" : "Αποστολή"}
            </button>
          </form>
          {chatUrl && <button className="chatbot__live-button" type="button" onClick={() => setLive(true)}>{isEnglish ? "Chat with our team ↗" : "Μιλήστε με την ομάδα μας ↗"}</button>}
          <p className="chatbot__note">
            {isEnglish
              ? "Automated assistant · Messages are not stored or sent to an AI service."
              : "Αυτόματος βοηθός · Τα μηνύματα δεν αποθηκεύονται ούτε στέλνονται σε υπηρεσία AI."}
          </p>
          </>}
        </section>
      )}

      <button
        className="chatbot__launcher"
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? (isEnglish ? "Close chat" : "Κλείσιμο συνομιλίας") : (isEnglish ? "Chat with GTSystems" : "Συνομιλία με την GTSystems")}
        onClick={() => setIsOpen((open) => !open)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {isOpen ? (
            <path d="m6 6 12 12M18 6 6 18" />
          ) : (
            <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-1 2v-5.2A7.5 7.5 0 1 1 20 11.5Z" />
          )}
        </svg>
        <span>{isEnglish ? "Chat" : "Συνομιλία"}</span>
      </button>
    </div>
  );
}
