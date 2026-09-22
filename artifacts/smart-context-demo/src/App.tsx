import { Switch, Route } from 'wouter';
import { DemoProvider } from './DemoContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Overview } from './pages/Overview';
import { Inbox } from './pages/Inbox';
import { OpportunityLayout } from './pages/OpportunityLayout';
import { Sources } from './pages/Sources';
import { useEffect } from 'react';

// The Logo from original demo to use in Sidebar
export function Logo({ invert = false }: { invert?: boolean }) {
  return (
    <div className={`flex items-center gap-2 font-bold ${invert ? 'text-white' : 'text-sc-navy'}`}>
      <div className="relative w-6 h-6 flex-shrink-0">
        <div className={`absolute w-3.5 h-[22px] border-[2.5px] rounded-full top-[1px] left-[1px] rotate-[28deg] ${invert ? 'border-sc-cyan' : 'border-sc-cyan'}`}></div>
        <div className={`absolute w-3.5 h-[22px] border-[2.5px] rounded-full top-[1px] right-[1px] -rotate-[28deg] ${invert ? 'border-sc-blue' : 'border-sc-blue'}`}></div>
        <div className="absolute w-[7px] h-[7px] bg-sc-cyan rounded-full left-[8.5px] top-[8.5px]"></div>
      </div>
      <span className="tracking-tight text-xl font-black">Smart Context</span>
    </div>
  );
}

export default function App() {
  // Clear any existing custom cursors or styles from the body that might be left over if hot-reloading
  useEffect(() => {
    document.body.style.cursor = 'auto';
  }, []);

  return (
    <DemoProvider>
      <div className="flex h-[100dvh] w-full bg-sc-desk text-sc-navy font-sans overflow-hidden selection:bg-sc-cyan/30">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-sc-desk">
          <Topbar />
          <main className="flex-1 overflow-hidden relative">
            <Switch>
              <Route path="/" component={Overview} />
              <Route path="/inbox" component={Inbox} />
              <Route path="/rfq/northgate/:tab" component={OpportunityLayout} />
              <Route path="/rfq/northgate" component={() => <OpportunityLayout params={{ tab: 'workspace' }} />} />
              <Route path="/sources" component={Sources} />
              <Route>
                <div className="p-8 text-center text-sc-muted font-bold">Page not found</div>
              </Route>
            </Switch>
          </main>
        </div>
      </div>
    </DemoProvider>
  );
}
