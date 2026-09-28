import { motion, useReducedMotion } from 'framer-motion';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { graphEdges, graphNodes, traceSteps, type GraphEdge, type GraphNode } from '../pages/context-graph-data';

const VIEWBOX = '0 0 1000 720';

function edgePath(edge: GraphEdge, nodeMap: Map<string, GraphNode>) {
  const from = nodeMap.get(edge.from)!;
  const to = nodeMap.get(edge.to)!;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const start = { x: from.x + ux * from.radius, y: from.y + uy * from.radius };
  const end = { x: to.x - ux * to.radius, y: to.y - uy * to.radius };
  const bend = edge.bend ?? 0;
  const normalX = -uy;
  const normalY = ux;
  const c1 = { x: start.x + dx * 0.42 + normalX * bend, y: start.y + dy * 0.42 + normalY * bend };
  const c2 = { x: end.x - dx * 0.42 + normalX * bend, y: end.y - dy * 0.42 + normalY * bend };
  return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
}

function GraphEdgeView({
  edge,
  nodeMap,
  index,
  isHovered,
  isSelected,
  isTraceActive,
  isTraceComplete,
  reduceMotion,
}: {
  edge: GraphEdge;
  nodeMap: Map<string, GraphNode>;
  index: number;
  isHovered: boolean;
  isSelected: boolean;
  isTraceActive: boolean;
  isTraceComplete: boolean;
  reduceMotion: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [labelPoint, setLabelPoint] = useState({ x: 0, y: 0 });
  const d = useMemo(() => edgePath(edge, nodeMap), [edge, nodeMap]);
  const labelWidth = Math.max(66, edge.label.length * 6.4 + 22);
  const labelVisible = isHovered || isSelected || isTraceActive || isTraceComplete;
  const edgeColor = isTraceActive ? '#4EE1DE' : isTraceComplete ? '#2FA9B8' : isHovered || isSelected ? '#23B6C4' : '#AEBCCC';

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const point = path.getPointAtLength(path.getTotalLength() / 2);
    setLabelPoint({ x: point.x, y: point.y });
  }, [d]);

  return (
    <g>
      <motion.path
        ref={pathRef}
        id={`graph-edge-${edge.id}`}
        d={d}
        fill="none"
        stroke={edgeColor}
        strokeWidth={isTraceActive ? 4 : isHovered || isSelected || isTraceComplete ? 2.8 : 1.5}
        strokeLinecap="round"
        markerEnd={isTraceActive || isTraceComplete || isHovered || isSelected ? 'url(#graph-arrow-active)' : 'url(#graph-arrow)'}
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0.3 }}
        animate={{ pathLength: 1, opacity: isHovered || isSelected || isTraceActive || isTraceComplete ? 1 : 0.62 }}
        transition={reduceMotion ? { duration: 0 } : { pathLength: { duration: 0.3, delay: 0.2 + index * 0.008, ease: 'easeOut' }, opacity: { duration: 0.2 } }}
        className="sc-graph-path"
        aria-hidden="true"
      />
      {labelVisible && (
        <g className="pointer-events-none">
          <rect x={labelPoint.x - labelWidth / 2} y={labelPoint.y - 12} width={labelWidth} height="24" rx="12" fill="#FFFFFF" stroke={isTraceActive ? '#8BE6E4' : '#DDE7EF'} strokeWidth="1" />
          <text x={labelPoint.x} y={labelPoint.y + 3.5} textAnchor="middle" fontSize="11" fontWeight="800" fill={isTraceActive ? '#087C85' : '#52647B'}>{edge.label}</text>
        </g>
      )}
      {edge.flow && !reduceMotion && (
        <circle r={isTraceActive ? 4 : 2.5} fill={isTraceActive ? '#E6FFFF' : '#65DAE1'} className={isTraceActive ? 'sc-flow-particle is-tracing' : 'sc-flow-particle'} aria-hidden="true">
          <animateMotion
            dur={isTraceActive ? '1.1s' : `${5.2 + (index % 4) * 0.55}s`}
            begin={isTraceActive ? '0s' : `${(index % 6) * 0.65}s`}
            repeatCount="indefinite"
            path={d}
          />
        </circle>
      )}
    </g>
  );
}

