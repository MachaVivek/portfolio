import { Character } from "@/components/Character";
import type { CharacterState } from "@/lib/types";

const STATES: CharacterState[] = [
  "idle",
  "thinking",
  "searching",
  "coding",
  "envelope",
  "error",
];

/**
 * Development helper: shows every character pose side by side.
 *
 * Handy when swapping in real artwork — you can check all six at once instead of
 * driving the chat into each state. Safe to delete; nothing links to it.
 */
export default function CharacterPreview() {
  return (
    <main className="mx-auto grid max-w-5xl grid-cols-2 gap-8 p-10 md:grid-cols-3">
      {STATES.map((state) => (
        <div key={state} className="rounded-xl border border-border bg-surface p-4">
          <p className="mb-2 text-center text-xs font-mono text-accent">{state}</p>
          <Character state={state} />
        </div>
      ))}
    </main>
  );
}
