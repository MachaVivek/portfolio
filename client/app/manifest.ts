import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Macha Vivek — Portfolio",
    short_name: "Macha Vivek",
    description:
      "Personal portfolio of Macha Vivek — Associate Software Engineer specializing in Full Stack Development, AI Engineering, Mobile Apps, and DevOps.",
    start_url: "/",
    display: "standalone",
    background_color: "#1e1e1e",
    theme_color: "#8B5CF6",
    orientation: "portrait",
    categories: ["portfolio", "technology", "software engineering"],
    lang: "en",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
      {
        src: "/images/avatar.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/avatar-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/images/og-image.png",
        sizes: "1200x630",
        type: "image/png",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore — form_factor is valid per W3C spec but not yet in TS types
        form_factor: "wide",
        label: "Portfolio Overview",
      },
    ],
  };
}
