import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CarePlan } from '@/types/carePlan';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { HealthInsight } from '@/types/analytics';

export const exportToPDF = async (data: Partial<CarePlan>) => {
  // PDF template oluştur
  const template = document.createElement('div');
  template.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="color: #1a5336; margin-bottom: 20px;">Bakım Planı</h1>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #2d3748; font-size: 18px;">Plan Detayları</h2>
        <p><strong>Başlık:</strong> ${data.title}</p>
        <p><strong>Durum:</strong> ${data.status}</p>
        <p><strong>Başlangıç:</strong> ${
          data.startDate &&
          format(new Date(data.startDate), 'dd MMMM yyyy', { locale: tr })
        }</p>
        <p><strong>Bitiş:</strong> ${
          data.endDate &&
          format(new Date(data.endDate), 'dd MMMM yyyy', { locale: tr })
        }</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #2d3748; font-size: 18px;">İlaçlar</h2>
        <ul style="list-style-type: none; padding: 0;">
          ${data.medications
            ?.map(
              (med) => `
            <li style="margin-bottom: 10px; padding: 10px; background: #f7fafc; border-radius: 4px;">
              <strong>${med.name}</strong> - ${med.dosage} ${med.unit}
              <br>
              <small>Sıklık: ${med.frequency}</small>
            </li>
          `
            )
            .join('')}
        </ul>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #2d3748; font-size: 18px;">Sağlık Hedefleri</h2>
        <ul style="list-style-type: none; padding: 0;">
          ${data.goals
            ?.map(
              (goal) => `
            <li style="margin-bottom: 10px; padding: 10px; background: #f7fafc; border-radius: 4px;">
              <strong>${goal.title}</strong>
              <br>
              <small>Durum: ${goal.status}</small>
            </li>
          `
            )
            .join('')}
        </ul>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #2d3748; font-size: 18px;">Takip Metrikleri</h2>
        <ul style="list-style-type: none; padding: 0;">
          ${data.metrics
            ?.map(
              (metric) => `
            <li style="margin-bottom: 10px; padding: 10px; background: #f7fafc; border-radius: 4px;">
              <strong>${metric.name}</strong>
              <br>
              <small>Sıklık: ${metric.frequency}</small>
            </li>
          `
            )
            .join('')}
        </ul>
      </div>

      <div style="margin-top: 40px; font-size: 12px; color: #718096; text-align: center;">
        Bu bakım planı ${format(new Date(), 'dd MMMM yyyy', {
          locale: tr,
        })} tarihinde Homy tarafından oluşturulmuştur.
      </div>
    </div>
  `;

  // Template'i DOM'a ekle
  document.body.appendChild(template);

  try {
    // HTML'i canvas'a dönüştür
    const canvas = await html2canvas(template, {
      scale: 2,
      logging: false,
      useCORS: true,
    });

    // Canvas'ı PDF'e dönüştür
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`care-plan-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  } finally {
    // Template'i DOM'dan kaldır
    document.body.removeChild(template);
  }
};

