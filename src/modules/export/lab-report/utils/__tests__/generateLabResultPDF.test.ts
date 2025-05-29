import { generateLabResultPDF, downloadLabResultPDF } from '../generateLabResultPDF';
import { mockLabResult, mockFilters } from '@/test/utils';

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = jest.fn();
const mockRevokeObjectURL = jest.fn();
global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

// Mock document.createElement
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();
const mockClick = jest.fn();

// Create a proper mock HTMLAnchorElement
const createMockAnchorElement = () => {
  const element = document.createElement('a');
  Object.defineProperties(element, {
    href: {
      get: () => '',
      set: jest.fn(),
    },
    download: {
      get: () => '',
      set: jest.fn(),
    },
    click: {
      value: mockClick,
    },
  });
  return element;
};

const mockCreateElement = jest.fn(createMockAnchorElement);
document.createElement = mockCreateElement as any;
document.body.appendChild = mockAppendChild;
document.body.removeChild = mockRemoveChild;

describe('generateLabResultPDF', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate PDF blob without filters', async () => {
    const blob = await generateLabResultPDF(mockLabResult);
    expect(blob).toBeInstanceOf(Blob);
  });

  it('should generate PDF blob with filters', async () => {
    const blob = await generateLabResultPDF(mockLabResult, { filters: mockFilters });
    expect(blob).toBeInstanceOf(Blob);
  });

  it('should generate PDF blob with patient info', async () => {
    const patientInfo = {
      fullName: 'John Doe',
      dateOfBirth: '1990-01-01',
      id: 'P12345',
    };
    const blob = await generateLabResultPDF(mockLabResult, { patientInfo });
    expect(blob).toBeInstanceOf(Blob);
  });

  it('should use custom filename when provided', async () => {
    const blob = await generateLabResultPDF(mockLabResult, { fileName: 'custom.pdf' });
    expect(blob).toBeInstanceOf(Blob);
  });
});

describe('downloadLabResultPDF', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger file download', async () => {
    await downloadLabResultPDF(mockLabResult);

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it('should use custom filename when provided', async () => {
    const fileName = 'custom-report.pdf';
    await downloadLabResultPDF(mockLabResult, { fileName });

    const link = mockCreateElement.mock.results[0].value;
    expect(link.download).toBe(fileName);
  });

  it('should clean up after download', async () => {
    await downloadLabResultPDF(mockLabResult);

    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockCreateObjectURL.mockImplementationOnce(() => {
      throw new Error('Failed to create URL');
    });

    await expect(downloadLabResultPDF(mockLabResult)).rejects.toThrow();
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
