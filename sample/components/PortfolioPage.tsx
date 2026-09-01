"use client";

import { useState } from "react";
import { portfolioData } from "@/data/portfolioData";

interface PortfolioPageProps {
  isActive: boolean;
}

export default function PortfolioPage({ isActive }: PortfolioPageProps) {
  const { portfolio } = portfolioData;
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectOpen, setSelectOpen] = useState(false);

  const handleFilter = (category: string) => {
    setActiveFilter(category);
    setSelectOpen(false);
  };

  const isProjectActive = (projectCategory: string) => {
    if (activeFilter === "All") return true;
    return activeFilter.toLowerCase() === projectCategory.toLowerCase();
  };

  return (
    <article
      className={`portfolio${isActive ? " active" : ""}`}
      data-page="projects"
    >
      <header>
        <h2 className="h2 article-title">Projects</h2>
      </header>

      <section className="projects">
        {/* Desktop filter buttons */}
        <ul className="filter-list">
          {portfolio.categories.map((cat) => (
            <li className="filter-item" key={cat}>
              <button
                className={activeFilter === cat ? "active" : ""}
                onClick={() => handleFilter(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile filter select */}
        <div className="filter-select-box">
          <button
            className={`filter-select${selectOpen ? " active" : ""}`}
            onClick={() => setSelectOpen(!selectOpen)}
          >
            <div className="select-value">
              {activeFilter === "All" ? "Select category" : activeFilter}
            </div>
            <div className="select-icon">
              <ion-icon name="chevron-down"></ion-icon>
            </div>
          </button>

          <ul className="select-list">
            {portfolio.categories.map((cat) => (
              <li className="select-item" key={cat}>
                <button onClick={() => handleFilter(cat)}>{cat}</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Project list */}
        <ul className="project-list">
          {portfolio.projects.map((project) => (
            <li
              className={`project-item${
                isProjectActive(project.category) ? " active" : ""
              }`}
              key={project.id || project.title}
              data-filter-item
              data-category={project.category}
            >
              <a href={project.link || "#"}>
                <figure className="project-img">
                  <div className="project-item-icon-box">
                    <ion-icon name="eye-outline"></ion-icon>
                  </div>
                  <img
                    src={project.image}
                    alt={project.alt}
                    loading="lazy"
                  />
                </figure>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-category">
                  {project.category.charAt(0).toUpperCase() +
                    project.category.slice(1)}
                </p>
                {project.description && (
                  <p className="project-description">{project.description}</p>
                )}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