export const exportToCSV = async (data: Partial<CarePlan>) => {
  // Header satırı
  const headers = [
    'Başlık',
    'Durum',
    'Başlangıç',
    'Bitiş',
    'İlaçlar',
    'Hedefler',
    'Metrikler',
  ];

  // Veri satırı
  const row = [
    data.title,
    data.status,
    data.startDate && format(new Date(data.startDate), 'dd.MM.yyyy'),
    data.endDate && format(new Date(data.endDate), 'dd.MM.yyyy'),
    data.medications?.map((m) => `${m.name} (${m.dosage} ${m.unit})`).join('; '),
    data.goals?.map((g) => `${g.title} (${g.status})`).join('; '),
    data.metrics?.map((m) => `${m.name} (${m.frequency})`).join('; '),
  ];

  // CSV string oluştur
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), row.map((cell) => `"${cell || ''}"`).join(',')].join(
      '\n'
    );

  // Download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `care-plan-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToICal = async (data: Partial<CarePlan>) => {
  let icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Homy//Care Plan//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  // İlaç hatırlatıcıları
  data.medications?.forEach((med) => {
    if (med.reminder) {
      icalContent = icalContent.concat([
        'BEGIN:VEVENT',
        `SUMMARY:İlaç Hatırlatıcı: ${med.name}`,
        `DESCRIPTION:${med.dosage} ${med.unit} alınacak.`,
        `DTSTART:${format(new Date(data.startDate!), "yyyyMMdd'T'HHmmss")}`,
        'RRULE:FREQ=DAILY',
        'END:VEVENT',
      ]);
    }
  });

  // Hedef kontrolleri
  data.goals?.forEach((goal) => {
    if (goal.reminder) {
      icalContent = icalContent.concat([
        'BEGIN:VEVENT',
        `SUMMARY:Hedef Kontrolü: ${goal.title}`,
        `DESCRIPTION:Hedef durumu: ${goal.status}`,
        `DTSTART:${format(new Date(goal.targetDate), "yyyyMMdd'T'HHmmss")}`,
        'END:VEVENT',
      ]);
    }
  });

  // Metrik ölçümleri
  data.metrics?.forEach((metric) => {
    if (metric.reminder) {
      icalContent = icalContent.concat([
        'BEGIN:VEVENT',
        `SUMMARY:Metrik Ölçümü: ${metric.name}`,
        `DESCRIPTION:${metric.description || ''}`,
        `DTSTART:${format(new Date(data.startDate!), "yyyyMMdd'T'HHmmss")}`,
        `RRULE:FREQ=${metric.frequency.toUpperCase()}`,
        'END:VEVENT',
      ]);
    }
  });

  icalContent.push('END:VCALENDAR');

  // Download
  const blob = new Blob([icalContent.join('\r\n')], {
    type: 'text/calendar;charset=utf-8',
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `care-plan-${format(new Date(), 'yyyy-MM-dd')}.ics`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const generateShareableLink = async (
  data: Partial<CarePlan>
): Promise<string> => {
  // Base64 encode plan data
  const encodedData = btoa(JSON.stringify(data));
  return `${window.location.origin}/care-plan/share/${encodedData}`;
};

export const exportInsightsToCSV = (insights: HealthInsight[]): string => {
  const headers = ['ID', 'Type', 'Category', 'Message', 'Date', 'Related Metrics', 'Action'];
  const rows = insights.map(insight => [
    insight.id,
    insight.type,
    insight.category,
    insight.message,
    new Date(insight.date).toISOString(),
    insight.relatedMetrics?.join(', ') || '',
    insight.action?.message || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};

export const downloadInsightsCSV = (insights: HealthInsight[]): void => {
  const csvContent = exportInsightsToCSV(insights);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `insights_${new Date().toISOString()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface InsightLogEntry {
  insightId: string;
  viewedAt: Date;
  userId?: string;
  sessionId: string;
  interactionType: 'view' | 'action' | 'dismiss';
}

export class InsightLogger {
  private static instance: InsightLogger;
  private logQueue: InsightLogEntry[] = [];
  private isProcessing = false;

  private constructor() {}

  static getInstance(): InsightLogger {
    if (!InsightLogger.instance) {
      InsightLogger.instance = new InsightLogger();
    }
    return InsightLogger.instance;
  }

  async logInteraction(
    insightId: string,
    interactionType: InsightLogEntry['interactionType'],
    userId?: string
  ): Promise<void> {
    const logEntry: InsightLogEntry = {
      insightId,
      viewedAt: new Date(),
      userId,
      sessionId: this.getSessionId(),
      interactionType
    };

    this.logQueue.push(logEntry);
    await this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.logQueue.length === 0) return;

    this.isProcessing = true;
    try {
      const batch = this.logQueue.splice(0, 10);
      await this.sendLogs(batch);
    } catch (error) {
      console.error('Failed to process insight logs:', error);
      // Retry failed entries
      this.logQueue.unshift(...this.logQueue.splice(0, 10));
    } finally {
      this.isProcessing = false;
      if (this.logQueue.length > 0) {
        await this.processQueue();
      }
    }
  }

  private async sendLogs(logs: InsightLogEntry[]): Promise<void> {
    try {
      const response = await fetch('/api/analytics/insight-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs }),
      });

      if (!response.ok) {
        throw new Error('Failed to send logs');
      }
    } catch (error) {
      console.error('Error sending insight logs:', error);
      throw error;
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('insight_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('insight_session_id', sessionId);
    }
    return sessionId;
  }
} 