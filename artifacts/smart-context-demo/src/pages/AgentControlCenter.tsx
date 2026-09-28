import { AlertTriangle, Check, ChevronDown, ChevronRight, Download, Edit3, FileText, Lock, Pause, Play, Search, Send, SlidersHorizontal, X } from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';
import { Link } from 'wouter';

type Agent = { id: string; name: string; description: string; status: 'Active' | 'Paused'; autonomy: string; action: string; time: string };
type Approval = { id: string; title: string; agent: string; draft: string; reasoning: string; sources: string[]; status: 'Pending' | 'Approved' | 'Rejected' };

const initialAgents: Agent[] = [
  { id: 'intake', name: 'Intake', description: 'Extracts incoming requests and normalizes requirements.', status: 'Active', autonomy: 'Suggest only', action: 'Extracted 12 requirements from Northgate email thread', time: '2 min ago' },
  { id: 'research', name: 'Deep Research', description: 'Finds precedent, supplier history and contract constraints.', status: 'Active', autonomy: 'Act with approval', action: 'Found 6 comparable quotations', time: '4 min ago' },
  { id: 'quotation', name: 'Quotation Analysis', description: 'Compares commercial responses against grounded history.', status: 'Active', autonomy: 'Act with approval', action: 'Ranked Suppliers A, B and D', time: '8 min ago' },
  { id: 'context', name: 'Context Engine', description: 'Maintains entity resolution and relationship provenance.', status: 'Active', autonomy: 'Autonomous', action: 'Synced 4 source systems', time: '11 min ago' },
];

const initialApproval: Approval = {
  id: 'send-rfqs',
  title: 'Send RFQs to Suppliers A, B, D',
  agent: 'Deep Research',
  draft: 'Please provide your best commercial and technical quotation for the Industrial Pump Package RFQ. Responses are requested by 28 May 2025.',
  reasoning: 'The context graph identifies Suppliers A, B and D as verified candidates with relevant pump package history. Supplier A has 14 prior orders, 94% on-time delivery and 0 incidents. The request is within the approved sourcing workflow.',
  sources: ['Northgate Water Authority · SAP', 'Supplier history · SAP', 'Industrial Pump Package RFQ · M365 Email'],
  status: 'Pending',
};

const auditRows = [
  { id: 'a1', timestamp: '28 Sep 2026 · 09:02', agent: 'Context Engine', action: 'Resolved RFQ owner', system: 'Salesforce', data: 'Northgate Water Authority · Maya Haddad', outcome: 'Verified', approved: 'System policy', graphNode: 'client' },
  { id: 'a2', timestamp: '28 Sep 2026 · 08:44', agent: 'Deep Research', action: 'Read supplier history', system: 'SAP', data: '14 orders · on-time delivery · incidents', outcome: 'Evidence attached', approved: 'Maya Haddad', graphNode: 'suppliers' },
  { id: 'a3', timestamp: '28 Sep 2026 · 08:35', agent: 'Intake', action: 'Extracted requirements', system: 'M365 Email', data: '12 RFQ requirements · due date', outcome: 'Draft created', approved: 'Maya Haddad', graphNode: 'rfq' },
  { id: 'a4', timestamp: '28 Sep 2026 · 08:28', agent: 'Context Engine', action: 'Synced contract clause', system: 'Contracts Drive', data: 'Clause 14 · approval threshold', outcome: 'Policy linked', approved: 'System policy', graphNode: 'contracts' },
  { id: 'a5', timestamp: '28 Sep 2026 · 08:20', agent: 'Quotation Analysis', action: 'Compared past quotations', system: 'SAP', data: '6 comparable quotations · margin history', outcome: 'Recommendation ready', approved: 'Pending review', graphNode: 'quotes' },
];

const permissionAgents = ['Intake', 'Deep Research', 'Quotation Analysis', 'Context Engine'];
const permissionSystems = ['SAP', 'Salesforce', 'Email', 'Contracts Drive'];
const permissionDefaults: Record<string, string> = {
  'Intake-Email': 'Read',
  'Intake-Contracts Drive': 'Read',
  'Quotation Analysis-SAP': 'Read',
};
const levels = ['No access', 'Read', 'Draft only', 'Write'];

