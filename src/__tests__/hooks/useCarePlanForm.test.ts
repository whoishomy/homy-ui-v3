import { renderHook, act } from '@testing-library/react';
import { useCarePlanForm } from '@/hooks/useCarePlanForm';

describe('useCarePlanForm', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCarePlanForm());

    expect(result.current.getValues()).toEqual({
      status: 'draft',
      medications: [],
      appointments: [],
      goals: [],
      metrics: [],
      tags: [],
    });
  });

  it('should override default values with provided values', () => {
    const defaultValues = {
      status: 'active' as const,
      title: 'Test Plan',
      startDate: new Date('2024-03-20'),
    };

    const { result } = renderHook(() => useCarePlanForm({ defaultValues }));

    expect(result.current.getValues()).toMatchObject({
      ...defaultValues,
      medications: [],
      appointments: [],
      goals: [],
      metrics: [],
      tags: [],
    });
  });

  it('should validate required fields', async () => {
    const { result } = renderHook(() => useCarePlanForm());

    let formErrors: any;
    await act(async () => {
      await result.current.handleSubmit(
        (data) => {
          // This should not be called due to validation errors
        },
        (errors) => {
          formErrors = errors;
        }
      )();
    });

    expect(formErrors).toBeDefined();
    expect(formErrors.title).toBeDefined();
    expect(formErrors.startDate).toBeDefined();
  });

  it('should validate medication fields', async () => {
    const { result } = renderHook(() => useCarePlanForm());

    await act(async () => {
      result.current.setValue('medications', [
        {
          name: 'A', // Too short
          dosage: -1, // Invalid negative value
          unit: 'mg',
          frequency: 'daily',
          startDate: new Date(),
          reminder: true,
          notifyBeforeMinutes: -5, // Invalid negative value
        },
      ]);
    });

    let formErrors: any;
    await act(async () => {
      await result.current.handleSubmit(
        () => {},
        (errors) => {
          formErrors = errors;
        }
      )();
    });

    expect(formErrors.medications).toBeDefined();
    expect(formErrors.medications[0]).toBeDefined();
    expect(formErrors.medications[0].name).toBeDefined(); // Name too short
    expect(formErrors.medications[0].dosage).toBeDefined(); // Negative dosage
    expect(formErrors.medications[0].notifyBeforeMinutes).toBeDefined(); // Negative minutes
  });

  it('should successfully submit valid form data', async () => {
    const { result } = renderHook(() => useCarePlanForm());

    const validFormData = {
      title: 'Test Care Plan',
      description: 'Test Description',
      startDate: new Date(),
      status: 'active' as const,
      medications: [
        {
          name: 'Test Medication',
          dosage: 100,
          unit: 'mg' as const,
          frequency: 'daily' as const,
          startDate: new Date(),
          reminder: true,
          notifyBeforeMinutes: 30,
        },
      ],
      appointments: [],
      goals: [],
      metrics: [],
      tags: ['test'],
    };

    await act(async () => {
      Object.entries(validFormData).forEach(([key, value]) => {
        result.current.setValue(key as any, value);
      });
    });

    let submittedData: any;
    let formErrors: any;

    await act(async () => {
      await result.current.handleSubmit(
        (data) => {
          submittedData = data;
        },
        (errors) => {
          formErrors = errors;
        }
      )();
    });

    expect(formErrors).toBeUndefined();
    expect(submittedData).toMatchObject(validFormData);
  });

  it('should handle form reset', () => {
    const { result } = renderHook(() => useCarePlanForm());

    act(() => {
      result.current.setValue('title', 'Test Title');
      result.current.setValue('status', 'active' as const);
    });

    expect(result.current.getValues().title).toBe('Test Title');
    expect(result.current.getValues().status).toBe('active');

    act(() => {
      result.current.reset();
    });

    expect(result.current.getValues()).toEqual({
      status: 'draft',
      medications: [],
      appointments: [],
      goals: [],
      metrics: [],
      tags: [],
    });
  });
});
