# Sentinel Journal

## 2025-02-14 - Input Sanitization and Validation in AI Modal

**Vulnerability:** The AI Chat Modal (`AiModal.jsx`) accepted user input and displayed it without explicit sanitization or profanity filtering. While React escapes content by default, preventing XSS, there was no defense-in-depth sanitization, and the application lacked content moderation controls.

**Learning:** Testing input sanitization in a React environment using JSDOM is tricky because both the sanitizer and React escape HTML entities. Tests must distinguish between what is in the DOM (escaped entities) and what the user sees (rendered text). Additionally, using real-world profanity filters in tests requires using inputs that trigger (or don't trigger) the filter as expected.

**Prevention:**
1.  Always use the `sanitizeInput` utility for user-generated content, even if React handles escaping, to ensure safety if the data is ever used in a non-React context or with `dangerouslySetInnerHTML`.
2.  Implement `isFamilyFriendly` or similar content moderation checks on the client-side for immediate feedback, and ideally repeat validation on the server-side (if applicable).
3.  When testing sanitization, verify the presence of escaped entities in the text content if inspecting the DOM directly.
