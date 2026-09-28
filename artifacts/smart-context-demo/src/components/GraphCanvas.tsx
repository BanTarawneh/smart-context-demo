import { animate, motion, motionValue, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { graphEdges, graphNodes, traceSteps, type GraphEdge, type GraphNode } from '../pages/context-graph-data';

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 760;
const VIEWBOX = `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`;
const LAYOUT_STORAGE_KEY = 'smart-context-graph-layout-v1';
const LAYOUT_SPRING = { type: 'spring' as const, stiffness: 520, damping: 38 };
const LABEL_SAMPLE_POINTS = [0.5, 0.35, 0.65, 0.25, 0.75, 0.15, 0.85];

type GraphPoint = { x: number; y: number };
type NodePositionValues = { x: MotionValue<number>; y: MotionValue<number> };
type SavedLayout = Record<string, GraphPoint>;
type ActiveDrag = {
  nodeId: string;
  pointerId: number;
  startClient: GraphPoint;
  startSvg: GraphPoint;
  startPosition: GraphPoint;
  lastSvg: GraphPoint;
  lastTime: number;
  velocity: GraphPoint;
  moved: boolean;
};

export type GraphCanvasHandle = {
  resetLayout: () => void;
};

function labelWidth(label: string) {
  return Math.max(32, label.length * 8 + 12);
}

function clampPosition(node: GraphNode, point: GraphPoint): GraphPoint {
  const horizontalPad = Math.max(node.radius + 14, labelWidth(node.label) / 2 + 12);
  const minX = horizontalPad;
  const maxX = VIEWBOX_WIDTH - horizontalPad;
  const minY = Math.max(76, node.radius + 18);
  const maxY = VIEWBOX_HEIGHT - node.radius - 40;
  return {
    x: Math.max(minX, Math.min(maxX, point.x)),
    y: Math.max(minY, Math.min(maxY, point.y)),
  };
}

function readSavedLayout(): SavedLayout {
  if (typeof window === 'undefined') return {};
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(LAYOUT_STORAGE_KEY) ?? '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const saved: SavedLayout = {};
    for (const node of graphNodes) {
      const point = (parsed as Record<string, unknown>)[node.id];
      if (
        point
        && typeof point === 'object'
        && typeof (point as GraphPoint).x === 'number'
        && Number.isFinite((point as GraphPoint).x)
        && typeof (point as GraphPoint).y === 'number'
        && Number.isFinite((point as GraphPoint).y)
      ) {
        saved[node.id] = clampPosition(node, point as GraphPoint);
      }
    }
    return saved;
  } catch {
    return {};
  }
}

function edgePath(
  edge: GraphEdge,
  from: GraphNode,
  to: GraphNode,
  fromX = from.x,
  fromY = from.y,
  toX = to.x,
  toY = to.y,
) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const start = { x: fromX + ux * from.radius, y: fromY + uy * from.radius };
  const end = { x: toX - ux * to.radius, y: toY - uy * to.radius };
  const bend = edge.bend ?? 0;
  const normalX = -uy;
  const normalY = ux;
  const c1 = { x: start.x + dx * 0.42 + normalX * bend, y: start.y + dy * 0.42 + normalY * bend };
  const c2 = { x: end.x - dx * 0.42 + normalX * bend, y: end.y - dy * 0.42 + normalY * bend };
  return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
}

