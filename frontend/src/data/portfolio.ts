/**
 * Portfolio content shown on the page.
 *
 * Synchronized with Vivek Macha's profile and projects.
 */

export const profile = {
  name: "Vivek Macha",
  role: "Associate Software Engineer",
  tagline:
    "Software Engineer at EKSAQ building scalable backend architectures, cross-platform applications, and intelligent AI/RAG systems.",
  email: "machavivek19@gmail.com",
  github: "https://github.com/MachaVivek",
  linkedin: "https://www.linkedin.com/in/macha-vivek-66a474276/",
  leetcode: "https://leetcode.com/machavivek19/",
};

export const about = `I'm an Associate Software Engineer at EKSAQ India Private Limited based in Hyderabad. I hold a B.Tech in Computer Science from KMIT (GPA: 9.47, Institute Rank 3) and I'm a LeetCode Knight (1900+ rating, 1000+ problems solved). I specialize in designing scalable distributed backend systems, building full-stack and mobile applications, and integrating production-ready AI agents and RAG pipelines.`;

export interface Project {
  /** Must match the repo name in the backend's GITHUB_ALLOWED_REPOS to be chat-linked. */
  slug: string;
  title: string;
  summary: string;
  tech: string[];
  github?: string;
  /** Suggested question that makes the assistant explain this project. */
  askPrompt: string;
}

export const projects: Project[] = [
  {
    slug: "react-native-tree-visualizer",
    title: "TreeVisualizer (npm Package)",
    summary:
      "A published open-source React Native component library for interactive hierarchical tree data structure visualization across mobile platforms.",
    tech: ["React Native", "TypeScript", "Expo", "Redux Toolkit", "npm"],
    github: "https://github.com/MachaVivek/react-native-tree-visualizer",
    askPrompt: "Tell me about the TreeVisualizer npm package",
  },
  {
    slug: "InstaAnalysisMcp",
    title: "InstaAnalysis MCP Server",
    summary:
      "A Model Context Protocol (MCP) server built with FastMCP providing AI agents access to social media analytics, audience intelligence, and caching via Redis.",
    tech: ["Python", "FastMCP", "PostgreSQL", "Redis", "SQLAlchemy", "Neon"],
    github: "https://github.com/MachaVivek/InstaAnalysisMcp",
    askPrompt: "Explain the InstaAnalysis MCP server architecture and tools",
  },
  {
    slug: "AiTourGuide",
    title: "AI Tour Guide (RAG Chatbot)",
    summary:
      "A full-stack Retrieval-Augmented Generation application for context-aware travel recommendations using LangChain, OpenAI, and Pinecone vector search.",
    tech: ["FastAPI", "Python", "React", "LangChain", "Pinecone", "Supabase", "Tailwind CSS"],
    github: "https://github.com/MachaVivek/AiTourGuide",
    askPrompt: "How does the AI Tour Guide RAG pipeline work?",
  },
  {
    slug: "Observability",
    title: "Notes App with Observability Stack",
    summary:
      "Full-stack CRUD application with production monitoring and metrics using Prometheus, Grafana, Loki, Promtail, Alertmanager, and Docker.",
    tech: ["Node.js", "Express.js", "PostgreSQL", "Docker", "Prometheus", "Grafana", "Loki"],
    github: "https://github.com/MachaVivek/Observability",
    askPrompt: "What observability and monitoring stack did Vivek implement in the Notes project?",
  },
  {
    slug: "DailyHub_Backend",
    title: "Daily Hub",
    summary:
      "Full-stack productivity and social collaboration platform featuring real-time messaging, encrypted diary management, expense tracking, and WebSockets.",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "WebSockets", "Socket.IO", "JWT"],
    github: "https://github.com/MachaVivek/DailyHub_Backend",
    askPrompt: "Tell me about Daily Hub features and technical implementation",
  },
  {
    slug: "TicketMela",
    title: "Ticket Mela",
    summary:
      "Decentralized ticketing infrastructure on Ethereum with Solidity smart contracts for counterfeit-proof asset transfers and seat allocation.",
    tech: ["Solidity", "Ethereum", "Smart Contracts", "OpenZeppelin", "Web3", "REST APIs"],
    github: "https://github.com/MachaVivek/TicketMela",
    askPrompt: "How does Ticket Mela use smart contracts for ticketing?",
  },
  {
    slug: "Brain_Tumor_Detection",
    title: "Brain Tumor Detection",
    summary:
      "Deep learning medical imaging pipeline using Convolutional Neural Networks (CNNs) for automated MRI scan tumor classification with 92%+ validation accuracy.",
    tech: ["Python", "TensorFlow", "Keras", "CNN", "FastAPI", "Computer Vision"],
    github: "https://github.com/MachaVivek/Brain_Tumor_Detection",
    askPrompt: "Explain the Brain Tumor Detection deep learning model and inference service",
  },
];

export const skills = [
  {
    group: "Languages",
    items: ["Java", "Python", "JavaScript", "TypeScript", "SQL", "C", "C++"],
  },
  {
    group: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "React Native", "Expo", "Redux Toolkit"],
  },
  {
    group: "Backend & Systems",
    items: ["Node.js", "Express.js", "FastAPI", "Django", "REST APIs", "WebSockets", "Redis", "Nginx"],
  },
  {
    group: "Databases",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Neon", "Redis", "Upstash Redis", "Qdrant", "Pinecone"],
  },
  {
    group: "AI & ML",
    items: ["LangChain", "RAG", "Model Context Protocol (MCP)", "TensorFlow", "Keras", "CNN", "Gemini API"],
  },
  {
    group: "Cloud & DevOps",
    items: ["Docker", "Docker Compose", "AWS (EC2, S3)", "Prometheus", "Grafana", "Loki", "GitHub Actions"],
  },
];
