import { useDemo } from '../../DemoContext';
import { CheckCircle2 } from 'lucide-react';

export function Decision() {
  const { supplierSelected, setSupplierSelected, decisionSent, setDecisionSent } = useDemo();

  return (
    <div className="w-full flex h-full">
       <div className="w-[420px] p-8 border-r border-sc-line bg-white overflow-y-auto flex-shrink-0">
          <div className="text-[10px] font-black text-sc-muted uppercase tracking-widest mb-3">Agent Recommendation</div>
          <div className="text-4xl font-black text-sc-navy mb-8">Supplier A</div>
          
          <div className="space-y-5 mb-10 bg-sc-paper p-5 rounded-xl border border-sc-line">
             {['Only offer inside the 14-week window with a proven record', '94% on-time across 14 previous orders', 'Active agreement · no incidents'].map((r, i) => (
               <div key={i} className="flex gap-3 text-sm text-[#43536c] font-bold leading-snug">
                  <CheckCircle2 className="w-5 h-5 text-sc-green flex-shrink-0" />
                  {r}
               </div>
             ))}
          </div>

          <button 
            onClick={() => setSupplierSelected(true)}
            className={`w-full py-3.5 rounded-lg font-black text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${supplierSelected ? 'bg-sc-green text-white hover:bg-sc-green/90' : 'bg-sc-blue text-white hover:bg-sc-blue/90 hover:-translate-y-px'}`}
          >
            {supplierSelected ? 'Supplier A selected by you ✓' : 'Select Supplier A'}
          </button>
       </div>
       
       <div className="flex-1 p-10 bg-sc-paper overflow-y-auto flex items-center justify-center relative">
          {supplierSelected ? (
             <div className="w-full max-w-2xl bg-white border border-sc-line rounded-xl p-8 shadow-[0_12px_40px_rgba(11,20,55,0.08)] relative overflow-hidden">
                {decisionSent && (
                   <div className="absolute top-0 left-0 w-full h-1.5 bg-sc-green"></div>
                )}
                {!decisionSent && (
                   <div className="absolute top-0 left-0 w-full h-1.5 bg-sc-cyan"></div>
                )}
                
                <div className="flex justify-between items-start mb-8 pt-2">
                   <div>
                     <div className="text-[10px] font-black text-sc-muted uppercase tracking-widest mb-1.5">Prepared by the Agent</div>
                     <div className="text-xs text-sc-muted font-bold">To: <span className="text-sc-navy">sales@supplier-a.example</span></div>
                   </div>
                   <div className={`text-[10px] font-black uppercase px-2.5 py-1 rounded tracking-wider ${decisionSent ? 'bg-sc-green text-white' : 'bg-sc-amber/15 text-sc-amber'}`}>
                     {decisionSent ? 'SENT' : 'DRAFT · awaiting your review'}
                   </div>
                </div>

                <div className="text-sm text-[#43536c] space-y-5 leading-relaxed font-medium bg-[#fbfdff] p-6 rounded-lg border border-sc-line">
                   <p className="border-b border-sc-line pb-4"><strong className="font-black text-sc-navy text-base tracking-tight">Subject: Centrifugal Pump Package — Selection and Next Steps</strong></p>
                   <p>Dear Supplier A team,</p>
                   <p>Thank you for your quotation of $184,000 for the centrifugal pump package. We are pleased to confirm your selection, subject to final commercial terms under our existing agreement.</p>
                   <p>Please confirm the 11-week delivery, DDP Aqaba, and share the updated technical submittals by Thursday.</p>
                   <p>Kind regards,<br />Procurement</p>
                </div>

                <div className="mt-8 flex justify-end">
                   <button 
                     onClick={() => setDecisionSent(true)}
                     disabled={decisionSent}
                     className={`px-8 py-3 rounded-lg font-black text-sm transition-all shadow-sm ${decisionSent ? 'bg-[#e5f5ee] border border-[#bde5d3] text-sc-green' : 'bg-sc-amber text-white hover:bg-sc-amber/90 hover:-translate-y-px'}`}
                   >
                     {decisionSent ? 'Sent ✓' : 'Send Selection'}
                   </button>
                </div>
             </div>
          ) : (
             <div className="text-center text-sc-muted font-bold text-sm bg-white p-8 rounded-xl border border-sc-line border-dashed">
                Select a supplier to generate the decision draft.
             </div>
          )}
       </div>
    </div>
  )
}
