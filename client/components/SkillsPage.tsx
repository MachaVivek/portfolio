"use client";

import SkillsSection from "@/components/SkillsSection";

interface SkillsPageProps {
  isActive: boolean;
}

export default function SkillsPage({ isActive }: SkillsPageProps) {
  return (
    <article className={`skills-page${isActive ? " active" : ""}`} data-page="skills">
      <header>
        <h2 className="h2 article-title">Skills</h2>
      </header>

      <SkillsSection />
    </article>
  );
}
