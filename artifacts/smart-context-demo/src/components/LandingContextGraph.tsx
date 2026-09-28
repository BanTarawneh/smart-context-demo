import {
  AnimatePresence,
  animate,
  motion,
  motionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useCallback, useEffect, useMemo, useState, type PointerEvent } from 'react';

const GRAPH_TIMING = {
  highlightIntervalSeconds: 3,
  countUpDurationSeconds: 1.55,
  countUpDelaySeconds: 0.28,
  edgeDrawSeconds: 0.88,
  edgeFadeSeconds: 0.32,
  primaryEdgeDelaySeconds: 0.42,
  outerEdgeDelaySeconds: 1.75,
  edgeStaggerSeconds: 0.045,
  innerNodeDelaySeconds: 0.46,
  innerNodeStaggerSeconds: 0.1,
  outerNodeDelaySeconds: 1.7,
  outerNodeStaggerSeconds: 0.052,
  hubEntryDelaySeconds: 0.05,
  captionTransitionSeconds: 0.28,
  liveIndicatorDurationSeconds: 1.8,
  nodeOpacityTransitionSeconds: 0.3,
  entrySpringStiffness: 230,
  entrySpringDamping: 22,
  hoverSpringStiffness: 260,
  hoverSpringDamping: 20,
  hubEntrySpringStiffness: 210,
  hubEntrySpringDamping: 17,
  nodeDriftPixels: 3.2,
  nodeDriftDurationSeconds: 9.5,
  nodeDriftPhaseSeconds: 0.55,
  graphSwayPixels: 1.6,
  graphSwayDurationSeconds: 180,
  centerGlowDurationSeconds: 8.5,
  dotGridDurationSeconds: 54,
  hubPulseDurationSeconds: 2.5,
  particleDurationSeconds: 6.8,
  particleStartDelaySeconds: 3.2,
  particleStaggerSeconds: 1.5,
  syncTickDurationSeconds: 0.62,
  syncTickRepeatDelaySeconds: 5.7,
  tiltDegrees: 6,
  graphParallaxPixels: 8,
  tiltSpringStiffness: 125,
  tiltSpringDamping: 20,
} as const;

type GraphNodeKind = 'source' | 'entity' | 'person' | 'metric' | 'hub';
type Point = { x: number; y: number };
type PositionedGraphNode = {
  id: string;
  label: string;
  kind: GraphNodeKind;
  source: string;
  fact: string;
  radius: number;
  wide: Point;
  compact: Point;
  labelSide?: 'above' | 'below';
} & Point;
type GraphEdge = {
  id: string;
  from: string;
  to: string;
  kind: 'primary' | 'secondary';
  bend: number;
  flow?: boolean;
};
type NodeOffset = { x: MotionValue<number>; y: MotionValue<number> };

