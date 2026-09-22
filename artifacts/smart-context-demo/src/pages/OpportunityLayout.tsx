import { Link } from 'wouter';
import { Workspace } from './rfq/Workspace';
import { Intelligence } from './rfq/Intelligence';
import { Suppliers } from './rfq/Suppliers';
import { Quotations } from './rfq/Quotations';
import { Comparison } from './rfq/Comparison';
import { Decision } from './rfq/Decision';
import { Building2, Sparkles, Users, FileText, BarChart2, CheckCircle } from 'lucide-react';

const tabs = [
  { id: 'workspace', label: 'Workspace', icon: Building2 },
  { id: 'intelligence', label: 'Intelligence', icon: Sparkles },
  { id: 'suppliers', label: 'Suppliers', icon: Users },
  { id: 'quotations', label: 'Quotations', icon: FileText },
  { id: 'comparison', label: 'Comparison', icon: BarChart2 },
  { id: 'decision', label: 'Decision', icon: CheckCircle },
];

export function OpportunityLayout({ params }: { params?: { tab?: string } }) {
  const requestedTab = params?.tab || 'workspace';
  const tab = tabs.some((item) => item.id === requestedTab)
    ? requestedTab
    : requestedTab === 'compare'
      ? 'comparison'
      : 'workspace';

  return (
    <div className="flex flex-col h-full space-y-5">
      <div className="flex items-center justify-between flex-shrink-0 mt-2 px-2">
        <div>
          <h1 className="text-2xl font-black text-sc-navy tracking-tight">Northgate Industrial Pump Package</h1>
          <p className="text-sc-muted font-bold text-xs uppercase tracking-widest mt-1">RFQ · Northgate Water Authority</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-sc-line pb-px px-2 flex-shrink-0 overflow-x-auto">
        {tabs.map(t => (
          <Link key={t.id} href={`/rfq/northgate/${t.id}`} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? 'border-sc-blue text-sc-blue' : 'border-transparent text-sc-muted hover:text-sc-navy hover:border-sc-line'}`}>
            <t.icon className="w-4 h-4" />
            {t.label}
          </Link>
        ))}
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-[0_10px_30px_rgba(11,20,55,0.08)] border border-sc-line overflow-hidden flex relative">
        {tab === 'workspace' && <Workspace />}
        {tab === 'intelligence' && <Intelligence />}
        {tab === 'suppliers' && <Suppliers />}
        {tab === 'quotations' && <Quotations />}
        {tab === 'comparison' && <Comparison />}
        {tab === 'decision' && <Decision />}
      </div>
    </div>
  );
}
