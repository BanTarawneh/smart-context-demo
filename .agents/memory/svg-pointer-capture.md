---
name: SVG pointer capture
description: Pointer capture behavior for drag interactions inside nested SVG graphics.
---

For SVG graph dragging that can leave the node's bounds, set pointer capture on the root `<svg>` and handle move, up, and cancel events there. Capturing on a nested `<g>` did not preserve the drag after the pointer left that group in Chromium.

**Why:** During a browser-level drag test, pointer events retargeted to the graph background as soon as the pointer left the node, so movement stopped. Root SVG capture kept the drag active and allowed the new position to persist.

**How to apply:** Keep the active node ID in a ref, use the root SVG as the pointer lifecycle target, and resolve the node from that ref during move/up/cancel handling.