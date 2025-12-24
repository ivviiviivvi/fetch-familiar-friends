## 2024-05-22 - Initial Setup
**Learning:** Found detached labels in JournalModal and SettingsModal. Explicit association or wrapping is required for accessibility.
**Action:** Always check form inputs for proper label association using 'htmlFor'/'id' or nesting.

## 2024-05-23 - Month Calendar Accessibility
**Learning:** Screen readers announce week day headers like "S-u-n" or "Sun" (star) if not properly labeled. Using `aria-label` with the full day name (e.g., "Sunday") provides a much clearer experience. Also, dates in a grid need more context than just the number, especially if they have status indicators like "has journal entry".
**Action:** When building custom calendar grids, always provide full text labels for headers and status-rich aria-labels for date cells.
