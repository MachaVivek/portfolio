"use client";

import { useState } from "react";

interface PortfolioPageProps {
  isActive: boolean;
}

interface ProjectItem {
  title: string;
  category: string;
  image: string;
  alt: string;
}

const projects: ProjectItem[] = [
  {
    title: "Finance",
    category: "web development",
    image: "/images/project-1.jpg",
    alt: "finance",
  },
  {
    title: "Orizon",
    category: "web development",
    image: "/images/project-2.png",
    alt: "orizon",
  },
  {
    title: "Fundo",
    category: "web design",
    image: "/images/project-3.jpg",
    alt: "fundo",
  },
  {
    title: "Brawlhalla",
    category: "applications",
    image: "/images/project-4.png",
    alt: "brawlhalla",
  },
  {
    title: "DSM.",
    category: "web design",
    image: "/images/project-5.png",
    alt: "dsm.",
  },
  {
    title: "MetaSpark",
    category: "web design",
    image: "/images/project-6.png",
    alt: "metaspark",
  },
  {
    title: "Summary",
    category: "web development",
    image: "/images/project-7.png",
    alt: "summary",
  },
  {
    title: "Task Manager",
    category: "applications",
    image: "/images/project-8.jpg",
    alt: "task manager",
  },
  {
    title: "Arrival",
    category: "web development",
    image: "/images/project-9.png",
    alt: "arrival",
  },
];

const CATEGORIES = ["All", "Web design", "Applications", "Web development"];

export default function PortfolioPage({ isActive }: PortfolioPageProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectOpen, setSelectOpen] = useState(false);

  const handleFilter = (category: string) => {
    setActiveFilter(category);
    setSelectOpen(false);
  };

  const isProjectActive = (projectCategory: string) => {
    if (activeFilter === "All") return true;
    return activeFilter.toLowerCase() === projectCategory;
  };

  return (
    <article
      className={`portfolio${isActive ? " active" : ""}`}
      data-page="portfolio"
    >
      <header>
        <h2 className="h2 article-title">Portfolio</h2>
      </header>

      <section className="projects">
        {/* Desktop filter buttons */}
        <ul className="filter-list">
          {CATEGORIES.map((cat) => (
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
            <div className="select-value">{activeFilter === "All" ? "Select category" : activeFilter}</div>
            <div className="select-icon">
              <ion-icon name="chevron-down"></ion-icon>
            </div>
          </button>

          <ul className="select-list">
            {CATEGORIES.map((cat) => (
              <li className="select-item" key={cat}>
                <button onClick={() => handleFilter(cat)}>{cat}</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Project list */}
        <ul className="project-list">
          {projects.map((project) => (
            <li
              className={`project-item${
                isProjectActive(project.category) ? " active" : ""
              }`}
              key={project.title}
              data-filter-item
              data-category={project.category}
            >
              <a href="#">
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
                <p className="project-category">{project.category.charAt(0).toUpperCase() + project.category.slice(1)}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
