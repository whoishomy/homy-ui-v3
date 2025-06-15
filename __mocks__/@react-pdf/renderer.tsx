import React from 'react';

interface MockPDFProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const MockPDFComponent = ({ children, ...props }: MockPDFProps): JSX.Element => (
  <div data-testid="pdf-mock" {...props}>
    {children}
  </div>
);

export const Document = MockPDFComponent;
export const Page = MockPDFComponent;
export const Text = MockPDFComponent;
export const View = MockPDFComponent;
export const Image = MockPDFComponent;
export const Link = MockPDFComponent;
export const Font = {
  register: jest.fn(),
};

export const pdf = jest.fn(() => ({
  toBlob: jest.fn().mockResolvedValue(new Blob()),
  toBuffer: jest.fn().mockResolvedValue(Buffer.from('')),
}));

export const PDFViewer = MockPDFComponent;
export const PDFDownloadLink = MockPDFComponent;
export const BlobProvider = MockPDFComponent;

export const StyleSheet = {
  create: (styles: Record<string, any>) => styles,
};

export const usePDF = jest.fn(() => [
  {
    loading: false,
    error: null,
    url: 'mock-pdf-url',
  },
  jest.fn(),
]);