const nodeBlueprints: Omit<PositionedGraphNode, 'x' | 'y'>[] = [
  { id: 'rfq', label: 'RFQ', kind: 'hub', source: 'Smart Context', fact: 'Industrial Pump Package RFQ', radius: 25, wide: { x: 400, y: 207 }, compact: { x: 250, y: 249 } },
  { id: 'sap', label: 'SAP', kind: 'source', source: 'SAP ERP', fact: '14 previous orders with Supplier A', radius: 15, wide: { x: 286, y: 145 }, compact: { x: 166, y: 174 } },
  { id: 'crm', label: 'CRM', kind: 'source', source: 'Salesforce CRM', fact: '17 similar opportunities, 11 won', radius: 15, wide: { x: 267, y: 215 }, compact: { x: 145, y: 249 } },
  { id: 'email', label: 'Email', kind: 'source', source: 'M365 Email', fact: 'RFQ and 2 attachments parsed', radius: 15, wide: { x: 309, y: 292 }, compact: { x: 176, y: 329 } },
  { id: 'contracts', label: 'Contracts', kind: 'source', source: 'Contracts Drive', fact: 'Agreement active with Supplier A', radius: 15, wide: { x: 491, y: 292 }, compact: { x: 324, y: 329 } },
  { id: 'suppliers', label: 'Suppliers', kind: 'entity', source: 'SAP + CRM', fact: 'Supplier A is linked to this RFQ', radius: 15, wide: { x: 533, y: 215 }, compact: { x: 355, y: 249 } },
  { id: 'margin', label: 'Margin', kind: 'metric', source: 'SAP ERP', fact: '18.4% historical margin', radius: 15, wide: { x: 514, y: 145 }, compact: { x: 334, y: 174 } },
  { id: 'northgate', label: 'Northgate', kind: 'entity', source: 'Salesforce CRM', fact: 'Buyer account for this request', radius: 8, wide: { x: 95, y: 91 }, compact: { x: 78, y: 88 } },
  { id: 'supplier-a', label: 'Supplier A', kind: 'entity', source: 'SAP ERP', fact: '14 previous orders on record', radius: 8, wide: { x: 100, y: 175 }, compact: { x: 237, y: 57 } },
  { id: 'supplier-b', label: 'Supplier B', kind: 'entity', source: 'SAP ERP', fact: 'Alternative supplier for pumps', radius: 8, wide: { x: 98, y: 270 }, compact: { x: 422, y: 95 } },
  { id: 'supplier-d', label: 'Supplier D', kind: 'entity', source: 'SAP ERP', fact: 'Delivery history linked to the RFQ', radius: 8, wide: { x: 205, y: 350 }, compact: { x: 432, y: 190 } },
  { id: 'past-quotes', label: 'Past quotes', kind: 'entity', source: 'SAP ERP', fact: 'Comparable pump package quotes', radius: 8, wide: { x: 285, y: 57 }, compact: { x: 430, y: 300 } },
  { id: 'pumps', label: 'Pumps', kind: 'entity', source: 'SAP ERP', fact: 'Centrifugal pump package', radius: 8, wide: { x: 400, y: 40 }, compact: { x: 366, y: 419 }, labelSide: 'above' },
  { id: 'motors', label: 'Motors', kind: 'entity', source: 'SAP ERP', fact: 'Motor specifications match', radius: 8, wide: { x: 515, y: 57 }, compact: { x: 250, y: 463 }, labelSide: 'above' },
  { id: 'panel', label: '11 kV panel', kind: 'entity', source: 'SAP ERP', fact: 'Panel included in the RFQ scope', radius: 8, wide: { x: 705, y: 91 }, compact: { x: 134, y: 419 }, labelSide: 'above' },
  { id: 'maya', label: 'Maya H.', kind: 'person', source: 'Salesforce CRM + Email', fact: 'Decision owner for procurement', radius: 8, wide: { x: 705, y: 175 }, compact: { x: 65, y: 307 } },
  { id: 'delivery', label: 'Delivery 94%', kind: 'metric', source: 'SAP ERP', fact: 'Historical on-time delivery rate', radius: 8, wide: { x: 702, y: 270 }, compact: { x: 66, y: 202 } },
  { id: 'similar-deals', label: '17 similar deals', kind: 'metric', source: 'Salesforce CRM', fact: '11 similar opportunities were won', radius: 8, wide: { x: 598, y: 350 }, compact: { x: 145, y: 453 }, labelSide: 'above' },
  { id: 'contract-terms', label: 'Contract terms', kind: 'entity', source: 'Contracts Drive', fact: 'Active terms include the approval gate', radius: 8, wide: { x: 400, y: 367 }, compact: { x: 355, y: 453 }, labelSide: 'above' },
];

