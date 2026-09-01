"use client";

interface NavbarProps {
  activePage: string;
  onNavClick: (page: string) => void;
}

const NAV_ITEMS = ["About", "Resume", "Portfolio", "Blog", "Contact"];

export default function Navbar({ activePage, onNavClick }: NavbarProps) {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {NAV_ITEMS.map((item) => (
          <li className="navbar-item" key={item}>
            <button
              className={`navbar-link${
                activePage === item.toLowerCase() ? " active" : ""
              }`}
              onClick={() => {
                onNavClick(item.toLowerCase());
              }}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
