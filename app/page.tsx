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
  );
}

function Dealroom() {
  return (
    <main className="min-h-screen bg-ink text-mist">
      <div className="noise" />
      <SideNav />
      <div className="lg:pl-72">
        <Intro />
        <Timeline />
        <Performance />
        <CaseStudies />
        <Built />
        <References />
        <Process />
      </div>
    </main>
  );
}

function SideNav() {
  return (
    <aside className="sticky top-0 z-50 border-b border-line bg-ink/92 px-4 py-3 backdrop-blur-xl lg:fixed lg:bottom-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex gap-4 overflow-x-auto lg:h-full lg:flex-col lg:overflow-visible">
        <a href="#intro" className="focus-ring min-w-64 rounded-md lg:min-w-0">
          <p className="text-sm font-medium text-white">{dealroom.candidate.name}</p>
          <p className="mt-1 max-w-56 text-[12px] leading-5 text-muted">{dealroom.candidate.roleSignal}</p>
        </a>
        <nav className="flex items-center gap-1 lg:mt-8 lg:flex-col lg:items-stretch" aria-label="Dealroom sections">
          {dealroom.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring whitespace-nowrap rounded-full px-3 py-2 text-sm text-muted transition hover:bg-mist/10 hover:text-white lg:whitespace-normal"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex min-w-max items-center gap-2 rounded-full border border-line bg-mist/5 px-3 py-2 text-xs text-muted lg:mt-auto lg:ml-0 lg:min-w-0">
          <span className="h-2 w-2 rounded-full bg-mist" />
          {dealroom.candidate.availability}
        </div>
      </div>
    </aside>
  );
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title?: string; copy?: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      {title ? <h2 className="mt-3 text-3xl font-normal text-white sm:text-4xl">{title}</h2> : null}
      {copy ? <p className="mt-4 text-base leading-7 text-muted">{copy}</p> : null}
    </div>
  );
}