function labelOverlapsNode(
  point: GraphPoint,
  edgeLabelWidth: number,
  node: GraphNode,
  nodePoint: GraphPoint,
) {
  const edgeHalfWidth = edgeLabelWidth / 2;
  const edgeHalfHeight = 12;
  const dx = Math.max(0, Math.abs(point.x - nodePoint.x) - edgeHalfWidth);
  const dy = Math.max(0, Math.abs(point.y - nodePoint.y) - edgeHalfHeight);
  if (dx * dx + dy * dy < (node.radius + 12) ** 2) return true;

  const nodeLabelHalfWidth = labelWidth(node.label) / 2;
  const nodeLabelTop = nodePoint.y + node.radius + 6;
  const nodeLabelBottom = nodePoint.y + node.radius + 26;
  const edgeTop = point.y - edgeHalfHeight;
  const edgeBottom = point.y + edgeHalfHeight;
  return (
    Math.abs(point.x - nodePoint.x) < edgeHalfWidth + nodeLabelHalfWidth
    && edgeBottom >= nodeLabelTop
    && edgeTop <= nodeLabelBottom
  );
}

function GraphEdgeView({
  edge,
  nodeMap,
  nodePositions,
  nodeOffsets,
  index,
  isHovered,
  isSelected,
  isDimmed,
  isTraceActive,
  isTraceComplete,
  reduceMotion,
}: {
  edge: GraphEdge;
  nodeMap: Map<string, GraphNode>;
  nodePositions: Map<string, NodePositionValues>;
  nodeOffsets: Map<string, MotionValue<number>>;
  index: number;
  isHovered: boolean;
  isSelected: boolean;
  isDimmed: boolean;
  isTraceActive: boolean;
  isTraceComplete: boolean;
  reduceMotion: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const labelX = useMotionValue(0);
  const labelY = useMotionValue(0);
  const labelOpacity = useMotionValue(0);
  const labelVisible = isHovered || isSelected || isTraceActive || isTraceComplete;
  const labelVisibleRef = useRef(labelVisible);
  const edgeHoveredRef = useRef(isHovered);
  labelVisibleRef.current = labelVisible;
  edgeHoveredRef.current = isHovered;
  const from = nodeMap.get(edge.from)!;
  const to = nodeMap.get(edge.to)!;
  const fromPosition = nodePositions.get(edge.from)!;
  const toPosition = nodePositions.get(edge.to)!;
  const fromOffset = nodeOffsets.get(edge.from)!;
  const toOffset = nodeOffsets.get(edge.to)!;
  const d = useTransform(
    [fromPosition.x, fromPosition.y, toPosition.x, toPosition.y, fromOffset, toOffset],
    (latest: number[]) => edgePath(
      edge,
      from,
      to,
      latest[0],
      latest[1] + latest[4],
      latest[2],
      latest[3] + latest[5],
    ),
  );
  const edgeLabelWidth = Math.max(66, edge.label.length * 6.4 + 22);
  const edgeColor = isTraceActive ? '#4EE1DE' : isTraceComplete ? '#2FA9B8' : isHovered || isSelected ? '#23B6C4' : '#AEBCCC';

  const updateLabelPosition = useCallback(() => {
    const path = pathRef.current;
    if (!path || !labelVisibleRef.current) {
      labelOpacity.set(0);
      return;
    }

    const pathLength = path.getTotalLength();
    if (!pathLength) {
      labelOpacity.set(0);
      return;
    }

    const nodePoints = graphNodes.map((node) => ({
      node,
      point: {
        x: nodePositions.get(node.id)!.x.get(),
        y: nodePositions.get(node.id)!.y.get() + nodeOffsets.get(node.id)!.get(),
      },
    }));
    let selectedPoint: GraphPoint | null = null;
    let midpoint: GraphPoint | null = null;
    for (const ratio of LABEL_SAMPLE_POINTS) {
      const candidate = path.getPointAtLength(pathLength * ratio);
      const point = { x: candidate.x, y: candidate.y };
      if (ratio === 0.5) midpoint = point;
      const collision = nodePoints.some(({ node, point: nodePoint }) => (
        labelOverlapsNode(point, edgeLabelWidth, node, nodePoint)
      ));
      if (!collision) {
        selectedPoint = point;
        break;
      }
    }

    const point = selectedPoint ?? midpoint ?? path.getPointAtLength(pathLength / 2);
    labelX.set(point.x);
    labelY.set(point.y);
    labelOpacity.set(selectedPoint || edgeHoveredRef.current ? 1 : 0);
  }, [edgeLabelWidth, labelOpacity, labelX, labelY, nodeOffsets, nodePositions]);

  useMotionValueEvent(d, 'change', updateLabelPosition);
  useLayoutEffect(() => {
    updateLabelPosition();
  }, [labelVisible, updateLabelPosition]);

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
        animate={{ pathLength: 1, opacity: isDimmed ? 0.25 : isHovered || isSelected || isTraceActive || isTraceComplete ? 1 : 0.62 }}
        transition={reduceMotion ? { duration: 0 } : { pathLength: { duration: 0.3, delay: 0.55 + index * 0.025, ease: 'easeOut' }, opacity: { duration: 0.2 } }}
        className="sc-graph-path"
        aria-hidden="true"
      />
      <motion.g className="pointer-events-none" style={{ x: labelX, y: labelY, opacity: labelOpacity }}>
        <rect x={-edgeLabelWidth / 2} y="-12" width={edgeLabelWidth} height="24" rx="12" fill="#FFFFFF" stroke={isTraceActive ? '#8BE6E4' : '#DDE7EF'} strokeWidth="1" />
        <text y="3.5" textAnchor="middle" fontSize="11" fontWeight="800" fill={isTraceActive ? '#087C85' : '#52647B'}>{edge.label}</text>
      </motion.g>
      {edge.flow && !reduceMotion && (
        <circle r={isTraceActive ? 4 : 2.5} fill={isTraceActive ? '#E6FFFF' : '#65DAE1'} className={isTraceActive ? 'sc-flow-particle is-tracing' : 'sc-flow-particle'} aria-hidden="true">
          <animateMotion
            dur={isTraceActive ? '1.1s' : `${5.2 + (index % 4) * 0.55}s`}
            begin={isTraceActive ? '0s' : `${(index % 6) * 0.65}s`}
            repeatCount="indefinite"
          >
            <mpath href={`#graph-edge-${edge.id}`} />
          </animateMotion>
        </circle>
      )}
    </g>
  );
}

