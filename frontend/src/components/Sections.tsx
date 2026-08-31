import { about, profile, projects, skills } from "@/data/portfolio";

/**
 * The plain portfolio content below the hero.
 *
 * These are server components (no "use client") — they're static text, so there's
 * no reason to ship them as JavaScript to the browser.
 */

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-6 text-2xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

export function About() {
  return (
    <section className="mx-auto max-w-6xl border-t border-border px-6 py-16">
      <SectionHeading id="about">About</SectionHeading>
      <p className="max-w-2xl leading-relaxed text-muted">{about}</p>
    </section>
  );
}

export function Projects() {
  return (
    <section className="mx-auto max-w-6xl border-t border-border px-6 py-16">
      <SectionHeading id="projects">Projects</SectionHeading>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="flex flex-col rounded-xl border border-border bg-surface p-5 transition hover:border-accent"
          >
            <h3 className="font-medium">{project.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {project.summary}
            </p>

            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                // noreferrer stops the new tab from being able to reach back
                // into this page via window.opener.
                rel="noopener noreferrer"
                className="mt-4 text-sm text-accent hover:underline"
              >
                View on GitHub →
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section className="mx-auto max-w-6xl border-t border-border px-6 py-16">
      <SectionHeading id="skills">Skills</SectionHeading>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((group) => (
          <div key={group.group}>
            <h3 className="mb-2 text-sm font-medium text-accent">{group.group}</h3>
            <ul className="space-y-1 text-sm text-muted">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl border-t border-border px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <nav className="flex gap-5 text-sm">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition hover:text-accent"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition hover:text-accent"
          >
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
