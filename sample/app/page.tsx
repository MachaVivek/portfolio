"use client";

import { useState } from "react";
import ThemeBar from "@/components/ThemeBar";
import AIAssistant from "@/components/AIAssistant";
import Navbar from "@/components/Navbar";
import AboutPage from "@/components/AboutPage";
import ResumePage from "@/components/ResumePage";
import PortfolioPage from "@/components/PortfolioPage";
import BlogPage from "@/components/BlogPage";
import ContactPage from "@/components/ContactPage";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [activePage, setActivePage] = useState("about");

  return (
    <main className="portfolio-app-main">
      {/* TOP BLOCK (Task 1): AI Assistant Card with Bot on Left & Conversation on Right */}
      <AIAssistant />

      {/* THEME & COLOR CONTROLS (Below top block) */}
      <ThemeBar />

      {/* BOTTOM ROW (Task 1): Details Card on Left & Profile Card on Right */}
      <div className="bottom-cards-layout">
        {/* Left Card: Details & Content Tabs */}
        <div className="main-content">
          <Navbar activePage={activePage} onNavClick={setActivePage} />

          <AboutPage isActive={activePage === "about"} />
          <ResumePage isActive={activePage === "resume"} />
          <PortfolioPage isActive={activePage === "portfolio"} />
          <BlogPage isActive={activePage === "blog"} />
          <ContactPage isActive={activePage === "contact"} />
        </div>

        {/* Right Card: Profile Sidebar */}
        <Sidebar />
      </div>
    </main>
  );
}