type GraphCanvasProps = {
  selectedId: string;
  onSelect: (id: string) => void;
  tracing: boolean;
  traceStep: number;
  onStopTrace: () => void;
  layoutLocked: boolean;
};

export const GraphCanvas = forwardRef<GraphCanvasHandle, GraphCanvasProps>(function GraphCanvas({
  selectedId,
  onSelect,
  tracing,
  traceStep,
  onStopTrace,
  layoutLocked,
}, ref) {
  const reduceMotion = useReducedMotion() ?? false;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [savedLayout] = useState(readSavedLayout);
  const nodeMap = useMemo(() => new Map(graphNodes.map((node) => [node.id, node])), []);
  const nodePositions = useMemo(() => new Map(graphNodes.map((node) => {
    const position = clampPosition(node, savedLayout[node.id] ?? { x: node.x, y: node.y });
    return [node.id, { x: motionValue(position.x), y: motionValue(position.y) }];
  })), [savedLayout]);
  const nodeOffsets = useMemo(() => new Map(graphNodes.map((node) => [node.id, motionValue(0)])), []);
  const svgRef = useRef<SVGSVGElement>(null);
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const suppressClickRef = useRef<string | null>(null);
  const suppressClickTimerRef = useRef<number | null>(null);
  const floatControlsRef = useRef(new Map<string, { stop: () => void }>());
  const settleControlsRef = useRef(new Map<string, Array<{ stop: () => void }>>());

  const saveLayout = useCallback(() => {
    const layout: SavedLayout = {};
    graphNodes.forEach((node) => {
      const position = nodePositions.get(node.id)!;
      layout[node.id] = { x: position.x.get(), y: position.y.get() };
    });
    try {
      window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
    } catch {
      // Layout persistence is optional when storage is unavailable or full.
    }
  }, [nodePositions]);

  const startFloat = useCallback((node: GraphNode, index: number, delay = 0) => {
    if (reduceMotion) return;
    floatControlsRef.current.get(node.id)?.stop();
    const offset = nodeOffsets.get(node.id)!;
    const start = offset.get();
    const control = animate(
      offset,
      [start, -3, start, 3, start],
      { duration: 7 + index * 0.23, delay, repeat: Infinity, ease: 'easeInOut' },
    );
    floatControlsRef.current.set(node.id, control);
  }, [nodeOffsets, reduceMotion]);

  useEffect(() => {
    graphNodes.forEach((node, index) => startFloat(node, index, index * 0.16));
    return () => {
      floatControlsRef.current.forEach((control) => control.stop());
      settleControlsRef.current.forEach((controls) => controls.forEach((control) => control.stop()));
    };
  }, [startFloat]);

  const toSvgPoint = useCallback((event: { clientX: number; clientY: number }): GraphPoint | null => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: point.x, y: point.y };
  }, []);

  const settleNode = useCallback((node: GraphNode, target: GraphPoint) => {
    const position = nodePositions.get(node.id)!;
    settleControlsRef.current.get(node.id)?.forEach((control) => control.stop());
    if (reduceMotion) {
      position.x.set(target.x);
      position.y.set(target.y);
      saveLayout();
      return;
    }
    let completedAxes = 0;
    const onComplete = () => {
      completedAxes += 1;
      if (completedAxes === 2) {
        settleControlsRef.current.delete(node.id);
        saveLayout();
      }
    };
    const xControl = animate(position.x, target.x, { ...LAYOUT_SPRING, onComplete });
    const yControl = animate(position.y, target.y, {
      ...LAYOUT_SPRING,
      onComplete,
    });
    settleControlsRef.current.set(node.id, [xControl, yControl]);
  }, [nodePositions, reduceMotion, saveLayout]);

  const resetLayout = useCallback(() => {
    settleControlsRef.current.forEach((controls) => controls.forEach((control) => control.stop()));
    settleControlsRef.current.clear();
    try {
      window.localStorage.removeItem(LAYOUT_STORAGE_KEY);
    } catch {
      // Reset still works in memory when storage is unavailable.
    }
    graphNodes.forEach((node) => {
      const position = nodePositions.get(node.id)!;
      if (reduceMotion) {
        position.x.set(node.x);
        position.y.set(node.y);
      } else {
        const xControl = animate(position.x, node.x, LAYOUT_SPRING);
        const yControl = animate(position.y, node.y, LAYOUT_SPRING);
        settleControlsRef.current.set(node.id, [xControl, yControl]);
      }
    });
  }, [nodePositions, reduceMotion]);

  useImperativeHandle(ref, () => ({ resetLayout }), [resetLayout]);

  const handlePointerDown = useCallback((
    event: ReactPointerEvent<SVGGElement>,
    node: GraphNode,
  ) => {
    if (layoutLocked || activeDragRef.current || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const startSvg = toSvgPoint(event);
    if (!startSvg) return;
    if (suppressClickTimerRef.current !== null) window.clearTimeout(suppressClickTimerRef.current);
    suppressClickRef.current = null;
    svgRef.current?.setPointerCapture(event.pointerId);
    settleControlsRef.current.get(node.id)?.forEach((control) => control.stop());
    settleControlsRef.current.delete(node.id);
    activeDragRef.current = {
      nodeId: node.id,
      pointerId: event.pointerId,
      startClient: { x: event.clientX, y: event.clientY },
      startSvg,
      startPosition: {
        x: nodePositions.get(node.id)!.x.get(),
        y: nodePositions.get(node.id)!.y.get(),
      },
      lastSvg: startSvg,
      lastTime: event.timeStamp,
      velocity: { x: 0, y: 0 },
      moved: false,
    };
    setHoveredId(node.id);
  }, [layoutLocked, nodePositions, toSvgPoint]);

  const handlePointerMove = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
    const drag = activeDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const node = nodeMap.get(drag.nodeId);
    if (!node) return;
    const svgPoint = toSvgPoint(event);
    if (!svgPoint) return;
    if (!drag.moved) {
      const clientDistance = Math.hypot(
        event.clientX - drag.startClient.x,
        event.clientY - drag.startClient.y,
      );
      if (clientDistance < 4) return;
      drag.moved = true;
      floatControlsRef.current.get(node.id)?.stop();
      floatControlsRef.current.delete(node.id);
      setDraggingId(node.id);
    }
    const elapsedSeconds = Math.max(0.001, (event.timeStamp - drag.lastTime) / 1000);
    drag.velocity = {
      x: (svgPoint.x - drag.lastSvg.x) / elapsedSeconds,
      y: (svgPoint.y - drag.lastSvg.y) / elapsedSeconds,
    };
    drag.lastSvg = svgPoint;
    drag.lastTime = event.timeStamp;
    const position = clampPosition(node, {
      x: drag.startPosition.x + svgPoint.x - drag.startSvg.x,
      y: drag.startPosition.y + svgPoint.y - drag.startSvg.y,
    });
    nodePositions.get(node.id)!.x.set(position.x);
    nodePositions.get(node.id)!.y.set(position.y);
  }, [nodeMap, nodePositions, toSvgPoint]);

  const finishPointer = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
    const drag = activeDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    activeDragRef.current = null;
    const node = nodeMap.get(drag.nodeId);
    if (!node) return;
    if (!drag.moved) {
      onSelect(node.id);
      onStopTrace();
      if (event.pointerType === 'touch') setHoveredId(null);
      return;
    }

    const finalSvg = toSvgPoint(event) ?? drag.lastSvg;
    const position = clampPosition(node, {
      x: drag.startPosition.x + finalSvg.x - drag.startSvg.x,
      y: drag.startPosition.y + finalSvg.y - drag.startSvg.y,
    });
    const target = clampPosition(node, {
      x: position.x + Math.max(-4, Math.min(4, drag.velocity.x * 0.02)),
      y: position.y + Math.max(-4, Math.min(4, drag.velocity.y * 0.02)),
    });
    nodePositions.get(node.id)!.x.set(position.x);
    nodePositions.get(node.id)!.y.set(position.y);
    suppressClickRef.current = node.id;
    if (suppressClickTimerRef.current !== null) window.clearTimeout(suppressClickTimerRef.current);
    suppressClickTimerRef.current = window.setTimeout(() => {
      suppressClickRef.current = null;
      suppressClickTimerRef.current = null;
    }, 0);
    setDraggingId(null);
    if (event.pointerType === 'touch') setHoveredId(null);
    settleNode(node, target);
    startFloat(node, graphNodes.indexOf(node));
  }, [nodeMap, nodePositions, onSelect, onStopTrace, settleNode, startFloat, toSvgPoint]);

  const handleNodeClick = useCallback((event: React.MouseEvent<SVGGElement>, node: GraphNode) => {
    if (suppressClickRef.current === node.id) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = null;
      if (suppressClickTimerRef.current !== null) window.clearTimeout(suppressClickTimerRef.current);
      suppressClickTimerRef.current = null;
      return;
    }
    onSelect(node.id);
    onStopTrace();
  }, [onSelect, onStopTrace]);

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
      <svg
        ref={svgRef}
        viewBox={VIEWBOX}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        className="block h-auto min-w-[900px] w-full"
        role="img"
        aria-label="Interactive context graph with systems, enterprise entities, evidence, and labeled relationships"
      >
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
        <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#graph-dot-grid)" />
        <ellipse cx="490" cy="380" rx="250" ry="350" fill="url(#graph-center-glow)" />
        <text x="44" y="42" className="sc-graph-column-label">SYSTEMS</text>
        <text x="385" y="42" className="sc-graph-column-label">BUSINESS CONTEXT</text>
        <text x="770" y="42" className="sc-graph-column-label">EVIDENCE</text>

        {graphEdges.map((edge, index) => {
          const incident = edge.from === selectedId || edge.to === selectedId;
          const hovered = Boolean(hoveredId && (edge.from === hoveredId || edge.to === hoveredId));
          const isActiveTraceEdge = edge.id === activeTraceEdgeId;
          const isTraceComplete = traceEdgeIds.has(edge.id);
          const dimmed = Boolean(hoveredId && edge.from !== hoveredId && edge.to !== hoveredId);
          return (
            <g key={edge.id} className="transition-opacity">
              <GraphEdgeView
                edge={edge}
                nodeMap={nodeMap}
                nodePositions={nodePositions}
                nodeOffsets={nodeOffsets}
                index={index}
                isHovered={hovered}
                isSelected={incident}
                isDimmed={dimmed}
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
          const isDragging = node.id === draggingId;
          const dimmed = Boolean(hoveredId && !relatedIds.has(node.id));
          const isSource = node.group === 'source';
          const isEvidence = node.group === 'evidence';
          const entryDelay = isSource ? index * 0.08 : isEvidence ? 2 + index * 0.06 : 1.45 + index * 0.08;
          const gradient = node.group === 'source' ? 'url(#graph-source-fill)' : node.group === 'person' ? 'url(#graph-person-fill)' : 'url(#graph-context-fill)';
          const stroke = node.group === 'source' ? '#9CB5CA' : node.group === 'person' ? '#C9772C' : '#4ECBDE';
          const ink = node.group === 'person' ? '#A35A18' : '#1C77BE';
          const position = nodePositions.get(node.id)!;
          return (
            <motion.g
              key={node.id}
              style={{ x: position.x, y: position.y, touchAction: 'none', userSelect: 'none' }}
              role="button"
              tabIndex={0}
              aria-label={`Select ${node.label}${layoutLocked ? '' : ' or drag to move'}`}
              aria-pressed={active}
              onClick={(event) => handleNodeClick(event, node)}
              onPointerDown={(event) => handlePointerDown(event, node)}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => {
                if (activeDragRef.current?.nodeId !== node.id) {
                  setHoveredId((current) => current === node.id ? null : current);
                }
              }}
              onFocus={() => setHoveredId(node.id)}
              onBlur={() => setHoveredId((current) => current === node.id ? null : current)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(node.id);
                  onStopTrace();
                }
              }}
              className={`sc-graph-node-group transition-opacity ${layoutLocked ? 'cursor-pointer' : isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
              <motion.g style={{ y: nodeOffsets.get(node.id)! }}>
                <motion.g
                  initial={reduceMotion ? false : { opacity: 0.2, scale: 0.76 }}
                  animate={{ opacity: dimmed ? 0.25 : 1, scale: isDragging ? 1.1 : hovered ? 1.08 : 1 }}
                  transition={reduceMotion ? { duration: 0 } : isDragging ? LAYOUT_SPRING : { type: 'spring', stiffness: 240, damping: 19, delay: active ? 0 : entryDelay }}
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
                  <circle r={node.radius} fill={gradient} stroke={stroke} strokeWidth={active || hovered || isDragging ? 2.5 : 1.5} filter={hovered || isDragging ? 'url(#graph-node-glow)' : 'url(#graph-soft-shadow)'} />
                  <Icon x={-9} y={-9} width={18} height={18} color={ink} aria-hidden="true" />
                  <text y={node.radius + 19} textAnchor="middle" className="sc-graph-node-label">{node.label}</text>
                </motion.g>
              </motion.g>
            </motion.g>
          );
        }))}
      </svg>
    </div>
  );
});