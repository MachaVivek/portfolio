"use client";

import { useState } from "react";
import ThemeBar from "@/components/ThemeBar";
import AIAssistant from "@/components/AIAssistant";
import Navbar from "@/components/Navbar";
import AboutPage from "@/components/AboutPage";
import ResumePage from "@/components/ResumePage";
import PortfolioPage from "@/components/PortfolioPage";
import SkillsPage from "@/components/SkillsPage";
import ContactPage from "@/components/ContactPage";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [activePage, setActivePage] = useState("about");

  return (
    <main className="portfolio-app-main">

      <AIAssistant />

      <ThemeBar />

      <div className="bottom-cards-layout">

        <div className="main-content">
          <Navbar activePage={activePage} onNavClick={setActivePage} />

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
