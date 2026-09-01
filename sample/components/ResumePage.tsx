"use client";

import { portfolioData } from "@/data/portfolioData";

interface ResumePageProps {
  isActive: boolean;
}

export default function ResumePage({ isActive }: ResumePageProps) {
  const { resume } = portfolioData;

  return (
    <article className={`resume${isActive ? " active" : ""}`} data-page="resume">
      <header>
        <h2 className="h2 article-title">Resume</h2>
      </header>

      {/* Education */}
      <section className="timeline">
        <div className="title-wrapper">
          <div className="icon-box">
            <ion-icon name="book-outline"></ion-icon>
          </div>
          <h3 className="h3">Education</h3>
        </div>

        <ol className="timeline-list">
          {resume.education.map((item) => (
            <li className="timeline-item" key={item.id || item.title}>
              <h4 className="h4 timeline-item-title">{item.title}</h4>
              <span>{item.period}</span>
              <p className="timeline-text">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Experience */}
      <section className="timeline">
        <div className="title-wrapper">
          <div className="icon-box">
            <ion-icon name="briefcase-outline"></ion-icon>
          </div>
          <h3 className="h3">Experience</h3>
        </div>

        <ol className="timeline-list">
          {resume.experience.map((item) => (
            <li className="timeline-item" key={item.id || item.title}>
              <h4 className="h4 timeline-item-title">{item.title}</h4>
              <span>{item.period}</span>
              <p className="timeline-text">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
