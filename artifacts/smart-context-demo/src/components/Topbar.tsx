import { useLocation } from 'wouter';
import { Bell, Menu, Search } from 'lucide-react';

type TopbarProps = {
  onMenuClick: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const [location] = useLocation();
  const title = location.startsWith('/rfq') ? 'Opportunity Workspace' : 
                location.startsWith('/inbox') ? 'RFQ Intake' : 
                location.startsWith('/context-graph') ? 'Context Graph' :
                location.startsWith('/agents') ? 'Agent Control Center' :
                location.startsWith('/sources') ? 'System Settings' : 'Overview';

  return (
    <header className="flex h-[60px] flex-shrink-0 items-center justify-between border-b border-sc-line bg-white px-4 sm:h-[72px] sm:px-8">
       <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onMenuClick} aria-label="Open navigation" aria-controls="workspace-sidebar" className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sc-navy hover:bg-sc-paper focus:outline-none focus:ring-2 focus:ring-sc-blue lg:hidden">
             <Menu className="h-5 w-5" />
          </button>
          <div className="truncate text-base font-black text-sc-navy sm:text-lg">{title}</div>
       </div>
       <div className="ml-3 flex flex-shrink-0 items-center gap-3 sm:gap-6">
          <div className="relative hidden sm:block">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sc-muted" />
             <input type="text" aria-label="Search across workspace" placeholder="Search across workspace..." className="w-[220px] rounded-lg border border-sc-line bg-sc-paper py-2 pl-9 pr-4 text-sm font-medium placeholder:font-bold placeholder:text-sc-muted focus:border-sc-blue focus:outline-none focus:ring-1 focus:ring-sc-blue lg:w-[280px]" />
          </div>
          <button type="button" aria-label="Notifications" className="relative text-sc-muted hover:text-sc-navy">
             <Bell className="w-5 h-5" />
             <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sc-red rounded-full border-2 border-white"></span>
          </button>
       </div>
    </header>
  );
}
