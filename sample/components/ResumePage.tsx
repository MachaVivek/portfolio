"use client";

interface ResumePageProps {
  isActive: boolean;
}

interface TimelineItem {
  title: string;
  period: string;
  text: string;
}

interface SkillItem {
  name: string;
  value: number;
}

const education: TimelineItem[] = [
  {
    title: "University school of the arts",
    period: "2007 — 2008",
    text: "Nemo enims ipsam voluptatem, blanditiis praesentium voluptum delenit atque corrupti, quos dolores et quas molestias exceptur.",
  },
  {
    title: "New york academy of art",
    period: "2006 — 2007",
    text: "Ratione voluptatem sequi nesciunt, facere quisquams facere menda ossimus, omnis voluptas assumenda est omnis..",
  },
  {
    title: "High school of art and design",
    period: "2002 — 2004",
    text: "Duis aute irure dolor in reprehenderit in voluptate, quila voluptas mag odit aut fugit, sed consequuntur magni dolores eos.",
  },
];

const experience: TimelineItem[] = [
  {
    title: "Creative director",
    period: "2015 — Present",
    text: "Nemo enim ipsam voluptatem blanditiis praesentium voluptum delenit atque corrupti, quos dolores et qvuas molestias exceptur.",
  },
  {
    title: "Art director",
    period: "2013 — 2015",
    text: "Nemo enims ipsam voluptatem, blanditiis praesentium voluptum delenit atque corrupti, quos dolores et quas molestias exceptur.",
  },
  {
    title: "Web designer",
    period: "2010 — 2013",
    text: "Nemo enims ipsam voluptatem, blanditiis praesentium voluptum delenit atque corrupti, quos dolores et quas molestias exceptur.",
  },
];

const skills: SkillItem[] = [
  { name: "Web design", value: 80 },
  { name: "Graphic design", value: 70 },
  { name: "Branding", value: 90 },
  { name: "WordPress", value: 50 },
];

export default function ResumePage({ isActive }: ResumePageProps) {
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
          {education.map((item) => (
            <li className="timeline-item" key={item.title}>
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
            <ion-icon name="book-outline"></ion-icon>
          </div>
          <h3 className="h3">Experience</h3>
        </div>

        <ol className="timeline-list">
          {experience.map((item) => (
            <li className="timeline-item" key={item.title}>
              <h4 className="h4 timeline-item-title">{item.title}</h4>
              <span>{item.period}</span>
              <p className="timeline-text">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Skills */}
      <section className="skill">
        <h3 className="h3 skills-title">My skills</h3>

        <ul className="skills-list content-card">
          {skills.map((skill) => (
            <li className="skills-item" key={skill.name}>
              <div className="title-wrapper">
                <h5 className="h5">{skill.name}</h5>
                <data value={skill.value}>{skill.value}%</data>
              </div>
              <div className="skill-progress-bg">
                <div
                  className="skill-progress-fill"
                  style={{ width: `${skill.value}%` }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
