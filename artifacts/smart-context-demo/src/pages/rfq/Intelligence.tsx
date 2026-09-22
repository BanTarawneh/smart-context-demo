import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export function Intelligence() {
  const evidence = [
    { value: '17', label: 'Similar opportunities', color: 'border-t-sc-blue' }, 
    { value: '11', label: 'Previously won', color: 'border-t-sc-green' }, 
    { value: '6', label: 'Previous client projects', color: 'border-t-sc-blue' }, 
    { value: '18.4%', label: 'Historical margin', color: 'border-t-sc-blue' }, 
    { value: '1', label: 'Relevant incident', color: 'border-t-sc-amber' }, 
    { value: '94%', label: 'Delivery performance', color: 'border-t-sc-green' }
  ];

  return (
    <div className="w-full p-10 flex flex-col items-center overflow-y-auto bg-sc-paper">
       <div className="text-center mb-12 mt-8">
          <h2 className="text-6xl font-black text-sc-navy uppercase tracking-tight mb-2">Should we <span className="text-transparent bg-clip-text bg-gradient-to-r from-sc-cyan to-sc-blue">pursue?</span></h2>
          <div className="w-[300px] h-1.5 bg-[#dce8f2] rounded-full mx-auto mt-6 overflow-hidden">
             <div className="w-full h-full bg-gradient-to-r from-sc-cyan to-sc-blue rounded-full"></div>
          </div>
          <div className="mt-8 p-4 bg-[#eefaf5] border border-[#bce3d3] rounded-lg flex items-center gap-3 max-w-xl mx-auto text-left shadow-sm">
             <CheckCircle2 className="w-6 h-6 text-sc-green flex-shrink-0" />
             <div className="text-sm">
                <strong className="text-sc-green block text-sm font-black mb-0.5">Suggested: Pursue</strong>
                <span className="text-sc-navy font-bold">Strong win history with this client and healthy margins. One past incident to account for.</span>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-3 gap-5 max-w-4xl w-full">
         {evidence.map(item => (
           <div key={item.label} className={`p-6 border border-sc-line bg-white rounded-xl shadow-[0_5px_15px_rgba(11,20,55,0.04)] border-t-[4px] ${item.color}`}>
             <div className="text-[32px] font-black text-sc-navy tabular-nums leading-none">{item.value}</div>
             <div className="text-[11px] font-black text-sc-muted uppercase tracking-widest mt-3">{item.label}</div>
           </div>
         ))}
       </div>

       <div className="mt-12">
          <Link href="/rfq/northgate/suppliers" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-sc-line rounded-lg font-black text-sm text-sc-navy hover:border-sc-blue hover:text-sc-blue transition-colors shadow-sm">
             Next: Review Suppliers <ArrowRight className="w-4 h-4" />
          </Link>
       </div>
    </div>
  )
}
