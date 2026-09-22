import { Link, useLocation } from 'wouter';
import { Home, Inbox as InboxIcon, Settings, Target, Layers } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function Sidebar() {
  const [location] = useLocation();

  const nav = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/inbox', label: 'Inbox', icon: InboxIcon },
    { href: '/rfq/northgate/workspace', label: 'Active RFQs', icon: Target, match: '/rfq' },
    { href: '/sources', label: 'Data Sources', icon: Layers },
  ];

  return (
    <div className="w-[260px] bg-sc-navy flex flex-col text-white flex-shrink-0">
       <div className="p-6 pb-2">
          <BrandLogo variant="wordmark" invert className="h-9" />
       </div>
       <div className="px-4 flex-1 space-y-1 mt-6">
          <div className="text-[10px] font-black text-white/40 uppercase tracking-widest px-4 mb-3">Workspace</div>
          {nav.map(item => {
             const active = item.match ? location.startsWith(item.match) : location === item.href;
             return (
               <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
               </Link>
             )
          })}
       </div>
       <div className="p-6 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-sc-blue flex items-center justify-center font-black text-sm text-white">MH</div>
             <div>
                <div className="text-sm font-bold">Maya Haddad</div>
                <div className="text-[10px] uppercase tracking-widest text-white/50 font-black">Procurement</div>
             </div>
          </div>
       </div>
    </div>
  );
}
