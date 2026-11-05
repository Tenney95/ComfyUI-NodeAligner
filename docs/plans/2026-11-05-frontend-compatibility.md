# Frontend Compatibility Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Keep NodeAligner's existing toolbar working with current ComfyUI frontends.

**Architecture:** Register through the ComfyUI extension lifecycle and use its current canvas. Keep the existing layout algorithms; wrap toolbar edits in graph change notifications and use the node resize API.

**Tech Stack:** Browser JavaScript, ComfyUI app/LiteGraph APIs, Node.js built-in assertions.

## Scope and choices

- Prefer a targeted compatibility update over a UI rewrite or replacing the toolbar with native menus. Preserve grouping, distribution, maximum/minimum size controls, and existing saved settings.
- Use `selectedItems` when available, with the older node-selection API as a fallback.
- Fix duplicate document drag listeners, viewport positioning, and setup/cleanup together because they share the toolbar lifecycle.
- Do not upgrade the user's ComfyUI installation or introduce dependencies.

## Task 1: Reproduce failures

**Files:** Create `tests/node_info.test.cjs`.

Use a small Node VM harness to check absent canvases, selected nodes versus groups, graph change notifications, resize callbacks, and dragging/storage behavior. Run `node tests/node_info.test.cjs`; the old implementation should fail the relevant regressions.

## Task 2: Update the extension

**Files:** Modify `node_info.js`.

Replace canvas polling/global canvas access with extension setup and the app canvas. Use standard graph and node mutation APIs. Register global drag handlers only during a drag; preserve pinned positions when the toolbar is temporary. Position the floating toolbar in viewport coordinates and remove listeners on destruction.

Run `node --check node_info.js` and the regression harness after implementation.

## Task 3: Verify and document

**Files:** Modify `README.md`.

Check the implementation against the official frontend release source and the locally installed frontend package. Correct outdated usage claims and document verification limits. Run `git diff --check`, the regression harness, and browser checks if a suitable browser session is available. Leave changes local for review.

## Verification results

- All 13 regression checks pass. The original implementation failed 11 of the initial 12 checks.
- On local frontend 1.57.6, both classic nodes and Nodes 2.0 were tested in an isolated browser tab: selection-triggered toolbar, top alignment, equal width, DOM widget layout, and single-step undo worked.
- Temporary workflows were closed without saving; the Nodes 2.0 setting was restored to its original value.
- Frontend 1.60.0 APIs were checked against official release source; a complete 1.60.0 browser runtime was not tested.
