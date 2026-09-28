import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  CircleDot,
  Code2,
  Database,
  FileText,
  House,
  LockKeyhole,
  Mail,
  Network,
  PackageCheck,
  Pause,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'wouter';
import { BrandLogo } from './BrandLogo';
import { useLocale } from '../i18n/LocaleProvider';

export const STORY_TIMING = {
  sceneDurationMs: 6800,
  sceneTransitionSeconds: 0.48,
  revealSeconds: 0.68,
  springStiffness: 250,
  springDamping: 20,
  itemStaggerSeconds: 0.13,
  microLoopSeconds: 2.8,
  particleLoopSeconds: 5.6,
  particleStaggerSeconds: 0.62,
  connectorDrawSeconds: 0.9,
  graphNodeStaggerSeconds: 0.08,
  auditTypingSeconds: 2.2,
  auditDelaySeconds: 0.25,
  closingGlowSeconds: 3.5,
};

const sceneMeta = [
  { eyebrow: '01 / CONNECT', title: 'Your systems.', copy: 'Your enterprise already has the knowledge. Smart Context connects it without taking ownership away from your team.' },
  { eyebrow: '02 / RESOLVE', title: 'One context graph.', copy: 'Relationships, provenance, and timing become one shared layer that agents can reason over.' },
  { eyebrow: '03 / ACT', title: 'Agents that act on it.', copy: 'Purpose-built agents use the same business context to read, investigate, compare, and prepare decisions.' },
  { eyebrow: '04 / GOVERN', title: 'Always under your control.', copy: 'Choose what agents can see and do. Keep approval gates and a verifiable record around consequential actions.' },
  { eyebrow: '05 / OWN', title: 'Yours, not ours.', copy: 'Open source, sovereign by design, and built on the context your teams already own.' },
];

type RevealProps = {
  children: ReactNode;
  presentation: boolean;
  reduceMotion: boolean;
  delay?: number;
  className?: string;
};

