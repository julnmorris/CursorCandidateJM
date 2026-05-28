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
import { dealroom as initialDealroom, StageStatus } from "@/content/dealroom";

const storageKey = "cursor-candidate-dealroom-unlocked";
const draftStorageKey = "cursor-candidate-dealroom-draft-v4";
type DealroomContent = typeof initialDealroom;
type Path = Array<string | number>;

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
    if (password === initialDealroom.password) {
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
                <h1 className="text-xl font-medium text-white">{initialDealroom.candidate.roomTitle}</h1>
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
  const [room, setRoom] = useState<DealroomContent>(initialDealroom);
  const [editing, setEditing] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    const draft = window.localStorage.getItem(draftStorageKey);
    if (draft) {
      setRoom(JSON.parse(draft));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(draftStorageKey, JSON.stringify(room));
  }, [room]);

  function update(path: Path, value: string | number) {
    setRoom((current) => updateAtPath(current, path, value));
  }

  function resetDraft() {
    window.localStorage.removeItem(draftStorageKey);
    setRoom(initialDealroom);
  }

  return (
    <main className="min-h-screen bg-ink text-mist">
      <div className="noise" />
      <SideNav
        room={room}
        editing={editing}
        onToggleEditing={() => setEditing((value) => !value)}
        onExport={() => setExportOpen(true)}
        onReset={resetDraft}
        update={update}
      />
      <div className="lg:pl-72">
        <Intro room={room} editing={editing} update={update} />
        <Timeline room={room} editing={editing} update={update} />
        <Performance room={room} editing={editing} update={update} />
        <CaseStudies room={room} editing={editing} update={update} />
        <Built room={room} editing={editing} update={update} />
        <References room={room} editing={editing} update={update} />
        <Process room={room} editing={editing} update={update} />
      </div>
      {exportOpen ? <ExportModal room={room} onClose={() => setExportOpen(false)} /> : null}
    </main>
  );
}

