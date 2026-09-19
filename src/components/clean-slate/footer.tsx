import Link from "next/link";

const FOOTER_LINKS = [
  {
    title: "Programmes",
    links: [
      { label: "BNS Connect", href: "/programmes/connect" },
      { label: "BNS Mashinani", href: "/programmes/mashinani" },
      { label: "Wanahabari Lab", href: "/programmes/wanahabari-lab" },
      { label: "BNS Studio", href: "/programmes/studios" },
    ],
  },
  {
    title: "Organisation",
    links: [
      { label: "About", href: "/" },
      { label: "Contact", href: "/contact" },
      { label: "Programmes", href: "/programmes" },
    ],
  },
];

export function CleanSlateFooter() {
  return (
    <footer className="cs-footer">
      <div className="cs-container">
        <div className="cs-footer-grid">
          <div>
            <Link href="/" className="cs-nav-logo" style={{ fontSize: "1.5rem" }}>
              BNS.
            </Link>
            <p
              className="cs-body"
              style={{ marginTop: "16px", color: "var(--cs-gray-600)", maxWidth: "40ch" }}
            >
              Translating Kenya&apos;s national budget into clear, actionable civic narratives.
            </p>
          </div>
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <p className="cs-label" style={{ marginBottom: "16px", color: "var(--cs-gray-400)" }}>
                {section.title}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="cs-link" style={{ fontSize: "0.875rem" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="cs-footer-bottom">
          <span>&copy; {new Date().getFullYear()} Budget Ndio Story</span>
          <span>Nairobi, Kenya</span>
        </div>
      </div>
    </footer>
  );
}