function Reveal({ children, presentation, reduceMotion, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={presentation ? undefined : { opacity: 1, y: 0 }}
      animate={presentation ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: reduceMotion ? 0 : STORY_TIMING.revealSeconds, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SystemsVisual({ presentation, reduceMotion }: { presentation: boolean; reduceMotion: boolean }) {
  const { t, isArabic } = useLocale();
  const systems = [
    { name: 'SAP ERP', icon: Database, color: '#68B6EB' },
    { name: 'Salesforce CRM', icon: Users, color: '#7FE1D0' },
    { name: 'M365 Email', icon: Mail, color: '#F5B76C' },
    { name: 'Contracts Drive', icon: FileText, color: '#9CAFC7' },
  ];
  const ys = [58, 138, 218, 298];
  const pathDs = systems.map((_, index) => `M 238 ${ys[index]} C 330 ${ys[index]}, 330 ${180 + (index - 1.5) * 20}, 440 ${180 + (index - 1.5) * 20}`);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.055] p-5 shadow-[0_30px_90px_rgba(0,0,0,.22)] backdrop-blur-xl sm:p-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(78,203,222,.16),transparent_42%)]" aria-hidden="true" />
      <div className="relative grid min-h-[340px] gap-3 sm:grid-cols-[230px_1fr] sm:items-center">
        <div className="z-10 grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-3">
          {systems.map(({ name, icon: Icon, color }, index) => (
            <motion.div
              key={name}
              initial={reduceMotion ? false : { opacity: 0, x: -24, scale: 0.96 }}
              whileInView={presentation ? undefined : { opacity: 1, x: 0, scale: 1 }}
              animate={presentation ? { opacity: 1, x: 0, scale: 1 } : undefined}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : STORY_TIMING.revealSeconds, delay: reduceMotion ? 0 : index * STORY_TIMING.itemStaggerSeconds }}
              className="flex min-h-[68px] items-center gap-3 rounded-xl border border-white/15 bg-sc-navy/65 px-3 py-3 shadow-[0_12px_30px_rgba(0,0,0,.16)] sm:min-h-[62px] sm:px-4"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5" style={{ color }}>
                <Icon className="h-4 w-4" />
              </span>
               <span className="text-xs font-black text-white sm:text-sm">{t(name)}</span>
            </motion.div>
          ))}
        </div>
        <div className="relative min-h-[210px] sm:min-h-[320px]">
          <svg viewBox="0 0 500 360" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="platform-system-stream" x1="0" x2="1">
                <stop offset="0%" stopColor="#4ECBDE" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#4ECBDE" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {pathDs.map((d, index) => (
              <g key={d}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke="url(#platform-system-stream)"
                  strokeWidth="2"
                  initial={reduceMotion ? false : { pathLength: 0 }}
                  whileInView={presentation ? undefined : { pathLength: 1 }}
                  animate={presentation ? { pathLength: 1 } : undefined}
                  viewport={{ once: true }}
                  transition={{ duration: reduceMotion ? 0 : STORY_TIMING.connectorDrawSeconds, delay: reduceMotion ? 0 : index * STORY_TIMING.itemStaggerSeconds }}
                />
                {!reduceMotion && (
                  <circle r="3.5" fill="#8FF8F0" className="sc-flow-particle">
                    <animateMotion
                      path={d}
                      dur={`${STORY_TIMING.particleLoopSeconds + (index % 2) * 0.8}s`}
                      begin={`${index * STORY_TIMING.particleStaggerSeconds}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            ))}
            <circle cx="440" cy="180" r="27" fill="rgba(78,203,222,.13)" stroke="#4ECBDE" strokeOpacity=".5" />
            <circle cx="440" cy="180" r="7" fill="#4ECBDE" />
          </svg>
           <div className={`absolute bottom-2 rounded-full border border-sc-cyan/30 bg-sc-navy/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-sc-cyan sm:bottom-5 ${isArabic ? 'left-2' : 'right-2'}`}>
             {t('One governed connection layer')}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContextVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const { t } = useLocale();
  const nodes = [
    { x: 80, y: 70 }, { x: 270, y: 52 }, { x: 455, y: 95 }, { x: 120, y: 230 },
    { x: 330, y: 215 }, { x: 500, y: 265 }, { x: 185, y: 345 }, { x: 405, y: 375 },
  ];
  const links = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 7], [6, 7], [5, 7]];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-sc-cyan/20 bg-[#0E1B43]/75 p-5 shadow-[0_30px_90px_rgba(0,0,0,.25)] backdrop-blur-xl sm:p-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(78,203,222,.17),transparent_45%)]" aria-hidden="true" />
      <div className="relative min-h-[360px] sm:min-h-[410px]">
        <svg viewBox="0 0 580 440" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {links.map(([a, b], index) => (
            <motion.line
              key={`${a}-${b}`}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke="#4ECBDE"
              strokeOpacity=".34"
              strokeWidth="1.5"
              initial={reduceMotion ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : STORY_TIMING.connectorDrawSeconds, delay: reduceMotion ? 0 : index * STORY_TIMING.graphNodeStaggerSeconds }}
            />
          ))}
          {nodes.map(({ x, y }, index) => (
            <motion.g
              key={`${x}-${y}`}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: STORY_TIMING.springStiffness, damping: STORY_TIMING.springDamping, delay: reduceMotion ? 0 : index * STORY_TIMING.graphNodeStaggerSeconds }}
            >
              <circle cx={x} cy={y} r={index === 4 ? 9 : 6} fill={index === 4 ? '#4ECBDE' : '#8AE4DB'} />
              <circle cx={x} cy={y} r={index === 4 ? 17 : 13} fill="none" stroke="#4ECBDE" strokeOpacity=".35" />
            </motion.g>
          ))}
        </svg>
        <motion.div
          animate={reduceMotion ? undefined : { boxShadow: ['0 0 35px rgba(78,203,222,.15)', '0 0 70px rgba(78,203,222,.34)', '0 0 35px rgba(78,203,222,.15)'] }}
          transition={reduceMotion ? undefined : { duration: STORY_TIMING.microLoopSeconds, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-sc-cyan/50 bg-[#10214E]/95 text-center shadow-[0_0_44px_rgba(78,203,222,.2)] sm:h-36 sm:w-36"
        >
          <Network className="h-7 w-7 text-sc-cyan" />
           <span className="mt-2 max-w-24 text-xs font-black leading-4 text-white">{t('Smart Context Engine')}</span>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-2">
          {['people', 'projects', 'suppliers', 'decisions'].map((label, index) => (
            <motion.span
              key={label}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : STORY_TIMING.revealSeconds, delay: reduceMotion ? 0 : STORY_TIMING.auditDelaySeconds + index * STORY_TIMING.itemStaggerSeconds }}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-white/65"
            >
               {t(label)}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

const agentCards = [
  { title: 'Intake Agent', description: 'Reads every email and attachment.', icon: Mail, color: '#4ECBDE', motionType: 'read' },
  { title: 'Data to Decide', description: 'Builds evidence for the pursue decision.', icon: Check, color: '#78D8B5', motionType: 'decide' },
  { title: 'Deep Research Agent', description: 'Finds precedent when internal knowledge is not enough.', icon: Search, color: '#8EC9F2', motionType: 'research' },
  { title: 'Quotation Analysis', description: 'Checks every offer against your history.', icon: PackageCheck, color: '#F3BD72', motionType: 'compare' },
  { title: 'Context Engine', description: 'Keeps one context across systems and teams.', icon: Workflow, color: '#C4AEFF', motionType: 'connect' },
];

function AgentMicroAnimation({ type, color, reduceMotion }: { type: string; color: string; reduceMotion: boolean }) {
  const loop = reduceMotion ? undefined : { duration: STORY_TIMING.microLoopSeconds, repeat: Infinity, ease: 'easeInOut' as const };
  if (type === 'compare') {
    return <div className="mt-4 flex h-8 items-end gap-1.5">{[12, 22, 16, 28, 20, 25].map((height, index) => <motion.span key={index} animate={reduceMotion ? undefined : { height: [height, height + 7, height] }} transition={loop ? { ...loop, delay: index * 0.08 } : undefined} className="w-2 rounded-t-sm" style={{ height, backgroundColor: color, opacity: 0.5 + index * 0.07 }} />)}</div>;
  }
  if (type === 'research') {
    return <div className="mt-4 flex h-8 items-center gap-2"><motion.span animate={reduceMotion ? undefined : { rotate: 360 }} transition={reduceMotion ? undefined : { duration: STORY_TIMING.microLoopSeconds, repeat: Infinity, ease: 'linear' }} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20"><Search className="h-3.5 w-3.5" style={{ color }} /></motion.span><span className="h-px flex-1 bg-white/15" /></div>;
  }
  return (
    <div className="mt-4 flex h-8 items-center gap-2">
      <motion.span animate={reduceMotion ? undefined : { width: type === 'read' ? [12, 38, 22] : [16, 30, 20], opacity: [0.45, 1, 0.45] }} transition={loop} className="h-1.5 rounded-full" style={{ backgroundColor: color }} />
      <motion.span animate={reduceMotion ? undefined : { scale: [0.75, 1, 0.75] }} transition={loop} className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="h-px flex-1 bg-white/15" />
    </div>
  );
}

function AgentsVisual({ presentation, reduceMotion }: { presentation: boolean; reduceMotion: boolean }) {
  const { t } = useLocale();
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {agentCards.map(({ title, description, icon: Icon, color, motionType }, index) => (
        <motion.article
          key={title}
          initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
          whileInView={presentation ? undefined : { opacity: 1, y: 0, scale: 1 }}
          animate={presentation ? { opacity: 1, y: 0, scale: 1 } : undefined}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : STORY_TIMING.revealSeconds, delay: reduceMotion ? 0 : index * STORY_TIMING.itemStaggerSeconds }}
          className="rounded-2xl border border-white/12 bg-white/[0.055] p-4 shadow-[0_20px_50px_rgba(0,0,0,.16)] backdrop-blur-xl"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5" style={{ color }}><Icon className="h-5 w-5" /></span>
            <div><h3 className="text-sm font-black text-white">{t(title)}</h3><p className="mt-1 text-xs leading-5 text-white/55">{t(description)}</p></div>
          </div>
          <AgentMicroAnimation type={motionType} color={color} reduceMotion={reduceMotion} />
        </motion.article>
      ))}
    </div>
  );
}

function GovernanceVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const { t, isArabic } = useLocale();
  const typedLine = t('Clause 14 requires approval above $100,000');
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-white/12 bg-white/[0.055] p-5 backdrop-blur-xl">
         <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/55"><SlidersHorizontal className="h-4 w-4 text-sc-cyan" /> {t('Permissions')}</div>
        <div className="mt-5 space-y-3">
          {['Read supplier history', 'Draft customer email', 'Send without approval'].map((label, index) => (
            <div key={label} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-sc-navy/55 px-3 py-3">
               <span className="text-xs font-bold text-white/75">{t(label)}</span>
              <motion.span
                animate={reduceMotion ? undefined : { backgroundColor: index === 2 ? ['#C9772C', '#7B8797', '#C9772C'] : ['#22896E', '#3BC29A', '#22896E'] }}
                transition={reduceMotion ? undefined : { duration: STORY_TIMING.microLoopSeconds, repeat: Infinity, delay: index * STORY_TIMING.itemStaggerSeconds }}
                className="relative h-5 w-9 shrink-0 rounded-full"
              >
                 <motion.span animate={reduceMotion ? undefined : { x: index === 2 ? (isArabic ? [-17, -1, -17] : [17, 1, 17]) : (isArabic ? [-17, -17, -17] : [17, 17, 17]) }} transition={reduceMotion ? undefined : { duration: STORY_TIMING.microLoopSeconds, repeat: Infinity, delay: index * STORY_TIMING.itemStaggerSeconds }} className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow ${isArabic ? 'right-0.5' : 'left-0.5'}`} />
              </motion.span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-3">
        <div className="rounded-2xl border border-white/12 bg-white/[0.055] p-5 backdrop-blur-xl">
           <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/55"><ShieldCheck className="h-4 w-4 text-sc-green" /> {t('Approval gate')}</div>
          <div className="mt-4 flex items-center gap-3">
            <motion.span initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: STORY_TIMING.springStiffness, damping: STORY_TIMING.springDamping }} className="flex h-10 w-10 items-center justify-center rounded-full bg-sc-green/15 text-sc-green"><Check className="h-5 w-5" /></motion.span>
             <div><div className="text-xs font-black text-white">{t('Human review required')}</div><div className="mt-1 text-[11px] text-white/50">{t('No send without approval')}</div></div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/12 bg-white/[0.055] p-5 backdrop-blur-xl">
           <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/55"><FileText className="h-4 w-4 text-sc-cyan" /> {t('Audit trail')}</div>
          <div className="mt-4 overflow-hidden whitespace-nowrap rounded-lg bg-sc-navy/65 px-3 py-2.5 font-mono text-[10px] text-sc-cyan">
            <motion.span
              initial={reduceMotion ? false : { width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : STORY_TIMING.auditTypingSeconds, ease: 'linear', delay: reduceMotion ? 0 : STORY_TIMING.auditDelaySeconds }}
              className="inline-block overflow-hidden align-bottom"
            >
              {typedLine}
            </motion.span>
          </div>
           <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-white/45"><span>{t('Maya Haddad · 09:02')}</span><span>{t('Immutable event')}</span></div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/[0.055] px-5 py-4 backdrop-blur-xl">
           <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/55"><Pause className="h-4 w-4 text-sc-amber" /> {t('Pause control')}</div>
           <div className="relative h-6 w-11 rounded-full bg-sc-green/80 p-1"><motion.span animate={reduceMotion ? undefined : { x: isArabic ? [20, 0, 20] : [0, 20, 0] }} transition={reduceMotion ? undefined : { duration: STORY_TIMING.microLoopSeconds, repeat: Infinity }} className={`block h-4 w-4 rounded-full bg-white shadow ${isArabic ? 'mr-auto' : ''}`} /></div>
        </div>
      </div>
    </div>
  );
}

function PillarsVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const { t, isArabic } = useLocale();
  const pillars = [
    { label: 'Open source', description: 'Inspect the implementation.', icon: Code2, color: '#4ECBDE' },
    { label: 'Sovereign', description: 'Your infrastructure. Your data.', icon: House, color: '#80D9B5' },
    { label: 'Built on context', description: 'Ground every decision in relationships.', icon: Network, color: '#F0B772' },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {pillars.map(({ label, description, icon: Icon, color }, index) => (
        <motion.article
          key={label}
          initial={reduceMotion ? false : { opacity: 0.45, y: 20, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0 : STORY_TIMING.revealSeconds, delay: reduceMotion ? 0 : index * STORY_TIMING.itemStaggerSeconds }}
          animate={reduceMotion ? undefined : { boxShadow: ['0 0 0 rgba(78,203,222,0)', `0 0 32px ${color}33`, '0 0 0 rgba(78,203,222,0)'] }}
          className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.055] p-6 backdrop-blur-xl"
        >
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl" style={{ backgroundColor: `${color}18` }} aria-hidden="true" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5" style={{ color }}>
            <Icon className="h-7 w-7" />
             {label === 'Sovereign' && <LockKeyhole className={`absolute -bottom-2 h-4 w-4 rounded-full bg-sc-navy p-0.5 text-white ${isArabic ? '-left-2' : '-right-2'}`} />}
          </div>
           <h3 className="relative mt-8 text-xl font-black text-white">{t(label)}</h3>
           <p className="relative mt-2 text-sm leading-6 text-white/55">{t(description)}</p>
        </motion.article>
      ))}
    </div>
  );
}

