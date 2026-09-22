import { Switch, Route } from 'wouter';
import { DemoProvider } from './DemoContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Overview } from './pages/Overview';
import { Inbox } from './pages/Inbox';
import { OpportunityLayout } from './pages/OpportunityLayout';
import { Sources } from './pages/Sources';
import { useEffect } from 'react';

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
