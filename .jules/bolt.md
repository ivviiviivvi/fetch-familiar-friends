# Bolt's Journal

This file contains critical learnings and insights from Bolt's performance optimization work.

## 2025-05-15 - React Component Optimization
**Learning:** `React.memo` is only effective if the props passed to the component are stable. Inline arrow functions (e.g., `onClick={() => ...}`) create new references on every render, defeating the purpose of memoization.
**Action:** Always wrap callback props in `useCallback` when passing them to memoized components. Also, defining static data outside the component prevents recreation.

## 2025-05-15 - Testing Memoization
**Learning:** When writing tests to verify `React.memo`, ensure all props passed in the test wrapper are stable. Passing object literals (e.g., `settings={{}}`) in the test render will trigger re-renders, causing the test to fail even if the component is correctly memoized.
**Action:** Use `useState` or `useMemo` in test wrappers to create stable object props.
