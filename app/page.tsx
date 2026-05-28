"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Circle,
  ExternalLink,
  KeyRound,
  Lock,
  ShieldCheck
} from "lucide-react";
import { dealroom, StageStatus } from "@/content/dealroom";

const storageKey = "cursor-candidate-dealroom-unlocked";

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(window.sessionStorage.getItem(storageKey) === "true");
  }, []);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return <Dealroom />;
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === dealroom.password) {
      window.sessionStorage.setItem(storageKey, "true");
      onUnlock();
      return;
    }
    setError("That password does not match this private room.");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-ink text-mist">
      <div className="noise" />
      <section className="relative flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="card w-full max-w-md p-6 sm:p-8"
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-[4px] border border-line bg-mist/5 text-mist">
                <Lock size={19} />
              </div>
              <div>
                <p className="text-xs uppercase text-muted">Private access</p>
                <h1 className="text-xl font-medium text-white">{dealroom.candidate.roomTitle}</h1>
              </div>
            </div>
            <ShieldCheck className="text-mist" size={22} />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm text-muted" htmlFor="password">
              Enter the room password
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  className="focus-ring h-12 w-full rounded-full border border-line bg-graphite pl-10 pr-3 text-white placeholder:text-muted"
                  placeholder="Password"
                />
              </div>
              <button className="focus-ring h-12 rounded-full bg-mist px-5 text-sm font-medium text-ink transition hover:bg-white">
                Unlock
              </button>
            </div>
            <p className="min-h-5 text-sm text-ember" aria-live="polite">
              {error}
            </p>
          </form>
        </motion.div>
      </section>
    </main>
