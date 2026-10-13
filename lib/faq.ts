export type FaqItem = {
  question: string;
  answer: string;
  link?: { label: string; href: string };
};

export const greekFaq: FaqItem[] = [
  {
    question: "Τι υπηρεσίες πληροφορικής προσφέρει η GTSystems σε επιχειρήσεις;",
    answer:
      "Η GTSystems παρέχει εμπορικό λογισμικό, ταμειακά και POS συστήματα, εξοπλισμό, τεχνική υποστήριξη, δίκτυα, ιστοσελίδες και web εφαρμογές.",
    link: { label: "Δείτε τις επιχειρησιακές λύσεις", href: "/business-systems" },
  },
  {
    question: "Αναλαμβάνετε εγκατάσταση και παραμετροποίηση POS και εμπορικού λογισμικού;",
    answer:
      "Ναι. Η GTSystems βοηθά στην επιλογή, εγκατάσταση, παραμετροποίηση και υποστήριξη επιχειρησιακού λογισμικού, ταμειακών συστημάτων και POS, ανάλογα με τις ανάγκες κάθε επιχείρησης.",
    link: { label: "Λογισμικό, ταμειακά και POS", href: "/business-systems" },
  },
  {
    question: "Μπορώ να ζητήσω τεχνική υποστήριξη για συστήματα που ήδη χρησιμοποιώ;",
    answer:
      "Επικοινωνήστε μαζί μας και περιγράψτε το σύστημα και το πρόβλημα. Θα εξετάσουμε το αίτημα και θα σας ενημερώσουμε για τον κατάλληλο τρόπο υποστήριξης.",
    link: { label: "Επικοινωνήστε με την υποστήριξη", href: "/contact" },
  },
  {
    question: "Κατασκευάζετε ιστοσελίδες και web εφαρμογές για επιχειρήσεις;",
    answer:
      "Ναι. Σχεδιάζουμε επαγγελματικές ιστοσελίδες και web εφαρμογές γύρω από τις ανάγκες της επιχείρησης, με δυνατότητα σύνδεσης με τις καθημερινές επιχειρησιακές διαδικασίες.",
    link: { label: "Ιστοσελίδες και digital υπηρεσίες", href: "/web-development" },
  },
  {
    question: "Η GTSystems εξυπηρετεί επιχειρήσεις εκτός Κέρκυρας;",
    answer:
      "Η GTSystems έχει έδρα στην Κέρκυρα και υποστηρίζει επιχειρήσεις σε όλη την Ελλάδα. Ο τρόπος εξυπηρέτησης εξαρτάται από την υπηρεσία και τις ανάγκες της επιχείρησης.",
    link: { label: "Σχετικά με την GTSystems", href: "/company" },
  },
  {
    question: "Πόσο κοστίζουν οι υπηρεσίες ή η κατασκευή μιας ιστοσελίδας;",
    answer:
      "Το κόστος εξαρτάται από το αντικείμενο, τις λειτουργίες και τον εξοπλισμό που χρειάζεται το έργο. Επικοινωνήστε μαζί μας με λίγες πληροφορίες για να συζητήσουμε τις ανάγκες σας.",
    link: { label: "Ζητήστε προσφορά", href: "/contact" },
  },
  {
    question: "Πώς ξεκινά μια συνεργασία με την GTSystems;",
    answer:
      "Ξεκινάμε με μια συζήτηση για τις ανάγκες, τα συστήματα που ήδη χρησιμοποιείτε και το αποτέλεσμα που θέλετε. Έπειτα προτείνουμε τα κατάλληλα επόμενα βήματα.",
    link: { label: "Μιλήστε μαζί μας", href: "/contact" },
  },
  {
    question: "Πώς μπορώ να επικοινωνήσω με την GTSystems;",
    answer:
      "Μπορείτε να καλέσετε στο +30 26617 00610, να στείλετε email στο info@gtsystems.gr ή να χρησιμοποιήσετε τη φόρμα επικοινωνίας.",
    link: { label: "Φόρμα επικοινωνίας", href: "/contact" },
  },
];

export const englishFaq: FaqItem[] = [
  {
    question: "What IT services does GTSystems provide for businesses?",
    answer:
      "GTSystems provides commercial software, cash register and POS systems, hardware, IT support, networks, business websites, and web applications.",
    link: { label: "Explore business systems", href: "/en/business-systems" },
  },
  {
    question: "Do you install and configure POS systems and business software?",
    answer:
      "Yes. GTSystems helps businesses choose, install, configure, and support commercial software, cash systems, and POS equipment based on their needs.",
    link: { label: "Software, cash systems, and POS", href: "/en/business-systems" },
  },
  {
    question: "Can I request support for systems I already use?",
    answer:
      "Contact us and describe the system and issue. We will review your request and let you know the right way to provide support.",
    link: { label: "Contact support", href: "/en/contact" },
  },
  {
    question: "Does GTSystems build business websites and web applications?",
    answer:
      "Yes. We build professional websites and web applications around business needs, with the option to connect them to everyday business workflows.",
    link: { label: "Websites and digital services", href: "/en/web-development" },
  },
  {
    question: "Does GTSystems work with businesses outside Corfu?",
    answer:
      "GTSystems is based in Corfu and supports businesses across Greece. The service approach depends on the work and the business’s needs.",
    link: { label: "About GTSystems", href: "/en/company" },
  },
  {
    question: "How much do your services or a business website cost?",
    answer:
      "Cost depends on the project scope, required features, and equipment. Contact us with a few details so we can discuss your needs.",
    link: { label: "Request a quote", href: "/en/contact" },
  },
  {
    question: "How do I get started with GTSystems?",
    answer:
      "We start with a conversation about your needs, the systems you already use, and the result you want. Then we recommend the right next steps.",
    link: { label: "Talk to our team", href: "/en/contact" },
  },
  {
    question: "How can I contact GTSystems?",
    answer:
      "Call +30 26617 00610, email info@gtsystems.gr, or send us a message using the contact form.",
    link: { label: "Contact form", href: "/en/contact" },
  },
];
