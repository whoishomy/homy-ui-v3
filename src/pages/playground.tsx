import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { ThemePlayground } from '@/components/playground/ThemePlayground';

export default function PlaygroundPage() {
  return (
    <ThemeProvider>
      <ThemePlayground />
    </ThemeProvider>
  );
}
