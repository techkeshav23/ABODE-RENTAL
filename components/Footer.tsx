import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative z-10 mt-16 lg:mt-24 bg-ink text-paper">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10 pt-14 sm:pt-20 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 sm:gap-12 lg:gap-8">
          <div className="col-span-2 lg:col-span-5">
            <Logo tone="paper" />
            <p className="mt-6 text-[0.95rem] leading-relaxed text-paper/70 max-w-md">
              Rental homes across India, direct from verified owners. Verified tenants,
              verified owners, zero brokers and zero brokerage.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#"
                className="px-4 py-2.5 rounded-full bg-paper/10 hover:bg-paper/20 transition-colors text-[0.85rem] inline-flex items-center gap-2"
              >
                <AppleGlyph /> iOS app
              </a>
              <a
                href="#"
                className="px-4 py-2.5 rounded-full bg-paper/10 hover:bg-paper/20 transition-colors text-[0.85rem] inline-flex items-center gap-2"
              >
                <AndroidGlyph /> Android app
              </a>
            </div>
          </div>

          <FooterCol
            title="Rent"
            links={[
              { href: "/stays", label: "All rental homes" },
              { href: "/nearby", label: "Search on map" },
              { href: "/stays?beds=2", label: "2 BHK homes" },
              { href: "/stays?beds=3", label: "3 BHK homes" },
              { href: "/saved", label: "Saved homes" },
            ]}
          />

          <FooterCol
            title="Owners"
            links={[
              { href: "/host", label: "List your home" },
              { href: "/verify", label: "Get verified" },
              { href: "#", label: "Why no brokers" },
              { href: "#", label: "Owner help" },
            ]}
          />

          <FooterCol
            title="Support"
            links={[
              { href: "#", label: "Help centre" },
              { href: "#", label: "Safety information" },
              { href: "#", label: "Cancellation options" },
              { href: "#", label: "Report a concern" },
            ]}
          />
        </div>

        <div className="mt-12 sm:mt-16 pt-8 border-t border-paper/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[0.82rem] text-paper/60">
          <div>© {new Date().getFullYear()} Abode Hospitality Pvt. Ltd. All rights reserved.</div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function AppleGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.4 12.5c0-2.4 2-3.5 2.1-3.6-1.1-1.7-2.9-1.9-3.5-2-1.5-.2-2.9.9-3.7.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.6C2 12.8 3.2 17.7 5 20.4c.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.8 3.4-.8 1.6 0 2.1.8 3.5.8 1.4 0 2.4-1.3 3.2-2.5.7-.9 1.4-2.2 1.5-3.5-1.5-.6-2.5-2-2.5-4.5zM14.6 5.6c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.5-.7.8-1.3 2-1.1 3.2 1.1.1 2.3-.6 3-1.4z" />
    </svg>
  );
}
function AndroidGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.6 9.5l1.6-2.8a.4.4 0 10-.7-.4l-1.7 2.9a9.6 9.6 0 00-9.6 0L5.5 6.3a.4.4 0 10-.7.4l1.6 2.8A8.5 8.5 0 002 16.5h20a8.5 8.5 0 00-4.4-7zM7.5 14.2a.9.9 0 110-1.7.9.9 0 010 1.7zm9 0a.9.9 0 110-1.7.9.9 0 010 1.7z" />
    </svg>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="lg:col-span-2">
      <div className="text-[0.7rem] uppercase tracking-[0.28em] text-saffron mb-5">
        {title}
      </div>
      <ul className="space-y-3 text-[0.95rem]">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-paper/80 hover:text-paper transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
