"use client";

interface NavbarProps {
  activePage: string;
  onNavClick: (page: string) => void;
}

const NAV_ITEMS = [
  { label: "About",    id: "about" },
  { label: "Resume",   id: "resume" },
  { label: "Projects", id: "projects" },
  { label: "Skills",   id: "skills" },
  { label: "Contact",  id: "contact" },
];

export default function Navbar({ activePage, onNavClick }: NavbarProps) {
  return (
    <nav className="navbar" aria-label="Portfolio sections">
      <ul className="navbar-list" role="tablist">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <li className="navbar-item" key={item.id} role="presentation">
              <a
                href={`#${item.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${item.id}`}
                id={`tab-${item.id}`}
                className={`navbar-link${isActive ? " active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick(item.id);
                  // Update URL hash without scrolling
                  window.history.pushState(null, "", `#${item.id}`);
                }}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
