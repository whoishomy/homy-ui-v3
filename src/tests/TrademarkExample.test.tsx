import React from 'react';
import { render, screen } from '@testing-library/react';
import { TrademarkExample } from '../components/ui/TrademarkExample';
import { TrademarkText } from '../components/ui/TrademarkText';
import { TrademarkThemeProvider } from '../context/TrademarkThemeContext';
import { notifyMake } from '../scripts/notifyMake';

// Mock notifyMake to prevent actual API calls during tests
jest.mock('../scripts/notifyMake');

describe('Trademark Components', () => {
  const mockNotifyMake = notifyMake as jest.MockedFunction<typeof notifyMake>;

  beforeEach(() => {
    mockNotifyMake.mockClear();
  });

  describe('TrademarkExample', () => {
    it('applies default trademark styles', async () => {
      try {
        render(
          <TrademarkThemeProvider>
            <TrademarkExample />
          </TrademarkThemeProvider>
        );

        const element = screen.getByText(/HOMY™ Component/i);
        expect(element).toBeInTheDocument();
        expect(element).toHaveStyle({
          fontFamily: '"Inter", sans-serif',
          color: '#007AFF',
        });

        await mockNotifyMake({
          file: 'trademark-example-styles.test.log',
          component: 'TrademarkExample',
          status: 'done',
          type: 'test',
        });
      } catch (error) {
        await mockNotifyMake({
          file: 'trademark-example-styles.test.log',
          component: 'TrademarkExample',
          status: 'failed',
          type: 'test',
          details: {
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
        throw error;
      }
    });
  });

  describe('TrademarkText', () => {
    it('renders with trademark symbol by default', async () => {
      try {
        render(
          <TrademarkThemeProvider>
            <TrademarkText>HOMY</TrademarkText>
          </TrademarkThemeProvider>
        );

        const element = screen.getByText(/HOMY™/);
        expect(element).toBeInTheDocument();

        await mockNotifyMake({
          file: 'trademark-text-symbol.test.log',
          component: 'TrademarkText',
          status: 'done',
          type: 'test',
        });
      } catch (error) {
        await mockNotifyMake({
          file: 'trademark-text-symbol.test.log',
          component: 'TrademarkText',
          status: 'failed',
          type: 'test',
          details: {
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
        throw error;
      }
    });

    it('hides trademark symbol when showSymbol is false', async () => {
      try {
        render(
          <TrademarkThemeProvider>
            <TrademarkText showSymbol={false}>HOMY</TrademarkText>
          </TrademarkThemeProvider>
        );

        const element = screen.getByText('HOMY');
        expect(element).toBeInTheDocument();
        expect(element).not.toHaveTextContent('™');

        await mockNotifyMake({
          file: 'trademark-text-no-symbol.test.log',
          component: 'TrademarkText',
          status: 'done',
          type: 'test',
        });
      } catch (error) {
        await mockNotifyMake({
          file: 'trademark-text-no-symbol.test.log',
          component: 'TrademarkText',
          status: 'failed',
          type: 'test',
          details: {
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
        throw error;
      }
    });

    it('applies variant-specific styles', async () => {
      try {
        render(
          <TrademarkThemeProvider>
            <TrademarkText variant="title">HOMY</TrademarkText>
          </TrademarkThemeProvider>
        );

        const element = screen.getByText(/HOMY™/);
        expect(element).toHaveStyle({
          fontFamily: '"Inter", sans-serif',
        });

        await mockNotifyMake({
          file: 'trademark-text-variants.test.log',
          component: 'TrademarkText',
          status: 'done',
          type: 'test',
        });
      } catch (error) {
        await mockNotifyMake({
          file: 'trademark-text-variants.test.log',
          component: 'TrademarkText',
          status: 'failed',
          type: 'test',
          details: {
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
        throw error;
      }
    });
  });
});
