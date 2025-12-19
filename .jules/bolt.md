## 2025-12-19 - Unstable Props & Component Re-renders
**Learning:** Passing unstable props (inline functions, objects created in render) to complex components like `CalendarCard` causes unnecessary re-renders, even when the data hasn't changed. This is especially costly for components with animations and internal state.
**Action:** Move static constants (like themes) outside components. Use `React.memo` for heavy UI components and `useCallback` for event handlers passed to them.
