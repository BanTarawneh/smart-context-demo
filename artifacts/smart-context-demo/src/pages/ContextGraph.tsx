import { ArrowRight, CircleHelp, Database, ExternalLink, Filter, Link2, MapPin, RefreshCw, ShieldCheck, UserRound, Building2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { GraphCanvas, type GraphCanvasHandle } from '../components/GraphCanvas';
import { findNode, graphNodes, traceSteps } from './context-graph-data';
import { useLocale } from '../i18n/LocaleProvider';

const stats = [
  { id: 'text-entity-count', value: '47', label: 'Entities', icon: Database },
  { id: 'text-relationship-count', value: '112', label: 'Relationships', icon: Link2 },
  { id: 'text-source-count', value: '4', label: 'Connected sources', icon: RefreshCw },
  { id: 'text-freshness', value: '09:02', label: 'Last synced · 28 Sep', icon: ShieldCheck },
];

export function ContextGraph() {
  const { t, isArabic, formatNumber } = useLocale();
  const graphCanvasRef = useRef<GraphCanvasHandle>(null);
  const [layoutLocked, setLayoutLocked] = useState(false);
  const [selectedId, setSelectedId] = useState(() => {
    const requestedId = new URLSearchParams(window.location.search).get('node');
    return findNode(requestedId ?? '') ? requestedId! : 'rfq';
  });
  const [tracing, setTracing] = useState(false);
  const [traceStep, setTraceStep] = useState(0);
  const selectedNode = findNode(selectedId) ?? graphNodes[0];
  const currentStep = traceSteps[traceStep];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!tracing || traceStep >= traceSteps.length - 1 || reduceMotion) return;
    const timer = window.setTimeout(() => {
      const nextStep = traceStep + 1;
      setTraceStep(nextStep);
      setSelectedId(traceSteps[nextStep].nodeId);
    }, 1050);
    return () => window.clearTimeout(timer);
  }, [tracing, traceStep, reduceMotion]);

  const startTrace = () => {
    setTracing(true);
    setTraceStep(0);
    setSelectedId(traceSteps[0].nodeId);
  };

  const stopTrace = () => {
    setTracing(false);
    setTraceStep(0);
  };

  const nextTraceStep = () => {
    if (!tracing || traceStep >= traceSteps.length - 1) {
      startTrace();
      return;
    }
    const nextStep = traceStep + 1;
    setTraceStep(nextStep);
    setSelectedId(traceSteps[nextStep].nodeId);
    setTracing(true);
  };

  return (
    <div className="h-full overflow-y-auto bg-sc-desk p-3 text-sc-navy sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-sc-blue"><MapPin className="h-4 w-4" /> {t('Context graph')} / {t('How everything in your enterprise connects')}</div>
            <h1 data-testid="text-context-graph-title" className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">{t('Everything this decision knows.')}</h1>
            <p className="mt-2 max-w-2xl text-sm text-sc-muted">{t('Trace the facts behind the Industrial Pump Package RFQ across systems, entities and ownership.')}</p>
          </div>
          <Link href="/inbox" data-testid="link-watch-agents" className="inline-flex items-center self-start rounded-lg bg-sc-navy px-4 py-2.5 text-sm font-black text-white transition-transform hover:-translate-y-0.5 md:self-auto">
            {t('Next: Watch the agents work')} <ArrowRight className="ml-2 h-4 w-4 rtl-flip-icon" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map(({ id, value, label, icon: Icon }) => (
            <div key={id} className="rounded-xl border border-sc-line bg-white px-4 py-3 shadow-[0_6px_18px_rgba(11,20,55,.04)]">
              <div className="flex items-center justify-between">
                <span data-testid={id} className="text-2xl font-black">{id === 'text-entity-count' || id === 'text-relationship-count' ? formatNumber(Number(value)) : value}</span>
                <Icon className="h-4 w-4 text-sc-blue" />
              </div>
              <div className="mt-1 text-[11px] font-black uppercase tracking-widest text-sc-muted">{t(label)}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid min-h-[600px] overflow-hidden rounded-xl border border-sc-line bg-white shadow-[0_12px_34px_rgba(11,20,55,.08)] 2xl:grid-cols-[minmax(0,1fr)_310px] xl:min-h-[700px]">
          <section className={`min-w-0 border-b border-sc-line p-4 2xl:border-b-0 lg:p-6 ${isArabic ? '2xl:border-l' : '2xl:border-r'}`}>
            <div className="flex flex-col gap-4 border-b border-sc-line pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-black text-sc-muted" aria-label={t('Graph legend')}>
                <span data-testid="legend-source" className="flex items-center gap-2"><Database className="h-3.5 w-3.5 text-sc-blue" /> {t('Source')}</span>
                <span data-testid="legend-entity" className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-sc-cyan" /> {t('Entity')}</span>
                <span data-testid="legend-person" className="flex items-center gap-2"><UserRound className="h-3.5 w-3.5 text-sc-amber" /> {t('Owner')}</span>
                <span data-testid="legend-edge" className="flex items-center gap-2"><span className="h-px w-5 bg-sc-muted" /> {t('Relationship')}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => graphCanvasRef.current?.resetLayout()}
                  data-testid="button-reset-graph-layout"
                  className="inline-flex items-center justify-center rounded-md border border-sc-line px-3 py-2 text-xs font-black text-sc-muted transition-colors hover:border-sc-blue hover:text-sc-blue"
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> {t('Reset layout')}
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutLocked((current) => !current)}
                  data-testid="button-lock-graph-layout"
                  aria-pressed={layoutLocked}
                  className={`inline-flex items-center justify-center rounded-md border px-3 py-2 text-xs font-black transition-colors ${layoutLocked ? 'border-sc-blue bg-sc-blue text-white' : 'border-sc-line text-sc-muted hover:border-sc-blue hover:text-sc-blue'}`}
                >
                  {layoutLocked ? t('Unlock layout') : t('Lock layout')}
                </button>
                <button
                  type="button"
                  onClick={startTrace}
                  data-testid="button-trace-rfq"
                  className="inline-flex items-center justify-center rounded-md border border-sc-blue px-3 py-2 text-xs font-black text-sc-blue transition-colors hover:bg-sc-blue hover:text-white"
                >
                  <MapPin className="mr-2 h-3.5 w-3.5" /> {tracing && traceStep === traceSteps.length - 1 ? t('Replay this RFQ') : t('Trace this RFQ')}
                </button>
              </div>
            </div>

            <GraphCanvas
              ref={graphCanvasRef}
              selectedId={selectedId}
              onSelect={setSelectedId}
              tracing={tracing}
              traceStep={traceStep}
              onStopTrace={stopTrace}
              layoutLocked={layoutLocked}
            />

            {tracing && (
              <div data-testid="trace-panel" className="mt-4 flex flex-col gap-3 rounded-lg border border-sc-blue/30 bg-sc-blue/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-sc-blue">{t('RFQ evidence path · {{current}} of {{total}}').replace('{{current}}', formatNumber(traceStep + 1)).replace('{{total}}', formatNumber(traceSteps.length))}</div>
                  <div data-testid="text-trace-current-step" className="mt-1 text-sm font-black">{t(currentStep.title)}</div>
                  <p data-testid="text-trace-caption" className="mt-1 text-xs leading-5 text-sc-muted">{t(currentStep.caption)}</p>
                </div>
                <button
                  type="button"
                  onClick={nextTraceStep}
                  data-testid="button-trace-next"
                  className="inline-flex shrink-0 items-center justify-center rounded-md bg-sc-blue px-3 py-2 text-xs font-black text-white"
                >
                  {traceStep === traceSteps.length - 1 ? t('Replay trace') : t('Next path step')} <ArrowRight className="ml-1 h-4 w-4 rtl-flip-icon" />
                </button>
              </div>
            )}
          </section>

          <aside className="bg-sc-paper/55 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-sc-muted">{t('Selected node')}</div>
                <h2 data-testid="text-selected-node" className="mt-2 text-2xl font-black leading-tight">{t(selectedNode.label)}</h2>
                <p className="mt-1 text-sm font-bold text-sc-blue">{t(selectedNode.detail)}</p>
              </div>
              <button type="button" onClick={() => { setSelectedId('rfq'); stopTrace(); }} data-testid="button-reset-selection" aria-label={t('Reset selection')} className="rounded-md p-1.5 text-sc-muted transition-colors hover:bg-white hover:text-sc-navy">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 rounded-lg border border-sc-line bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-black text-sc-green"><RefreshCw className="h-3.5 w-3.5" /> {t('Last synced')}</div>
              <div data-testid="text-selected-sync" className="mt-1 text-sm font-bold">{t(selectedNode.synced)}</div>
            </div>
            <div className="mt-5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-sc-muted"><CircleHelp className="h-3.5 w-3.5" /> {t('Related facts')}</div>
              <ul className="mt-3 space-y-2">
                {selectedNode.facts.map((fact) => (
                  <li key={fact} data-testid={`fact-${selectedNode.id}-${fact.slice(0, 10).replaceAll(' ', '-')}`} className="flex gap-2 text-sm leading-5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sc-cyan" />{t(fact)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 border-t border-sc-line pt-5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-sc-muted"><Link2 className="h-3.5 w-3.5" /> {t('Provenance')}</div>
              <p className="mt-2 text-sm leading-6 text-sc-muted">{t('Every relationship is retained with its source record and sync timestamp.')}</p>
              <Link href="/sources" data-testid="link-open-sources" className="mt-3 inline-flex items-center text-sm font-black text-sc-blue">
                {t('Open sources')} <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-8 rounded-lg border border-sc-line bg-white p-3 text-xs text-sc-muted">
              <div className="flex items-center gap-2 font-black text-sc-navy"><Filter className="h-3.5 w-3.5" /> {t('Hover to isolate context')}</div>
              <p className="mt-1 leading-5">{t('Hover a node to highlight its immediate neighbors. Click or focus a node for its traceable facts.')}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}