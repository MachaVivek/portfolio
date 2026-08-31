import { FloatingChat } from "@/components/FloatingChat";
import { Hero } from "@/components/Hero";
import { About, Footer, Projects, Skills } from "@/components/Sections";

/**
 * Homepage.
 *
 * The assistant sits at the top because it's the thing that makes this portfolio
 * different — but the normal portfolio content follows immediately below, so a
 * visitor who just wants to scan projects isn't forced to talk to a chatbot.
 */
export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Footer />
      <FloatingChat />
    </main>
  );
}
