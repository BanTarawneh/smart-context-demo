import { Link, useLocation } from 'wouter';
import { Home, Inbox as InboxIcon, Target, Layers, Network, Bot } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

type SidebarProps = {
  mobileOpen: boolean;
  onNavigate: () => void;
};

export function Sidebar({ mobileOpen, onNavigate }: SidebarProps) {
  const [location] = useLocation();

  const nav = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/inbox', label: 'Inbox', icon: InboxIcon },
    { href: '/rfq/northgate/workspace', label: 'Active RFQs', icon: Target, match: '/rfq' },
    { href: '/context-graph', label: 'Context Graph', icon: Network },
    { href: '/agents', label: 'Agent Control', icon: Bot },
    { href: '/sources', label: 'Data Sources', icon: Layers },
  ];

  return (
    <aside
      id="workspace-sidebar"
      aria-label="Workspace navigation"
      className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-[260px] flex-shrink-0 flex-col overflow-y-auto bg-sc-navy text-white shadow-2xl transition-transform duration-200 ease-out lg:visible lg:static lg:z-auto lg:h-auto lg:translate-x-0 lg:shadow-none ${mobileOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'}`}
    >
       <div className="p-6 pb-2">
          <BrandLogo variant="wordmark" invert className="h-9" />
       </div>
        <nav aria-label="Workspace" className="mt-6 flex-1 space-y-1 px-4">
          <div className="text-[10px] font-black text-white/40 uppercase tracking-widest px-4 mb-3">Workspace</div>
          {nav.map(item => {
             const active = item.match ? location.startsWith(item.match) : location === item.href;
             return (
                <Link key={item.label} href={item.href} onClick={onNavigate} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
               </Link>
             )
          })}
        </nav>
       <div className="p-6 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-sc-blue flex items-center justify-center font-black text-sm text-white">MH</div>
             <div>
                <div className="text-sm font-bold">Maya Haddad</div>
                <div className="text-[10px] uppercase tracking-widest text-white/50 font-black">Procurement</div>
             </div>
          </div>
       </div>
     </aside>
  );
}
