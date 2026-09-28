import { CheckCircle2, FileText } from 'lucide-react';
import { useState } from 'react';
import { useLocale } from '../../i18n/LocaleProvider';

export function Quotations() {
  const { t, isArabic } = useLocale();
  const [selectedQuote, setSelectedQuote] = useState('Supplier A');

  const quoteDetails = {
    'Supplier A': {
      price: '$184,000',
      summary: 'Centrifugal pump package · 11 weeks · DDP Aqaba',
      facts: [
        { label: 'Previous price', value: '$169,000' },
        { label: 'Historical margin', value: '19.2%' },
        { label: 'Previous orders', value: '14' },
        { label: 'On-time delivery', value: '94%', good: true },
        { label: 'Incidents', value: '0', good: true },
        { label: 'Agreement', value: 'Active', good: true },
      ],
    },
    'Supplier B': {
      price: '$176,000',
      summary: 'Centrifugal pump package · 15 weeks · DDP Aqaba',
      facts: [
        { label: 'Previous price', value: '$163,500' },
        { label: 'Relationship', value: 'Agency agreement', good: true },
        { label: 'Previous orders', value: '9' },
        { label: 'On-time delivery', value: '82%' },
        { label: 'Delivery history', value: 'Previous delay' },
        { label: 'Agreement', value: 'Active', good: true },
      ],
    },
    'Supplier D': {
      price: '$168,000',
      summary: 'Centrifugal pump package · 13 weeks · DDP Aqaba',
      facts: [
        { label: 'Source', value: 'External research' },
        { label: 'Authorization', value: 'Distributor', good: true },
        { label: 'Certification', value: 'IEC certified', good: true },
        { label: 'Compatibility', value: '11 kV spec', good: true },
        { label: 'Previous orders', value: 'New' },
        { label: 'Internal history', value: 'None' },
      ],
    },
  } as const;

  const selectedDetails = quoteDetails[selectedQuote as keyof typeof quoteDetails];

  return (
    <div className="w-full flex h-full">
        <div className={`w-[340px] ${isArabic ? 'border-l' : 'border-r'} border-sc-line bg-white flex flex-col flex-shrink-0`}>
          <div className="p-6 border-b border-sc-line bg-[#fbfdff]">
              <div className="text-[10px] font-black text-sc-muted uppercase tracking-widest mb-1">{t('Incoming Quotations')}</div>
              <div className="text-sm font-bold text-sc-navy">{t('Industrial Pump Package')}</div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f6f9fc]">
             {['Supplier A', 'Supplier B', 'Supplier D'].map((s) => (
               <div 
                 key={s} 
                 onClick={() => setSelectedQuote(s)}
                 className={`p-4 rounded-xl border cursor-pointer transition-all shadow-sm ${selectedQuote === s ? 'bg-[#effbfc] border-sc-cyan' : 'bg-white border-sc-line hover:border-sc-blue'}`}
               >
                 <div className="flex justify-between items-start mb-2">
                    <span className="font-black text-sm text-sc-navy">{t(s)}</span>
                    <span className="bg-[#e3f4ee] text-sc-green text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider">{t('Detected')}</span>
                 </div>
                 <div className="text-[11px] text-sc-muted font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> {t('Quotation received · 3 files')}
                 </div>
               </div>
             ))}
          </div>
       </div>
       <div className="flex-1 p-10 bg-sc-paper overflow-y-auto">
           <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white border border-sc-line rounded-xl p-8 shadow-[0_8px_24px_rgba(11,20,55,0.04)]">
                  <div className="text-[10px] font-black text-sc-muted uppercase tracking-widest mb-4">{t('Current Offer ·')} {t(selectedQuote)}</div>
                 <div className="text-[44px] font-black text-sc-navy tabular-nums leading-none tracking-tight">{selectedDetails.price}</div>
                  <div className="text-sm text-sc-muted mt-4 font-bold bg-sc-desk/30 inline-block px-3 py-1.5 rounded">{t(selectedDetails.summary)}</div>
             </div>

              <div>
                  <div className="text-[11px] font-black text-sc-navy uppercase tracking-widest mb-5">{t('What we already know about')} {t(selectedQuote)}</div>
                 <div className="grid grid-cols-3 gap-4">
                   {selectedDetails.facts.map(f => (
                     <div key={f.label} className={`bg-white border border-sc-line rounded-xl p-5 border-t-[3px] shadow-[0_2px_8px_rgba(11,20,55,0.02)] ${'good' in f && f.good ? 'border-t-sc-green' : 'border-t-sc-blue'}`}>
                         <div className="text-[10px] font-black text-sc-muted uppercase tracking-wider">{t(f.label)}</div>
                         <div className="text-xl font-black text-sc-navy mt-2 tabular-nums">{t(f.value)}</div>
                     </div>
                   ))}
                 </div>
             </div>
           </div>
       </div>
    </div>
  )
}
