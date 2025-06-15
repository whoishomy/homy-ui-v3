import type { Breakpoint } from './Breakpoint';

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;
