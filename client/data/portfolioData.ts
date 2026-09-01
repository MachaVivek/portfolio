export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  birthday: {
    display: string;
    iso: string;
  };
  location: string;
  mapEmbedUrl: string;
  resumeUrl: string;
}

export interface Profile {
  name: string;
  title: string;
  avatar: string;
  contacts: ContactInfo;
  socials: SocialLink[];
}

export interface Service {
  id: string;
  icon: string;
  iconAlt: string;
  title: string;
  text: string;
}

export interface AIAssistantInfo {
  title: string;
  badge?: string;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  avatar: string;
  text: string;
  date?: string;
}

export type Testimonial = Achievement;

export interface ClientLogo {
  id: string;
  name: string;
  logo: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  period: string;
  text: string;
}

export interface SkillItem {
  name: string;
  value: number;
}

export interface SkillCardItem {
  name: string;
  icon: string;
  value: number;
}

export interface SkillCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  skills: SkillCardItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  alt: string;
  link: string;
}

export interface PortfolioData {
  profile: Profile;
  about: {
    paragraphs: string[];
    services: Service[];
    achievements: Achievement[];
    testimonials?: Achievement[];
    clients: ClientLogo[];
  };
  resume: {
    education: TimelineItem[];
    experience: TimelineItem[];
    skills: SkillItem[];
    skillCategories: SkillCategory[];
  };
  portfolio: {
    categories: string[];
    projects: ProjectItem[];
  };
  aiAssistant: AIAssistantInfo;
}

