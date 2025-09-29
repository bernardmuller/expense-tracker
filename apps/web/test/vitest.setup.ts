/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import { afterEach, expect, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});


Object.defineProperty(Element.prototype, 'hasPointerCapture', {
  value: vi.fn(),
  writable: true,
})

Object.defineProperty(Element.prototype, 'setPointerCapture', {
  value: vi.fn(),
  writable: true,
})

Object.defineProperty(Element.prototype, 'releasePointerCapture', {
  value: vi.fn(),
  writable: true,
})

Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true,
})