function formatNow() {
  return '28 Sep 2026 · 09:02';
}

export function AgentControlCenter() {
  const [tab, setTab] = useState('Agents');
  const [agents, setAgents] = useState(initialAgents);
  const [autonomy, setAutonomy] = useState<Record<string, string>>({});
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [pausedAt, setPausedAt] = useState('');
  const [permissions, setPermissions] = useState<Record<string, string>>(permissionDefaults);
  const [guardrails, setGuardrails] = useState([true, true, true]);
  const [approval, setApproval] = useState(initialApproval);
  const [editingApproval, setEditingApproval] = useState(false);
  const [draft, setDraft] = useState(initialApproval.draft);
  const [expandedAudit, setExpandedAudit] = useState<string | null>(null);
  const [agentFilter, setAgentFilter] = useState('All agents');
  const [systemFilter, setSystemFilter] = useState('All systems');
  const [dateFilter, setDateFilter] = useState('28 Sep 2026');
  const [search, setSearch] = useState('');

  const updateAgent = (id: string, updates: Partial<Agent>) => setAgents((current) => current.map((agent) => agent.id === id ? { ...agent, ...updates } : agent));
  const pauseAll = () => {
    setAgents((current) => current.map((agent) => ({ ...agent, status: 'Paused' })));
    setPausedAt(formatNow());
    setShowPauseDialog(false);
  };
  const visibleAudit = useMemo(() => auditRows.filter((row) => {
    const matchesAgent = agentFilter === 'All agents' || row.agent === agentFilter;
    const matchesSystem = systemFilter === 'All systems' || row.system === systemFilter;
    const matchesDate = dateFilter === 'All dates' || row.timestamp.includes(dateFilter);
    const haystack = `${row.agent} ${row.action} ${row.system} ${row.data} ${row.outcome}`.toLowerCase();
    return matchesAgent && matchesSystem && matchesDate && haystack.includes(search.toLowerCase());
  }), [agentFilter, systemFilter, dateFilter, search]);

  const exportLog = () => {
    const header = 'timestamp,agent,action,system,data accessed,outcome,approved by';
    const rows = visibleAudit.map((row) => [row.timestamp, row.agent, row.action, row.system, row.data, row.outcome, row.approved].map((value) => `"${value.replaceAll('"', '""')}"`).join(','));
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smart-context-audit-log.csv';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="min-h-full overflow-y-auto bg-sc-desk p-3 text-sc-navy sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1420px]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-sc-blue"><SlidersHorizontal className="h-4 w-4" /> Agent control / You decide what agents can do</div><h1 data-testid="text-agent-center-title" className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Control center</h1><p className="mt-2 text-sm text-sc-muted">Set boundaries for agent action, then see the evidence behind every decision.</p></div>
          <div className="flex items-center gap-2"><span data-testid="status-agent-system" className="flex items-center gap-2 rounded-full border border-sc-green/25 bg-sc-green/10 px-3 py-2 text-xs font-black text-sc-green"><span className="h-2 w-2 rounded-full bg-sc-green" /> {agents.filter((agent) => agent.status === 'Active').length} agents active</span><button type="button" onClick={() => setShowPauseDialog(true)} data-testid="button-pause-all" className="inline-flex items-center rounded-lg border border-sc-line bg-white px-3 py-2 text-xs font-black text-sc-navy transition-colors hover:border-sc-red hover:text-sc-red"><Pause className="mr-2 h-3.5 w-3.5" /> Pause all</button></div>
        </div>

        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-sc-line" role="tablist" aria-label="Agent control center sections">
          {['Agents', 'Permissions', 'Approvals', 'Audit Trail'].map((item) => <button type="button" role="tab" aria-selected={tab === item} key={item} onClick={() => setTab(item)} data-testid={`tab-${item.toLowerCase().replace(' ', '-')}`} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-black transition-colors ${tab === item ? 'border-sc-blue text-sc-blue' : 'border-transparent text-sc-muted hover:text-sc-navy'}`}>{item}</button>)}
        </div>

        {tab === 'Agents' && <section className="mt-5">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-xl font-black">Agents</h2><p className="text-sm text-sc-muted">Autonomy can be changed without redeploying a workflow.</p></div>{pausedAt && <div data-testid="status-paused-by" className="rounded-lg border border-sc-amber/25 bg-sc-amber/10 px-3 py-2 text-xs font-bold text-sc-amber">Paused by Maya Haddad · {pausedAt}</div>}</div>
          <div className="grid gap-4 xl:grid-cols-2">
            {agents.map((agent) => <article key={agent.id} data-testid={`card-agent-${agent.id}`} className="rounded-xl border border-sc-line bg-white p-5 shadow-[0_8px_24px_rgba(11,20,55,.05)]">
              <div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${agent.status === 'Active' ? 'bg-sc-green' : 'bg-sc-amber'}`} /><h3 className="text-lg font-black">{agent.name}</h3></div><p className="mt-2 max-w-md text-sm leading-5 text-sc-muted">{agent.description}</p></div><span data-testid={`status-agent-${agent.id}`} className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${agent.status === 'Active' ? 'bg-sc-green/10 text-sc-green' : 'bg-sc-amber/10 text-sc-amber'}`}>{agent.status}</span></div>
              <div className="mt-5 grid gap-3 border-t border-sc-line pt-4 sm:grid-cols-[1fr_1fr]"><label className="text-xs font-black text-sc-muted">Autonomy<select value={autonomy[agent.id] ?? agent.autonomy} onChange={(event) => setAutonomy((current) => ({ ...current, [agent.id]: event.target.value }))} data-testid={`select-autonomy-${agent.id}`} className="mt-1.5 block w-full rounded-md border border-sc-line bg-sc-paper px-2.5 py-2 text-xs font-bold text-sc-navy outline-none focus:border-sc-blue"><option>Suggest only</option><option>Act with approval</option><option>Autonomous</option></select></label><div className="text-xs font-black text-sc-muted">Last action<div data-testid={`text-last-action-${agent.id}`} className="mt-1.5 text-xs font-bold leading-5 text-sc-navy">{agent.action}<span className="ml-1 font-normal text-sc-muted">· {agent.time}</span></div></div></div>
              <button type="button" onClick={() => updateAgent(agent.id, { status: agent.status === 'Active' ? 'Paused' : 'Active' })} data-testid={`button-${agent.status === 'Active' ? 'pause' : 'resume'}-${agent.id}`} className={`mt-5 inline-flex items-center text-xs font-black ${agent.status === 'Active' ? 'text-sc-amber' : 'text-sc-green'}`}>{agent.status === 'Active' ? <Pause className="mr-1.5 h-3.5 w-3.5" /> : <Play className="mr-1.5 h-3.5 w-3.5" />}{agent.status === 'Active' ? 'Pause agent' : 'Resume agent'}</button>
            </article>)}
          </div>
        </section>}

        {tab === 'Permissions' && <section className="mt-5">
          <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="text-xl font-black">Permissions</h2><p className="text-sm text-sc-muted">Least privilege by default. Email can never be sent without approval.</p></div><div className="hidden items-center gap-2 text-xs font-bold text-sc-muted sm:flex"><Lock className="h-3.5 w-3.5" /> Changes apply to the next action</div></div>
          <div className="overflow-x-auto rounded-xl border border-sc-line bg-white shadow-[0_8px_24px_rgba(11,20,55,.05)]"><table className="w-full min-w-[720px] text-left"><thead className="bg-sc-paper text-[10px] font-black uppercase tracking-widest text-sc-muted"><tr><th className="px-5 py-4">Agent</th>{permissionSystems.map((system) => <th key={system} className="px-4 py-4">{system}</th>)}</tr></thead><tbody>{permissionAgents.map((agent) => <tr key={agent} className="border-t border-sc-line"><td className="px-5 py-4"><div className="text-sm font-black">{agent}</div><div className="text-xs text-sc-muted">{agent === 'Intake' ? 'Inbound requirements' : agent === 'Deep Research' ? 'Evidence gathering' : agent === 'Quotation Analysis' ? 'Commercial review' : 'Entity resolution'}</div></td>{permissionSystems.map((system) => { const key = `${agent}-${system}`; return <td key={system} className="px-4 py-4"><select value={permissions[key] ?? 'No access'} onChange={(event) => setPermissions((current) => ({ ...current, [key]: event.target.value }))} data-testid={`select-permission-${agent.toLowerCase().replaceAll(' ', '-')}-${system.toLowerCase().replaceAll(' ', '-')}`} className={`rounded-md border px-2 py-2 text-xs font-bold outline-none focus:border-sc-blue ${permissions[key] === 'Write' && system === 'Email' ? 'border-sc-amber/50 bg-sc-amber/10 text-sc-amber' : 'border-sc-line bg-sc-paper text-sc-navy'}`}><option>No access</option><option>Read</option><option>Draft only</option><option>Write</option></select></td>; })}</tr>)}</tbody></table></div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">{['Any RFQ over $100,000 requires human approval', 'New suppliers require verification before contact', 'Agents can never delete records'].map((rule, index) => <label key={rule} className="flex cursor-pointer items-start gap-3 rounded-lg border border-sc-line bg-white p-4"><input type="checkbox" checked={guardrails[index]} onChange={(event) => setGuardrails((current) => current.map((value, i) => i === index ? event.target.checked : value))} data-testid={`checkbox-guardrail-${index + 1}`} className="mt-0.5 h-4 w-4 accent-sc-blue" /><span><span className="block text-sm font-black">{rule}</span><span className="mt-1 block text-xs leading-5 text-sc-muted">{guardrails[index] ? 'Enforced for every agent.' : 'Not enforced.'}</span></span></label>)}</div>
        </section>}

        {tab === 'Approvals' && <section className="mt-5">
          <div className="mb-4"><h2 className="text-xl font-black">Approvals</h2><p className="text-sm text-sc-muted">Human checkpoints keep consequential actions legible and reversible.</p></div>
          <div className="rounded-xl border border-sc-line bg-white shadow-[0_8px_24px_rgba(11,20,55,.05)]">{approval.status === 'Pending' ? <div className="p-5 sm:p-7"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-sc-amber"><AlertTriangle className="h-4 w-4" /> Pending approval</div><h3 data-testid="text-approval-title" className="mt-2 text-2xl font-black">{approval.title}</h3><p className="mt-1 text-sm text-sc-muted">Requested by {approval.agent} · Northgate Water Authority</p></div><span className="rounded-full bg-sc-amber/10 px-3 py-1 text-xs font-black text-sc-amber">Human gate</span></div><div className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-lg border border-sc-line bg-sc-paper p-4"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-sc-muted"><Send className="h-3.5 w-3.5" /> Draft action</div>{editingApproval ? <textarea value={draft} onChange={(event) => setDraft(event.target.value)} data-testid="textarea-approval-draft" className="mt-3 min-h-28 w-full rounded-md border border-sc-blue bg-white p-3 text-sm leading-6 outline-none" /> : <p data-testid="text-approval-draft" className="mt-3 text-sm leading-6">{draft}</p>}{editingApproval && <button type="button" onClick={() => { setApproval((current) => ({ ...current, draft })); setEditingApproval(false); }} data-testid="button-save-approval-edit" className="mt-3 inline-flex items-center rounded-md bg-sc-blue px-3 py-2 text-xs font-black text-white"><Check className="mr-1.5 h-3.5 w-3.5" /> Save draft</button>}</div><div><div className="text-xs font-black uppercase tracking-widest text-sc-muted">Agent reasoning</div><p data-testid="text-approval-reasoning" className="mt-3 text-sm leading-6 text-sc-muted">{approval.reasoning}</p><div className="mt-4 space-y-2">{approval.sources.map((source) => <Link href="/context-graph" key={source} data-testid={`link-approval-source-${source.slice(0, 6)}`} className="flex items-center gap-2 text-xs font-black text-sc-blue"><FileText className="h-3.5 w-3.5" /> {source} <ChevronRight className="ml-auto h-3.5 w-3.5" /></Link>)}</div></div></div><div className="mt-7 flex flex-wrap gap-2 border-t border-sc-line pt-5"><button type="button" onClick={() => setApproval((current) => ({ ...current, status: 'Approved' }))} data-testid="button-approve-rfqs" className="inline-flex items-center rounded-md bg-sc-green px-4 py-2.5 text-sm font-black text-white"><Check className="mr-2 h-4 w-4" /> Approve</button><button type="button" onClick={() => setApproval((current) => ({ ...current, status: 'Rejected' }))} data-testid="button-reject-rfqs" className="inline-flex items-center rounded-md border border-sc-line px-4 py-2.5 text-sm font-black text-sc-red"><X className="mr-2 h-4 w-4" /> Reject</button><button type="button" onClick={() => setEditingApproval(true)} data-testid="button-edit-rfqs" className="inline-flex items-center rounded-md border border-sc-line px-4 py-2.5 text-sm font-black text-sc-navy"><Edit3 className="mr-2 h-4 w-4" /> Edit</button></div></div> : <div className="p-8 text-center"><div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${approval.status === 'Approved' ? 'bg-sc-green/10 text-sc-green' : 'bg-sc-red/10 text-sc-red'}`}>{approval.status === 'Approved' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}</div><h3 data-testid="text-approval-result" className="mt-3 text-lg font-black">RFQs {approval.status.toLowerCase()}</h3><p className="mt-1 text-sm text-sc-muted">The decision was recorded in the immutable audit trail.</p><button type="button" onClick={() => setApproval(initialApproval)} data-testid="button-reset-approval" className="mt-4 text-sm font-black text-sc-blue">Reset demo approval</button></div>}</div>
        </section>}

        {tab === 'Audit Trail' && <section className="mt-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-xl font-black">Audit trail</h2><p className="text-sm text-sc-muted">A deterministic record of what agents accessed and what happened next.</p></div><button type="button" onClick={exportLog} data-testid="button-export-log" className="inline-flex items-center self-start rounded-lg border border-sc-line bg-white px-3 py-2 text-xs font-black transition-colors hover:border-sc-navy"><Download className="mr-2 h-3.5 w-3.5" /> Export log</button></div>
          <div className="mt-5 grid gap-2 rounded-xl border border-sc-line bg-white p-3 shadow-[0_8px_24px_rgba(11,20,55,.05)] sm:grid-cols-2 lg:grid-cols-4"><label className="relative sm:col-span-2 lg:col-span-1"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-sc-muted" /><input value={search} onChange={(event) => setSearch(event.target.value)} data-testid="input-audit-search" placeholder="Search audit log" className="w-full rounded-md border border-sc-line bg-sc-paper py-2 pl-8 pr-2 text-xs font-bold outline-none focus:border-sc-blue" /></label><select value={agentFilter} onChange={(event) => setAgentFilter(event.target.value)} data-testid="select-audit-agent" className="rounded-md border border-sc-line bg-sc-paper px-2 py-2 text-xs font-bold outline-none focus:border-sc-blue"><option>All agents</option>{permissionAgents.map((agent) => <option key={agent}>{agent}</option>)}</select><select value={systemFilter} onChange={(event) => setSystemFilter(event.target.value)} data-testid="select-audit-system" className="rounded-md border border-sc-line bg-sc-paper px-2 py-2 text-xs font-bold outline-none focus:border-sc-blue"><option>All systems</option>{permissionSystems.map((system) => <option key={system}>{system}</option>)}</select><select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} data-testid="select-audit-date" className="rounded-md border border-sc-line bg-sc-paper px-2 py-2 text-xs font-bold outline-none focus:border-sc-blue"><option>28 Sep 2026</option><option>All dates</option></select></div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-sc-line bg-white shadow-[0_8px_24px_rgba(11,20,55,.05)]">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-sc-paper text-[10px] font-black uppercase tracking-widest text-sc-muted">
                <tr>
                  <th className="w-8 px-3 py-4" />
                  <th className="px-3 py-4">Timestamp</th>
                  <th className="px-3 py-4">Agent</th>
                  <th className="px-3 py-4">Action</th>
                  <th className="px-3 py-4">System</th>
                  <th className="px-3 py-4">Data accessed</th>
                  <th className="px-3 py-4">Outcome</th>
                  <th className="px-3 py-4">Approved by</th>
                </tr>
              </thead>
              <tbody>
                {visibleAudit.map((row) => (
                  <Fragment key={row.id}>
                    <tr className="border-t border-sc-line">
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => setExpandedAudit(expandedAudit === row.id ? null : row.id)}
                          data-testid={`button-expand-audit-${row.id}`}
                          aria-label={`${expandedAudit === row.id ? 'Collapse' : 'Expand'} ${row.action}`}
                          className="rounded p-1 text-sc-muted hover:bg-sc-paper hover:text-sc-navy"
                        >
                          {expandedAudit === row.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                      </td>
                      <td data-testid={`text-audit-timestamp-${row.id}`} className="px-3 py-3 text-xs font-bold text-sc-muted">{row.timestamp}</td>
                      <td className="px-3 py-3 text-xs font-black">{row.agent}</td>
                      <td className="px-3 py-3 text-xs font-bold">{row.action}</td>
                      <td className="px-3 py-3 text-xs font-bold text-sc-blue">{row.system}</td>
                      <td className="px-3 py-3 text-xs">{row.data}</td>
                      <td className="px-3 py-3 text-xs font-bold text-sc-green">{row.outcome}</td>
                      <td className="px-3 py-3 text-xs font-bold text-sc-muted">{row.approved}</td>
                    </tr>
                    {expandedAudit === row.id && (
                      <tr className="border-t border-sc-line bg-sc-paper/70">
                        <td colSpan={8} className="px-12 py-4">
                          <div data-testid={`text-audit-detail-${row.id}`} className="grid gap-3 text-xs sm:grid-cols-3">
                            <div>
                              <span className="font-black text-sc-muted">Reasoning</span>
                              <p className="mt-1 leading-5">The action was grounded in the linked Northgate RFQ context and passed the active policy checks.</p>
                            </div>
                            <div>
                              <span className="font-black text-sc-muted">Source records</span>
                              <p className="mt-1 leading-5">{row.data}</p>
                            </div>
                            <Link href={`/context-graph?node=${row.graphNode}`} data-testid={`link-audit-context-${row.id}`} className="flex items-start gap-1 font-black text-sc-blue">
                              Open matching context node <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
            {visibleAudit.length === 0 && (
              <div data-testid="empty-audit-results" className="p-10 text-center text-sm font-bold text-sc-muted">
                No audit events match these filters.
              </div>
            )}
          </div>
        </section>}

        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-sc-line pt-5 text-xs font-bold text-sc-muted sm:flex-row sm:items-center"><span>Immutable log · stored in your infrastructure.</span><Link href="/rfq/northgate/decision" data-testid="link-northgate-decision" className="inline-flex items-center font-black text-sc-blue">Open Northgate Decision <ChevronRight className="ml-1 h-4 w-4" /></Link></div>
      </div>

      {showPauseDialog && <div className="fixed inset-0 z-50 flex items-center justify-center bg-sc-navy/45 p-4" role="dialog" aria-modal="true" aria-labelledby="pause-dialog-title"><div className="w-full max-w-md rounded-xl border border-sc-line bg-white p-6 shadow-2xl"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-sc-amber/10 text-sc-amber"><AlertTriangle className="h-5 w-5" /></div><h2 id="pause-dialog-title" className="mt-4 text-xl font-black">Pause all agents?</h2><p className="mt-2 text-sm leading-6 text-sc-muted">Running work will stop at its next safe checkpoint. You can resume each agent individually from this control center.</p><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setShowPauseDialog(false)} data-testid="button-cancel-pause-all" className="rounded-md border border-sc-line px-3 py-2 text-sm font-black">Cancel</button><button type="button" onClick={pauseAll} data-testid="button-confirm-pause-all" className="rounded-md bg-sc-amber px-3 py-2 text-sm font-black text-white">Pause all agents</button></div></div></div>}
    </div>
  );
}