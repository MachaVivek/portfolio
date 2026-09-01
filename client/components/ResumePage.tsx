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
              <span className="timeline-period">{item.period}</span>
              <p className="timeline-text">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

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
              <span className="timeline-period">{item.period}</span>
              {item.bullets && item.bullets.length > 0 ? (
                <ul className="timeline-bullets">
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx} className="timeline-bullet-item">
                      <span className="timeline-bullet-dot"></span>
                      <p className="timeline-bullet-text">{bullet}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="timeline-text">{item.text}</p>
              )}
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