export function GraphCanvas({
  selectedId,
  onSelect,
  tracing,
  traceStep,
  onStopTrace,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  tracing: boolean;
  traceStep: number;
  onStopTrace: () => void;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const nodeMap = useMemo(() => new Map(graphNodes.map((node) => [node.id, node])), []);
  const relatedIds = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    const related = new Set([hoveredId]);
    graphEdges.forEach((edge) => {
      if (edge.from === hoveredId) related.add(edge.to);
      if (edge.to === hoveredId) related.add(edge.from);
    });
    return related;
  }, [hoveredId]);
  const traceEdgeIds = new Set(traceSteps.slice(0, traceStep).map((step) => step.edgeId).filter(Boolean));
  const activeTraceEdgeId = tracing ? traceSteps[traceStep]?.edgeId : null;
  const groups: GraphNode['group'][] = ['source', 'context', 'person', 'evidence'];
  const currentTraceNode = tracing ? traceSteps[traceStep]?.nodeId : null;

  return (
    <div className="sc-graph-scroll relative mt-4 overflow-auto rounded-lg border border-sc-line bg-[#F8FAFC]">
      <svg viewBox={VIEWBOX} className="block h-auto min-w-[900px] w-full" role="img" aria-label="Interactive context graph with systems, enterprise entities, evidence, and labeled relationships">
        <defs>
          <pattern id="graph-dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#C7D3E0" opacity="0.48" />
          </pattern>
          <radialGradient id="graph-center-glow">
            <stop offset="0%" stopColor="#BEEFF2" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="graph-source-fill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E8F1F8" />
          </linearGradient>
          <linearGradient id="graph-context-fill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#DBF5F6" />
          </linearGradient>
          <linearGradient id="graph-person-fill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFF0DF" />
          </linearGradient>
          <filter id="graph-soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#203653" floodOpacity="0.16" />
          </filter>
          <filter id="graph-node-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="graph-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="#AEBCCC" />
          </marker>
          <marker id="graph-arrow-active" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="#23B6C4" />
          </marker>
        </defs>
        <rect width="1000" height="720" fill="url(#graph-dot-grid)" />
        <ellipse cx="490" cy="360" rx="250" ry="330" fill="url(#graph-center-glow)" />
        <text x="44" y="42" className="sc-graph-column-label">SYSTEMS</text>
        <text x="385" y="42" className="sc-graph-column-label">BUSINESS CONTEXT</text>
        <text x="770" y="42" className="sc-graph-column-label">EVIDENCE</text>

        {graphEdges.map((edge, index) => {
          const incident = edge.from === selectedId || edge.to === selectedId;
          const hovered = Boolean(hoveredId && (edge.from === hoveredId || edge.to === hoveredId));
          const isActiveTraceEdge = edge.id === activeTraceEdgeId;
          const isTraceComplete = traceEdgeIds.has(edge.id);
          const dimmed = Boolean(hoveredId && !relatedIds.has(edge.from) && !relatedIds.has(edge.to));
          return (
            <g key={edge.id} opacity={dimmed ? 0.25 : 1} className="transition-opacity">
              <GraphEdgeView
                edge={edge}
                nodeMap={nodeMap}
                index={index}
                isHovered={hovered}
                isSelected={incident}
                isTraceActive={isActiveTraceEdge}
                isTraceComplete={isTraceComplete}
                reduceMotion={reduceMotion}
              />
            </g>
          );
        })}

        {groups.flatMap((group) => graphNodes.filter((node) => node.group === group).map((node, index) => {
          const Icon = node.icon;
          const active = node.id === selectedId || node.id === currentTraceNode;
          const hovered = node.id === hoveredId;
          const dimmed = Boolean(hoveredId && !relatedIds.has(node.id));
          const isSource = node.group === 'source';
          const isEvidence = node.group === 'evidence';
          const entryDelay = isSource ? index * 0.045 : isEvidence ? 0.58 + index * 0.035 : 0.38 + index * 0.04;
          const gradient = node.group === 'source' ? 'url(#graph-source-fill)' : node.group === 'person' ? 'url(#graph-person-fill)' : 'url(#graph-context-fill)';
          const stroke = node.group === 'source' ? '#9CB5CA' : node.group === 'person' ? '#C9772C' : '#4ECBDE';
          const ink = node.group === 'person' ? '#A35A18' : '#1C77BE';
          return (
            <g
              key={node.id}
              transform={`translate(${node.x} ${node.y})`}
              role="button"
              tabIndex={0}
              aria-label={`Select ${node.label}`}
              aria-pressed={active}
              onClick={() => { onSelect(node.id); onStopTrace(); }}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(node.id)}
              onBlur={() => setHoveredId(null)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(node.id);
                  onStopTrace();
                }
              }}
              opacity={dimmed ? 0.25 : 1}
              className="sc-graph-node-group cursor-pointer transition-opacity"
            >
              <motion.g
                animate={reduceMotion ? undefined : { y: [0, -2, 0, 2, 0] }}
                transition={reduceMotion ? undefined : { duration: 7 + index * 0.23, repeat: Infinity, ease: 'easeInOut', delay: index * 0.16 }}
              >
                <motion.g
                  initial={reduceMotion ? false : { opacity: 0.2, scale: 0.76 }}
                  animate={{ opacity: dimmed ? 0.25 : 1, scale: hovered ? 1.08 : 1 }}
                  transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 19, delay: entryDelay }}
                >
                  {tracing && currentTraceNode === node.id && !reduceMotion && (
                    <motion.circle
                      key={`${node.id}-${traceStep}`}
                      r={node.radius}
                      fill="none"
                      stroke={stroke}
                      strokeWidth="2"
                      initial={{ r: node.radius, opacity: 0.8 }}
                      animate={{ r: node.radius + 30, opacity: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  )}
                  {active && <circle r={node.radius + 10} fill="none" stroke={stroke} strokeWidth="2" opacity="0.55" filter="url(#graph-node-glow)" />}
                  <circle r={node.radius} fill={gradient} stroke={stroke} strokeWidth={active || hovered ? 2.5 : 1.5} filter="url(#graph-soft-shadow)" />
                  <Icon x={-9} y={-9} width={18} height={18} color={ink} aria-hidden="true" />
                  <text y={node.radius + 19} textAnchor="middle" className="sc-graph-node-label">{node.label}</text>
                </motion.g>
              </motion.g>
            </g>
          );
        }))}
      </svg>
    </div>
  );
}