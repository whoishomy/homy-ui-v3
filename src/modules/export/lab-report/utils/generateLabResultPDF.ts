import { pdf, Document } from '@react-pdf/renderer';
import { createElement } from 'react';
import { LabResult } from '@/types/lab-results';
import { LabResultPDFTemplate } from '../components/LabResultPDFTemplate';
import { Filters } from '@/contexts/FilterContext';

interface GeneratePDFOptions {
  patientInfo?: {
    fullName: string;
    dateOfBirth: string;
    id: string;
  };
  fileName?: string;
  filters?: Filters;
}

export const generateLabResultPDF = async (
  result: LabResult,
  options: GeneratePDFOptions = {}
): Promise<Blob> => {
  const { patientInfo, fileName = `lab-result-${result.id}.pdf`, filters } = options;

  // Generate PDF blob
  const doc = createElement(
    Document,
    {},
    createElement(LabResultPDFTemplate, { result, patientInfo, filters })
  );
  const blob = await pdf(doc).toBlob();
  return blob;
};

export const downloadLabResultPDF = async (
  result: LabResult,
  options: GeneratePDFOptions = {}
): Promise<void> => {
  const { fileName = `lab-result-${result.id}.pdf` } = options;

  try {
    const blob = await generateLabResultPDF(result, options);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF oluşturulurken bir hata oluştu:', error);
    throw error;
  }
};
