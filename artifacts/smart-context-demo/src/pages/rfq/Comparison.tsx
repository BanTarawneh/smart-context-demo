import { useLocale } from '../../i18n/LocaleProvider';

export function Comparison() {
  const { t } = useLocale();
  return (
    <div className="w-full p-10 overflow-y-auto bg-sc-paper">
       <div className="max-w-5xl mx-auto">
          <table className="w-full bg-white border border-sc-line rounded-xl overflow-hidden text-left shadow-[0_10px_30px_rgba(11,20,55,0.05)] border-separate border-spacing-0">
             <thead className="bg-[#fbfdff]">
               <tr>
                 <th className="p-5 border-b border-sc-line"></th>
                  <th className="p-5 border-b border-sc-line text-center font-black text-sc-navy text-sm">{t('Supplier A')}</th>
                  <th className="p-5 border-b border-sc-line text-center font-black text-sc-navy text-sm">{t('Supplier B')}</th>
                  <th className="p-5 border-b border-sc-line text-center font-black text-sc-navy text-sm">{t('Supplier D')}</th>
               </tr>
             </thead>
             <tbody className="text-sm">
               <tr>
                  <td className="p-5 border-b border-sc-line font-black text-sc-muted text-xs uppercase tracking-wider">{t('Price')}</td>
                 <td className="p-5 border-b border-sc-line text-center font-black text-sc-green tabular-nums text-base">$184K</td>
                 <td className="p-5 border-b border-sc-line text-center font-black text-sc-amber tabular-nums text-base">$176K</td>
                 <td className="p-5 border-b border-sc-line text-center font-bold text-sc-muted tabular-nums text-base">$168K</td>
               </tr>
               <tr>
                  <td className="p-5 border-b border-sc-line font-black text-sc-muted text-xs uppercase tracking-wider">{t('Lead time')}</td>
                 <td className="p-5 border-b border-sc-line text-center font-black text-sc-green">{t('11 weeks')}</td>
                 <td className="p-5 border-b border-sc-line text-center font-black text-sc-amber">{t('15 weeks')}</td>
                 <td className="p-5 border-b border-sc-line text-center font-bold text-sc-muted">{t('13 weeks')}</td>
               </tr>
               <tr className="bg-[#eaf9fb]">
                 <td className="p-5 border-b border-sc-line font-black text-sc-muted text-xs uppercase tracking-wider">
                     {t('Delivery record')}
                     <span className="ml-3 bg-[#dceff9] text-sc-blue text-[9px] font-black px-2 py-0.5 rounded tracking-wider shadow-sm">{t('FROM CONTEXT')}</span>
                 </td>
                 <td className="p-5 border-b border-sc-line text-center font-black text-sc-green">94%</td>
                 <td className="p-5 border-b border-sc-line text-center font-black text-sc-amber">82%</td>
                 <td className="p-5 border-b border-sc-line text-center font-bold text-[#8a99ab]">{t('New')}</td>
               </tr>
               <tr className="bg-[#eaf9fb]">
                 <td className="p-5 font-black text-sc-muted text-xs uppercase tracking-wider">
                     {t('History')}
                     <span className="ml-3 bg-[#dceff9] text-sc-blue text-[9px] font-black px-2 py-0.5 rounded tracking-wider shadow-sm">{t('FROM CONTEXT')}</span>
                 </td>
                  <td className="p-5 text-center font-black text-sc-navy">{t('Active agreement')}</td>
                  <td className="p-5 text-center font-black text-sc-amber">{t('Previous delay')}</td>
                  <td className="p-5 text-center font-bold text-[#8a99ab]">{t('No internal history')}</td>
               </tr>
             </tbody>
          </table>

          <div className="grid grid-cols-3 gap-5 mt-8">
             <div className="p-5 bg-white border border-sc-line border-t-[4px] border-t-sc-green shadow-sm rounded-xl text-sm font-bold text-sc-navy leading-relaxed">
                 {t('Supplier A has the strongest historical delivery performance.')}
             </div>
             <div className="p-5 bg-white border border-sc-line border-t-[4px] border-t-[#9aa8ba] shadow-sm rounded-xl text-sm font-bold text-sc-navy leading-relaxed">
                 {t('Supplier B exceeds the required 14-week delivery window.')}
             </div>
             <div className="p-5 bg-white border border-sc-line border-t-[4px] border-t-sc-amber shadow-sm rounded-xl text-sm font-bold text-sc-navy leading-relaxed">
                 {t('Supplier D has no internal performance history.')}
             </div>
          </div>
       </div>
    </div>
  )
}
