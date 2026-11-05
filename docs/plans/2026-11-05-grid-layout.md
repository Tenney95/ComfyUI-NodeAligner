# Grid Layout Fix Implementation Plan

**Goal:** Include offset nodes in alignment while preserving established rows and columns in larger selections.

**Architecture:** Share deterministic row/column recognition across alignment and distribution. Keep graph transactions and node resizing unchanged.

**Tech Stack:** Existing browser JavaScript and dependency-free Node regression harness.

## Behavior

- Left/right/horizontal-center alignment works within columns; top/bottom/vertical-center alignment works within rows.
- Horizontal distribution works within rows; vertical distribution works within columns. Distribution changes only its own axis.
- Recognize tracks from node positions and sizes, including already aligned starts, centers, or ends. Sort geometrically so selection order cannot change the result.
- Require at least two repeated tracks before preserving multiple tracks. Otherwise treat the selection as one row/column, including the reported three-aligned-plus-one-offset case.
- Each track uses its own bounds and dimensions. If space is insufficient, expand from its first node with at least 20 units between nodes.
- Alignment keeps established tracks separate; overlapping track bounds move forward to leave at least 20 units between tracks.
- Preserve node sizes and unselected nodes. Repeated actions should settle after one click and each action remains one undo step.

## Implementation

1. Extend `tests/node_info.test.cjs` with the reported four-node case, irregular grids, missing cells, unequal sizes, reversed selection order, repeated actions, and overlap.
2. In `node_info.js`, replace the old threshold/grouping rules with shared track recognition and axis-based alignment/distribution.
3. Update the patch version and README with the actual behavior, including the sparse-layout ambiguity.
4. Run syntax, regression, and diff checks; validate a four-node offset column and a multi-row grid in the real frontend before committing and pushing the follow-up.

## Validation

- 32 regression checks pass, including the originally reported offset column, heterogeneous grids, missing cells, overlap, rendered dimensions, selection order, and repeated actions.
- A fixed seed of 2,500 sparse three-column layouts across eight actions (20,000 checks) has no selection-order differences or repeated-action drift.
- Real frontend validation includes all four offset nodes participating in left alignment, single-step undo, and a two-row/three-column layout retaining its tracks. In Nodes 2.0, the actual rendered right edges align within each column and repeated clicks preserve the result.
- Temporary workflows were discarded and the original renderer setting restored. Pointer events from workspace tabs and sidebars no longer reposition the temporary toolbar.
