"use client";

import { Character } from "@/components/Character";
import { ChatPanel } from "@/components/ChatPanel";
import { profile } from "@/data/portfolio";
import { useChat } from "@/lib/chat-context";

/**
 * The homepage hero: character on the left, chat on the right.
 *
 * Both read from the same shared chat state, which is what lets the character
 * react to what the assistant is doing.
 */
export function Hero() {
  const { characterState } = useChat();

  return (
    // id is what the floating widget watches, to know when the hero has scrolled away.
    <section
      id="hero"
      className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24"
    >
      {/* Intro + character */}
      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{profile.name}</h1>
        <p className="mt-2 text-lg text-accent">{profile.role}</p>
        <p className="mt-4 max-w-md text-muted">{profile.tagline}</p>

        {/* Hidden on small screens — on a phone the chat needs the whole viewport,
            and a large character above it would push the input off-screen. */}
        <Character state={characterState} className="mt-8 hidden md:flex" />
      </div>

      {/* Chat */}
      <div className="flex flex-col gap-4">
        {/* On mobile the character shows here instead, small and above the chat. */}
        <Character
          state={characterState}
          showCaption={false}
          className="mx-auto w-32 md:hidden"
        />
        <ChatPanel />
      </div>
    </section>
  );
}
