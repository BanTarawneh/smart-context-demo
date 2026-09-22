import { useDemo } from '../../DemoContext';
import { Check, Edit2, Zap, FileText } from 'lucide-react';

export function Workspace() {
  const { quantityCorrected, setQuantityCorrected, extractionConfirmed, setExtractionConfirmed, sapCreated, setSapCreated } = useDemo();

  return (
    <div className="flex h-full w-full">
      <div className="flex-1 flex flex-col border-r border-sc-line bg-sc-paper p-8 overflow-y-auto">
         {/* Email / Doc Preview */}
         <div className="bg-white border border-sc-line rounded-xl p-8 shadow-sm">
            <div className="border-b border-sc-line pb-5 mb-5">
               <div className="text-[10px] font-black text-sc-muted uppercase tracking-widest mb-2">Source: Email</div>
               <h2 className="text-xl font-black text-sc-navy">RFQ — Industrial Pump Package</h2>
               <div className="text-sm text-sc-muted mt-2 font-medium">From: <strong className="text-sc-navy font-bold">Northgate Water Authority</strong> · 09:02 AM</div>
            </div>
            <div className="text-sm text-[#43536c] space-y-5 leading-relaxed font-medium">
               <p>Dear Sir / Madam,</p>
               <p>Please quote for the supply of the centrifugal pump package described in the attached specification, including motors and the control panel. Delivery is required within 14 weeks, DDP Aqaba.</p>
               <p>Quotations must be received no later than 30 September 2026.</p>
               <p>Regards,<br />Procurement Department</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-sc-line">
               {['RFQ.pdf', 'Technical Specifications.pdf', 'Equipment List.xlsx'].map((f, i) => (
                 <div key={f} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold ${i === 1 ? 'bg-[#dff8fb] text-sc-blue ring-2 ring-sc-cyan/30' : 'bg-sc-desk text-sc-muted'}`}>
                    <FileText className="w-3 h-3" /> {f}
                 </div>
               ))}
            </div>
         </div>
      </div>
      
      <div className="w-[430px] flex flex-col bg-white flex-shrink-0">
         <div className="p-6 border-b border-sc-line flex items-center justify-between bg-[#fbfdff]">
            <div className="flex items-center gap-2 font-black text-sm text-sc-navy">
              <Zap className="w-4 h-4 text-sc-cyan" />
              Smart Context Extraction
            </div>
            {sapCreated && <div className="text-[10px] font-black uppercase tracking-wider text-sc-green bg-sc-green/10 px-2 py-1 rounded">SAP Inquiry 10004582</div>}
         </div>
         <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
            <Field label="Client" value="Northgate Water Authority" />
            <Field label="Items" value="Centrifugal pump package" />
            <div className="relative">
               <label className="block text-[10px] font-black text-sc-muted uppercase tracking-widest mb-1.5">Quantity</label>
               <div className={`flex items-center gap-3 border rounded-lg px-4 py-3 text-sm font-bold ${quantityCorrected ? 'bg-[#fffaf3] border-sc-amber' : 'bg-[#f1f5f9] border-sc-line'}`}>
                 <div className="flex-1 text-sc-navy">
                   {quantityCorrected ? '4 pumps · 4 motors · 1 panel' : '4 pumps · 4 motors'}
                 </div>
                 {quantityCorrected ? (
                   <span className="text-[9px] font-black text-sc-amber bg-sc-amber/15 px-2 py-1 rounded uppercase tracking-wider">Corrected</span>
                 ) : (
                   !extractionConfirmed && <button onClick={() => setQuantityCorrected(true)} className="text-sc-muted hover:text-sc-amber transition-colors"><Edit2 className="w-4 h-4" /></button>
                 )}
                  {quantityCorrected && <Check className="w-4 h-4 text-sc-green" />}
               </div>
               {quantityCorrected && (
                  <div className="text-[10px] font-bold text-sc-muted mt-1.5 ml-1">
                     agent read: <s className="opacity-70">4 pumps · 4 motors</s> · fixed by you
                  </div>
               )}
            </div>
            <Field label="Specifications" value="API 610 · 350 m³/h · 11 kV" />
            <div className="relative">
               <label className="block text-[10px] font-black text-sc-muted uppercase tracking-widest mb-1.5">Delivery</label>
               <div className={`flex items-center gap-3 border rounded-lg px-4 py-3 text-sm font-bold bg-[#f1f5f9] border-sc-line ${!extractionConfirmed ? 'ring-2 ring-sc-blue bg-white border-sc-blue' : ''}`}>
                 <div className="flex-1 text-sc-navy">14 weeks · DDP Aqaba</div>
                 <Check className="w-4 h-4 text-sc-green" />
               </div>
               {!extractionConfirmed && (
                  <div className="absolute left-[-265px] top-0 w-[240px] p-4 bg-white border border-sc-line shadow-[0_12px_32px_rgba(11,20,55,0.14)] rounded-lg text-xs z-10 hidden lg:block">
                     <div className="font-bold text-sc-navy flex items-center gap-2 mb-3">
                        <FileText className="w-3 h-3" /> Technical Specification · Page 17
                     </div>
                     <div className="p-3 bg-[#f3f5f7] rounded">
                        <div className="h-1 bg-[#c9d1dc] rounded w-[90%] mb-2"></div>
                        <div className="h-1 bg-[#c9d1dc] rounded w-[60%] mb-2"></div>
                        <div className="border-l-2 border-sc-cyan pl-2 py-1 bg-[#bcecf2] font-bold text-[#31506b] text-[10px] mt-2 mb-2 leading-tight">
                           4.3 Delivery: 14 weeks from PO, DDP Aqaba
                        </div>
                     </div>
                     <div className="absolute top-6 -right-[5px] w-2.5 h-2.5 bg-white border-t border-r border-sc-line rotate-45"></div>
                  </div>
               )}
            </div>
         </div>
         <div className="p-6 border-t border-sc-line bg-[#fbfdff]">
            {!extractionConfirmed ? (
              <button 
                onClick={() => setExtractionConfirmed(true)}
                disabled={!quantityCorrected}
                className={`w-full py-3 rounded-lg font-black text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                  quantityCorrected
                    ? 'bg-sc-blue text-white hover:bg-sc-blue/90 hover:-translate-y-px'
                    : 'bg-sc-desk text-sc-muted cursor-not-allowed'
                }`}
              >
                {quantityCorrected ? 'Confirm Extraction' : 'Correct quantity to confirm'}
              </button>
            ) : !sapCreated ? (
              <button 
                onClick={() => setSapCreated(true)}
                className="w-full py-3 bg-sc-amber text-white rounded-lg font-black text-sm hover:bg-sc-amber/90 transition-all flex items-center justify-center gap-2 shadow-sm hover:-translate-y-px"
              >
                Approve & Create in SAP
              </button>
            ) : (
              <div className="w-full py-3 bg-[#e5f5ee] border border-[#bde5d3] text-sc-green rounded-lg font-black text-sm flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> SAP Record Created
              </div>
            )}
         </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-sc-muted uppercase tracking-widest mb-1.5">{label}</label>
      <div className="flex items-center gap-3 bg-[#f1f5f9] border border-sc-line rounded-lg px-4 py-3 text-sm font-bold text-sc-navy">
        <div className="flex-1">{value}</div>
        <Check className="w-4 h-4 text-sc-green" />
      </div>
    </div>
  );
}
