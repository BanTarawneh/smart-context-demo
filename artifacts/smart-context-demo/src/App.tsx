import { Switch, Route, useLocation } from 'wouter';
import { DemoProvider } from './DemoContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Overview } from './pages/Overview';
import { Inbox } from './pages/Inbox';
import { OpportunityLayout } from './pages/OpportunityLayout';
import { Sources } from './pages/Sources';
import { Landing } from './pages/Landing';
import { ContextGraph } from './pages/ContextGraph';
import { AgentControlCenter } from './pages/AgentControlCenter';
import { PlatformOverview } from './pages/PlatformOverview';
import { useEffect, useState } from 'react';
import { LocaleProvider, useLocale } from './i18n/LocaleProvider';

function AppContent() {
  const [location] = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { t } = useLocale();

  // Clear any existing custom cursors or styles from the body that might be left over if hot-reloading
  useEffect(() => {
    document.body.style.cursor = 'auto';
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileNavOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileNavOpen]);

  if (location === '/') {
    return <Landing />;
  }

  if (location === '/platform' || location === '/platform/') {
    return <PlatformOverview />;
  }

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-sc-desk font-sans text-sc-navy selection:bg-sc-cyan/30">
      {mobileNavOpen && (
        <button
          type="button"
          aria-label={t('Close navigation')}
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-sc-navy/55 backdrop-blur-[1px] lg:hidden"
        />
      )}
      <Sidebar mobileOpen={mobileNavOpen} onNavigate={() => setMobileNavOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 bg-sc-desk">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-hidden relative">
          <Switch>
            <Route path="/dashboard" component={Overview} />
            <Route path="/inbox" component={Inbox} />
            <Route path="/context-graph" component={ContextGraph} />
            <Route path="/agents" component={AgentControlCenter} />
            <Route path="/rfq/northgate/:tab" component={OpportunityLayout} />
            <Route path="/rfq/northgate" component={() => <OpportunityLayout params={{ tab: 'workspace' }} />} />
            <Route path="/sources" component={Sources} />
            <Route>
              <div className="p-8 text-center text-sc-muted font-bold">{t('Page not found')}</div>
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <DemoProvider>
        <AppContent />
      </DemoProvider>
    </LocaleProvider>
  );
}