function Intro() {
  return (
    <section id="intro" className="section-shell pb-10 pt-16 lg:pb-12">
      <div className="max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="eyebrow">{dealroom.intro.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-normal text-white sm:text-6xl">{dealroom.intro.headline}</h1>
          <div className="mt-7 space-y-4 text-lg leading-8 text-muted">
            {dealroom.intro.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Timeline() {
  const [active, setActive] = useState(0);
  const selected = dealroom.timeline[active];

  return (
    <section id="timeline" className="section-shell">
      <SectionHeading
        eyebrow="Employment History"
        copy="Please select an experience to view a description of responsibilities and key achievements."
      />
      <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
        <div className="card p-2">
          {dealroom.timeline.map((item, index) => (
            <button
              key={item.employer}
              onClick={() => setActive(index)}
              className={`focus-ring flex w-full items-center justify-between rounded-[4px] p-4 text-left transition ${
                active === index ? "bg-mist text-ink" : "text-muted hover:bg-mist/10 hover:text-white"
              }`}
            >
              <span>
                <span className="block text-base font-medium">{item.employer}</span>
                <span className="block text-sm opacity-80">{item.role}</span>
              </span>
              <ArrowUpRight size={18} />
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.article
            key={selected.employer}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="card p-6"
          >
            <p className="text-sm text-muted">{selected.dates}</p>
            <h3 className="mt-2 text-3xl font-normal text-white">{selected.employer}</h3>
            <p className="mt-1 text-lg text-muted">{selected.role}</p>
            <p className="mt-5 leading-7 text-mist">{selected.description}</p>
            <div className="mt-6 rounded-[4px] border border-line bg-graphite/70 p-4">
              <h4 className="text-sm font-medium text-white">Achievements</h4>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                {selected.achievements.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-1 shrink-0 text-mist" size={14} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Performance() {
  return (
    <section id="performance" className="section-shell">
      <SectionHeading eyebrow="Current KPIs" />
      <div className="grid gap-4 md:grid-cols-3">
        {dealroom.performance.metrics.map((metric) => (
          <div key={metric.label} className="card p-5">
            <p className="text-sm text-muted">{metric.label}</p>
            <p className="mt-3 text-3xl font-normal text-white">{metric.value}</p>
            {metric.detail ? <p className="mt-2 text-sm leading-6 text-muted">{metric.detail}</p> : null}
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-5">
        <DataPanel title="Yearly quota attainment">
          <QuotaChart />
        </DataPanel>
      </div>
    </section>
  );
}

function QuotaChart() {
  const maxAttainment = Math.max(...dealroom.performance.quota.map((item) => item.attainment), 100);
  const benchmarkOffset = Math.min(220, Math.max(28, (100 / maxAttainment) * 220)) + 4;

  return (
    <div className="overflow-x-auto">
      <div className="relative flex min-w-[780px] items-end gap-3 rounded-[4px] border border-line bg-graphite/60 p-4">
        <div
          className="pointer-events-none absolute left-4 right-4 border-t border-dotted border-[#4a4740]"
          style={{ bottom: `${benchmarkOffset}px` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-5 rounded-sm bg-graphite px-1 text-[10px] text-muted"
          style={{ bottom: `${benchmarkOffset + 4}px` }}
          aria-hidden="true"
        >
          100%
        </div>
        {dealroom.performance.quota.map((item) => {
          const height = Math.max(28, (item.attainment / maxAttainment) * 220);

          return (
            <div key={item.year} className="flex flex-1 flex-col items-center gap-3">
              <div className="flex h-64 w-full items-end rounded-[3px] border border-line bg-ink/70 p-1">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="w-full rounded-[2px] bg-mist/90"
                />
              </div>
              <div className="text-center">
                <p className="text-xs text-white">{item.attainment}%</p>
                <p className="mt-1 text-xs text-muted">{item.year}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DataPanel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`card p-5 ${className}`}>
      <h3 className="mb-4 text-lg font-medium text-white">{title}</h3>
      {children}
    </div>
  );
}

function CaseStudies() {
  return (
    <section id="deals" className="section-shell">
      <SectionHeading
        eyebrow="Case Studies"
        copy="Please select a case study for an overview of an anonymized proof point."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {dealroom.caseStudies.map((study) => (
          <CaseStudy key={study.title} study={study} />
        ))}
      </div>
    </section>
  );
}

function CaseStudy({ study }: { study: (typeof dealroom.caseStudies)[number] }) {
  const [open, setOpen] = useState(false);
  const rows = [
    ["Problem", study.problem],
    ["Strategy", study.strategy],
    ["Result", study.result]
  ];

  return (
    <article className="card overflow-hidden">
      <button
        onClick={() => setOpen((value) => !value)}
        className="focus-ring flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <BriefcaseBusiness className="text-mist" size={20} />
          <h3 className="text-xl font-normal text-white">{study.title}</h3>
        </div>
        <ChevronDown className={`shrink-0 text-muted transition ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-line p-5">
              {rows.map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs uppercase text-muted">{label}</p>
                  <p className="mt-1 leading-7 text-muted">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

function Built() {
  return (
    <section id="built" className="section-shell">
      <SectionHeading eyebrow="Additional Resources" />
      <div className="grid gap-5 md:grid-cols-1">
        {dealroom.built.map((item) => (
          <article key={item.title} className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase text-muted">{item.status}</p>
                <h3 className="mt-3 text-2xl font-normal text-white">{item.title}</h3>
              </div>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="focus-ring rounded-full border border-line p-2 text-muted transition hover:bg-mist/10 hover:text-white"
                aria-label={`Open ${item.title}`}
              >
                <ExternalLink size={18} />
              </a>
            </div>
            {item.description ? <p className="mt-4 leading-7 text-muted">{item.description}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function References() {
  return (
    <section id="references" className="section-shell">
      <SectionHeading eyebrow="References" title="References by senior leadership available for each employment experience." />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dealroom.references.map((reference) => (
          <article key={reference.title} className="card p-5">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-white">Reference for</dt>
                <dd className="mt-1 leading-6 text-muted">{reference.employer}</dd>
              </div>
              <div>
                <dt className="text-white">Current job title</dt>
                <dd className="mt-1 leading-6 text-muted">{reference.title}</dd>
              </div>
              <div>
                <dt className="text-white">Relationship</dt>
                <dd className="mt-1 leading-6 text-muted">{reference.relationship}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="section-shell">
      <SectionHeading
        eyebrow="Path to Closed Won"
        copy="Deal stages for Opportunity: Julian Morris, Cursor AE"
      />
      <div className="card p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {dealroom.process.map((stage, index) => (
            <StageCard key={stage.label} stage={stage} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StageCard({ stage, index }: { stage: { label: string; status: StageStatus; date?: string; notes?: string }; index: number }) {
  const statusStyle = useMemo(
    () =>
      ({
        complete: "border-mist/30 bg-mist/10 text-mist",
        active: "border-ember/40 bg-ember/10 text-ember",
        upcoming: "border-line bg-graphite/70 text-muted"
      })[stage.status],
    [stage.status]
  );

  return (
    <article className={`rounded-[4px] border p-4 ${statusStyle}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs">0{index + 1}</span>
        {stage.status === "complete" ? <Check size={18} /> : <Circle size={14} />}
      </div>
      <h3 className="mt-5 min-h-12 text-base font-medium text-white">{stage.label}</h3>
      {stage.date ? <p className="mt-3 text-sm opacity-90">{stage.date}</p> : null}
      {stage.notes ? <p className="mt-2 text-sm leading-6 text-muted">{stage.notes}</p> : null}
    </article>
  );
}
