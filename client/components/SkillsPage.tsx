"use client";

import SkillsSection from "@/components/SkillsSection";

interface SkillsPageProps {
  isActive: boolean;
}

export default function SkillsPage({ isActive }: SkillsPageProps) {
  return (
    <article
      id="skills"
      className={`skills-page${isActive ? " active" : ""}`}
      data-page="skills"
      role="tabpanel"
      aria-labelledby="tab-skills"
      tabIndex={0}
    >
      <header>
        <h2 className="h2 article-title">Skills</h2>
      </header>

      <SkillsSection />
    </article>
  );
}
