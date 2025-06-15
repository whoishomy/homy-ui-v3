export class VitalSignsSimulator {
  private timestamp = 0;

  generateVitals() {
    return {
      heartRate: 75,
      bloodPressure: '120/80',
      temperature: 37,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      heartRateStatus: 'normal',
      bloodPressureStatus: 'normal',
      temperatureStatus: 'normal',
      respiratoryRateStatus: 'normal',
      oxygenSaturationStatus: 'normal',
    };
  }

  simulate() {
    return {
      vitals: this.generateVitals(),
      timestamp: this.timestamp++,
    };
  }
}