const graphEdges: GraphEdge[] = [
  { id: 'sap-rfq', from: 'sap', to: 'rfq', kind: 'primary', bend: -4, flow: true },
  { id: 'crm-rfq', from: 'crm', to: 'rfq', kind: 'primary', bend: -7, flow: true },
  { id: 'email-rfq', from: 'email', to: 'rfq', kind: 'primary', bend: -5, flow: true },
  { id: 'contracts-rfq', from: 'contracts', to: 'rfq', kind: 'primary', bend: 5, flow: true },
  { id: 'suppliers-rfq', from: 'suppliers', to: 'rfq', kind: 'primary', bend: 7 },
  { id: 'margin-rfq', from: 'margin', to: 'rfq', kind: 'primary', bend: 4, flow: true },
  { id: 'northgate-sap', from: 'northgate', to: 'sap', kind: 'secondary', bend: -14 },
  { id: 'northgate-crm', from: 'northgate', to: 'crm', kind: 'secondary', bend: 12 },
  { id: 'supplier-a-sap', from: 'supplier-a', to: 'sap', kind: 'secondary', bend: -10 },
  { id: 'supplier-a-suppliers', from: 'supplier-a', to: 'suppliers', kind: 'secondary', bend: 9 },
  { id: 'supplier-b-crm', from: 'supplier-b', to: 'crm', kind: 'secondary', bend: 10 },
  { id: 'supplier-b-suppliers', from: 'supplier-b', to: 'suppliers', kind: 'secondary', bend: -12 },
  { id: 'supplier-d-suppliers', from: 'supplier-d', to: 'suppliers', kind: 'secondary', bend: 8 },
  { id: 'supplier-d-contracts', from: 'supplier-d', to: 'contracts', kind: 'secondary', bend: -8 },
  { id: 'past-quotes-sap', from: 'past-quotes', to: 'sap', kind: 'secondary', bend: 9 },
  { id: 'past-quotes-margin', from: 'past-quotes', to: 'margin', kind: 'secondary', bend: -9 },
  { id: 'pumps-suppliers', from: 'pumps', to: 'suppliers', kind: 'secondary', bend: 12 },
  { id: 'pumps-contracts', from: 'pumps', to: 'contracts', kind: 'secondary', bend: -10 },
  { id: 'motors-suppliers', from: 'motors', to: 'suppliers', kind: 'secondary', bend: -12 },
  { id: 'motors-margin', from: 'motors', to: 'margin', kind: 'secondary', bend: 10 },
  { id: 'panel-suppliers', from: 'panel', to: 'suppliers', kind: 'secondary', bend: -12 },
  { id: 'panel-contracts', from: 'panel', to: 'contracts', kind: 'secondary', bend: 11 },
  { id: 'maya-crm', from: 'maya', to: 'crm', kind: 'secondary', bend: -9 },
  { id: 'maya-email', from: 'maya', to: 'email', kind: 'secondary', bend: 11 },
  { id: 'delivery-sap', from: 'delivery', to: 'sap', kind: 'secondary', bend: -10 },
  { id: 'delivery-suppliers', from: 'delivery', to: 'suppliers', kind: 'secondary', bend: 11 },
  { id: 'similar-crm', from: 'similar-deals', to: 'crm', kind: 'secondary', bend: -11 },
  { id: 'similar-margin', from: 'similar-deals', to: 'margin', kind: 'secondary', bend: 10 },
  { id: 'terms-contracts', from: 'contract-terms', to: 'contracts', kind: 'secondary', bend: 10 },
  { id: 'terms-margin', from: 'contract-terms', to: 'margin', kind: 'secondary', bend: -11 },
];

const nodePalette: Record<GraphNodeKind, { color: string; fill: string }> = {
  source: { color: '#8DB5E2', fill: '#31547A' },
  entity: { color: '#67E0E3', fill: '#164D62' },
  person: { color: '#F0AA67', fill: '#704526' },
  metric: { color: '#79D9A8', fill: '#1D5B4D' },
  hub: { color: '#75F0ED', fill: '#145065' },
};

const highlightCycle = [
  { sourceId: 'sap', caption: 'SAP → 14 previous orders with Supplier A' },
  { sourceId: 'crm', caption: 'CRM → 17 similar opportunities, 11 won' },
  { sourceId: 'email', caption: 'Email → RFQ + 2 attachments parsed' },
  { sourceId: 'contracts', caption: 'Contracts → agreement active with Supplier A' },
  { sourceId: 'margin', caption: 'Margin → 18.4% historical margin' },
];

