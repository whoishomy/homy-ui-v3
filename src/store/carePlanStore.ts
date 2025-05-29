import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  CarePlan,
  Medication,
  Appointment,
  HealthGoal,
  HealthMetric,
  carePlanSchema,
} from '../types/carePlan';

interface CarePlanState {
  carePlans: CarePlan[];
  activePlanId: string | null;
  isLoading: boolean;
  error: string | null;

  // CarePlan CRUD
  createCarePlan: (plan: Omit<CarePlan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<CarePlan>;
  updateCarePlan: (id: string, plan: Partial<CarePlan>) => Promise<CarePlan>;
  deleteCarePlan: (id: string) => Promise<void>;
  setActivePlan: (id: string | null) => void;

  // Medication Management
  addMedication: (planId: string, medication: Omit<Medication, 'id'>) => Promise<void>;
  updateMedication: (planId: string, medicationId: string, updates: Partial<Medication>) => Promise<void>;
  deleteMedication: (planId: string, medicationId: string) => Promise<void>;

  // Appointment Management
  addAppointment: (planId: string, appointment: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointment: (planId: string, appointmentId: string, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (planId: string, appointmentId: string) => Promise<void>;

  // Health Goal Management
  addHealthGoal: (planId: string, goal: Omit<HealthGoal, 'id'>) => Promise<void>;
  updateHealthGoal: (planId: string, goalId: string, updates: Partial<HealthGoal>) => Promise<void>;
  deleteHealthGoal: (planId: string, goalId: string) => Promise<void>;

  // Health Metric Management
  addHealthMetric: (planId: string, metric: Omit<HealthMetric, 'id'>) => Promise<void>;
  updateHealthMetric: (planId: string, metricId: string, updates: Partial<HealthMetric>) => Promise<void>;
  deleteHealthMetric: (planId: string, metricId: string) => Promise<void>;
}

export const useCarePlanStore = create<CarePlanState>()(
  devtools(
    persist(
      (set, get) => ({
        carePlans: [],
        activePlanId: null,
        isLoading: false,
        error: null,

        // CarePlan CRUD
        createCarePlan: async (planData) => {
          set({ isLoading: true, error: null });
          try {
            const newPlan: CarePlan = {
              ...planData,
              id: uuidv4(),
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            
            // Validate with Zod schema
            carePlanSchema.parse(newPlan);
            
            set((state) => ({
              carePlans: [...state.carePlans, newPlan],
              activePlanId: newPlan.id,
            }));
            return newPlan;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Bakım planı oluşturulamadı';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        updateCarePlan: async (id, updates) => {
          set({ isLoading: true, error: null });
          try {
            const state = get();
            const planIndex = state.carePlans.findIndex((plan) => plan.id === id);
            
            if (planIndex === -1) {
              throw new Error('Bakım planı bulunamadı');
            }

            const updatedPlan: CarePlan = {
              ...state.carePlans[planIndex],
              ...updates,
              updatedAt: new Date(),
            };

            // Validate with Zod schema
            carePlanSchema.parse(updatedPlan);

            const newCarePlans = [...state.carePlans];
            newCarePlans[planIndex] = updatedPlan;

            set({ carePlans: newCarePlans });
            return updatedPlan;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Bakım planı güncellenemedi';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        deleteCarePlan: async (id) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              carePlans: state.carePlans.filter((plan) => plan.id !== id),
              activePlanId: state.activePlanId === id ? null : state.activePlanId,
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Bakım planı silinemedi';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        setActivePlan: (id) => {
          set({ activePlanId: id });
        },

        // Medication Management
        addMedication: async (planId, medication) => {
          set({ isLoading: true, error: null });
          try {
            const newMedication: Medication = {
              ...medication,
              id: uuidv4(),
            };

            set((state) => ({
              carePlans: state.carePlans.map((plan) =>
                plan.id === planId
                  ? { ...plan, medications: [...plan.medications, newMedication], updatedAt: new Date() }
                  : plan
              ),
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'İlaç eklenemedi';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        updateMedication: async (planId, medicationId, updates) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              carePlans: state.carePlans.map((plan) =>
                plan.id === planId
                  ? {
                      ...plan,
                      medications: plan.medications.map((med) =>
                        med.id === medicationId ? { ...med, ...updates } : med
                      ),
                      updatedAt: new Date(),
                    }
                  : plan
              ),
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'İlaç güncellenemedi';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        deleteMedication: async (planId, medicationId) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              carePlans: state.carePlans.map((plan) =>
                plan.id === planId
                  ? {
                      ...plan,
                      medications: plan.medications.filter((med) => med.id !== medicationId),
                      updatedAt: new Date(),
                    }
                  : plan
              ),
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'İlaç silinemedi';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        // Appointment Management
        addAppointment: async (planId, appointment) => {
          set({ isLoading: true, error: null });
          try {
            const newAppointment: Appointment = {
              ...appointment,
              id: uuidv4(),
            };

            set((state) => ({
              carePlans: state.carePlans.map((plan) =>
                plan.id === planId
                  ? { ...plan, appointments: [...plan.appointments, newAppointment], updatedAt: new Date() }
                  : plan
              ),
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Randevu eklenemedi';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        updateAppointment: async (planId, appointmentId, updates) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              carePlans: state.carePlans.map((plan) =>
                plan.id === planId
                  ? {
                      ...plan,
                      appointments: plan.appointments.map((apt) =>
                        apt.id === appointmentId ? { ...apt, ...updates } : apt
                      ),
                      updatedAt: new Date(),
                    }
                  : plan
              ),
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Randevu güncellenemedi';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        deleteAppointment: async (planId, appointmentId) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              carePlans: state.carePlans.map((plan) =>
                plan.id === planId
                  ? {
                      ...plan,
                      appointments: plan.appointments.filter((apt) => apt.id !== appointmentId),
                      updatedAt: new Date(),
                    }
                  : plan
              ),
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Randevu silinemedi';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        // Health Goal Management
        addHealthGoal: async (planId, goal) => {
          set({ isLoading: true, error: null });
          try {
            const newGoal: HealthGoal = {
              ...goal,
              id: uuidv4(),
            };

            set((state) => ({
              carePlans: state.carePlans.map((plan) =>
                plan.id === planId
                  ? { ...plan, goals: [...plan.goals, newGoal], updatedAt: new Date() }
                  : plan
              ),
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Hedef eklenemedi';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        updateHealthGoal: async (planId, goalId, updates) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              carePlans: state.carePlans.map((plan) =>
                plan.id === planId
                  ? {
                      ...plan,
                      goals: plan.goals.map((goal) =>
                        goal.id === goalId ? { ...goal, ...updates } : goal
                      ),
                      updatedAt: new Date(),
                    }
                  : plan
              ),
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Hedef güncellenemedi';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        deleteHealthGoal: async (planId, goalId) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              carePlans: state.carePlans.map((plan) =>
                plan.id === planId
                  ? {
                      ...plan,
                      goals: plan.goals.filter((goal) => goal.id !== goalId),
                      updatedAt: new Date(),
                    }
                  : plan
              ),
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Hedef silinemedi';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        // Health Metric Management
        addHealthMetric: async (planId, metric) => {
          set({ isLoading: true, error: null });
          try {
            const newMetric: HealthMetric = {
              ...metric,
              id: uuidv4(),
            };

            set((state) => ({
              carePlans: state.carePlans.map((plan) =>
                plan.id === planId
                  ? { ...plan, metrics: [...plan.metrics, newMetric], updatedAt: new Date() }
                  : plan
              ),
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Metrik eklenemedi';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        updateHealthMetric: async (planId, metricId, updates) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              carePlans: state.carePlans.map((plan) =>
                plan.id === planId
                  ? {
                      ...plan,
                      metrics: plan.metrics.map((metric) =>
                        metric.id === metricId ? { ...metric, ...updates } : metric
                      ),
                      updatedAt: new Date(),
                    }
                  : plan
              ),
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Metrik güncellenemedi';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        deleteHealthMetric: async (planId, metricId) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              carePlans: state.carePlans.map((plan) =>
                plan.id === planId
                  ? {
                      ...plan,
                      metrics: plan.metrics.filter((metric) => metric.id !== metricId),
                      updatedAt: new Date(),
                    }
                  : plan
              ),
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Metrik silinemedi';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
      }),
      {
        name: 'care-plan-storage',
        version: 1,
      }
    )
  )
); 