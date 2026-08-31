"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AboutPage from "@/components/AboutPage";
import ResumePage from "@/components/ResumePage";
import PortfolioPage from "@/components/PortfolioPage";
import BlogPage from "@/components/BlogPage";
import ContactPage from "@/components/ContactPage";

export default function Home() {
  const [activePage, setActivePage] = useState("about");

  return (
    <main>
      <Sidebar />

      <div className="main-content">
        <Navbar activePage={activePage} onNavClick={setActivePage} />

        <AboutPage isActive={activePage === "about"} />
        <ResumePage isActive={activePage === "resume"} />
        <PortfolioPage isActive={activePage === "portfolio"} />
        <BlogPage isActive={activePage === "blog"} />
        <ContactPage isActive={activePage === "contact"} />
      </div>
    </main>
  );
}
