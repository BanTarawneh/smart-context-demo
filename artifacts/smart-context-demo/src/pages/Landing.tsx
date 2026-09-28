import { ArrowRight, Check, CircleDot, GitBranch, Github, Network, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { BrandLogo } from '../components/BrandLogo';

const previewNodes = [
  { label: 'SAP', x: 48, y: 72, tone: 'bg-sc-blue' },
  { label: 'CRM', x: 72, y: 152, tone: 'bg-sc-green' },
  { label: 'Email', x: 54, y: 246, tone: 'bg-sc-amber' },
  { label: 'Contracts', x: 145, y: 316, tone: 'bg-sc-navy' },
  { label: 'RFQ', x: 270, y: 178, tone: 'bg-sc-cyan' },
  { label: 'Suppliers', x: 426, y: 86, tone: 'bg-sc-blue' },
  { label: 'Margin', x: 468, y: 252, tone: 'bg-sc-green' },
];

const previewLines = [
  [48, 72, 270, 178],
  [72, 152, 270, 178],
  [54, 246, 270, 178],
  [145, 316, 270, 178],
  [270, 178, 426, 86],
  [270, 178, 468, 252],
];

const pillars = [
  {
    title: 'Open source',
    description: 'Inspect every line. No black boxes, no lock-in.',
    icon: GitBranch,
    accent: 'text-sc-blue',
  },
  {
    title: 'Sovereign',
    description: 'Runs in your infrastructure. Your data never leaves.',
    icon: ShieldCheck,
    accent: 'text-sc-green',
  },
  {
    title: 'Built on context',
    description: 'Agents grounded in your ERP, CRM, email and contracts, not just raw tables.',
    icon: Network,
    accent: 'text-sc-amber',
  },
];

const steps = [
  ['01', 'Connect systems', 'Bring the operational truth together without moving ownership.'],
  ['02', 'Build the context graph', 'Resolve people, projects, suppliers and commercial facts into a living model.'],
  ['03', 'Govern agents', 'Set boundaries, approval gates and a clear audit trail for every action.'],
  ['04', 'Deploy workflows', 'Turn grounded decisions into work your procurement team can trust.'],
];

export function Landing() {
  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-sc-paper text-sc-navy">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-sc-navy/95 text-white backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" data-testid="link-brand-home" className="rounded-md focus:outline-none focus:ring-2 focus:ring-sc-cyan">
            <BrandLogo variant="wordmark" invert className="h-8" />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-bold text-white/65 md:flex" aria-label="Main navigation">
            <a href="#platform" data-testid="link-platform" className="transition-colors hover:text-white">Platform</a>
            <a href="#how-it-works" data-testid="link-how-it-works" className="transition-colors hover:text-white">How it works</a>
            <a href="#governance" data-testid="link-governance" className="transition-colors hover:text-white">Governance</a>
            <a href="#open-source" data-testid="link-github" className="transition-colors hover:text-white">GitHub</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="#open-source" data-testid="link-view-github" className="hidden rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-black text-white transition-colors hover:border-white/40 hover:bg-white/10 sm:inline-flex">
              <Github className="mr-2 h-4 w-4" /> View on GitHub
            </a>
            <Link href="/context-graph" data-testid="link-start-demo" className="inline-flex items-center rounded-lg bg-sc-cyan px-3 py-2 text-sm font-black text-sc-navy transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white sm:px-4">
              Start the demo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section id="platform" className="relative overflow-hidden border-b border-white/10 bg-sc-navy text-white">
          <div className="absolute -right-32 top-4 h-[500px] w-[500px] rounded-full bg-sc-cyan/10 blur-3xl" aria-hidden="true" />
          <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-16 lg:grid-cols-[1.02fr_.98fr] lg:px-8 lg:py-24">
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sc-cyan/30 bg-white/5 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-sc-cyan">
                <CircleDot className="h-3.5 w-3.5 text-sc-cyan" /> The sovereign context layer
              </div>
              <h1 data-testid="text-landing-headline" className="max-w-3xl text-5xl font-black leading-[.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[76px]">
                The context layer for enterprise agents.
              </h1>
              <p data-testid="text-landing-subhead" className="mt-7 max-w-2xl text-lg leading-8 text-white/65 sm:text-xl">
                Open-source, sovereign AI that connects your systems into one living context graph, so agents reason on how your business actually works.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/context-graph" data-testid="link-hero-demo" className="inline-flex items-center rounded-lg bg-sc-cyan px-5 py-3 text-sm font-black text-sc-navy shadow-[0_8px_20px_rgba(78,203,222,.16)] transition-transform hover:-translate-y-0.5">
                  See the context graph <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <a href="#open-source" data-testid="link-hero-open-source" className="inline-flex items-center rounded-lg px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white/10">
                  <Github className="mr-2 h-4 w-4" /> Open-source by design
                </a>
              </div>
              <div className="mt-10 flex items-center gap-3 text-xs font-bold text-white/55">
                <span className="flex items-center gap-1.5 font-mono text-[10px] font-black text-sc-blue">
                  <span className="h-1.5 w-1.5 rounded-full bg-sc-blue" /><span className="h-px w-5 bg-sc-line" /><span className="h-1.5 w-1.5 rounded-full bg-sc-cyan" /><span className="h-px w-5 bg-sc-line" /><span className="h-1.5 w-1.5 rounded-full bg-sc-green" />
                </span>
                Designed for operators who need to know why
              </div>
            </div>

            <div data-testid="graph-preview" className="relative min-h-[390px] overflow-hidden rounded-2xl border border-sc-line bg-white p-5 shadow-[0_24px_70px_rgba(11,20,55,.12)]">
              <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(rgba(227,234,243,.65) 1px, transparent 1px), linear-gradient(90deg, rgba(227,234,243,.65) 1px, transparent 1px)', backgroundSize: '32px 32px' }} aria-hidden="true" />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-sc-muted">Live context graph</div>
                  <div data-testid="text-preview-status" className="mt-1 flex items-center gap-2 text-sm font-black"><span className="h-2 w-2 rounded-full bg-sc-green" /> RFQ decision context</div>
                </div>
                <div className="rounded-md bg-sc-paper px-2 py-1 font-mono text-[10px] font-bold text-sc-muted">47 entities · 112 links</div>
              </div>
              <svg viewBox="0 0 520 360" className="relative z-10 mt-6 h-[300px] w-full overflow-visible" role="img" aria-label="Animated preview of systems resolving into an RFQ context graph">
                {previewLines.map(([x1, y1, x2, y2], index) => (
                  <line key={`${x1}-${y1}-${index}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#B9C9D9" strokeWidth="1.5" strokeDasharray="5 6" className="motion-safe:animate-pulse" style={{ animationDelay: `${index * 240}ms` }} />
                ))}
                {previewNodes.map((node, index) => (
                  <g key={node.label} transform={`translate(${node.x}, ${node.y})`} className="motion-safe:animate-pulse" style={{ animationDelay: `${index * 180}ms` }}>
                    <circle r={node.label === 'RFQ' ? 27 : 19} fill="white" stroke={node.label === 'RFQ' ? '#4ECBDE' : '#E3EAF3'} strokeWidth={node.label === 'RFQ' ? 4 : 2} />
                    <circle r={node.label === 'RFQ' ? 7 : 5} fill={node.tone === 'bg-sc-blue' ? '#1C77BE' : node.tone === 'bg-sc-green' ? '#2E9B75' : node.tone === 'bg-sc-amber' ? '#C9772C' : node.tone === 'bg-sc-cyan' ? '#4ECBDE' : '#0B1437'} />
                    <text y="36" textAnchor="middle" fill="#5A6B85" fontSize="11" fontWeight="700">{node.label}</text>
                  </g>
                ))}
              </svg>
              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between border-t border-sc-line pt-3 text-[11px] font-bold text-sc-muted">
                <span>Every fact has a source.</span><span className="text-sc-green">Synced just now</span>
              </div>
            </div>
          </div>
        </section>

        <section id="open-source" className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-sc-blue">A better substrate</div>
              <h2 className="mt-3 max-w-md text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">Your agents are only as grounded as their context.</h2>
              <p className="mt-5 max-w-md leading-7 text-sc-muted">Raw tables tell an agent what exists. A context graph tells it what matters, what changed, and what it is allowed to do next.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {pillars.map((pillar) => (
                <article key={pillar.title} data-testid={`card-pillar-${pillar.title.toLowerCase().replaceAll(' ', '-')}`} className="rounded-xl border border-sc-line bg-white p-6 shadow-[0_10px_30px_rgba(11,20,55,.05)]">
                  <pillar.icon className={`h-7 w-7 ${pillar.accent}`} />
                  <h3 className="mt-8 text-xl font-black">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-sc-muted">{pillar.description}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-14 grid gap-5 rounded-2xl border border-sc-line bg-sc-navy p-5 text-white sm:p-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-white/50">Raw tables</div>
              <div className="mt-4 space-y-2 font-mono text-xs text-white/70">
                <div className="rounded bg-white/5 px-3 py-2">supplier_id · quote_total</div>
                <div className="rounded bg-white/5 px-3 py-2">project_id · delivery_date</div>
                <div className="rounded bg-white/5 px-3 py-2">contract_id · clause_14</div>
              </div>
            </div>
            <div className="flex items-center justify-center py-3 text-sc-cyan"><ArrowRight className="h-7 w-7 md:rotate-0 rotate-90" /></div>
            <div className="rounded-xl border border-sc-cyan/40 bg-sc-cyan/10 p-6">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-sc-cyan">Graph-grounded agent</div>
              <div className="mt-4 space-y-2 text-sm font-bold text-white">
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-sc-cyan" /> “Supplier A delivered this pump twice.”</div>
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-sc-cyan" /> “Clause 14 requires approval above $100k.”</div>
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-sc-cyan" /> “Maya owns this decision.”</div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-sc-line bg-white">
          <div className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-24">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div><div className="text-xs font-black uppercase tracking-[0.18em] text-sc-blue">The operating loop</div><h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">From scattered systems to a decision.</h2></div>
              <p className="max-w-sm text-sm leading-6 text-sc-muted">A clear path from connection to governed action, with no hidden hand-offs.</p>
            </div>
            <div className="mt-14 grid gap-0 border-l border-sc-line md:grid-cols-4 md:border-l-0 md:border-t">
              {steps.map(([number, title, description], index) => (
                <div key={number} data-testid={`step-${number}`} className="relative border-b border-sc-line py-6 pl-6 md:border-b-0 md:border-r md:pl-5 md:pr-6 md:pt-8">
                  <span className={`absolute -left-[9px] top-6 h-4 w-4 rounded-full border-4 border-white ${index === 1 ? 'bg-sc-cyan' : 'bg-sc-blue'} md:-top-[9px] md:left-5`} />
                  <div className="font-mono text-xs font-bold text-sc-blue">{number}</div>
                  <h3 className="mt-5 text-lg font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-sc-muted">{description}</p>
                </div>
              ))}
            </div>
            <div id="governance" className="mt-16 grid items-center gap-8 rounded-2xl bg-sc-paper p-6 sm:p-10 md:grid-cols-[1fr_auto]">
              <div><div className="flex items-center gap-2 text-sm font-black text-sc-green"><ShieldCheck className="h-5 w-5" /> Governance is part of the graph</div><p className="mt-3 max-w-2xl text-2xl font-black leading-tight">Know what an agent saw, why it reasoned, and who approved the final action.</p></div>
              <Link href="/agents" data-testid="link-governance-center" className="inline-flex items-center justify-center rounded-lg border border-sc-navy px-4 py-3 text-sm font-black transition-colors hover:bg-sc-navy hover:text-white">Explore agent controls <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div><div className="text-xs font-black uppercase tracking-[0.18em] text-sc-amber">Connect what already works</div><h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Context begins where your teams do.</h2><p className="mt-5 max-w-md leading-7 text-sc-muted">No rip-and-replace project. Start with the systems behind one decision, then expand the graph as trust grows.</p></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {['SAP ERP', 'Salesforce CRM', 'Microsoft 365 Email', 'Contracts Drive'].map((source, index) => (
                <div key={source} data-testid={`chip-integration-${index}`} className="flex min-h-28 flex-col justify-between rounded-xl border border-sc-line bg-white p-4 shadow-[0_8px_24px_rgba(11,20,55,.05)]">
                  <span className={`h-2.5 w-2.5 rounded-full ${index === 0 ? 'bg-sc-blue' : index === 1 ? 'bg-sc-green' : index === 2 ? 'bg-sc-amber' : 'bg-sc-navy'}`} />
                  <span className="text-sm font-black leading-5">{source}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-sc-navy px-5 py-16 text-white lg:px-8 lg:py-20">
          <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div><div className="flex items-center gap-2 text-sm font-black text-sc-cyan"><Sparkles className="h-4 w-4" /> One decision, fully grounded</div><h2 className="mt-3 max-w-2xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">See it on a real RFQ.</h2><p className="mt-4 max-w-xl text-white/65">Follow a live procurement decision from source systems through supplier outreach and approval.</p></div>
            <Link href="/context-graph" data-testid="link-rfq-cta" className="inline-flex shrink-0 items-center rounded-lg bg-sc-cyan px-5 py-3 text-sm font-black text-sc-navy transition-transform hover:-translate-y-0.5">See it on a real RFQ <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-sc-navy px-5 py-7 text-white/60 lg:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-4 text-xs font-bold sm:flex-row sm:items-center">
          <BrandLogo variant="wordmark" invert className="h-7" />
          <span>Context for decisions that carry weight.</span>
        </div>
      </footer>
    </div>
  );
}