function SideNav({
  room,
  editing,
  onToggleEditing,
  onExport,
  onReset,
  update
}: {
  room: DealroomContent;
  editing: boolean;
  onToggleEditing: () => void;
  onExport: () => void;
  onReset: () => void;
  update: (path: Path, value: string | number) => void;
}) {
  return (
    <aside className="sticky top-0 z-50 border-b border-line bg-ink/92 px-4 py-3 backdrop-blur-xl lg:fixed lg:bottom-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex gap-4 overflow-x-auto lg:h-full lg:flex-col lg:overflow-visible">
        <a href="#intro" className="focus-ring min-w-64 rounded-md lg:min-w-0">
          <EditableText value={room.candidate.name} path={["candidate", "name"]} editing={editing} update={update} className="text-sm font-medium text-white" as="p" />
          <EditableText value={room.candidate.roleSignal} path={["candidate", "roleSignal"]} editing={editing} update={update} className="mt-1 max-w-56 text-[12px] leading-5 text-muted" as="p" />
        </a>
        <nav className="flex items-center gap-1 lg:mt-8 lg:flex-col lg:items-stretch" aria-label="Dealroom sections">
          {room.nav.map((item) => (
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
          <EditableText value={room.candidate.availability} path={["candidate", "availability"]} editing={editing} update={update} />
        </div>
        <div className="flex gap-2 lg:flex-col">
          <button onClick={onToggleEditing} className="focus-ring rounded-full bg-mist px-4 py-2 text-sm font-medium text-ink">
            {editing ? "Done editing" : "Edit"}
          </button>
          <button onClick={onExport} className="focus-ring rounded-full border border-line px-4 py-2 text-sm text-mist transition hover:bg-mist/10">
            Export
          </button>
          {editing ? (
            <button onClick={onReset} className="focus-ring rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:bg-mist/10 hover:text-mist">
              Reset draft
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

function updateAtPath<T>(source: T, path: Path, value: string | number): T {
  if (path.length === 0) return value as T;
  const [head, ...tail] = path;
  const clone: any = Array.isArray(source) ? [...source] : { ...(source as any) };
  clone[head] = updateAtPath(clone[head], tail, value);
  return clone;
}

function EditableText({
  value,
  path,
  editing,
  update,
  className = "",
  multiline = false,
  as = "span"
}: {
  value: string;
  path: Path;
  editing: boolean;
  update: (path: Path, value: string | number) => void;
  className?: string;
  multiline?: boolean;
  as?: "span" | "p" | "h1" | "h2" | "h3";
}) {
  const Element = as;

  if (editing) {
    if (multiline) {
      return (
        <textarea
          value={value}
          onChange={(event) => update(path, event.target.value)}
          className={`focus-ring min-h-28 w-full resize-y rounded-[4px] border border-line bg-graphite/80 p-3 text-inherit ${className}`}
        />
      );
    }

    return (
      <input
        value={value}
        onChange={(event) => update(path, event.target.value)}
        className={`focus-ring w-full rounded-[4px] border border-line bg-graphite/80 px-3 py-2 text-inherit ${className}`}
      />
    );
  }

  return <Element className={className}>{value}</Element>;
}

function EditableNumber({
  value,
  path,
  editing,
  update,
  className = ""
}: {
  value: number;
  path: Path;
  editing: boolean;
  update: (path: Path, value: string | number) => void;
  className?: string;
}) {
  if (editing) {
    return (
      <input
        type="number"
        value={value}
        onChange={(event) => update(path, Number(event.target.value))}
        className={`focus-ring w-full rounded-[4px] border border-line bg-graphite/80 px-2 py-1 text-center ${className}`}
      />
    );
  }

  return <span className={className}>{value}%</span>;
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  editing,
  update,
  paths
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  editing?: boolean;
  update?: (path: Path, value: string | number) => void;
  paths?: { eyebrow?: Path; title?: Path; copy?: Path };
}) {
  return (
    <div className="mb-8 max-w-3xl">
      {editing && update && paths?.eyebrow ? (
        <EditableText value={eyebrow} path={paths.eyebrow} editing={editing} update={update} className="eyebrow" as="p" />
      ) : (
        <p className="eyebrow">{eyebrow}</p>
      )}
      {title ? (
        editing && update && paths?.title ? (
          <EditableText value={title} path={paths.title} editing={editing} update={update} className="mt-3 text-3xl font-normal text-white sm:text-4xl" as="h2" />
        ) : (
          <h2 className="mt-3 text-3xl font-normal text-white sm:text-4xl">{title}</h2>
        )
      ) : null}
      {copy ? (
        editing && update && paths?.copy ? (
          <EditableText value={copy} path={paths.copy} editing={editing} update={update} className="mt-4 text-base leading-7 text-muted" multiline as="p" />
        ) : (
          <p className="mt-4 text-base leading-7 text-muted">{copy}</p>
        )
      ) : null}
    </div>
  );
}

function Intro({ room, editing, update }: { room: DealroomContent; editing: boolean; update: (path: Path, value: string | number) => void }) {
  return (
    <section id="intro" className="section-shell pb-10 pt-16 lg:pb-12">
      <div className="max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <EditableText value={room.intro.eyebrow} path={["intro", "eyebrow"]} editing={editing} update={update} className="eyebrow" as="p" />
          <EditableText value={room.intro.headline} path={["intro", "headline"]} editing={editing} update={update} className="mt-4 max-w-4xl text-4xl font-normal text-white sm:text-6xl" as="h1" multiline />
          <div className="mt-7 space-y-4 text-lg leading-8 text-muted">
            {room.intro.body.map((paragraph, index) => (
              <EditableText key={index} value={paragraph} path={["intro", "body", index]} editing={editing} update={update} multiline as="p" />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Timeline({ room, editing, update }: { room: DealroomContent; editing: boolean; update: (path: Path, value: string | number) => void }) {
  const [active, setActive] = useState(0);
  const selected = room.timeline[active];

  return (
    <section id="timeline" className="section-shell">
      <SectionHeading
        eyebrow="Employment History"
        title=""
        copy="Please select an experience to view a description of responsibilities and key achievements."
      />
      <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
        <div className="card p-2">
          {room.timeline.map((item, index) => (
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
            <EditableText value={selected.dates} path={["timeline", active, "dates"]} editing={editing} update={update} className="text-sm text-muted" as="p" />
            <EditableText value={selected.employer} path={["timeline", active, "employer"]} editing={editing} update={update} className="mt-2 text-3xl font-normal text-white" as="h3" />
            <EditableText value={selected.role} path={["timeline", active, "role"]} editing={editing} update={update} className="mt-1 text-lg text-muted" as="p" />
            <EditableText value={selected.description} path={["timeline", active, "description"]} editing={editing} update={update} className="mt-5 leading-7 text-mist" multiline as="p" />
            <div className="mt-6 grid gap-4">
              <InfoBlock title="Achievements" items={selected.achievements} basePath={["timeline", active, "achievements"]} editing={editing} update={update} />
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}

function InfoBlock({
  title,
  items,
  basePath,
  editing,
  update
}: {
  title: string;
  items: string[];
  basePath: Path;
  editing: boolean;
  update: (path: Path, value: string | number) => void;
}) {
  return (
    <div className="rounded-[4px] border border-line bg-graphite/70 p-4">
      <h4 className="text-sm font-medium text-white">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="flex gap-2">
            <Check className="mt-1 shrink-0 text-mist" size={14} />
            <EditableText value={item} path={items.length === 1 ? basePath : [...basePath, index]} editing={editing} update={update} multiline />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Performance({ room, editing, update }: { room: DealroomContent; editing: boolean; update: (path: Path, value: string | number) => void }) {
  return (
    <section id="performance" className="section-shell">
      <SectionHeading
        eyebrow="Current KPIs"
        title=""
      />
      <div className="grid gap-4 md:grid-cols-3">
        {room.performance.metrics.map((metric, index) => (
          <div key={metric.label} className="card p-5">
            <EditableText value={metric.label} path={["performance", "metrics", index, "label"]} editing={editing} update={update} className="text-sm text-muted" as="p" />
            <EditableText value={metric.value} path={["performance", "metrics", index, "value"]} editing={editing} update={update} className="mt-3 text-3xl font-normal text-white" as="p" />
            <EditableText value={metric.detail} path={["performance", "metrics", index, "detail"]} editing={editing} update={update} className="mt-2 text-sm leading-6 text-muted" multiline as="p" />
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-5">
        <DataPanel title="Yearly quota attainment">
          <QuotaChart room={room} editing={editing} update={update} />
        </DataPanel>
      </div>
    </section>
  );
}

function QuotaChart({ room, editing, update }: { room: DealroomContent; editing: boolean; update: (path: Path, value: string | number) => void }) {
  const maxAttainment = Math.max(...room.performance.quota.map((item) => item.attainment), 100);
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
        {room.performance.quota.map((item, index) => {
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
                <EditableNumber value={item.attainment} path={["performance", "quota", index, "attainment"]} editing={editing} update={update} className="text-xs text-white" />
                <EditableText value={item.year} path={["performance", "quota", index, "year"]} editing={editing} update={update} className="mt-1 text-xs text-muted" as="p" />
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

function CaseStudies({ room, editing, update }: { room: DealroomContent; editing: boolean; update: (path: Path, value: string | number) => void }) {
  return (
    <section id="deals" className="section-shell">
      <SectionHeading
        eyebrow="Case Studies"
        title=""
        copy="Please select a case study for an overview of an anonymized proof point."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {room.caseStudies.map((study, index) => (
          <CaseStudy key={study.title} study={study} index={index} editing={editing} update={update} />
        ))}
      </div>
    </section>
  );
}

function CaseStudy({
  study,
  index,
  editing,
  update
}: {
  study: DealroomContent["caseStudies"][number];
  index: number;
  editing: boolean;
  update: (path: Path, value: string | number) => void;
}) {
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
          <EditableText value={study.title} path={["caseStudies", index, "title"]} editing={editing} update={update} className="text-xl font-normal text-white" as="h3" />
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
                  <EditableText value={value} path={["caseStudies", index, label.toLowerCase()]} editing={editing} update={update} className="mt-1 leading-7 text-muted" multiline as="p" />
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

function Built({ room, editing, update }: { room: DealroomContent; editing: boolean; update: (path: Path, value: string | number) => void }) {
  return (
    <section id="built" className="section-shell">
      <SectionHeading eyebrow="Additional Resources" title="" />
      <div className="grid gap-5 md:grid-cols-1">
        {room.built.map((item, index) => (
          <article key={item.title} className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <EditableText value={item.status} path={["built", index, "status"]} editing={editing} update={update} className="text-xs uppercase text-muted" as="p" />
                <EditableText value={item.title} path={["built", index, "title"]} editing={editing} update={update} className="mt-3 text-2xl font-normal text-white" as="h3" />
              </div>
              <a href={item.link} target="_blank" rel="noreferrer" className="focus-ring rounded-full border border-line p-2 text-muted transition hover:bg-mist/10 hover:text-white" aria-label={`Open ${item.title}`}>
                <ExternalLink size={18} />
              </a>
            </div>
            <EditableText value={item.description} path={["built", index, "description"]} editing={editing} update={update} className="mt-4 leading-7 text-muted" multiline as="p" />
            {editing ? (
              <div className="mt-5 rounded-[4px] border border-line bg-graphite/70 p-4">
                <p className="text-xs uppercase text-muted">Link</p>
                <EditableText value={item.link} path={["built", index, "link"]} editing={editing} update={update} className="mt-1 text-sm text-muted" />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function References({ room, editing, update }: { room: DealroomContent; editing: boolean; update: (path: Path, value: string | number) => void }) {
  return (
    <section id="references" className="section-shell">
      <SectionHeading eyebrow="References" title="References by senior leadership available for each employment experience." />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {room.references.map((reference, index) => (
          <article key={reference.title} className="card p-5">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-white">Reference for</dt>
                <dd className="mt-1 leading-6 text-muted">
                  <EditableText value={reference.employer} path={["references", index, "employer"]} editing={editing} update={update} />
                </dd>
              </div>
              <div>
                <dt className="text-white">Current job title</dt>
                <dd className="mt-1 leading-6 text-muted">
                  <EditableText value={reference.title} path={["references", index, "title"]} editing={editing} update={update} />
                </dd>
              </div>
              <div>
                <dt className="text-white">Relationship</dt>
                <dd className="mt-1 leading-6 text-muted">
                  <EditableText value={reference.relationship} path={["references", index, "relationship"]} editing={editing} update={update} />
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function Process({ room, editing, update }: { room: DealroomContent; editing: boolean; update: (path: Path, value: string | number) => void }) {
  return (
    <section id="process" className="section-shell">
      <SectionHeading
        eyebrow="Path to Closed Won"
        title=""
        copy="Deal stages for Opportunity: Julian Morris, Cursor AE"
      />
      <div className="card p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {room.process.map((stage, index) => (
            <StageCard key={stage.label} stage={stage} index={index} editing={editing} update={update} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StageCard({
  stage,
  index,
  editing,
  update
}: {
  stage: { label: string; status: StageStatus; date?: string; notes?: string };
  index: number;
  editing: boolean;
  update: (path: Path, value: string | number) => void;
}) {
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
        <span className="font-mono text-xs">0{index + 1}</span>
        {stage.status === "complete" ? <Check size={18} /> : <Circle size={14} />}
      </div>
      <EditableText value={stage.label} path={["process", index, "label"]} editing={editing} update={update} className="mt-5 min-h-12 text-base font-medium text-white" as="h3" />
      {editing ? (
        <select
          value={stage.status}
          onChange={(event) => update(["process", index, "status"], event.target.value)}
          className="focus-ring mt-3 w-full rounded-[4px] border border-line bg-graphite px-2 py-1 text-sm text-mist"
        >
          <option value="complete">complete</option>
          <option value="active">active</option>
          <option value="upcoming">upcoming</option>
        </select>
      ) : null}
      {(stage.date || editing) ? <EditableText value={stage.date ?? ""} path={["process", index, "date"]} editing={editing} update={update} className="mt-3 text-sm opacity-90" as="p" /> : null}
      {(stage.notes || editing) ? <EditableText value={stage.notes ?? ""} path={["process", index, "notes"]} editing={editing} update={update} className="mt-2 text-sm leading-6 text-muted" multiline as="p" /> : null}
    </article>
  );
}

function serializeDealroom(room: DealroomContent) {
  const json = JSON.stringify(room, null, 2).replace(
    /"status": "(complete|active|upcoming)"/g,
    '"status": "$1" as StageStatus'
  );

  return `export type StageStatus = "complete" | "active" | "upcoming";\n\nexport const dealroom = ${json};\n`;
}

function ExportModal({ room, onClose }: { room: DealroomContent; onClose: () => void }) {
  const output = serializeDealroom(room);
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
  }

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 p-4 backdrop-blur">
      <div className="mx-auto flex h-full max-w-5xl flex-col rounded-[4px] border border-line bg-ink p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase text-muted">Export updated content</p>
            <h2 className="mt-1 text-2xl font-normal text-white">Replace content/dealroom.ts with this when ready.</h2>
          </div>
          <button onClick={onClose} className="focus-ring rounded-full border border-line px-4 py-2 text-sm text-mist">
            Close
          </button>
        </div>
        <textarea readOnly value={output} className="focus-ring min-h-0 flex-1 rounded-[4px] border border-line bg-graphite p-4 font-mono text-sm leading-6 text-mist" />
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={copy} className="focus-ring rounded-full bg-mist px-4 py-2 text-sm font-medium text-ink">
            {copied ? "Copied" : "Copy all"}
          </button>
        </div>
      </div>
    </div>
  );
}
