"use client";

import { useState, useEffect } from "react";
import ThemeBar from "@/components/ThemeBar";
import AIAssistant from "@/components/AIAssistant";
import Navbar from "@/components/Navbar";
import AboutPage from "@/components/AboutPage";
import ResumePage from "@/components/ResumePage";
import PortfolioPage from "@/components/PortfolioPage";
import SkillsPage from "@/components/SkillsPage";
import ContactPage from "@/components/ContactPage";
import Sidebar from "@/components/Sidebar";

const VALID_PAGES = ["about", "resume", "projects", "skills", "contact"];

function getPageFromHash(hash: string): string {
  const page = hash.replace("#", "").toLowerCase();
  return VALID_PAGES.includes(page) ? page : "about";
}

export default function Home() {
  const [activePage, setActivePage] = useState("about");

  // Sync active tab from URL hash on initial load and on browser back/forward
  useEffect(() => {
    // Set initial page from hash
    const initial = getPageFromHash(window.location.hash);
    setActivePage(initial);
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#about");
    }

    const handleHashChange = () => {
      setActivePage(getPageFromHash(window.location.hash));
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const handleNavClick = (page: string) => {
    setActivePage(page);
  };

  return (
    <main className="portfolio-app-main">

      <AIAssistant />

      <ThemeBar />

      <div className="bottom-cards-layout">

        <div className="main-content">
          <Navbar activePage={activePage} onNavClick={handleNavClick} />

          <AboutPage isActive={activePage === "about"} />
          <ResumePage isActive={activePage === "resume"} />
          <PortfolioPage isActive={activePage === "projects"} />
          <SkillsPage isActive={activePage === "skills"} />
          <ContactPage isActive={activePage === "contact"} />
        </div>

        <Sidebar />
      </div>
    </main>
  );
}
