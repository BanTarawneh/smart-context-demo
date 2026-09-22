import { Search } from 'lucide-react';
import { Link } from 'wouter';

export function Inbox() {
  const mailRows = [
    ['Northgate Water Authority', 'RFQ — Industrial Pump Package', '09:02', true],
    ['Flow Group', 'FW: RFX 5500813926', '08:57', false],
    ['SCHENCK Procurement', 'Invitation to Negotiation 26-RFQ-28809-3', '08:51', false],
    ['Levant Power', 'RFQ — 33KV Switchgear Breakers', '08:44', false],
    ['Supplier: HydroTech', 'Re: Revised quotation Q-2291', '08:40', false],
    ['Harbour Logistics', 'Delivery note DN-77120', '08:31', false],
    ['Aqaba Refinery', 'RFQ — Valves and Fittings, Lot 4', '08:22', false],
    ['Supplier: Ferro Steel', 'Quotation — carbon steel pipe', '08:15', false],
    ['Desert Mining Co.', 'Clarification request — RFQ 7713', '08:03', false],
    ['Finance', 'Invoice scan INV-4410', '07:58', false],
    ['Gulf Cement', 'RFQ — Conveyor spares', '07:49', false],
    ['Supplier: Pumpworks', 'Price list 2026', '07:41', false],
  ];

  return (
    <div className="max-w-5xl mx-auto h-full pb-6">
       <div className="h-full flex flex-col bg-white rounded-xl shadow-[0_10px_30px_rgba(11,20,55,0.08)] border border-sc-line overflow-hidden mt-4">
          <div className="p-5 border-b border-sc-line flex items-center justify-between bg-[#fbfdff]">
             <h1 className="text-lg font-black text-sc-navy">Inbox · RFQ Intake</h1>
             <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sc-muted" />
                <input type="text" placeholder="Search mail" className="pl-9 pr-4 py-2 bg-white border border-sc-line rounded-lg text-sm focus:outline-none focus:border-sc-blue focus:ring-1 focus:ring-sc-blue w-[320px] font-medium placeholder:font-bold placeholder:text-sc-muted" />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
             {mailRows.map(([sender, subject, time, isNorthgate], i) => {
                const inner = (
                   <div className={`px-6 py-4 border-b border-sc-line flex items-center gap-4 hover:bg-sc-desk/30 transition-colors ${isNorthgate ? 'bg-[#effbfc]' : ''}`}>
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isNorthgate ? 'bg-sc-cyan' : 'bg-transparent'}`}></div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-center mb-1">
                            <span className={`font-bold text-sm text-sc-navy ${isNorthgate ? 'font-black' : ''}`}>{sender as string}</span>
                            <span className="text-xs font-bold text-sc-muted tabular-nums">{time as string}</span>
                         </div>
                         <div className="text-sm text-sc-muted truncate font-medium">{subject as string}</div>
                      </div>
                   </div>
                );

                if (isNorthgate) {
                  return <Link key={i} href="/rfq/northgate/workspace" className="block">{inner}</Link>;
                }
                return <div key={i} className="cursor-pointer">{inner}</div>;
             })}
          </div>
       </div>
    </div>
  )
}
