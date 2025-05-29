import Foundation
import HealthKit

@objc(HealthKitManager)
class HealthKitManager: NSObject {
    
    private let healthStore = HKHealthStore()
    private var updateTimer: Timer?
    private let updateInterval: TimeInterval = 15.0 // 15 seconds
    
    // Types we want to read from HealthKit
    private let typesToRead: Set<HKObjectType> = {
        guard let heartRate = HKObjectType.quantityType(forIdentifier: .heartRate),
              let oxygenSaturation = HKObjectType.quantityType(forIdentifier: .oxygenSaturation),
              let steps = HKObjectType.quantityType(forIdentifier: .stepCount),
              let sleepAnalysis = HKObjectType.categoryType(forIdentifier: .sleepAnalysis),
              let mindfulSession = HKObjectType.categoryType(forIdentifier: .mindfulSession) else {
            fatalError("Unable to create HealthKit types")
        }
        return [heartRate, oxygenSaturation, steps, sleepAnalysis, mindfulSession]
    }()
    
    @objc
    func initialize(_ resolve: @escaping RCTPromiseResolveBlock,
                   rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard HKHealthStore.isHealthDataAvailable() else {
            reject("error", "HealthKit is not available on this device", nil)
            return
        }
        
        healthStore.requestAuthorization(toShare: nil, read: typesToRead) { success, error in
            if let error = error {
                reject("error", "Failed to request HealthKit authorization: \(error.localizedDescription)", error)
                return
            }
            
            if success {
                resolve(true)
            } else {
                reject("error", "User denied HealthKit authorization", nil)
            }
        }
    }
    
    @objc
    func startMonitoring(_ resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
        stopMonitoring()
        
        updateTimer = Timer.scheduledTimer(withTimeInterval: updateInterval, repeats: true) { [weak self] _ in
            self?.fetchLatestReadings { result in
                switch result {
                case .success(let readings):
                    NotificationCenter.default.post(name: .newHealthKitData,
                                                 object: nil,
                                                 userInfo: ["readings": readings])
                case .failure(let error):
                    print("Error fetching HealthKit data: \(error)")
                }
            }
        }
        
        resolve(true)
    }
    
    @objc
    func stopMonitoring() {
        updateTimer?.invalidate()
        updateTimer = nil
    }
    
    private func fetchLatestReadings(completion: @escaping (Result<[[String: Any]], Error>) -> Void) {
        let group = DispatchGroup()
        var readings: [[String: Any]] = []
        var fetchError: Error?
        
        // Fetch heart rate
        group.enter()
        fetchLatestHeartRate { result in
            switch result {
            case .success(let reading):
                readings.append(reading)
            case .failure(let error):
                fetchError = error
            }
            group.leave()
        }
        
        // Fetch oxygen saturation
        group.enter()
        fetchLatestOxygenSaturation { result in
            switch result {
            case .success(let reading):
                readings.append(reading)
            case .failure(let error):
                fetchError = error
            }
            group.leave()
        }
        
        group.notify(queue: .main) {
            if let error = fetchError {
                completion(.failure(error))
            } else {
                completion(.success(readings))
            }
        }
    }
    
    private func fetchLatestHeartRate(completion: @escaping (Result<[String: Any], Error>) -> Void) {
        guard let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate) else {
            completion(.failure(HealthKitError.typeNotAvailable))
            return
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: Date().addingTimeInterval(-300), // Last 5 minutes
                                                   end: nil,
                                                   options: .strictEndDate)
        
        let query = HKSampleQuery(sampleType: heartRateType,
                                predicate: predicate,
                                limit: 1,
                                sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierEndDate,
                                                                ascending: false)]) { _, samples, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let sample = samples?.first as? HKQuantitySample else {
                completion(.failure(HealthKitError.noData))
                return
            }
            
            let reading: [String: Any] = [
                "type": "heartRate",
                "value": sample.quantity.doubleValue(for: HKUnit(from: "count/min")),
                "unit": "bpm",
                "timestamp": sample.endDate.ISO8601Format(),
                "device": [
                    "name": sample.device?.name ?? "Unknown",
                    "model": sample.device?.model ?? "Unknown",
                    "manufacturer": sample.device?.manufacturer ?? "Unknown"
                ]
            ]
            
            completion(.success(reading))
        }
        
        healthStore.execute(query)
    }
    
    private func fetchLatestOxygenSaturation(completion: @escaping (Result<[String: Any], Error>) -> Void) {
        guard let oxygenType = HKObjectType.quantityType(forIdentifier: .oxygenSaturation) else {
            completion(.failure(HealthKitError.typeNotAvailable))
            return
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: Date().addingTimeInterval(-300), // Last 5 minutes
                                                   end: nil,
                                                   options: .strictEndDate)
        
        let query = HKSampleQuery(sampleType: oxygenType,
                                predicate: predicate,
                                limit: 1,
                                sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierEndDate,
                                                                ascending: false)]) { _, samples, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let sample = samples?.first as? HKQuantitySample else {
                completion(.failure(HealthKitError.noData))
                return
            }
            
            let reading: [String: Any] = [
                "type": "oxygenSaturation",
                "value": sample.quantity.doubleValue(for: HKUnit.percent()) * 100,
                "unit": "%",
                "timestamp": sample.endDate.ISO8601Format(),
                "device": [
                    "name": sample.device?.name ?? "Unknown",
                    "model": sample.device?.model ?? "Unknown",
                    "manufacturer": sample.device?.manufacturer ?? "Unknown"
                ]
            ]
            
            completion(.success(reading))
        }
        
        healthStore.execute(query)
    }
}

enum HealthKitError: Error {
    case typeNotAvailable
    case noData
}

extension Notification.Name {
    static let newHealthKitData = Notification.Name("NewHealthKitData")
} 