function wordWrap(text: string, limit: number) {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > limit && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

function curvedEdgePath(
  edge: GraphEdge,
  from: PositionedGraphNode,
  to: PositionedGraphNode,
  fromOffsetX = 0,
  fromOffsetY = 0,
  toOffsetX = 0,
  toOffsetY = 0,
) {
  const fromX = from.x + fromOffsetX;
  const fromY = from.y + fromOffsetY;
  const toX = to.x + toOffsetX;
  const toY = to.y + toOffsetY;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const startX = fromX + ux * from.radius;
  const startY = fromY + uy * from.radius;
  const endX = toX - ux * to.radius;
  const endY = toY - uy * to.radius;
  const normalX = -uy;
  const normalY = ux;
  const bend = edge.bend;
  const c1x = startX + dx * 0.4 + normalX * bend;
  const c1y = startY + dy * 0.4 + normalY * bend;
  const c2x = endX - dx * 0.4 + normalX * bend;
  const c2y = endY - dy * 0.4 + normalY * bend;
  return `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;
}

function GraphEdgeView({
  edge,
  from,
  to,
  offsets,
  index,
  reduceMotion,
  isFocused,
  isActivePath,
  isDimmed,
}: {
  edge: GraphEdge;
  from: PositionedGraphNode;
  to: PositionedGraphNode;
  offsets: Map<string, NodeOffset>;
  index: number;
  reduceMotion: boolean;
  isFocused: boolean;
  isActivePath: boolean;
  isDimmed: boolean;
}) {
  const fromOffset = offsets.get(edge.from)!;
  const toOffset = offsets.get(edge.to)!;
  const path = useTransform(
    [fromOffset.x, fromOffset.y, toOffset.x, toOffset.y],
    (latest: number[]) => curvedEdgePath(edge, from, to, latest[0], latest[1], latest[2], latest[3]),
  );
  const finalPath = curvedEdgePath(edge, from, to);
  const edgeDelay = edge.kind === 'primary'
    ? GRAPH_TIMING.primaryEdgeDelaySeconds + index * GRAPH_TIMING.edgeStaggerSeconds
    : GRAPH_TIMING.outerEdgeDelaySeconds + index * GRAPH_TIMING.edgeStaggerSeconds * 0.5;
  const opacity = isDimmed ? 0.13 : isActivePath ? 1 : isFocused ? 0.64 : edge.kind === 'primary' ? 0.55 : 0.28;

  return (
    <g>
      <motion.path
        d={path}
        fill="none"
        stroke={isActivePath ? '#64F1EF' : isFocused ? '#54D8E5' : 'url(#landing-graph-edge-gradient)'}
        strokeWidth={isActivePath ? 2.9 : isFocused ? 2.1 : edge.kind === 'primary' ? 1.85 : 1.15}
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0.08 }}
        animate={{ pathLength: 1, opacity }}
        transition={reduceMotion ? { duration: 0 } : {
          pathLength: { duration: GRAPH_TIMING.edgeDrawSeconds, delay: edgeDelay, ease: 'easeOut' },
          opacity: { duration: GRAPH_TIMING.edgeFadeSeconds },
        }}
        aria-hidden="true"
      />
      {edge.flow && !reduceMotion && (
        <circle
          r={isActivePath ? 3.4 : 2.5}
          fill={isActivePath ? '#CFFFFF' : '#70EEF0'}
          style={{ filter: 'drop-shadow(0 0 5px rgba(91, 238, 239, .95))' }}
          aria-hidden="true"
        >
          <animateMotion
            path={finalPath}
            dur={`${GRAPH_TIMING.particleDurationSeconds}s`}
            begin={`${GRAPH_TIMING.particleStartDelaySeconds + (index % 4) * GRAPH_TIMING.particleStaggerSeconds}s`}
            repeatCount="indefinite"
          />
        </circle>
      )}
    </g>
  );
}

export function LandingContextGraph() {
  const reduceMotion = useReducedMotion() ?? false;
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 639px)').matches);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [entityCount, setEntityCount] = useState(reduceMotion ? 47 : 0);
  const [linkCount, setLinkCount] = useState(reduceMotion ? 112 : 0);
  const tiltXRaw = useMotionValue(0);
  const tiltYRaw = useMotionValue(0);
  const graphXRaw = useMotionValue(0);
  const graphYRaw = useMotionValue(0);
  const tiltX = useSpring(tiltXRaw, { stiffness: GRAPH_TIMING.tiltSpringStiffness, damping: GRAPH_TIMING.tiltSpringDamping });
  const tiltY = useSpring(tiltYRaw, { stiffness: GRAPH_TIMING.tiltSpringStiffness, damping: GRAPH_TIMING.tiltSpringDamping });
  const graphX = useSpring(graphXRaw, { stiffness: GRAPH_TIMING.tiltSpringStiffness, damping: GRAPH_TIMING.tiltSpringDamping });
  const graphY = useSpring(graphYRaw, { stiffness: GRAPH_TIMING.tiltSpringStiffness, damping: GRAPH_TIMING.tiltSpringDamping });
  const cycle = highlightCycle[cycleIndex];
  const activeFocusId = hoveredNodeId ?? cycle.sourceId;
  const activeNode = nodeBlueprints.find((node) => node.id === hoveredNodeId);
  const activeNodes = useMemo(
    () => nodeBlueprints.map((node) => ({ ...node, ...(compact ? node.compact : node.wide) })),
    [compact],
  );
  const activePositions = useMemo(
    () => new Map(activeNodes.map((node) => [node.id, node])),
    [activeNodes],
  );
  const graphSize = compact ? { width: 500, height: 520, center: { x: 250, y: 249 } } : { width: 800, height: 410, center: { x: 400, y: 207 } };
  const nodeOffsets = useMemo(() => new Map(activeNodes.map((node) => [
    node.id,
    {
      x: motionValue(reduceMotion || node.id === 'rfq' ? 0 : graphSize.center.x - node.x),
      y: motionValue(reduceMotion || node.id === 'rfq' ? 0 : graphSize.center.y - node.y),
    },
  ])), [activeNodes, graphSize.center.x, graphSize.center.y, reduceMotion]);
  const neighborsByNode = useMemo(() => {
    const neighbors = new Map<string, Set<string>>();
    graphEdges.forEach((edge) => {
      if (!neighbors.has(edge.from)) neighbors.set(edge.from, new Set());
      if (!neighbors.has(edge.to)) neighbors.set(edge.to, new Set());
      neighbors.get(edge.from)!.add(edge.to);
      neighbors.get(edge.to)!.add(edge.from);
    });
    return neighbors;
  }, []);
  const activeNeighbors = neighborsByNode.get(activeFocusId) ?? new Set<string>();
  const cycleCaption = cycle.caption;

  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)');
    const update = () => setCompact(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduceMotion || hoveredNodeId) return;
    const timer = window.setInterval(() => {
      setCycleIndex((index) => (index + 1) % highlightCycle.length);
    }, GRAPH_TIMING.highlightIntervalSeconds * 1000);
    return () => window.clearInterval(timer);
  }, [hoveredNodeId, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      setEntityCount(47);
      setLinkCount(112);
      return;
    }
    let frame = 0;
    const startAt = window.performance.now() + GRAPH_TIMING.countUpDelaySeconds * 1000;
    const duration = GRAPH_TIMING.countUpDurationSeconds * 1000;
    const tick = (now: number) => {
      const progress = Math.max(0, Math.min(1, (now - startAt) / duration));
      const eased = 1 - Math.pow(1 - progress, 3);
      setEntityCount(Math.round(47 * eased));
      setLinkCount(Math.round(112 * eased));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const controls: Array<{ stop: () => void }> = [];
    const timers: number[] = [];
    activeNodes.forEach((node, index) => {
      if (node.id === 'rfq') return;
      const offset = nodeOffsets.get(node.id)!;
      const isOuter = !['sap', 'crm', 'email', 'contracts', 'suppliers', 'margin'].includes(node.id);
      const entryDelay = isOuter
        ? GRAPH_TIMING.outerNodeDelaySeconds + Math.max(0, index - 7) * GRAPH_TIMING.outerNodeStaggerSeconds
        : GRAPH_TIMING.innerNodeDelaySeconds + Math.max(0, index - 1) * GRAPH_TIMING.innerNodeStaggerSeconds;
      const spring = {
        type: 'spring' as const,
        stiffness: GRAPH_TIMING.entrySpringStiffness,
        damping: GRAPH_TIMING.entrySpringDamping,
        delay: entryDelay,
      };
      controls.push(animate(offset.x, 0, spring));
      controls.push(animate(offset.y, 0, {
        ...spring,
        onComplete: () => {
          const timer = window.setTimeout(() => {
            controls.push(animate(offset.y, [0, -GRAPH_TIMING.nodeDriftPixels, 0, GRAPH_TIMING.nodeDriftPixels, 0], {
              duration: GRAPH_TIMING.nodeDriftDurationSeconds + (index % 5) * 0.48,
              delay: (index % 5) * GRAPH_TIMING.nodeDriftPhaseSeconds,
              repeat: Infinity,
              ease: 'easeInOut',
            }));
          }, 0);
          timers.push(timer);
        },
      }));
    });
    return () => {
      controls.forEach((control) => control.stop());
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [activeNodes, nodeOffsets, reduceMotion]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    tiltXRaw.set(-y * GRAPH_TIMING.tiltDegrees);
    tiltYRaw.set(x * GRAPH_TIMING.tiltDegrees);
    graphXRaw.set(x * GRAPH_TIMING.graphParallaxPixels);
    graphYRaw.set(y * GRAPH_TIMING.graphParallaxPixels);
  }, [graphXRaw, graphYRaw, reduceMotion, tiltXRaw, tiltYRaw]);

  const handlePointerLeave = useCallback(() => {
    tiltXRaw.set(0);
    tiltYRaw.set(0);
    graphXRaw.set(0);
    graphYRaw.set(0);
  }, [graphXRaw, graphYRaw, tiltXRaw, tiltYRaw]);

  const setHovered = useCallback((id: string | null) => setHoveredNodeId(id), []);

  const tooltip = activeNode && activePositions.get(activeNode.id);
  const tooltipWidth = compact ? 194 : 206;
  const tooltipX = tooltip ? Math.max(8, Math.min(graphSize.width - tooltipWidth - 8, tooltip.x - tooltipWidth / 2)) : 0;
  const tooltipY = tooltip
    ? tooltip.y < graphSize.height / 2
      ? Math.min(graphSize.height - 58, tooltip.y + tooltip.radius + 28)
      : Math.max(8, tooltip.y - tooltip.radius - 62)
    : 0;
  const tooltipLines = activeNode ? wordWrap(activeNode.fact, compact ? 30 : 34) : [];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-sc-cyan/10 opacity-75 blur-3xl" aria-hidden="true" />
      <motion.div
        data-testid="graph-preview"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={reduceMotion ? undefined : { rotateX: tiltX, rotateY: tiltY, transformPerspective: 1050 }}
        className="relative isolate min-h-[455px] overflow-hidden rounded-2xl border border-white/10 bg-[rgba(20,32,70,0.78)] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:min-h-[410px] sm:p-6"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-[0.23]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(177, 225, 242, .32) 1px, transparent 1.2px)',
            backgroundSize: '24px 24px',
          }}
          animate={reduceMotion ? undefined : { backgroundPosition: ['0px 0px', '24px 24px'] }}
          transition={reduceMotion ? undefined : { duration: GRAPH_TIMING.dotGridDurationSeconds, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[52%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(52, 220, 232, .19) 0%, rgba(52, 220, 232, .07) 34%, transparent 72%)' }}
          animate={reduceMotion ? undefined : { opacity: [0.46, 0.9, 0.46], scale: [0.94, 1.08, 0.94] }}
          transition={reduceMotion ? undefined : { duration: GRAPH_TIMING.centerGlowDurationSeconds, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />

        <div className="relative z-20 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.17em] text-white/75 sm:text-[11px]">
              <motion.span
                className="h-2 w-2 rounded-full bg-[#62DEA4] shadow-[0_0_12px_rgba(98,222,164,.8)]"
                animate={reduceMotion ? undefined : { opacity: [1, 0.56, 1], scale: [1, 0.86, 1] }}
                transition={reduceMotion ? undefined : { duration: GRAPH_TIMING.liveIndicatorDurationSeconds, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              />
              <span>Live context graph</span>
            </div>
            <div data-testid="text-preview-status" className="mt-1.5 text-sm font-black text-white sm:text-base">RFQ decision context</div>
          </div>
          <div className="shrink-0 rounded-lg border border-white/10 bg-white/[0.055] px-2.5 py-2 font-mono text-[9px] font-bold text-white/70 shadow-inner sm:text-[10px]">
            <span className="tabular-nums text-white">{entityCount}</span> entities <span className="mx-1 text-white/25">·</span>
            <span className="tabular-nums text-white">{linkCount}</span> links
          </div>
        </div>

        <div className="absolute inset-x-3 bottom-[67px] top-[68px] z-10 sm:bottom-[61px] sm:top-[62px]">
          <motion.svg
            viewBox={`0 0 ${graphSize.width} ${graphSize.height}`}
            preserveAspectRatio="xMidYMid meet"
            role="group"
            aria-label="Connected systems, suppliers, evidence, and metrics around the Industrial Pump Package RFQ"
            className="h-full w-full overflow-visible"
            style={reduceMotion ? undefined : { x: graphX, y: graphY }}
          >
            <defs>
              <linearGradient id="landing-graph-edge-gradient" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor="#769CC6" stopOpacity=".32" />
                <stop offset="54%" stopColor="#5AC9D7" stopOpacity=".78" />
                <stop offset="100%" stopColor="#8AC3E3" stopOpacity=".42" />
              </linearGradient>
              <radialGradient id="landing-graph-hub-gradient">
                <stop offset="0%" stopColor="#318C9C" stopOpacity=".5" />
                <stop offset="100%" stopColor="#0C2746" stopOpacity=".05" />
              </radialGradient>
            </defs>

            <motion.g
              animate={reduceMotion ? undefined : { x: [-GRAPH_TIMING.graphSwayPixels, GRAPH_TIMING.graphSwayPixels, -GRAPH_TIMING.graphSwayPixels] }}
              transition={reduceMotion ? undefined : { duration: GRAPH_TIMING.graphSwayDurationSeconds, repeat: Infinity, ease: 'easeInOut' }}
            >

            <motion.circle
              cx={graphSize.center.x}
              cy={graphSize.center.y}
              r={compact ? 142 : 132}
              fill="url(#landing-graph-hub-gradient)"
              animate={reduceMotion ? undefined : { opacity: [0.55, 0.95, 0.55], scale: [0.92, 1.06, 0.92] }}
              transition={reduceMotion ? undefined : { duration: GRAPH_TIMING.centerGlowDurationSeconds, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: `${graphSize.center.x}px ${graphSize.center.y}px` }}
              aria-hidden="true"
            />

            <g>
              {graphEdges.map((edge, index) => {
                const from = activePositions.get(edge.from)!;
                const to = activePositions.get(edge.to)!;
                const edgeIsFocused = edge.from === activeFocusId || edge.to === activeFocusId
                  || (activeNeighbors.has(edge.from) && activeNeighbors.has(edge.to));
                const edgeIsActivePath = edge.kind === 'primary' && edge.from === activeFocusId && edge.to === 'rfq';
                const edgeIsDimmed = Boolean(activeFocusId && !edgeIsFocused);
                return (
                  <GraphEdgeView
                    key={edge.id}
                    edge={edge}
                    from={from}
                    to={to}
                    offsets={nodeOffsets}
                    index={index}
                    reduceMotion={reduceMotion}
                    isFocused={edgeIsFocused}
                    isActivePath={edgeIsActivePath}
                    isDimmed={edgeIsDimmed}
                  />
                );
              })}
            </g>

            {activeNodes.filter((node) => node.id !== 'rfq').map((node, index) => {
              const palette = nodePalette[node.kind];
              const hovered = hoveredNodeId === node.id;
              const connected = node.id === activeFocusId || activeNeighbors.has(node.id);
              const dimmed = Boolean(activeFocusId && !connected);
              const isOuter = !['sap', 'crm', 'email', 'contracts', 'suppliers', 'margin'].includes(node.id);
              const entryDelay = isOuter
                ? GRAPH_TIMING.outerNodeDelaySeconds + Math.max(0, index - 6) * GRAPH_TIMING.outerNodeStaggerSeconds
                : GRAPH_TIMING.innerNodeDelaySeconds + Math.max(0, index - 1) * GRAPH_TIMING.innerNodeStaggerSeconds;
              const labelWidth = Math.max(42, node.label.length * (compact ? 8.5 : 7.2) + (compact ? 18 : 15));
              const labelY = node.labelSide === 'above' ? -node.radius - 14 : node.radius + 15;
              return (
                <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
                  <motion.g
                    style={{ x: nodeOffsets.get(node.id)!.x, y: nodeOffsets.get(node.id)!.y }}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
                    animate={{ opacity: dimmed ? 0.34 : 1, scale: hovered ? 1.16 : 1 }}
                    transition={reduceMotion ? { duration: 0 } : {
                      opacity: { duration: GRAPH_TIMING.nodeOpacityTransitionSeconds },
                      scale: { type: 'spring', stiffness: GRAPH_TIMING.hoverSpringStiffness, damping: GRAPH_TIMING.hoverSpringDamping },
                      delay: entryDelay,
                    }}
                  >
                    <g
                      role="button"
                      tabIndex={0}
                      aria-label={`${node.label}. Source: ${node.source}. ${node.fact}`}
                      data-testid={`hero-graph-node-${node.id}`}
                      onMouseEnter={() => setHovered(node.id)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(node.id)}
                      onBlur={() => setHovered(null)}
                      onClick={() => setHovered(node.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setHovered(node.id);
                        }
                      }}
                      className="cursor-pointer outline-none"
                    >
                      <circle r={node.radius + (hovered ? 14 : 9)} fill={palette.color} opacity={hovered ? 0.18 : 0.1} />
                      <circle r={node.radius + 3} fill="none" stroke={palette.color} strokeOpacity={hovered ? 0.76 : 0.35} strokeWidth={hovered ? 1.7 : 1} />
                      <circle r={node.radius} fill={palette.fill} fillOpacity=".96" stroke={palette.color} strokeOpacity={hovered ? 1 : 0.82} strokeWidth={hovered ? 2 : 1.4} />
                      <circle r={Math.max(2.5, node.radius * 0.32)} fill={palette.color} opacity=".95" />
                      <rect
                        x={-labelWidth / 2}
                        y={labelY - (compact ? 11 : 10)}
                        width={labelWidth}
                        height={compact ? 22 : 20}
                        rx={compact ? 8 : 7}
                        fill="rgba(9, 20, 46, .78)"
                        stroke={palette.color}
                        strokeOpacity={hovered ? 0.85 : 0.32}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y={labelY + (compact ? 4.2 : 3.8)}
                        textAnchor="middle"
                        fill={hovered ? '#FFFFFF' : '#E5F1FB'}
                        fontSize={compact ? 14 : 12.5}
                        fontWeight="800"
                        letterSpacing=".1"
                      >
                        {node.label}
                      </text>
                    </g>
                  </motion.g>
                </g>
              );
            })}

            {activePositions.get('rfq') && (
              <g transform={`translate(${graphSize.center.x} ${graphSize.center.y})`}>
                <motion.g
                  style={{ x: nodeOffsets.get('rfq')!.x, y: nodeOffsets.get('rfq')!.y }}
                  initial={reduceMotion ? false : { scale: 0.36, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={reduceMotion ? { duration: 0 } : {
                    type: 'spring',
                    stiffness: GRAPH_TIMING.hubEntrySpringStiffness,
                    damping: GRAPH_TIMING.hubEntrySpringDamping,
                    delay: GRAPH_TIMING.hubEntryDelaySeconds,
                  }}
                >
                  {!reduceMotion && [0, 1].map((pulse) => (
                    <motion.circle
                      key={pulse}
                      r={compact ? 27 : 26}
                      fill="none"
                      stroke="#6BEAE9"
                      strokeWidth="1.4"
                      initial={{ scale: 0.92, opacity: 0.62 }}
                      animate={{ scale: [0.92, 1.85], opacity: [0.62, 0] }}
                      transition={{
                        duration: GRAPH_TIMING.hubPulseDurationSeconds,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: pulse * GRAPH_TIMING.hubPulseDurationSeconds / 2,
                      }}
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                      aria-hidden="true"
                    />
                  ))}
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label="Industrial Pump Package RFQ. Source: Smart Context. Central procurement decision."
                    data-testid="hero-graph-node-rfq"
                    onMouseEnter={() => setHovered('rfq')}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered('rfq')}
                    onBlur={() => setHovered(null)}
                    onClick={() => setHovered('rfq')}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setHovered('rfq');
                      }
                    }}
                    className="cursor-pointer outline-none"
                  >
                    <circle r={compact ? 31 : 31} fill="rgba(61, 232, 231, .12)" />
                    <circle r={compact ? 23 : 23} fill="#102746" stroke="#7AF0EB" strokeWidth="2" />
                    <circle r="9" fill="url(#landing-graph-hub-gradient)" />
                    <circle r="4.5" fill="#80F6EF" />
                    <rect x="-27" y="34" width="54" height="21" rx="8" fill="rgba(7, 20, 43, .9)" stroke="#72E7E3" strokeOpacity=".75" />
                    <text x="0" y="48.5" textAnchor="middle" fill="#E9FFFF" fontSize="12.5" fontWeight="900">RFQ</text>
                  </g>
                </motion.g>
              </g>
            )}

            {tooltip && activeNode && (
              <g className="pointer-events-none" transform={`translate(${tooltipX} ${tooltipY})`} aria-hidden="true">
                <rect width={tooltipWidth} height="52" rx="10" fill="rgba(7, 17, 41, .96)" stroke={nodePalette[activeNode.kind].color} strokeOpacity=".54" />
                <text x="11" y="16" fill={nodePalette[activeNode.kind].color} fontSize="9.5" fontWeight="900" letterSpacing=".8">
                  {activeNode.source.toUpperCase()}
                </text>
                {tooltipLines.map((line, index) => (
                  <text key={line} x="11" y={31 + index * 13} fill="#F4F8FD" fontSize={compact ? 11 : 10.5} fontWeight="700">
                    {line}
                  </text>
                ))}
              </g>
            )}
            </motion.g>
          </motion.svg>
        </div>

        <div className="absolute bottom-4 left-5 right-5 z-20 border-t border-white/10 pt-3 sm:left-6 sm:right-6">
          <div className="flex min-h-5 items-center justify-between gap-3 text-[9px] font-bold sm:text-[10px]">
            <div className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-white/75">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={cycleCaption}
                  initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: GRAPH_TIMING.captionTransitionSeconds }}
                  className="inline-block"
                  data-testid="text-graph-cycle-caption"
                >
                  {cycleCaption}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 text-[#8BE6B8]">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-[#68DCA3]"
                animate={reduceMotion ? undefined : { opacity: [0.58, 1, 0.58], scale: [0.92, 1.16, 0.92] }}
                transition={reduceMotion ? undefined : {
                  duration: GRAPH_TIMING.syncTickDurationSeconds,
                  repeat: Infinity,
                  repeatDelay: GRAPH_TIMING.syncTickRepeatDelaySeconds,
                  ease: 'easeInOut',
                }}
                aria-hidden="true"
              />
              <span>Synced just now</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}