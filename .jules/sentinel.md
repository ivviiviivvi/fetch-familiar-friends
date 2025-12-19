## 2024-05-23 - [Sanitization Improvement]
**Vulnerability:** The previous `sanitizeInput` function used a fragile regex-based blacklist (removing `<script>`, `<iframe>`, etc.) which is easily bypassed by other XSS vectors (e.g., `<img onerror=...>`).
**Learning:** Regex-based blacklisting is insufficient for security. HTML entity encoding is a safer default when full HTML parsing/sanitization libraries (like DOMPurify) are not available or desired to keep dependencies low.
**Prevention:** Always default to HTML entity encoding for user input unless rich text is explicitly required.

## 2024-05-23 - [Input Length Limits]
**Vulnerability:** The AI chat input field lacked a maximum length constraint, potentially allowing massive payloads that could cause client-side DoS or server-side issues (simulated).
**Learning:** Even for client-side interactions, enforcing reasonable input limits improves robustness and prevents UI breaking.
**Prevention:** Always add `maxLength` attributes to input fields and validate length on submission.
