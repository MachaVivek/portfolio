/**
 * StructuredData.tsx
 * Server-rendered Schema.org JSON-LD scripts injected into <head>.
 * Provides rich snippets for Google Search (Person, WebSite, ProfilePage, SoftwareApplication).
 */

import { portfolioData } from "@/data/portfolioData";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://machavivek.vercel.app";

const { profile, about, portfolio, resume } = portfolioData;

/** Person entity — the subject of the portfolio */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE_URL}/#person`,
  name: profile.name,
  alternateName: "Vivek Macha",
  url: BASE_URL,
  image: {
    "@type": "ImageObject",
    url: `${BASE_URL}${profile.avatar}`,
    width: 512,
    height: 512,
  },
  email: profile.contacts.email,
  telephone: profile.contacts.phone,
  birthDate: profile.contacts.birthday.iso,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    addressCountry: "IN",
  },
  jobTitle: profile.title,
  worksFor: {
    "@type": "Organization",
    name: "Eksaq India Private Limited",
    url: "https://eksaq.com",
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Keshav Memorial Institute of Technology",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        addressCountry: "IN",
      },
    },
  ],
  award: [
    "Institute Rank 3 — Keshav Memorial Institute of Technology",
    "LeetCode Knight (1900+ Rating)",
    "1000+ DSA Problems Solved",
    "Open Source Contributor",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "React Native",
    "Node.js",
    "Express.js",
    "FastAPI",
    "Python",
    "TypeScript",
    "JavaScript",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Docker",
    "AWS",
    "GitHub Actions",
    "CI/CD",
    "AI Engineering",
    "RAG",
    "LangChain",
    "Vector Databases",
    "MCP Servers",
    "Full Stack Development",
    "Mobile App Development",
    "System Design",
    "Microservices",
    "Data Structures",
    "Algorithms",
    "Blockchain",
    "Solidity",
    "Web3",
  ],
  description: about.paragraphs.join(" "),
  sameAs: [
    "https://www.linkedin.com/in/macha-vivek-66a474276/",
    "https://github.com/MachaVivek",
    "https://leetcode.com/machavivek19/",
  ],
};

/** WebSite entity */
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: `${profile.name} — Portfolio`,
  description: `Personal portfolio website of ${profile.name}, ${profile.title}`,
  author: { "@id": `${BASE_URL}/#person` },
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/#projects`,
    },
    "query-input": "required name=search_term_string",
  },
};

/** ProfilePage entity */
const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${BASE_URL}/#profilepage`,
  url: BASE_URL,
  name: `${profile.name} — Personal Portfolio`,
  description: `Professional portfolio of ${profile.name}, ${profile.title} based in Hyderabad, India.`,
  dateCreated: "2024-01-01",
  dateModified: new Date().toISOString().split("T")[0],
  author: { "@id": `${BASE_URL}/#person` },
  mainEntity: { "@id": `${BASE_URL}/#person` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: `${BASE_URL}/#about`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Projects",
        item: `${BASE_URL}/#projects`,
      },
    ],
  },
};

/** Project / SoftwareApplication entities */
const projectsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `Projects by ${profile.name}`,
  description: `Open source and professional software projects built by ${profile.name}`,
  url: `${BASE_URL}/#projects`,
  author: { "@id": `${BASE_URL}/#person` },
  itemListElement: portfolio.projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "SoftwareApplication",
      name: project.title,
      description: project.description,
      url: project.link,
      image: project.image.startsWith("http")
        ? project.image
        : `${BASE_URL}${project.image}`,
      applicationCategory: mapCategory(project.category),
      author: { "@id": `${BASE_URL}/#person` },
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  })),
};

function mapCategory(category: string): string {
  const map: Record<string, string> = {
    ai: "Artificial Intelligence Application",
    "full stack": "WebApplication",
    mobile: "MobileApplication",
    blockchain: "FinanceApplication",
    backend: "DeveloperApplication",
  };
  return map[category.toLowerCase()] || "WebApplication";
}

/** Work experience / Occupation structured data */
const occupationSchema = {
  "@context": "https://schema.org",
  "@type": "Occupation",
  name: profile.title,
  description: resume.experience[0]?.text || "",
  skills: "Full Stack Development, AI Engineering, React, Node.js, FastAPI, PostgreSQL, Docker, AWS",
  occupationLocation: {
    "@type": "City",
    name: "Hyderabad",
  },
  estimatedSalary: {
    "@type": "MonetaryAmountDistribution",
    name: "Associate Software Engineer",
    currency: "INR",
    duration: "P1Y",
    percentile10: 400000,
    percentile25: 500000,
    median: 700000,
    percentile75: 900000,
    percentile90: 1200000,
  },
};

export default function StructuredData() {
  const schemas = [
    personSchema,
    websiteSchema,
    profilePageSchema,
    projectsSchema,
    occupationSchema,
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
