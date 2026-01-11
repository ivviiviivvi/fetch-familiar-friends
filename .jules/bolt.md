# Bolt's Journal

This file contains critical learnings and insights from Bolt's performance optimization work.

## 2025-05-15 - React Component Optimization
**Learning:** `React.memo` is only effective if the props passed to the component are stable. Inline arrow functions (e.g., `onClick={() => ...}`) create new references on every render, defeating the purpose of memoization.
**Action:** Always wrap callback props in `useCallback` when passing them to memoized components. Also, defining static data outside the component prevents recreation.

## 2025-05-18 - Render Loop Optimization
**Learning:** Performing O(N) or O(M) lookups (like `array.some()`) inside a render loop (which runs N times) results in O(N*M) complexity. In `MonthCalendar`, looking up favorites for each day was causing performance issues.
**Action:** Pre-calculate lookups into a `Set` (O(1)) using `useMemo` before entering the render loop. Also, avoid creating `new Date()` objects repeatedly inside loops; calculate them once or memoize them.
