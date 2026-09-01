"use client";

import { useState } from "react";
import { portfolioData } from "@/data/portfolioData";

export default function SkillsSection() {
  const { skillCategories } = portfolioData.resume;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const renderIcon = (iconStr: string, name: string, className: string) => {
    if (iconStr && (iconStr.startsWith("http") || iconStr.startsWith("/")) && !brokenImages[name]) {
      return (

        <img
          src={iconStr}
          alt={name}
          className={className}
          loading="lazy"
          onError={() => setBrokenImages((prev) => ({ ...prev, [name]: true }))}
        />
      );
    }
    return <span className={className}>✦</span>;
  };

  return (
    <section className="skill-redesign">

      <div className="skill-category-tabs">
        <button
          className={`skill-cat-tab${activeCategory === null ? " active" : ""}`}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {skillCategories.map((cat) => (
          <button
            key={cat.id}
            className={`skill-cat-tab${activeCategory === cat.id ? " active" : ""}`}
            onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="skill-categories-wrap">
        {skillCategories
          .filter((cat) => activeCategory === null || activeCategory === cat.id)
          .map((cat) => (
            <div className="skill-category-section" key={cat.id}>

              <div className="skill-category-header">
                <h4 className="skill-category-label">{cat.label}</h4>
                <div className="skill-category-line" />
              </div>

              <ul className="skill-cards-grid">
                {cat.skills.map((skill) => (
                  <li className="skill-card" key={skill.name} title={`${skill.name} — ${skill.value}%`}>
                    <div className="skill-card-icon">
                      {renderIcon(skill.icon, skill.name, "skill-card-img-icon")}
                    </div>
                    <span className="skill-card-name">{skill.name}</span>
                    <div className="skill-card-bar-bg">
                      <div
                        className="skill-card-bar-fill"
                        style={{
                          width: `${skill.value}%`,
                        }}
                      />
                    </div>
                    <span className="skill-card-pct">{skill.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </section>
  );
}

