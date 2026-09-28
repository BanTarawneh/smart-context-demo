import { BarChart3, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';
import { useLocale } from '../i18n/LocaleProvider';

export function Overview() {
  const { t } = useLocale();
  return (
    <div className="h-full overflow-y-auto">
       <div className="max-w-6xl mx-auto py-4">
           <h1 className="text-2xl font-black text-sc-navy tracking-tight mb-6">{t('Dashboard')}</h1>
           
           <div className="grid grid-cols-4 gap-6 mb-8">
              <StatCard title="Active Opportunities" value="24" icon={TrendingUp} trend="+3 this week" />
              
              <Link href="/inbox" className="block p-6 bg-white border border-sc-line rounded-xl shadow-[0_5px_15px_rgba(11,20,55,0.04)] relative overflow-hidden hover:border-sc-cyan transition-colors text-left group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-sc-cyan/10 flex items-center justify-center text-sc-cyan">
                     <AlertCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-sc-navy tabular-nums mb-1">12</div>
                <div className="text-xs font-bold text-sc-muted uppercase tracking-wider">{t('New RFQs in Queue')}</div>
                <div className="text-xs font-bold text-sc-blue mt-3 group-hover:translate-x-1 transition-transform inline-block">{t('Action required →')}</div>
              </Link>
              
              <StatCard title="Decisions Pending" value="5" icon={Clock} trend="Awaiting approval" />
              <StatCard title="Context Coverage" value="98%" icon={BarChart3} trend="Last 30 days" />
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border border-sc-line rounded-xl shadow-[0_5px_15px_rgba(11,20,55,0.04)] p-6">
                 <h2 className="text-sm font-black text-sc-navy uppercase tracking-widest mb-6">{t('Recent Activity')}</h2>
                 <div className="space-y-6">
                    <ActivityItem time="09:02 AM" title="Northgate Water Authority" desc="New RFQ received — Industrial Pump Package" active />
                    <ActivityItem time="08:44 AM" title="Levant Power" desc="RFQ Extracted — 33KV Switchgear Breakers" />
                    <ActivityItem time="Yesterday" title="Desert Mining Co." desc="Quote generated and sent to supplier" />
                 </div>
              </div>
              <div className="bg-white border border-sc-line rounded-xl shadow-[0_5px_15px_rgba(11,20,55,0.04)] p-6">
                 <h2 className="text-sm font-black text-sc-navy uppercase tracking-widest mb-6">{t('Action Recommendations')}</h2>
                 <div className="space-y-4">
                    <div className="p-5 bg-[#effbfc] border border-sc-cyan/30 rounded-lg">
                       <div className="font-bold text-sc-navy mb-1 text-base">{t('Northgate Pump Package')}</div>
                       <div className="text-sm text-[#43536c] mb-4 font-medium">{t('Context engine recommends pursuing based on historical margin and 14 past orders.')}</div>
                       <Link href="/rfq/northgate/intelligence" className="inline-block text-xs font-bold text-sc-blue bg-white px-4 py-2 rounded-md border border-sc-blue/20 hover:bg-sc-blue/5 transition-colors shadow-sm">{t('Review Evidence')}</Link>
                    </div>
                 </div>
              </div>
           </div>
       </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, trend }: any) {
  const { t } = useLocale();
  return (
    <div className="p-6 bg-white border border-sc-line rounded-xl shadow-[0_5px_15px_rgba(11,20,55,0.04)]">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-lg bg-sc-desk flex items-center justify-center text-sc-muted">
           <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-black text-sc-navy tabular-nums mb-1">{value}</div>
      <div className="text-xs font-bold text-sc-muted uppercase tracking-wider">{t(title)}</div>
      <div className="text-xs font-bold text-[#8a99ab] mt-3">{t(trend)}</div>
    </div>
  )
}

function ActivityItem({ time, title, desc, active }: any) {
  const { t } = useLocale();
  return (
    <div className="flex gap-4">
       <div className="w-16 text-xs font-bold text-sc-muted text-right flex-shrink-0 pt-0.5 tabular-nums">{t(time)}</div>
       <div className="relative flex-1 pb-2">
          <div className={`absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full ${active ? 'bg-sc-cyan shadow-[0_0_0_4px_rgba(78,203,222,0.2)]' : 'bg-[#c9d1dc]'}`}></div>
          {active && <div className="absolute -left-[23px] top-5 bottom-[-16px] w-[2px] bg-sc-line"></div>}
          {!active && <div className="absolute -left-[23px] top-5 bottom-[-16px] w-[2px] bg-sc-line"></div>}
          <div className="font-bold text-sm text-sc-navy">{t(title)}</div>
          <div className="text-sm text-sc-muted mt-0.5 font-medium">{t(desc)}</div>
       </div>
    </div>
  )
}
