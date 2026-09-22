import { useLocation } from 'wouter';
import { Bell, Search } from 'lucide-react';

export function Topbar() {
  const [location] = useLocation();
  const title = location.startsWith('/rfq') ? 'Opportunity Workspace' : 
                location.startsWith('/inbox') ? 'RFQ Intake' : 
                location.startsWith('/sources') ? 'System Settings' : 'Overview';

  return (
    <header className="h-[72px] border-b border-sc-line bg-white flex items-center justify-between px-8 flex-shrink-0">
       <div className="font-black text-sc-navy text-lg">{title}</div>
       <div className="flex items-center gap-6">
          <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sc-muted" />
             <input type="text" placeholder="Search across workspace..." className="pl-9 pr-4 py-2 bg-sc-paper border border-sc-line rounded-lg text-sm focus:outline-none focus:border-sc-blue focus:ring-1 focus:ring-sc-blue w-[280px] font-medium placeholder:font-bold placeholder:text-sc-muted" />
          </div>
          <button className="relative text-sc-muted hover:text-sc-navy">
             <Bell className="w-5 h-5" />
             <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sc-red rounded-full border-2 border-white"></span>
          </button>
       </div>
    </header>
  );
}
