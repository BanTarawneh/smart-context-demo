import { ArrowRight, Building2, ChevronRight, CircleHelp, Cog, Database, ExternalLink, FileText, Filter, FolderOpen, GitBranch, History, Link2, Mail, MapPin, Package, RefreshCw, ShieldCheck, Truck, UserRound, Users, X, type LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';

type GraphNode = {
  id: string;
  label: string;
  group: 'source' | 'entity' | 'person';
  icon: LucideIcon;
  x: number;
  y: number;
  detail: string;
  synced: string;
  facts: string[];
};

type GraphEdge = { from: string; to: string; label: string };

const nodes: GraphNode[] = [
  { id: 'sap', label: 'SAP', group: 'source', icon: Database, x: 90, y: 98, detail: 'ERP source system', synced: '28 Sep 2026, 09:02 AM', facts: ['17 similar opportunities', '11 won opportunities', 'Historical margin: 18.4%'] },
  { id: 'salesforce', label: 'Salesforce', group: 'source', icon: Users, x: 90, y: 208, detail: 'CRM source system', synced: '28 Sep 2026, 08:44 AM', facts: ['Northgate account owner: Maya Haddad', '17 similar opportunities'] },
  { id: 'm365', label: 'M365 Email', group: 'source', icon: Mail, x: 90, y: 318, detail: 'Mailbox source system', synced: '28 Sep 2026, 09:02 AM', facts: ['8 messages linked to this RFQ', 'Latest thread: supplier outreach'] },
  { id: 'contracts', label: 'Contracts Drive', group: 'source', icon: FolderOpen, x: 90, y: 428, detail: 'Contract repository', synced: '28 Sep 2026, 08:44 AM', facts: ['Clause 14: approval above $100,000', '3 related contract clauses'] },
  { id: 'client', label: 'Northgate Water Authority', group: 'entity', icon: Building2, x: 350, y: 86, detail: 'Client account', synced: '28 Sep 2026, 08:44 AM', facts: ['17 similar opportunities', '11 won', '18.4% historical margin'] },
  { id: 'rfq', label: 'Industrial Pump Package RFQ', group: 'entity', icon: FileText, x: 350, y: 250, detail: 'Active procurement request', synced: '28 Sep 2026, 09:02 AM', facts: ['Budget band: $100,000–$250,000', 'Due date: 30 September 2026', 'Decision owner: Maya Haddad'] },
  { id: 'pumps', label: 'centrifugal pumps', group: 'entity', icon: Package, x: 630, y: 78, detail: 'Requested equipment', synced: '28 Sep 2026, 09:02 AM', facts: ['Quantity: 4', 'Specification: 350 m³/h'] },
  { id: 'motors', label: 'motors', group: 'entity', icon: Cog, x: 630, y: 170, detail: 'Requested equipment', synced: '28 Sep 2026, 09:02 AM', facts: ['Quantity: 4', 'Efficiency class: IE4'] },
  { id: 'panel', label: '11 kV control panel', group: 'entity', icon: Cog, x: 630, y: 262, detail: 'Requested equipment', synced: '28 Sep 2026, 09:02 AM', facts: ['Quantity: 1', 'Delivery requirement: 14 weeks'] },
  { id: 'suppliers', label: 'Suppliers A / B / D', group: 'entity', icon: Truck, x: 630, y: 365, detail: 'Candidate supplier set', synced: '28 Sep 2026, 09:02 AM', facts: ['Supplier A: 14 orders', '94% on time', '0 incidents'] },
  { id: 'quotes', label: 'past quotations', group: 'entity', icon: History, x: 630, y: 465, detail: 'Commercial evidence', synced: '28 Sep 2026, 08:44 AM', facts: ['6 comparable quotations', 'Median variance: 4.8%'] },
  { id: 'projects', label: 'past projects', group: 'entity', icon: History, x: 350, y: 455, detail: 'Comparable Northgate work', synced: '28 Sep 2026, 08:44 AM', facts: ['17 similar opportunities', '11 won', '18.4% historical margin'] },
  { id: 'contract', label: 'Active supply contract', group: 'entity', icon: FileText, x: 350, y: 570, detail: 'Commercial terms', synced: '28 Sep 2026, 08:44 AM', facts: ['Clause 14: approval above $100,000', 'Active supplier agreement'] },
  { id: 'maya', label: 'Maya Haddad', group: 'person', icon: UserRound, x: 350, y: 355, detail: 'Procurement decision owner', synced: '28 Sep 2026, 09:02 AM', facts: ['Approval authority: $250,000', 'Team: Strategic procurement'] },
];

const edges: GraphEdge[] = [
  { from: 'sap', to: 'client', label: 'synced from' },
  { from: 'salesforce', to: 'client', label: 'synced from' },
  { from: 'm365', to: 'rfq', label: 'synced from' },
  { from: 'contracts', to: 'contract', label: 'synced from' },
  { from: 'contract', to: 'rfq', label: 'governed by' },
  { from: 'client', to: 'rfq', label: 'requested' },
  { from: 'client', to: 'projects', label: 'requested' },
  { from: 'rfq', to: 'pumps', label: 'requested' },
  { from: 'rfq', to: 'motors', label: 'requested' },
  { from: 'rfq', to: 'panel', label: 'requested' },
  { from: 'rfq', to: 'suppliers', label: 'quoted' },
  { from: 'rfq', to: 'quotes', label: 'quoted' },
  { from: 'rfq', to: 'maya', label: 'owned by' },
  { from: 'suppliers', to: 'quotes', label: 'supplied' },
  { from: 'rfq', to: 'maya', label: 'governed by' },
  { from: 'projects', to: 'suppliers', label: 'supplied' },
  { from: 'projects', to: 'quotes', label: 'quoted' },
];

const tracePath = ['rfq', 'client', 'projects', 'suppliers', 'quotes'];
const traceLabels = ['Industrial Pump Package RFQ', 'Northgate Water Authority', 'past projects', 'Suppliers A / B / D', 'past quotations'];

function nodeRadius(node: GraphNode) {
  return node.group === 'source' ? 25 : node.group === 'person' ? 22 : 29;
}

export function ContextGraph() {
  const [selectedId, setSelectedId] = useState(() => {
    const requestedId = new URLSearchParams(window.location.search).get('node');
    return nodes.some((node) => node.id === requestedId) ? requestedId! : 'rfq';
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tracing, setTracing] = useState(false);
  const [traceStep, setTraceStep] = useState(0);
  const selectedNode = nodes.find((node) => node.id === selectedId) ?? nodes[0];
  const relatedIds = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    const related = new Set([hoveredId]);
    edges.forEach((edge) => {
      if (edge.from === hoveredId) related.add(edge.to);
      if (edge.to === hoveredId) related.add(edge.from);
    });
    return related;
  }, [hoveredId]);

  useEffect(() => {
    if (!tracing || traceStep >= tracePath.length - 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => {
      const nextStep = traceStep + 1;
      setTraceStep(nextStep);
      setSelectedId(tracePath[nextStep]);
    }, 1300);
    return () => window.clearTimeout(timer);
  }, [tracing, traceStep]);

  const activateTrace = () => {
    setTracing(true);
    setTraceStep(0);
    setSelectedId(tracePath[0]);
  };

  return (
    <div className="h-full overflow-y-auto bg-sc-desk p-3 text-sc-navy sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-sc-blue"><GitBranch className="h-4 w-4" /> Context graph / How everything in your enterprise connects</div>
            <h1 data-testid="text-context-graph-title" className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Everything this decision knows.</h1>
            <p className="mt-2 max-w-2xl text-sm text-sc-muted">Trace the facts behind the Industrial Pump Package RFQ across systems, entities and ownership.</p>
          </div>
          <Link href="/inbox" data-testid="link-watch-agents" className="inline-flex items-center self-start rounded-lg bg-sc-navy px-4 py-2.5 text-sm font-black text-white transition-transform hover:-translate-y-0.5 md:self-auto">Next: Watch the agents work <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {([
            { id: 'text-entity-count', value: '47', label: 'Entities', icon: Database },
            { id: 'text-relationship-count', value: '112', label: 'Relationships', icon: Link2 },
            { id: 'text-source-count', value: '4', label: 'Connected sources', icon: RefreshCw },
            { id: 'text-freshness', value: '09:02', label: 'Last synced · 28 Sep', icon: ShieldCheck },
          ] satisfies { id: string; value: string; label: string; icon: LucideIcon }[]).map(({ id, value, label, icon: Icon }) => (
            <div key={id} className="rounded-xl border border-sc-line bg-white px-4 py-3 shadow-[0_6px_18px_rgba(11,20,55,.04)]">
              <div className="flex items-center justify-between"><span data-testid={id} className="text-2xl font-black">{value}</span><Icon className="h-4 w-4 text-sc-blue" /></div>
              <div className="mt-1 text-[11px] font-black uppercase tracking-widest text-sc-muted">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid min-h-[600px] overflow-hidden rounded-xl border border-sc-line bg-white shadow-[0_12px_34px_rgba(11,20,55,.08)] lg:grid-cols-[minmax(0,1fr)_310px] xl:min-h-[700px]">
          <section className="min-w-0 border-b border-sc-line p-4 lg:border-b-0 lg:border-r lg:p-6">
            <div className="flex flex-col gap-4 border-b border-sc-line pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-black text-sc-muted" aria-label="Graph legend">
              <span data-testid="legend-source" className="flex items-center gap-2"><Database className="h-3.5 w-3.5 text-sc-blue" /> Source</span>
              <span data-testid="legend-entity" className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-sc-cyan" /> Entity</span>
              <span data-testid="legend-person" className="flex items-center gap-2"><UserRound className="h-3.5 w-3.5 text-sc-amber" /> Owner</span>
                <span data-testid="legend-edge" className="flex items-center gap-2"><span className="h-px w-5 bg-sc-muted" /> Relationship</span>
              </div>
              <button type="button" onClick={activateTrace} data-testid="button-trace-rfq" className="inline-flex items-center justify-center rounded-md border border-sc-blue px-3 py-2 text-xs font-black text-sc-blue transition-colors hover:bg-sc-blue hover:text-white"><MapPin className="mr-2 h-3.5 w-3.5" /> Trace this RFQ</button>
            </div>
            <div className="relative mt-4 overflow-auto rounded-lg border border-sc-line bg-sc-paper/60">
              <svg viewBox="0 0 760 650" className="h-auto min-h-[500px] min-w-[760px] w-full xl:min-h-[650px]" role="img" aria-label="Interactive context graph showing sources, entities and relationships">
                <defs>
                  <marker id="graph-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#AEBCCC" /></marker>
                  <marker id="trace-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#1C77BE" /></marker>
                </defs>
                <text x="44" y="32" fontSize="10" fontWeight="800" fill="#5A6B85" letterSpacing="1.8">SYSTEMS</text>
                <text x="304" y="32" fontSize="10" fontWeight="800" fill="#5A6B85" letterSpacing="1.8">BUSINESS CONTEXT</text>
                <text x="586" y="32" fontSize="10" fontWeight="800" fill="#5A6B85" letterSpacing="1.8">EVIDENCE</text>
                {edges.map((edge, index) => {
                  const from = nodes.find((node) => node.id === edge.from)!;
                  const to = nodes.find((node) => node.id === edge.to)!;
                  const isTrace = tracing && tracePath.includes(edge.from) && tracePath.includes(edge.to) && Math.abs(tracePath.indexOf(edge.from) - tracePath.indexOf(edge.to)) === 1;
                  const dimmed = hoveredId !== null && !relatedIds.has(edge.from) && !relatedIds.has(edge.to);
                  return <g key={`${edge.from}-${edge.to}-${edge.label}-${index}`} className="transition-opacity" opacity={dimmed ? 0.12 : isTrace ? 1 : 0.7}>
                    <line className="sc-graph-edge-line" style={{ animationDelay: `${90 + index * 10}ms` }} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={isTrace ? '#1C77BE' : '#B9C9D9'} strokeWidth={isTrace ? 3 : 1.4} markerEnd={`url(#${isTrace ? 'trace-arrow' : 'graph-arrow'})`} />
                    <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 5} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={isTrace ? '#1C77BE' : '#7A8AA0'}>{edge.label}</text>
                  </g>;
                })}
                {nodes.filter((node) => node.group === 'source').map((node, index) => {
                  const active = node.id === selectedId || (tracing && node.id === tracePath[traceStep]);
                  const dimmed = hoveredId !== null && !relatedIds.has(node.id);
                  const Icon = node.icon;
                  return <g key={node.id} transform={`translate(${node.x} ${node.y})`} role="button" tabIndex={0} aria-label={`Select ${node.label}`} onClick={() => { setSelectedId(node.id); setTracing(false); }} onMouseEnter={() => setHoveredId(node.id)} onMouseLeave={() => setHoveredId(null)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedId(node.id); setTracing(false); } }} opacity={dimmed ? 0.22 : 1} className="cursor-pointer transition-opacity sc-graph-node-source" style={{ animationDelay: `${index * 25}ms` }}>
                    <circle r={nodeRadius(node) + (active ? 5 : 0)} fill={active ? '#D9F7FA' : '#EAF2FA'} stroke={active ? '#1C77BE' : '#B9D0E5'} strokeWidth={active ? 2.5 : 1.5} />
                    <Icon x={-8} y={-8} width={16} height={16} className="text-sc-blue" aria-hidden="true" />
                    <text y="41" textAnchor="middle" fill="#0B1437" fontSize="11" fontWeight="800">{node.label}</text>
                  </g>;
                })}
                {nodes.filter((node) => node.group !== 'source').map((node, index) => {
                  const active = node.id === selectedId || (tracing && node.id === tracePath[traceStep]);
                  const dimmed = hoveredId !== null && !relatedIds.has(node.id);
                  const fill = node.group === 'person' ? '#FFF0DF' : '#D9F7FA';
                  const stroke = node.group === 'person' ? '#C9772C' : '#4ECBDE';
                  const Icon = node.icon;
                  return <g key={node.id} transform={`translate(${node.x} ${node.y})`} role="button" tabIndex={0} aria-label={`Select ${node.label}`} onClick={() => { setSelectedId(node.id); setTracing(false); }} onMouseEnter={() => setHoveredId(node.id)} onMouseLeave={() => setHoveredId(null)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedId(node.id); setTracing(false); } }} opacity={dimmed ? 0.22 : 1} className={`cursor-pointer transition-opacity ${node.group === 'person' ? 'sc-graph-node-person' : 'sc-graph-node-entity'}`} style={{ animationDelay: `${60 + index * 20}ms` }}>
                    <circle r={nodeRadius(node) + (active ? 5 : 0)} fill={active ? '#BDEEF2' : fill} stroke={active ? '#1C77BE' : stroke} strokeWidth={active ? 3 : 1.7} />
                    <Icon x={-8} y={-8} width={16} height={16} className={node.group === 'person' ? 'text-sc-amber' : 'text-sc-blue'} aria-hidden="true" />
                    <text y={node.id === 'client' ? 46 : 42} textAnchor="middle" fill="#0B1437" fontSize="11" fontWeight="800">{node.label}</text>
                  </g>;
                })}
              </svg>
            </div>
            {tracing && <div data-testid="trace-panel" className="mt-4 flex flex-col gap-3 rounded-lg border border-sc-blue/30 bg-sc-blue/5 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div><div className="text-[10px] font-black uppercase tracking-widest text-sc-blue">Current path step {traceStep + 1} of {tracePath.length}</div><div data-testid="text-trace-current-step" className="mt-1 text-sm font-black">{traceLabels[traceStep]}</div></div>
              <button type="button" onClick={() => { const next = (traceStep + 1) % tracePath.length; setTraceStep(next); setSelectedId(tracePath[next]); }} data-testid="button-trace-next" className="inline-flex items-center rounded-md bg-sc-blue px-3 py-2 text-xs font-black text-white">Next path step <ChevronRight className="ml-1 h-4 w-4" /></button>
            </div>}
          </section>

          <aside className="bg-sc-paper/55 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div><div className="text-[10px] font-black uppercase tracking-[0.18em] text-sc-muted">Selected node</div><h2 data-testid="text-selected-node" className="mt-2 text-2xl font-black leading-tight">{selectedNode.label}</h2><p className="mt-1 text-sm font-bold text-sc-blue">{selectedNode.detail}</p></div>
              <button type="button" onClick={() => setSelectedId('rfq')} data-testid="button-reset-selection" aria-label="Reset selection" className="rounded-md p-1.5 text-sc-muted transition-colors hover:bg-white hover:text-sc-navy"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-6 rounded-lg border border-sc-line bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-black text-sc-green"><RefreshCw className="h-3.5 w-3.5" /> Last synced</div>
              <div data-testid="text-selected-sync" className="mt-1 text-sm font-bold">{selectedNode.synced}</div>
            </div>
            <div className="mt-5"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-sc-muted"><CircleHelp className="h-3.5 w-3.5" /> Related facts</div><ul className="mt-3 space-y-2">{selectedNode.facts.map((fact) => <li key={fact} data-testid={`fact-${selectedNode.id}-${fact.slice(0, 10).replaceAll(' ', '-')}`} className="flex gap-2 text-sm leading-5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sc-cyan" />{fact}</li>)}</ul></div>
            <div className="mt-6 border-t border-sc-line pt-5"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-sc-muted"><Link2 className="h-3.5 w-3.5" /> Provenance</div><p className="mt-2 text-sm leading-6 text-sc-muted">Every relationship is retained with the source record and sync timestamp.</p><Link href="/sources" data-testid="link-open-sources" className="mt-3 inline-flex items-center text-sm font-black text-sc-blue">Open source records <ExternalLink className="ml-1.5 h-3.5 w-3.5" /></Link></div>
            <div className="mt-8 rounded-lg border border-sc-line bg-white p-3 text-xs text-sc-muted"><div className="flex items-center gap-2 font-black text-sc-navy"><Filter className="h-3.5 w-3.5" /> Hover to isolate context</div><p className="mt-1 leading-5">Hover a node to highlight its immediate neighbors. Click for a traceable fact set.</p></div>
          </aside>
        </div>
      </div>
    </div>
  );
}