export const portfolioData: PortfolioData = {
  profile: {
    name: "Macha Vivek",
    title: "Associate Software Engineer",
    avatar: "/images/my-avatar.png",

    contacts: {
      email: "machavivek19@gmail.com",
      phone: "+91 6281617463",
      birthday: {
        display: "November 19, 2003",
        iso: "2003-11-19",
      },
      location: "Hyderabad, Telangana, India",
      resumeUrl: "https://drive.google.com/file/d/your-google-drive-resume-link/view?usp=sharing",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.3160923726!2d78.24323254863281!3d17.412281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1717000000000!5m2!1sen!2sin",
    },

    socials: [
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/macha-vivek-66a474276/",
        icon: "logo-linkedin",
      },
      {
        name: "GitHub",
        url: "https://github.com/MachaVivek",
        icon: "logo-github",
      },
      {
        name: "LeetCode",
        url: "https://leetcode.com/machavivek19/",
        icon: "code-slash",
      },
    ],
  },

  about: {
    paragraphs: [
      "Associate Software Engineer specializing in Full Stack Development, Mobile Applications, AI, and scalable backend systems. I enjoy building production-ready software with clean architecture and exceptional user experiences.",

      "My expertise spans React, React Native, Node.js, FastAPI, PostgreSQL, Redis, LangChain, and cloud-native development. I have experience delivering real-world products, open-source libraries, AI applications, and developer tools.",
    ],

    services: [
      {
        id: "srv-web",
        icon: "layers-outline",
        iconAlt: "Full Stack Development",
        title: "Full Stack Development",
        text: "Building scalable web applications using React, Next.js, Node.js, Express, FastAPI, and PostgreSQL.",
      },
      {
        id: "srv-mobile",
        icon: "phone-portrait-outline",
        iconAlt: "Mobile Apps",
        title: "Mobile Apps",
        text: "Cross-platform mobile application development using React Native, Expo, and TypeScript.",
      },
      {
        id: "srv-ai",
        icon: "sparkles-outline",
        iconAlt: "AI Engineering",
        title: "AI Engineering",
        text: "Developing RAG applications, LangChain pipelines, vector search, and MCP servers for intelligent systems.",
      },
      {
        id: "srv-devops",
        icon: "infinite-outline",
        iconAlt: "DevOps",
        title: "DevOps",
        text: "Docker containerization, CI/CD with GitHub Actions, AWS cloud infrastructure (EC2, S3), and automated deployment.",
      },
    ],

    achievements: [
      {
        id: "a-1",
        name: "Institute Rank 3",
        avatar: "/images/avatar-1.png",
        text: "Awarded the Vidyalankar Vinayak Rao Koratkar Award for graduating with Institute Rank 3 in Computer Science Engineering.",
      },
      {
        id: "a-2",
        name: "LeetCode Knight",
        avatar: "/images/avatar-2.png",
        text: "Achieved Knight rating (1900+) on LeetCode with strong problem-solving and competitive programming skills.",
      },
      {
        id: "a-3",
        name: "1000+ Problems Solved",
        avatar: "/images/avatar-3.png",
        text: "Solved over 1000 Data Structures & Algorithms problems across LeetCode and Codeforces.",
      },
      {
        id: "a-4",
        name: "Open Source Contributor",
        avatar: "/images/avatar-4.png",
        text: "Published reusable React Native npm packages and actively builds developer-focused open-source projects.",
      },
    ],

    clients: [
      { id: "tech-1", name: "React", logo: "/images/logo-1-color.png" },
      { id: "tech-2", name: "Node.js", logo: "/images/logo-2-color.png" },
      { id: "tech-3", name: "FastAPI", logo: "/images/logo-3-color.png" },
      { id: "tech-4", name: "PostgreSQL", logo: "/images/logo-4-color.png" },
      { id: "tech-5", name: "Docker", logo: "/images/logo-5-color.png" },
      { id: "tech-6", name: "AWS", logo: "/images/logo-6-color.png" },
    ],
  },

  resume: {
    education: [
      {
        id: "edu-1",
        title: "Keshav Memorial Institute of Technology",
        period: "Dec 2021 — Jun 2025",
        text: "Bachelor of Technology in Computer Science Engineering with a CGPA of 9.47.",
      },
      {
        id: "edu-2",
        title: "Alphores Junior College",
        period: "2019 — 2021",
        text: "Intermediate Education (MPC) with 98.4% in Mathematics, Physics, and Chemistry.",
      },
    ],

    experience: [
      {
        id: "exp-1",
        title: "Associate Software Engineer • EKSAQ India Pvt Ltd",
        period: "Aug 2025 — Present",
        text: "Developed 40+ REST APIs, implemented Redis caching, JWT authentication, Swagger documentation, API Gateway integration, and backend services supporting 2,000+ users.",
      },
      {
        id: "exp-2",
        title: "Software Engineer Intern • EKSAQ India Pvt Ltd",
        period: "Dec 2024 — Jul 2025",
        text: "Built 35+ reusable React Native components, integrated 40+ REST APIs, and contributed to production mobile and backend releases in an agile startup environment.",
      },
    ],

    skills: [
      { name: "React / React Native", value: 95 },
      { name: "Node.js / Express", value: 95 },
      { name: "FastAPI / Python", value: 90 },
      { name: "PostgreSQL / MongoDB", value: 88 },
      { name: "AI • RAG • LangChain", value: 90 },
      { name: "Docker • Redis • AWS", value: 85 },
      { name: "DSA & System Design", value: 92 },
    ],

    skillCategories: [
      {
        id: "lang",
        label: "Programming Languages",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
        color: "#6366f1",
        skills: [
          { name: "Java",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", value: 85 },
          { name: "Python",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", value: 90 },
          { name: "JavaScript",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", value: 95 },
          { name: "TypeScript",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", value: 93 },
          { name: "SQL",         icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", value: 88 },
          { name: "C",           icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", value: 75 },
          { name: "C++",         icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", value: 75 },
        ],
      },
      {
        id: "frontend",
        label: "Frontend",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        color: "#22d3ee",
        skills: [
          { name: "React",                 icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", value: 95 },
          { name: "Next.js",               icon: "https://cdn.simpleicons.org/nextdotjs/white", value: 90 },
          { name: "HTML",                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", value: 95 },
          { name: "CSS",                   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", value: 90 },
          { name: "Tailwind CSS",          icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4", value: 88 },
          { name: "Redux",                 icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg", value: 85 },
          { name: "React Native",          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", value: 95 },
          { name: "Android Development",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg", value: 72 },
          { name: "REST API Integration",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg", value: 95 },
        ],
      },
      {
        id: "backend",
        label: "Backend",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        color: "#10b981",
        skills: [
          { name: "Node.js",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", value: 95 },
          { name: "Express.js",     icon: "https://cdn.simpleicons.org/express/white", value: 93 },
          { name: "FastAPI",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg", value: 90 },
          { name: "Django",         icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg", value: 72 },
          { name: "REST APIs",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg", value: 95 },
          { name: "JWT",            icon: "https://cdn.simpleicons.org/jsonwebtokens/D63AFF", value: 90 },
          { name: "Authentication", icon: "https://cdn.simpleicons.org/auth0/EB5424", value: 88 },
          { name: "OAuth",          icon: "https://cdn.simpleicons.org/openid/F78C40", value: 85 },
          { name: "WebSockets",     icon: "https://cdn.simpleicons.org/socketdotio/white", value: 82 },
        ],
      },
      {
        id: "database",
        label: "Database",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
        color: "#f59e0b",
        skills: [
          { name: "PostgreSQL",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", value: 88 },
          { name: "MySQL",         icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", value: 85 },
          { name: "MongoDB",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", value: 85 },
          { name: "Redis",         icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg", value: 87 },
          { name: "Indexing",      icon: "https://cdn.simpleicons.org/databricks/FF3621", value: 82 },
          { name: "Normalization", icon: "https://cdn.simpleicons.org/diagramsdotnet/F08705", value: 80 },
          { name: "Transactions",  icon: "https://cdn.simpleicons.org/apachecassandra/1287B1", value: 80 },
        ],
      },
      {
        id: "cloud",
        label: "Cloud & DevOps",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
        color: "#3b82f6",
        skills: [
          { name: "AWS",            icon: "/images/aws.svg", value: 82 },
          { name: "Docker",         icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", value: 85 },
          { name: "GitHub Actions", icon: "https://cdn.simpleicons.org/githubactions/2088FF", value: 80 },
          { name: "EC2",            icon: "/images/aws-ec2.svg", value: 78 },
          { name: "S3",             icon: "/images/aws-s3.svg", value: 78 },
          { name: "Monitoring",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg", value: 80 },
          { name: "Logging",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg", value: 80 },
        ],
      },
      {
        id: "dsa",
        label: "DSA & CP",
        icon: "https://cdn.simpleicons.org/leetcode/FFA116",
        color: "#8b5cf6",
        skills: [
          { name: "Data Structures",        icon: "https://cdn.simpleicons.org/graphql/E10098", value: 92 },
          { name: "Algorithms",             icon: "https://cdn.simpleicons.org/thealgorithms/00BCF2", value: 90 },
          { name: "Competitive Programming",icon: "https://cdn.simpleicons.org/hackerrank/00EA64", value: 88 },
          { name: "Problem Solving",        icon: "https://cdn.simpleicons.org/hackerearth/327499", value: 92 },
          { name: "LeetCode",               icon: "https://cdn.simpleicons.org/leetcode/FFA116", value: 90 },
          { name: "Codeforces",             icon: "https://cdn.simpleicons.org/codeforces/1F8ACB", value: 82 },
        ],
      },
      {
        id: "lld",
        label: "Low Level Design",
        icon: "https://cdn.simpleicons.org/blueprint/137CBD",
        color: "#ec4899",
        skills: [
          { name: "OOP",              icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", value: 90 },
          { name: "SOLID Principles", icon: "https://cdn.simpleicons.org/blueprint/137CBD", value: 85 },
          { name: "Design Patterns",  icon: "https://cdn.simpleicons.org/affinitydesigner/1B72BA", value: 83 },
          { name: "Low Level Design", icon: "https://cdn.simpleicons.org/sketch/FDB300", value: 82 },
        ],
      },
      {
        id: "system",
        label: "System Design",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
        color: "#5eead4",
        skills: [
          { name: "System Design",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg", value: 88 },
          { name: "Scalability",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg", value: 85 },
          { name: "Load Balancing", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg", value: 82 },
          { name: "Caching",        icon: "https://cdn.simpleicons.org/memcached/00D26A", value: 88 },
          { name: "Redis",          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg", value: 87 },
          { name: "Rate Limiting",  icon: "https://cdn.simpleicons.org/cloudflare/F38020", value: 82 },
          { name: "MicroServices",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", value: 83 },
          { name: "CAP Theorem",    icon: "https://cdn.simpleicons.org/apachespark/E25A1C", value: 80 },
          { name: "Consistency",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neo4j/neo4j-original.svg", value: 82 },
          { name: "Availability",   icon: "https://cdn.simpleicons.org/uptimekuma/5CD06B", value: 82 },
        ],
      },
      {
        id: "ai",
        label: "AI / ML",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
        color: "#a3e635",
        skills: [
          { name: "Machine Learning",         icon: "https://cdn.simpleicons.org/scikitlearn/F7931E", value: 80 },
          { name: "Deep Learning",            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg", value: 75 },
          { name: "CNN",                      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg", value: 78 },
          { name: "TensorFlow",               icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg", value: 72 },
          { name: "Keras",                    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg", value: 70 },
          { name: "LangChain",                icon: "https://cdn.simpleicons.org/langchain/00A67E", value: 88 },
          { name: "RAG",                      icon: "https://cdn.simpleicons.org/elastic/00BFB3", value: 87 },
          { name: "Pinecone",                 icon: "/images/pinecone.svg", value: 85 },
          { name: "NLP",                      icon: "https://cdn.simpleicons.org/huggingface/FFD21E", value: 75 },
          { name: "Vector Database",          icon: "https://cdn.simpleicons.org/qdrant/DC2626", value: 85 },
          { name: "Model Context Protocol",   icon: "https://cdn.simpleicons.org/anthropic/D97706", value: 85 },
        ],
      },
      {
        id: "blockchain",
        label: "Blockchain",
        icon: "https://cdn.simpleicons.org/ethereum/627EEA",
        color: "#f97316",
        skills: [
          { name: "Blockchain",      icon: "https://cdn.simpleicons.org/ethereum/627EEA", value: 75 },
          { name: "Web3",            icon: "https://cdn.simpleicons.org/web3dotjs/F16822", value: 72 },
          { name: "Solidity",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg", value: 72 },
          { name: "Smart Contracts", icon: "https://cdn.simpleicons.org/chainlink/375BD2", value: 70 },
          { name: "MetaMask",        icon: "/images/metamask.svg", value: 75 },
          { name: "NFT",             icon: "https://cdn.simpleicons.org/opensea/2081E2", value: 68 },
        ],
      },
      {
        id: "tools",
        label: "Tools",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
        color: "#94a3b8",
        skills: [
          { name: "Git",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", value: 95 },
          { name: "GitHub",    icon: "https://cdn.simpleicons.org/github/white", value: 95 },
          { name: "Bitbucket", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg", value: 78 },
          { name: "Postman",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg", value: 90 },
          { name: "VS Code",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", value: 95 },
          { name: "Jira",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg", value: 82 },
        ],
      },
    ],
  },

  portfolio: {
    categories: [
      "All",
      "AI",
      "Full Stack",
      "Mobile",
      "Blockchain",
      "Backend",
    ],

    projects: [
      {
        id: "proj-1",
        title: "AI Tour Guide",
        category: "ai",
        description:
          "An intelligent real-time travel companion app powered by AI and computer vision. Features personalized audio narration, automatic landmark recognition from camera feeds, context-aware historical trivia, interactive route planning, and multilingual speech translation for global travelers exploring new destinations.",
        image: "/images/project-1.jpg",
        alt: "AI Tour Guide",
        link: "https://github.com/MachaVivek/AiTourGuide",
      },
      {
        id: "proj-2",
        title: "TreeVisualizer",
        category: "mobile",
        description:
          "An interactive open-source React Native npm package built to visualize complex hierarchical data structures and binary search trees. Features animated tree traversals (BFS, DFS, Inorder, Preorder), node insertions, deletions, step-by-step algorithmic demonstrations, and fully customizable node styling.",
        image: "/images/project-2.png",
        alt: "Tree Visualizer",
        link: "https://github.com/MachaVivek/react-native-tree-visualizer",
      },
      {
        id: "proj-3",
        title: "Daily Hub",
        category: "full stack",
        description:
          "A full-stack productivity and workflow management web ecosystem built with React, Node.js, Express, and PostgreSQL. Features secure JWT authentication, real-time activity feeds, task scheduling, automated reminders, priority queues, and comprehensive performance analytics dashboards.",
        image: "/images/project-3.jpg",
        alt: "Daily Hub",
        link: "https://github.com/MachaVivek/DailyHub_Backend",
      },
      {
        id: "proj-4",
        title: "Ticket Mela",
        category: "blockchain",
        description:
          "A decentralized event ticketing platform that prevents counterfeiting and secondary-market scalping using Ethereum smart contracts and NFTs. Enables secure peer-to-peer ticket transfers with enforced price caps, verifiable on-chain ownership, and seamless Web3 wallet authentication.",
        image: "/images/project-4.png",
        alt: "Ticket Mela",
        link: "https://github.com/MachaVivek/TicketMela",
      },
      {
        id: "proj-5",
        title: "Brain Tumor Detection",
        category: "ai",
        description:
          "A medical deep learning system trained on MRI scan datasets to accurately detect and segment brain tumors. Implemented with TensorFlow, Keras, and convolutional neural networks (CNNs), providing high-precision clinical classifications along with interactive heatmap visualization overlays.",
        image: "/images/project-5.png",
        alt: "Brain Tumor Detection",
        link: "https://github.com/MachaVivek/Brain_Tumor_Detection",
      },
      {
        id: "proj-6",
        title: "InstaAnalysis MCP",
        category: "backend",
        description:
          "A Model Context Protocol (MCP) server engineered with FastMCP and Python for advanced Instagram analytics and intelligence. Exposes dedicated tools for LLMs to extract post engagement metrics, hashtag performance trends, audience demographic distributions, and sentiment insights seamlessly.",
        image: "/images/project-6.png",
        alt: "InstaAnalysis MCP",
        link: "https://github.com/MachaVivek/InstaAnalysisMcp",
      },
      {
        id: "proj-7",
        title: "Observability Stack",
        category: "backend",
        description:
          "An enterprise-grade telemetry, monitoring, and alerting infrastructure built using Docker, Prometheus, Grafana, and Loki. Provides centralized log aggregation, distributed request tracing, automated anomaly alerts, and real-time interactive health dashboards for microservices architecture.",
        image: "/images/project-7.png",
        alt: "Observability",
        link: "https://github.com/MachaVivek/Observability",
      },
    ],
  },

  aiAssistant: {
    title: "Ask Vivek",
    description:
      "I can answer questions, explore my GitHub, and even send emails. I know my portfolio inside out, retrieve live context with RAG, and use real tools to help you go beyond simple Q&A.",
  },
};

export default portfolioData;