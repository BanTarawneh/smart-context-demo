import { Database, Check, Server, FileBox, CloudCog, Shield } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { useLocale } from '../i18n/LocaleProvider';

export function Sources() {
  const { t, formatNumber } = useLocale();
  const sources = [
    { name: 'SAP ERP', status: 'Connected', sync: 'Just now', icon: Server, color: 'text-[#0a6ed1]' },
    { name: 'Salesforce CRM', status: 'Connected', sync: '2 mins ago', icon: CloudCog, color: 'text-[#6b4fbb]' },
    { name: 'Microsoft 365 Email', status: 'Connected', sync: 'Live', icon: FileBox, color: 'text-[#0f5ca8]' },
    { name: 'Contracts Drive', status: 'Connected', sync: '1 hour ago', icon: Database, color: 'text-sc-amber' },
  ];

  return (
    <div className="h-full overflow-y-auto pb-10">
       <div className="max-w-6xl mx-auto py-4">
           <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-2xl font-black text-sc-navy tracking-tight">{t('Context Sources')}</h1>
                <p className="text-sm font-bold text-sc-muted mt-2">{t('Enterprise integrations powering the Context Engine.')}</p>
              </div>
              <button className="px-5 py-2.5 bg-white border border-sc-line text-sc-navy shadow-sm rounded-lg font-black text-sm hover:border-sc-blue transition-colors">{t('Add Integration')}</button>
           </div>

           <div className="grid grid-cols-4 gap-6 mb-10">
              {sources.map(s => (
                <div key={s.name} className="p-6 bg-white border border-sc-line rounded-xl shadow-[0_5px_15px_rgba(11,20,55,0.04)]">
                   <div className="flex items-center justify-between mb-5">
                     <div className="w-10 h-10 rounded-lg bg-sc-desk/50 flex items-center justify-center">
                        <s.icon className={`w-5 h-5 ${s.color}`} />
                     </div>
                     <div className="flex items-center gap-1.5 text-[10px] font-black text-sc-green bg-sc-green/10 px-2 py-1 rounded uppercase tracking-wider">
                       <Check className="w-3 h-3" /> {t(s.status)}
                     </div>
                   </div>
                   <div className="font-black text-sc-navy text-lg">{t(s.name)}</div>
                   <div className="text-[11px] font-bold text-sc-muted uppercase tracking-widest mt-2">{t('Last sync:')} <span className="font-black">{t(s.sync)}</span></div>
                </div>
              ))}
           </div>

           <div className="bg-sc-navy border border-sc-navy rounded-xl shadow-lg overflow-hidden text-white relative">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sc-cyan/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-3">
                      <BrandLogo variant="mark" className="h-8 w-8" testId="link-sources-engine-home" />
                    <h2 className="font-black text-lg">{t('Context Engine Health')}</h2>
                 </div>
                 <div className="flex items-center gap-2 text-xs font-black text-sc-cyan bg-sc-cyan/10 px-3 py-1.5 rounded-full uppercase tracking-wider border border-sc-cyan/20">
                    <Shield className="w-3.5 h-3.5" /> {t('SOC2 Compliant · Data never trains public models')}
                 </div>
              </div>
               <div className="p-8 relative z-10 flex items-center justify-between gap-12">
                 <div className="space-y-8 max-w-3xl">
                    <div>
                       <div className="flex justify-between text-sm font-bold mb-3">
                           <span className="text-white">{t('Supplier Records (CRM + SAP)')}</span>
                           <span className="text-sc-cyan font-black tabular-nums tracking-wide">{t('12,450 records indexed').replace('12,450', formatNumber(12450))}</span>
                       </div>
                       <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-sc-cyan w-[100%]"></div>
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between text-sm font-bold mb-3">
                           <span className="text-white">{t('Past Deal Outcomes (Contracts + SAP)')}</span>
                           <span className="text-[#a8e6cf] font-black tabular-nums tracking-wide">{t('98% coverage').replace('98', formatNumber(98))}</span>
                       </div>
                       <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[#a8e6cf] w-[98%]"></div>
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between text-sm font-bold mb-3">
                           <span className="text-white">{t('Live Quotations (Email)')}</span>
                           <span className="text-[#ffd3b6] font-black tracking-wide">{t('Processing normally')}</span>
                       </div>
                       <div className="h-2 bg-white/10 rounded-full overflow-hidden flex">
                          <div className="h-full bg-[#ffd3b6] w-[100%] animate-pulse"></div>
                       </div>
                    </div>
                  </div>
                  <div className="hidden xl:flex w-[250px] min-h-[210px] flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
                      <BrandLogo variant="full" className="w-full" testId="link-sources-full-home" linkClassName="h-full w-full items-center justify-center" />
                  </div>
              </div>
           </div>
       </div>
    </div>
  )
}
