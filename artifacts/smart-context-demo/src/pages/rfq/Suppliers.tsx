import { useDemo } from '../../DemoContext';
import { Search, Globe, Building } from 'lucide-react';
import { useLocale } from '../../i18n/LocaleProvider';

export function Suppliers() {
  const { rfqsGenerated, setRfqsGenerated } = useDemo();
  const { t, isArabic } = useLocale();
  
  return (
    <div className="w-full flex h-full">
      <div className={`flex-1 p-10 ${isArabic ? 'border-l' : 'border-r'} border-sc-line overflow-y-auto bg-white`}>
          <div className="flex items-center gap-3 mb-8">
             <div className="w-8 h-8 rounded-lg bg-sc-blue/10 flex items-center justify-center text-sc-blue">
                <Building className="w-4 h-4" />
             </div>
              <h3 className="text-sm font-black text-sc-navy uppercase tracking-widest">{t('Internal Context')}</h3>
          </div>
          
          <div className="space-y-4">
              <SupplierCard name={t('Supplier A')} desc={t('14 previous orders · 94% on-time delivery')} />
              <SupplierCard name={t('Supplier B')} desc={t('Existing agency agreement · Previous price available')} />
              <SupplierCard name={t('Supplier C')} desc={t('8 previous orders · 87% on-time delivery')} />
          </div>
       </div>
       <div className="flex-1 p-10 bg-sc-paper overflow-y-auto relative">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-8 h-8 rounded-lg bg-sc-amber/15 flex items-center justify-center text-sc-amber">
                <Globe className="w-4 h-4" />
             </div>
              <h3 className="text-sm font-black text-sc-amber uppercase tracking-widest">{t('External Research')}</h3>
          </div>
          
          <div className="mb-6 p-5 bg-white border border-sc-line border-l-4 border-l-sc-amber shadow-sm rounded-lg">
              <div className="font-black text-sc-navy text-[10px] uppercase tracking-widest mb-2 text-sc-amber">{t('Insufficient Internal Context')}</div>
              <div className="font-black text-sc-navy text-lg">{t('Item 3 · 11 kV control panel')}</div>
              <div className="text-sm text-sc-muted mt-1 font-bold">{t('No purchase history · no supplier on record')}</div>
          </div>

          <div className="flex justify-center my-6 text-sc-cyan">
             <Search className="w-6 h-6 animate-pulse" />
          </div>

          <div className="space-y-4 relative z-10">
              <SupplierCard name={t('Supplier D')} desc={t('Authorized distributor · IEC certified · Compatible with 11 kV spec')} external />
          </div>

          <div className="mt-12 bg-white border border-sc-line p-8 rounded-xl shadow-[0_10px_30px_rgba(11,20,55,0.06)] relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sc-cyan to-sc-blue"></div>
              <h4 className="font-black text-sc-navy mb-3 text-lg">{t('Generate Request for Quotations')}</h4>
              <p className="text-sm text-sc-muted mb-6 font-bold leading-relaxed">{t('Agent recommends soliciting quotes from')} <strong className="text-sc-navy">{t('Suppliers A, B, and D')}</strong> {t('based on context and technical requirements.')}</p>
             <button 
               onClick={() => setRfqsGenerated(true)}
               className={`w-full py-3 rounded-lg font-black text-sm transition-all shadow-sm flex justify-center gap-2 ${rfqsGenerated ? 'bg-sc-green text-white hover:bg-sc-green/90' : 'bg-sc-blue text-white hover:bg-sc-blue/90 hover:-translate-y-px'}`}
             >
                {rfqsGenerated ? t('RFQs Generated ✓') : t('Generate RFQs')}
             </button>
          </div>
       </div>
    </div>
  )
}

function SupplierCard({ name, desc, external }: any) {
  const { t } = useLocale();
  return (
    <div className={`p-5 rounded-xl bg-white flex items-start justify-between ${external ? 'border-2 border-[#bde5d3] border-l-4 border-l-sc-green shadow-sm' : 'border border-sc-line shadow-[0_2px_8px_rgba(11,20,55,0.02)]'}`}>
       <div>
          <div className="font-black text-base text-sc-navy flex items-center gap-3">
            {external && <span className="text-sc-green"><Check className="w-5 h-5"/></span>}
            {name}
             {external && <span className="px-2 py-0.5 rounded bg-[#eee9fa] text-[#6b4fbb] text-[9px] uppercase tracking-wider font-black">{t('External Research')}</span>}
          </div>
          <div className={`text-xs mt-2 font-bold ${external ? 'text-[#43536c]' : 'text-sc-muted'}`}>{desc}</div>
       </div>
    </div>
  )
}

import { Check } from 'lucide-react';