function SceneVisual({ index, presentation, reduceMotion }: { index: number; presentation: boolean; reduceMotion: boolean }) {
  if (index === 0) return <SystemsVisual presentation={presentation} reduceMotion={reduceMotion} />;
  if (index === 1) return <ContextVisual reduceMotion={reduceMotion} />;
  if (index === 2) return <AgentsVisual presentation={presentation} reduceMotion={reduceMotion} />;
  if (index === 3) return <GovernanceVisual reduceMotion={reduceMotion} />;
  if (index === 4) return <PillarsVisual reduceMotion={reduceMotion} />;
  return null;
}

export function PlatformScene({
  index,
  presentation,
  reduceMotion,
}: {
  index: number;
  presentation: boolean;
  reduceMotion: boolean;
}) {
  const { t } = useLocale();
  if (index === 5) {
    return (
      <section className="relative flex min-h-[100dvh] snap-start items-center justify-center overflow-hidden px-5 py-28 text-center sm:px-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 22 }}
          whileInView={presentation ? undefined : { opacity: 1, scale: 1, y: 0 }}
          animate={presentation ? { opacity: 1, scale: 1, y: 0 } : undefined}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduceMotion ? 0 : STORY_TIMING.revealSeconds }}
          className="relative mx-auto max-w-5xl"
        >
          <motion.div
            animate={reduceMotion ? undefined : { opacity: [0.22, 0.55, 0.22], scale: [0.9, 1.08, 0.9] }}
            transition={reduceMotion ? undefined : { duration: STORY_TIMING.closingGlowSeconds, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sc-cyan/15 blur-[100px]"
            aria-hidden="true"
          />
          <div className="relative">
            <div className="mb-8 flex justify-center"><BrandLogo variant="wordmark" invert className="h-11" testId="link-platform-end-brand-home" /></div>
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-sc-cyan/35 bg-sc-cyan/10 text-sc-cyan"><Sparkles className="h-6 w-6" /></div>
             <div className="text-xs font-black uppercase tracking-[0.2em] text-sc-cyan">{t('Smart Context')}</div>
            <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
               {t('Your enterprise already has the knowledge.')}
               <span className="mt-2 block text-white/60">{t('Now your agents have the context to use it.')}</span>
            </h1>
             <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">{t('Connected systems. Grounded decisions. Agent actions under your control.')}</p>
            <Link href="/context-graph" data-testid="link-platform-rfq-cta" className="mt-10 inline-flex items-center rounded-xl bg-sc-cyan px-6 py-4 text-sm font-black text-sc-navy shadow-[0_12px_36px_rgba(78,203,222,.19)] transition-transform hover:-translate-y-0.5">
               {t('See it on a real RFQ')} <ArrowRight className="ml-2 h-4 w-4 rtl-flip-icon" />
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  const meta = sceneMeta[index];
  return (
    <section className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1480px] snap-start items-center overflow-hidden px-5 pb-20 pt-28 sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute -right-24 top-1/4 h-[460px] w-[460px] rounded-full bg-sc-cyan/[0.07] blur-[110px]" aria-hidden="true" />
      <div className="relative grid w-full items-center gap-8 lg:grid-cols-[.68fr_1.32fr] lg:gap-14">
        <Reveal presentation={presentation} reduceMotion={reduceMotion}>
          <div className="inline-flex items-center gap-2 rounded-full border border-sc-cyan/25 bg-white/[0.045] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-sc-cyan">
             <CircleDot className="h-3.5 w-3.5" /> {t(meta.eyebrow)}
          </div>
           <h2 className="mt-5 text-4xl font-black leading-[1.02] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">{t(meta.title)}</h2>
           <p className="mt-5 max-w-xl text-sm leading-7 text-white/58 sm:text-base">{t(meta.copy)}</p>
          <div className="mt-7 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
             <span className="h-px w-8 bg-sc-cyan/70" /> {t('Sovereign context layer')}
          </div>
        </Reveal>
        <Reveal presentation={presentation} reduceMotion={reduceMotion} delay={0.12}>
          <SceneVisual index={index} presentation={presentation} reduceMotion={reduceMotion} />
        </Reveal>
      </div>
    </section>
  );
}
