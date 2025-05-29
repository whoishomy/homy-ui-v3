'use client';

import { useMemo } from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { LabResult } from '@/types/lab-results';
import { AIGeneratedInsight } from '@/types/health-report';
import { Filters } from '@/contexts/FilterContext';

interface LabResultPDFTemplateProps {
  result: LabResult;
  patientInfo?: {
    fullName: string;
    dateOfBirth: string;
    id: string;
  };
  filters?: Filters;
}

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf' },
    { src: '/fonts/Inter-Medium.ttf', fontWeight: 500 },
    { src: '/fonts/Inter-SemiBold.ttf', fontWeight: 600 },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 700 },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Inter',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 8,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottom: '1 solid #e5e7eb',
  },
  resultLabel: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
  },
  resultValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: 500,
    color: '#111827',
  },
  referenceRange: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
  },
  status: {
    width: 80,
    fontSize: 12,
    textAlign: 'right',
  },
  statusNormal: {
    color: '#059669',
  },
  statusWarning: {
    color: '#d97706',
  },
  statusCritical: {
    color: '#dc2626',
  },
  insightCard: {
    marginVertical: 4,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f3f4f6',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  insightType: {
    fontSize: 10,
    fontWeight: 500,
    color: '#6b7280',
    marginRight: 4,
  },
  insightContent: {
    fontSize: 11,
    color: '#374151',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
  },
  filterInfo: {
    marginTop: 8,
    fontSize: 10,
    color: '#6b7280',
  },
});

const getStatusStyle = (status: LabResult['status']) => {
  switch (status) {
    case 'normal':
      return styles.statusNormal;
    case 'low':
    case 'high':
      return styles.statusWarning;
    case 'critical_low':
    case 'critical_high':
      return styles.statusCritical;
    default:
      return {};
  }
};

const getStatusText = (status: LabResult['status']) => {
  switch (status) {
    case 'normal':
      return 'Normal';
    case 'low':
      return 'Düşük';
    case 'high':
      return 'Yüksek';
    case 'critical_low':
      return 'Kritik Düşük';
    case 'critical_high':
      return 'Kritik Yüksek';
    default:
      return '';
  }
};

const getInsightTypeText = (type: AIGeneratedInsight['type']) => {
  switch (type) {
    case 'summary':
      return 'Özet';
    case 'recommendation':
      return 'Öneri';
    case 'alert':
      return 'Uyarı';
    case 'trend':
      return 'Trend';
    default:
      return '';
  }
};

const getFilterSummary = (filters: Filters) => {
  const parts = [];
  if (filters.testType) parts.push(`Test: ${filters.testType}`);
  if (filters.dateRange) parts.push(`Tarih: ${filters.dateRange}`);
  if (filters.trend) parts.push(`Trend: ${filters.trend}`);
  if (filters.significance) parts.push(`Önem: ${filters.significance}`);
  return parts.length > 0 ? `Filtreler: ${parts.join(' • ')}` : '';
};

export const LabResultPDFTemplate = ({
  result,
  patientInfo,
  filters,
}: LabResultPDFTemplateProps) => {
  const formattedDate = useMemo(
    () => format(new Date(result.date), 'PPP', { locale: tr }),
    [result.date]
  );

  const filterSummary = filters ? getFilterSummary(filters) : '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{result.testName}</Text>
            <Text style={styles.subtitle}>
              {formattedDate} • {result.laboratory}
            </Text>
            {patientInfo && (
              <Text style={styles.subtitle}>
                {patientInfo.fullName} •{' '}
                {format(new Date(patientInfo.dateOfBirth), 'PP', {
                  locale: tr,
                })}
              </Text>
            )}
            {filterSummary && <Text style={styles.filterInfo}>{filterSummary}</Text>}
          </View>
          <View style={styles.headerRight}>
            <Text style={[styles.subtitle, { marginBottom: 4 }]}>Rapor No: {result.id}</Text>
            {result.orderedBy && (
              <Text style={styles.subtitle}>İsteyen Hekim: {result.orderedBy}</Text>
            )}
          </View>
        </View>

        {/* Test Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Sonuçları</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Parametre</Text>
            <Text style={styles.resultValue}>Sonuç</Text>
            <Text style={styles.referenceRange}>Referans Aralığı</Text>
            <Text style={[styles.status, { color: '#6b7280' }]}>Durum</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>{result.testName}</Text>
            <Text style={styles.resultValue}>
              {result.value} {result.unit}
            </Text>
            <Text style={styles.referenceRange}>
              {result.referenceRange.min} - {result.referenceRange.max} {result.referenceRange.unit}
            </Text>
            <Text style={[styles.status, getStatusStyle(result.status)]}>
              {getStatusText(result.status)}
            </Text>
          </View>
        </View>

        {/* AI Insights */}
        {result.insights && result.insights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI İçgörüleri</Text>
            {result.insights.map((insight, index) => (
              <View key={index} style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <Text style={styles.insightType}>{getInsightTypeText(insight.type)}</Text>
                  <Text style={[styles.insightType, { marginLeft: 'auto' }]}>
                    {Math.round(insight.confidence * 100)}% güven
                  </Text>
                </View>
                <Text style={styles.insightContent}>{insight.content}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Notes */}
        {result.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notlar</Text>
            <Text style={styles.resultLabel}>{result.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Bu rapor HomyOS Sağlık Sistemi tarafından {formattedDate} tarihinde oluşturulmuştur.
          {result.verifiedBy && ` • Onaylayan: ${result.verifiedBy}`}
        </Text>
      </Page>
    </Document>
  );
};
